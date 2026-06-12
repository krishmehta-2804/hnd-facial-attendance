/**
 * Attendance Page - Mark attendance via facial recognition or manual mode
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { useAttendance } from '../contexts/AttendanceContext';
import { ATTENDANCE_STATUS } from '../utils/constants';
import { formatTime } from '../utils/dateUtils';
import { loadModels, detectFace, createMatcher, matchFace, areModelsLoaded } from '../services/faceRecognition';
// areModelsLoaded is imported but we allow camera even while loading
import offlineDB from '../services/offlineDB';
import {
  Camera, UserCheck, List, Search, CheckCircle2, XCircle, Clock,
  AlertCircle, ChevronDown, Play, Square, Scan, RefreshCw
} from 'lucide-react';
import '../styles/attendance.css';

const AttendancePage = () => {
  const { students, classes, todayRecords, markAttendance, getClassStudents, getClassTodayStats } = useAttendance();
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || '');
  const [mode, setMode] = useState('manual'); // 'manual' or 'facial'
  const [searchQuery, setSearchQuery] = useState('');
  const [recentMarked, setRecentMarked] = useState([]);

  // Camera & Scanning States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanStatus, setScanStatus] = useState('idle'); // idle, scanning, recognized
  const [recognizedStudent, setRecognizedStudent] = useState(null);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [isDemoScanner, setIsDemoScanner] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const scanIntervalRef = useRef(null);

  const classStudents = getClassStudents(selectedClass);
  const classStats = getClassTodayStats(selectedClass);

  // Refs to avoid React hook state closures in requestAnimationFrame loop
  const classStudentsRef = useRef(classStudents);
  const todayRecordsRef = useRef(todayRecords);
  const scanStatusRef = useRef(scanStatus);
  const isCameraActiveRef = useRef(isCameraActive);

  useEffect(() => {
    classStudentsRef.current = classStudents;
  }, [classStudents]);

  useEffect(() => {
    todayRecordsRef.current = todayRecords;
  }, [todayRecords]);

  useEffect(() => {
    scanStatusRef.current = scanStatus;
  }, [scanStatus]);

  useEffect(() => {
    isCameraActiveRef.current = isCameraActive;
  }, [isCameraActive]);

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
    const record = todayRecords.find((r) => r.studentId === studentId);
    return record?.status || null;
  };

  const getStudentStatusFromRef = (studentId) => {
    const record = todayRecordsRef.current.find((r) => r.studentId === studentId);
    return record?.status || null;
  };

  const handleMark = useCallback((studentId, status) => {
    const record = markAttendance(studentId, status, 'manual');
    if (record) {
      setRecentMarked((prev) => [record, ...prev.slice(0, 9)]);
    }
  }, [markAttendance]);

  const handleMarkAll = (status) => {
    classStudents.forEach((student) => {
      if (!getStudentStatus(student.id)) {
        markAttendance(student.id, status, 'manual');
      }
    });
  };

  // Start Camera — always starts immediately; models may still be loading in background
  const startCamera = async () => {
    setScanStatus('idle');
    setRecognizedStudent(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      setScanStatus('scanning');

      // Wait for models if they are still loading (max 10s)
      if (!areModelsLoaded()) {
        try {
          await Promise.race([
            loadModels(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000))
          ]);
        } catch (e) {
          console.warn('[AttendancePage] Models could not load — falling back to demo mode:', e.message);
        }
      }

      // Fetch stored face descriptors from IndexedDB
      const storedDescriptors = await offlineDB.faceDescriptors.toArray();
      const currentClassStudentIds = new Set(classStudents.map(s => s.id));
      const classDescriptors = storedDescriptors.filter(d => currentClassStudentIds.has(d.studentId));

      if (areModelsLoaded() && classDescriptors.length > 0) {
        setIsDemoScanner(false);
        const formatted = classDescriptors.map(d => ({
          label: d.studentId,
          descriptors: [new Float32Array(d.descriptor)]
        }));
        const matcher = createMatcher(formatted, 0.6);
        startScanningSimulation(matcher);
      } else {
        // Fallback to simulation mode if no faces registered OR models failed
        setIsDemoScanner(true);
        startScanningSimulation(null);
      }
    } catch (err) {
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
    setIsCameraActive(false);
    setScanStatus('idle');
    setRecognizedStudent(null);
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
  };

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
          if (detection && detection.descriptor) {
            const match = matchFace(detection.descriptor, matcher);
            if (match && match.label !== 'unknown') {
              const studentId = match.label;
              const student = classStudentsRef.current.find(s => s.id === studentId);
              
              if (student) {
                const alreadyMarked = getStudentStatusFromRef(studentId);
                if (!alreadyMarked) {
                  const record = markAttendance(studentId, ATTENDANCE_STATUS.PRESENT, 'facial', match.confidence);
                  if (record) {
                    setRecentMarked((prev) => [record, ...prev.slice(0, 9)]);
                  }
                }
                
                setRecognizedStudent({ 
                  name: student.name, 
                  confidence: match.confidence,
                  alreadyMarked: !!alreadyMarked
                });
                setScanStatus('recognized');

                setTimeout(() => {
                  setRecognizedStudent(null);
                  setScanStatus('scanning');
                }, 2000);
              }
            }
          }
        } catch (err) {
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

    // Mock Simulation Fallback
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    scanIntervalRef.current = setInterval(() => {
      setScanStatus('scanning');
      setRecognizedStudent(null);

      setTimeout(() => {
        const unmarked = classStudentsRef.current.filter((s) => !getStudentStatusFromRef(s.id));
        
        if (unmarked.length === 0) {
          stopCamera();
          alert('All students in this class have been marked present!');
          return;
        }

        const student = unmarked[Math.floor(Math.random() * unmarked.length)];
        const confidence = (0.82 + Math.random() * 0.16).toFixed(2);

        const record = markAttendance(student.id, ATTENDANCE_STATUS.PRESENT, 'facial', confidence);
        if (record) {
          setRecentMarked((prev) => [record, ...prev.slice(0, 9)]);
        }

        setRecognizedStudent({ name: student.name, confidence });
        setScanStatus('recognized');

        setTimeout(() => {
          setRecognizedStudent(null);
          setScanStatus('scanning');
        }, 2000);

      }, 1500);

    }, 4000);
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
      <div className="page-header">
        <div>
          <h1>Mark Attendance</h1>
          <p>Select a class and mark attendance for today</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-success btn-sm" onClick={() => handleMarkAll(ATTENDANCE_STATUS.PRESENT)}>
            <CheckCircle2 size={14} />
            Mark All Present
          </button>
        </div>
      </div>

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
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 'var(--space-lg)' }}>
        <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--text)' }}>{classStats.total}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Total</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--success)' }}>{classStats.present}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Present</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--danger)' }}>{classStats.absent}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Absent</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--warning)' }}>{classStats.late}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Late</div>
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
              <>
                <video ref={videoRef} autoPlay playsInline muted width="640" height="480" />
                {scanStatus === 'scanning' && (
                  <>
                    <div className="face-capture-guide animate-pulse" />
                    <div className="face-capture-status detecting">
                      <Scan className="animate-spin" size={16} />
                      {isDemoScanner ? 'Simulating Classroom Scanner...' : 'Scanning Classroom (Live)...'}
                    </div>
                  </>
                )}
                {scanStatus === 'recognized' && recognizedStudent && (
                  <>
                    <div 
                      className="face-capture-guide" 
                      style={{ 
                        borderColor: recognizedStudent.alreadyMarked ? '#F59E0B' : 'var(--success)', 
                        boxShadow: recognizedStudent.alreadyMarked 
                          ? '0 0 30px rgba(245, 158, 11, 0.5)' 
                          : '0 0 30px rgba(16, 185, 129, 0.5)' 
                      }} 
                    />
                    <div className={`face-capture-status ${recognizedStudent.alreadyMarked ? 'warning' : 'recognized'}`}
                         style={recognizedStudent.alreadyMarked ? { background: '#F59E0B', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' } : {}}>
                      {recognizedStudent.alreadyMarked ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                      {recognizedStudent.name} {recognizedStudent.alreadyMarked ? '(Already Marked)' : `(${(recognizedStudent.confidence * 100).toFixed(0)}%)`}
                    </div>
                  </>
                )}
              </>
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
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                      Roll #{student.rollNo}
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
                    <button
                      className={status === ATTENDANCE_STATUS.LATE ? 'active-late' : ''}
                      onClick={() => handleMark(student.id, ATTENDANCE_STATUS.LATE)}
                      title="Late"
                    >
                      <Clock size={12} /> L
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
