/**
 * Attendance Page - Mark attendance via facial recognition or manual mode
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { useAttendance } from '../contexts/AttendanceContext';
import { useAuth } from '../contexts/AuthContext';
import { ATTENDANCE_STATUS } from '../utils/constants';
import { formatTime } from '../utils/dateUtils';
import { format } from 'date-fns';
import { loadModels, detectFace, createMatcher, matchFace, areModelsLoaded } from '../services/faceRecognition';
// areModelsLoaded is imported but we allow camera even while loading
import offlineDB from '../services/offlineDB';
import {
  Camera, UserCheck, List, Search, CheckCircle2, XCircle, Clock,
  AlertCircle, ChevronDown, Play, Square, Scan, RefreshCw, Lock
} from 'lucide-react';
import '../styles/attendance.css';

const AttendancePage = () => {
  const { currentUser } = useAuth();
  const {
    students,
    classes,
    records,
    getStudentStatusByDate,
    markAttendance,
    getClassStudents,
    getClassTodayStats,
    getGenderStats,
  } = useAttendance();

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || '');
  const [mode, setMode] = useState('manual'); // 'manual' or 'facial'
  const [searchQuery, setSearchQuery] = useState('');
  const [recentMarked, setRecentMarked] = useState([]);

  // Auto-initialize class once loaded
  useEffect(() => {
    if (!selectedClass && classes.length > 0) {
      setSelectedClass(classes[0].id);
    }
  }, [classes, selectedClass]);

  // Camera & Scanning States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanStatus, setScanStatus] = useState('idle'); // idle, scanning, recognized
  const [recognizedStudent, setRecognizedStudent] = useState(null);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [isDemoScanner, setIsDemoScanner] = useState(false);
  const [kioskCountdown, setKioskCountdown] = useState(0);
  const [logs, setLogs] = useState([]);
  const lastLogTimeRef = useRef(0);

  const isEditingLocked = currentUser?.role === 'teacher' && selectedDate !== todayStr;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const scanIntervalRef = useRef(null);

  const classStudents = getClassStudents(selectedClass);
  const classStats = getClassTodayStats(selectedClass, selectedDate);
  const genderStats = getGenderStats(selectedClass, selectedDate);

  // Refs to avoid React hook state closures in requestAnimationFrame loop
  const classStudentsRef = useRef(classStudents);
  const recordsRef = useRef(records);
  const scanStatusRef = useRef(scanStatus);
  const isCameraActiveRef = useRef(isCameraActive);
  const selectedDateRef = useRef(selectedDate);

  useEffect(() => {
    classStudentsRef.current = classStudents;
  }, [classStudents]);

  useEffect(() => {
    recordsRef.current = records;
  }, [records]);

  useEffect(() => {
    scanStatusRef.current = scanStatus;
  }, [scanStatus]);

  useEffect(() => {
    isCameraActiveRef.current = isCameraActive;
  }, [isCameraActive]);

  useEffect(() => {
    selectedDateRef.current = selectedDate;
  }, [selectedDate]);

  const filteredStudents = classStudents.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(s.rollNo).includes(searchQuery)
  );

  // Load models on page mount
  useEffect(() => {
    const initModels = async () => {
      try {
        await loadModels();
      } catch (err) {
        console.error('Error loading face-api models:', err);
      } finally {
        setModelsLoading(false);
      }
    };
    initModels();
  }, []);

  const getStudentStatus = (studentId) => {
    return getStudentStatusByDate(studentId, selectedDate);
  };

  const getStudentStatusFromRef = (studentId) => {
    const record = recordsRef.current.find(
      (r) => r.studentId === studentId && r.date === selectedDateRef.current
    );
    return record?.status || null;
  };

  const handleMark = useCallback((studentId, status) => {
    if (isEditingLocked) return;
    const record = markAttendance(studentId, status, 'manual', null, selectedDate);
    if (record) {
      setRecentMarked((prev) => [record, ...prev.slice(0, 9)]);
    }
  }, [markAttendance, isEditingLocked, selectedDate]);

  const handleMarkAll = (status) => {
    if (isEditingLocked) return;
    classStudents.forEach((student) => {
      if (!getStudentStatus(student.id)) {
        markAttendance(student.id, status, 'manual', null, selectedDate);
      }
    });
  };

  const addLog = useCallback((msg, type = 'info') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs((prev) => [`[${time}] [${type.toUpperCase()}] ${msg}`, ...prev.slice(0, 49)]);
  }, []);

  // Start Camera — always starts immediately; models may still be loading in background
  const startCamera = async () => {
    setScanStatus('idle');
    setRecognizedStudent(null);
    setLogs([]);
    addLog('Requesting webcam access...', 'info');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      setScanStatus('scanning');
      addLog('Webcam stream active. Dimensions: 640x480 (User facing)', 'success');

      // Wait for models if they are still loading (max 10s)
      if (!areModelsLoaded()) {
        addLog('Face AI models are not fully loaded. Initializing network...', 'warning');
        try {
          await Promise.race([
            loadModels(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000))
          ]);
          addLog('Face AI models loaded successfully.', 'success');
        } catch (e) {
          addLog(`Face AI models loading timeout: ${e.message}`, 'error');
        }
      } else {
        addLog('Face AI models verified loaded.', 'success');
      }
    } catch (err) {
      addLog(`Camera Access Denied: ${err.message || err.toString()}`, 'error');
      console.error('Error starting camera:', err);
      alert('Could not access camera. Please check browser camera permissions.');
    }
  };

  // Bind video stream once the video element has mounted in the DOM
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraActive]);

  const handleVideoPlay = async () => {
    addLog('Webcam stream started playing. Loading face-api settings...', 'info');
    try {
      // Fetch stored face descriptors from IndexedDB
      const storedDescriptors = await offlineDB.faceDescriptors.toArray();
      const currentClassStudentIds = new Set(classStudents.map(s => s.id));
      const classDescriptors = storedDescriptors.filter(d => currentClassStudentIds.has(d.studentId));

      addLog(`Queried IndexedDB. Class has ${classDescriptors.length} registered face(s) out of ${classStudents.length} enrolled.`, 'info');

      if (areModelsLoaded() && classDescriptors.length > 0) {
        setIsDemoScanner(false);
        const formatted = classDescriptors.map(d => ({
          label: d.studentId,
          descriptors: [new Float32Array(d.descriptor)]
        }));
        const matcher = createMatcher(formatted, 0.45);
        addLog('FaceMatcher successfully compiled. Live recognition running.', 'success');
        startScanningSimulation(matcher);
      } else {
        setIsDemoScanner(true);
        addLog('Starting in Demo Simulation mode (no registered faces in this class).', 'warning');
        startScanningSimulation(null);
      }
    } catch (err) {
      addLog(`Failed to initialize matcher: ${err.message}`, 'error');
      setIsDemoScanner(true);
      startScanningSimulation(null);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (canvasRef.current) {
      try {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      } catch (e) {}
    }
    setIsCameraActive(false);
    setScanStatus('idle');
    setRecognizedStudent(null);
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
  };

  const playSuccessSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
      
      oscillator.start();
      
      setTimeout(() => {
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      }, 100);
      
      setTimeout(() => {
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        setTimeout(() => {
          oscillator.stop();
          audioCtx.close();
        }, 150);
      }, 200);
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  };

  const handleNextStudent = () => {
    setRecognizedStudent(null);
    setScanStatus('scanning');
    setKioskCountdown(0);
    if (videoRef.current && isCameraActiveRef.current) {
      try { videoRef.current.play(); } catch (e) {}
    }
  };

  const simulateStudentScan = (studentId) => {
    const student = classStudentsRef.current.find(s => s.id === studentId);
    if (!student) return;

    const confidence = (0.85 + Math.random() * 0.14).toFixed(2);
    const alreadyMarked = getStudentStatusFromRef(studentId);
    const isAlreadyCheckedIn = alreadyMarked === ATTENDANCE_STATUS.PRESENT || alreadyMarked === ATTENDANCE_STATUS.LATE;

    if (!isAlreadyCheckedIn) {
      const record = markAttendance(studentId, ATTENDANCE_STATUS.PRESENT, 'facial', confidence, selectedDateRef.current);
      if (record) {
        setRecentMarked((prev) => [record, ...prev.slice(0, 9)]);
      }
    }

    setRecognizedStudent({
      name: student.name,
      rollNo: student.rollNo,
      confidence,
      alreadyMarked: isAlreadyCheckedIn
    });
    setScanStatus('recognized');
    playSuccessSound();
    if (videoRef.current) {
      try { videoRef.current.pause(); } catch (e) {}
    }
    setKioskCountdown(5);
  };

  useEffect(() => {
    if (kioskCountdown <= 0) return;
    const timer = setTimeout(() => {
      setKioskCountdown(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [kioskCountdown]);

  useEffect(() => {
    if (scanStatus === 'recognized' && kioskCountdown === 0) {
      handleNextStudent();
    }
  }, [kioskCountdown, scanStatus]);

  // Continuous scanning simulation or real face-api loop
  const startScanningSimulation = (matcher = null) => {
    if (matcher) {
      const scanLoop = async () => {
        if (!videoRef.current || !isCameraActiveRef.current) return;
 
        // Skip detection if we are currently displaying a recognized student
        if (scanStatusRef.current === 'recognized') {
          if (isCameraActiveRef.current) {
            setTimeout(() => {
              animationFrameRef.current = requestAnimationFrame(scanLoop);
            }, 500);
          }
          return;
        }

        try {
          const detection = await detectFace(videoRef.current);
          
          // Clear canvas on each loop run
          const canvas = canvasRef.current;
          let ctx = null;
          if (canvas) {
            ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }

          if (detection && detection.descriptor) {
            const match = matchFace(detection.descriptor, matcher);
            
            // Draw real-time diagnostic bounding box
            if (canvas && ctx) {
              const box = detection.detection.box;
              
              if (match && match.label !== 'unknown') {
                // Match Found: Draw Green Box with Student Name Banner
                ctx.strokeStyle = '#10B981';
                ctx.lineWidth = 3;
                ctx.strokeRect(box.x, box.y, box.width, box.height);
                
                ctx.fillStyle = '#10B981';
                ctx.fillRect(box.x, box.y - 25, Math.max(140, box.width), 25);
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 12px Inter, sans-serif';
                const student = classStudentsRef.current.find(s => s.id === match.label);
                const nameLabel = student ? student.name : 'Matched';
                ctx.fillText(nameLabel.toUpperCase(), box.x + 8, box.y - 8);
              } else {
                // Match Failed: Draw Red Box with UNKNOWN FACE Banner
                ctx.strokeStyle = '#EF4444';
                ctx.lineWidth = 3;
                ctx.strokeRect(box.x, box.y, box.width, box.height);
                
                ctx.fillStyle = '#EF4444';
                ctx.fillRect(box.x, box.y - 25, Math.max(140, box.width), 25);
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 12px Inter, sans-serif';
                ctx.fillText('UNKNOWN FACE', box.x + 8, box.y - 8);
              }
            }

            // Throttled logging to avoid layout stutter
            const now = Date.now();
            if (!lastLogTimeRef.current || now - lastLogTimeRef.current > 1500) {
              lastLogTimeRef.current = now;
              addLog(`Face detected (Confidence: ${detection.detection.score.toFixed(2)})`, 'info');
              if (match) {
                if (match.label !== 'unknown') {
                  const student = classStudentsRef.current.find(s => s.id === match.label);
                  addLog(`Recognized: ${student ? student.name : match.label} (Conf: ${match.confidence})`, 'success');
                } else {
                  addLog(`Not recognized (Best Match Distance: ${match.distance.toFixed(2)})`, 'warning');
                }
              }
            }

            if (match && match.label !== 'unknown') {
              const studentId = match.label;
              const student = classStudentsRef.current.find(s => s.id === studentId);
              
              if (student) {
                const alreadyMarked = getStudentStatusFromRef(studentId);
                const isAlreadyCheckedIn = alreadyMarked === ATTENDANCE_STATUS.PRESENT || alreadyMarked === ATTENDANCE_STATUS.LATE;

                addLog(`Success check-in: matching ${student.name}`, 'success');
                if (!isAlreadyCheckedIn) {
                  const record = markAttendance(studentId, ATTENDANCE_STATUS.PRESENT, 'facial', match.confidence, selectedDateRef.current);
                  if (record) {
                    setRecentMarked((prev) => [record, ...prev.slice(0, 9)]);
                  }
                }
                
                setRecognizedStudent({ 
                  name: student.name, 
                  rollNo: student.rollNo,
                  confidence: match.confidence,
                  alreadyMarked: isAlreadyCheckedIn
                });
                setScanStatus('recognized');
                playSuccessSound();
                if (videoRef.current) {
                  try { videoRef.current.pause(); } catch (e) {}
                }
                
                // Clear canvas immediately on success view
                if (canvas && ctx) {
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
                
                setKioskCountdown(5);
              }
            }
          } else {
            // Log frame scan with no face (throttled)
            const now = Date.now();
            if (!lastLogTimeRef.current || now - lastLogTimeRef.current > 3000) {
              lastLogTimeRef.current = now;
              addLog('Frame analyzed: no face detected in view.', 'info');
            }
          }
        } catch (err) {
          addLog(`Matching Loop Error: ${err.message || err.toString()}`, 'error');
          console.error('Real-time face recognition match error:', err);
        }

        if (isCameraActiveRef.current) {
          setTimeout(() => {
            animationFrameRef.current = requestAnimationFrame(scanLoop);
          }, 500); // Check frame every 500ms
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(scanLoop);
      return;
    }

    // Mock Simulation Fallback: No auto-loop, user triggers simulated scan manually
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
  };

  // Stop camera on tab change or page unmount
  useEffect(() => {
    stopCamera();
    return () => {
      stopCamera();
    };
  }, [mode, selectedClass]);

  return (
    <div className="attendance-page">
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Mark Attendance</h1>
          <p>Select a class and mark attendance for {selectedDate === todayStr ? 'today' : selectedDate}</p>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
          {/* Date Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', padding: '6px 12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}>Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              disabled={currentUser?.role === 'teacher'}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text)',
                outline: 'none',
                fontFamily: 'Inter',
                fontSize: 'var(--font-size-sm)',
                cursor: currentUser?.role === 'teacher' ? 'not-allowed' : 'pointer'
              }}
            />
            {currentUser?.role === 'teacher' && <Lock size={12} style={{ color: 'var(--text-tertiary)', marginLeft: '4px' }} />}
          </div>

          <div className="page-actions">
            <button 
              className="btn btn-success btn-sm" 
              onClick={() => handleMarkAll(ATTENDANCE_STATUS.PRESENT)}
              disabled={isEditingLocked}
              style={isEditingLocked ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              <CheckCircle2 size={14} />
              Mark All Present
            </button>
          </div>
        </div>
      </div>

      {isEditingLocked && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px var(--space-md)',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--danger-light)',
          marginBottom: 'var(--space-md)',
          fontSize: 'var(--font-size-sm)'
        }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <div>
            <strong>Attendance Editing Locked:</strong> As a teacher, you only have permissions to modify attendance for the current day. Please contact the Headmaster to edit past records.
          </div>
        </div>
      )}

      {/* Mode Tabs */}
      <div className="attendance-mode-tabs">
        <button
          className={`attendance-mode-tab ${mode === 'manual' ? 'active' : ''}`}
          onClick={() => setMode('manual')}
        >
          <List size={16} />
          Manual
        </button>
        <button
          className={`attendance-mode-tab ${mode === 'facial' ? 'active' : ''}`}
          onClick={() => setMode('facial')}
        >
          <Camera size={16} />
          Facial Recognition
        </button>
      </div>

      {/* Class Selector */}
      <div className="class-selector">
        {classes.map((cls) => (
          <button
            key={cls.id}
            className={`class-chip ${selectedClass === cls.id ? 'active' : ''}`}
            onClick={() => setSelectedClass(cls.id)}
          >
            Class {cls.name}-{cls.section}
          </button>
        ))}
      </div>

      {/* Class Stats Summary */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
        <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--text)' }}>{classStats.total}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Total</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--success)' }}>{classStats.present}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Present</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--danger)' }}>{classStats.absent}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Absent</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: '#3B82F6' }}>
            {genderStats.presentBoys}/{genderStats.enrolledBoys}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Boys (Pres/Total)</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: '#EC4899' }}>
            {genderStats.presentGirls}/{genderStats.enrolledGirls}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Girls (Pres/Total)</div>
        </div>
      </div>

      {mode === 'facial' ? (
        /* Facial Recognition Mode */
        <div className="card" style={{ padding: 'var(--space-lg)', position: 'relative' }}>
          {/* Simulation vs Live Mode Indicator Banner */}
          {isCameraActive && (
            isDemoScanner ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px var(--space-md)',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: 'var(--radius-md)',
                color: '#F59E0B',
                marginBottom: 'var(--space-md)',
                fontSize: 'var(--font-size-sm)',
                lineHeight: '1.4'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0, color: '#F59E0B' }} />
                <div>
                  <strong>Demo Simulation Mode Active:</strong> No face profiles are registered for Class {classes.find(c => c.id === selectedClass)?.name}-{classes.find(c => c.id === selectedClass)?.section}. The camera is running in simulation mode. Enrolling a student's face in the <strong>Face Register</strong> tab will activate real-time face matching.
                </div>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px var(--space-md)',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 'var(--radius-md)',
                color: '#10B981',
                marginBottom: 'var(--space-md)',
                fontSize: 'var(--font-size-sm)',
                lineHeight: '1.4'
              }}>
                <CheckCircle2 size={18} style={{ flexShrink: 0, color: '#10B981' }} />
                <div>
                  <strong>Live Webcam Matching Active:</strong> The scanner is comparing face features against registered descriptors for Class {classes.find(c => c.id === selectedClass)?.name}-{classes.find(c => c.id === selectedClass)?.section}.
                </div>
              </div>
            )
          )}

          <div className="face-capture-container" style={{ background: '#111827', position: 'relative', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
            {modelsLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--accent)', padding: 'var(--space-2xl)' }}>
                <RefreshCw className="animate-spin" size={48} style={{ marginBottom: 'var(--space-md)' }} />
                <h3>Loading Face AI Models...</h3>
                <p style={{ fontSize: 'var(--font-size-sm)', marginTop: '4px', color: 'var(--text-tertiary)' }}>Please wait while neural networks initialize.</p>
              </div>
            ) : isCameraActive ? (
              <div style={{ position: 'relative', width: '640px', height: '480px', margin: '0 auto', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
                <video ref={videoRef} autoPlay playsInline muted width="640" height="480" onPlay={handleVideoPlay} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <canvas ref={canvasRef} width="640" height="480" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5, pointerEvents: 'none' }} />
                {scanStatus === 'scanning' && (
                  <>
                    <div className="face-capture-guide animate-pulse" style={{ zIndex: 6 }} />
                    <div className="face-capture-status detecting" style={{ zIndex: 7 }}>
                      <Scan className="animate-spin" size={16} />
                      {isDemoScanner ? 'Simulating Kiosk Check-In...' : 'Kiosk Check-In Active (Live)...'}
                    </div>
                  </>
                )}
                {scanStatus === 'recognized' && recognizedStudent && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-xl)',
                    zIndex: 10
                  }} className="animate-fade-in">
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: recognizedStudent.alreadyMarked ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      border: recognizedStudent.alreadyMarked ? '3px solid #F59E0B' : '3px solid var(--success)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: recognizedStudent.alreadyMarked ? '#F59E0B' : 'var(--success)',
                      marginBottom: 'var(--space-lg)',
                      boxShadow: recognizedStudent.alreadyMarked ? '0 0 30px rgba(245, 158, 11, 0.3)' : '0 0 30px rgba(16, 185, 129, 0.3)'
                    }}>
                      {recognizedStudent.alreadyMarked ? <AlertCircle size={48} /> : <CheckCircle2 size={48} />}
                    </div>

                    <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, textAlign: 'center', margin: '0 0 8px 0', color: 'white' }}>
                      {recognizedStudent.name}
                    </h2>
                    
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-base)', margin: '0 0 24px 0', textAlign: 'center' }}>
                      Roll #{recognizedStudent.rollNo} · Class {classes.find(c => c.id === selectedClass)?.name}-{classes.find(c => c.id === selectedClass)?.section}
                    </p>

                    <div style={{
                      padding: '8px 16px',
                      background: recognizedStudent.alreadyMarked ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      border: recognizedStudent.alreadyMarked ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: 'var(--radius-full)',
                      color: recognizedStudent.alreadyMarked ? '#F59E0B' : 'var(--success-light)',
                      fontWeight: 600,
                      fontSize: 'var(--font-size-sm)',
                      marginBottom: '32px'
                    }}>
                      {recognizedStudent.alreadyMarked ? 'Already Checked In Today' : `Checked In Successfully (${(recognizedStudent.confidence * 100).toFixed(0)}% Match)`}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)' }}>
                      <button className="btn btn-primary" onClick={handleNextStudent} style={{ padding: '10px 24px', fontWeight: 600 }}>
                        Next Student Check-In
                      </button>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                        Automatically resetting in {kioskCountdown}s...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-tertiary)', padding: 'var(--space-2xl)' }}>
                <Camera size={64} style={{ marginBottom: 'var(--space-md)', opacity: 0.3 }} />
                <h3>Classroom Attendance Scanner</h3>
                <p style={{ fontSize: 'var(--font-size-sm)', marginTop: '4px', maxWidth: '400px', textAlign: 'center' }}>
                  Position the tablet facing the class. Students will be scanned and checked in automatically.
                </p>
                {classStudents.filter(s => s.faceRegistered).length === 0 ? (
                  <p style={{ fontSize: 'var(--font-size-xs)', marginTop: '8px', color: 'var(--warning)', maxWidth: '360px', textAlign: 'center' }}>
                    Note: No student face profiles are registered for this class. It will run in Demo Mode.
                  </p>
                ) : (
                  <p style={{ fontSize: 'var(--font-size-xs)', marginTop: '8px', color: 'var(--success)', maxWidth: '360px', textAlign: 'center' }}>
                    ✓ {classStudents.filter(s => s.faceRegistered).length} students have registered face profiles in this class. Live recognition is available!
                  </p>
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
            {!isCameraActive ? (
              <button className="btn btn-primary btn-lg" onClick={startCamera}>
                <Play size={18} /> {modelsLoading ? 'Start Scanner (Loading AI...)' : 'Start Scanner Camera'}
              </button>
            ) : (
              <button className="btn btn-ghost" onClick={stopCamera}>
                <Square size={16} /> Stop Scanner Camera
              </button>
            )}
          </div>

          {isCameraActive && scanStatus === 'scanning' && (
            <div className="animate-fade-in" style={{ 
              marginTop: 'var(--space-md)', 
              padding: 'var(--space-md)', 
              background: 'var(--bg-secondary)', 
              borderRadius: 'var(--radius)', 
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--warning-light)', fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
                <Scan size={16} style={{ color: 'var(--warning)' }} />
                Testing / Demo Simulator Control Panel
              </div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', margin: 0 }}>
                Select a student below to simulate them stepping in front of the kiosk (useful for testing):
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', marginTop: '4px' }}>
                <select 
                  id="demo-student-scan-select"
                  style={{ 
                    flex: 1, 
                    padding: '8px 12px', 
                    fontSize: 'var(--font-size-sm)',
                    background: 'var(--bg-input)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)'
                  }}
                >
                  {classStudents.filter(s => !getStudentStatus(s.id)).map(s => (
                    <option key={s.id} value={s.id}>
                      Roll #{s.rollNo} - {s.name}
                    </option>
                  ))}
                  {classStudents.filter(s => !getStudentStatus(s.id)).length === 0 && (
                    <option value="">All students marked present</option>
                  )}
                </select>
                <button 
                  className="btn btn-warning"
                  style={{ padding: '8px 16px', fontSize: 'var(--font-size-xs)' }}
                  onClick={() => {
                    const selectEl = document.getElementById('demo-student-scan-select');
                    if (selectEl && selectEl.value) {
                      simulateStudentScan(selectEl.value);
                    }
                  }}
                  disabled={classStudents.filter(s => !getStudentStatus(s.id)).length === 0}
                >
                  Simulate Scan
                </button>
              </div>
            </div>
          )}

          {/* Diagnostics Log Panel */}
          {isCameraActive && (
            <div className="card" style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--accent-light)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🔍</span> Live Diagnostics Console
                </div>
                <button 
                  className="btn btn-ghost btn-sm"
                  onClick={() => setLogs([])}
                  style={{ padding: '2px 8px', fontSize: 'var(--font-size-xs)' }}
                >
                  Clear Log
                </button>
              </div>
              <div style={{ 
                background: '#090f1e', 
                padding: '12px', 
                borderRadius: 'var(--radius-sm)', 
                fontFamily: 'monospace', 
                fontSize: '11px', 
                height: '140px', 
                overflowY: 'auto',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                textAlign: 'left'
              }}>
                {logs.map((log, i) => {
                  let color = '#34D399'; // green
                  if (log.includes('[ERROR]')) color = '#EF4444'; // red
                  if (log.includes('[WARNING]')) color = '#F59E0B'; // orange
                  return (
                    <div key={i} style={{ color }}>{log}</div>
                  );
                })}
                {logs.length === 0 && (
                  <div style={{ color: 'var(--text-tertiary)' }}>No events logged yet. Show your face to the camera to run matching diagnostics.</div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Manual Mode */
        <>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 'var(--space-lg)', maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '42px', height: '44px' }}
            />
          </div>

          {/* Student List */}
          <div className="manual-attendance-grid">
            {filteredStudents.map((student) => {
              const status = getStudentStatus(student.id);
              return (
                <div
                  key={student.id}
                  className={`student-attendance-card ${status || ''}`}
                >
                  <div className="student-avatar" style={{
                    width: '40px', height: '40px', borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, var(--accent) 0%, #8B5CF6 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, color: 'white', fontSize: 'var(--font-size-sm)', flexShrink: 0,
                  }}>
                    {student.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-size-base)', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {student.name}
                      {student.faceRegistered && (
                        <span style={{
                          fontSize: '10px',
                          padding: '1px 6px',
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#10B981',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          borderRadius: '10px',
                          fontWeight: 'bold',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}>
                          <Scan size={10} /> Live Face
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                      <span>Roll #{student.rollNo}</span>
                      {status && (() => {
                        const record = records.find(r => r.studentId === student.id && r.date === selectedDate);
                        const method = record?.method || 'manual';
                        return (
                          <span style={{
                            fontSize: '9px',
                            padding: '1px 5px',
                            background: method === 'facial' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                            color: method === 'facial' ? '#A78BFA' : '#94A3B8',
                            borderRadius: '4px',
                            fontWeight: '600',
                            border: method === 'facial' ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(100, 116, 139, 0.2)',
                          }}>
                            {method === 'facial' ? '📷 Facial' : '✍️ Manual'}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="attendance-toggle">
                    <button
                      className={status === ATTENDANCE_STATUS.PRESENT ? 'active-present' : ''}
                      onClick={() => handleMark(student.id, ATTENDANCE_STATUS.PRESENT)}
                      title="Present"
                    >
                      <CheckCircle2 size={12} /> P
                    </button>
                    <button
                      className={status === ATTENDANCE_STATUS.ABSENT ? 'active-absent' : ''}
                      onClick={() => handleMark(student.id, ATTENDANCE_STATUS.ABSENT)}
                      title="Absent"
                    >
                      <XCircle size={12} /> A
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Recent Marked Feed */}
      {recentMarked.length > 0 && (
        <div className="attendance-feed">
          <div className="attendance-feed-header">
            <h4>Recently Marked</h4>
            <span className="badge badge-primary">{recentMarked.length}</span>
          </div>
          <div className="attendance-feed-list">
            {recentMarked.slice(0, 5).map((record) => (
              <div key={record.id} className="attendance-feed-item">
                <div className="student-avatar">
                  {record.studentName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="feed-info">
                  <div className="feed-name">{record.studentName}</div>
                  <div className="feed-meta">{record.className} · {formatTime(record.timestamp)}</div>
                </div>
                <div className="feed-status">
                  <span className={`badge badge-${record.status === 'present' ? 'success' : record.status === 'absent' ? 'danger' : 'warning'}`}>
                    {record.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
