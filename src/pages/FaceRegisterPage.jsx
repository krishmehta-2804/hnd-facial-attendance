/**
 * Face Register Page - Student facial recognition registration
 */
import { useState, useRef, useEffect } from 'react';
import { useAttendance } from '../contexts/AttendanceContext';
import { Camera, RefreshCw, CheckCircle, AlertCircle, Scan, User, Play, Square, Award } from 'lucide-react';
import { loadModels, detectFace, areModelsLoaded } from '../services/faceRecognition';
import offlineDB from '../services/offlineDB';
import '../styles/attendance.css';

const FaceRegisterPage = () => {
  const { students, classes, refreshFaceRegistrations } = useAttendance();
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || '');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [capturedImages, setCapturedImages] = useState([]);
  const [registerStatus, setRegisterStatus] = useState('idle'); // idle, capturing, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [modelsLoading, setModelsLoading] = useState(true);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const descriptorsRef = useRef([]);

  // Load models on page mount
  useEffect(() => {
    const initModels = async () => {
      try {
        await loadModels();
      } catch (err) {
        console.error('Error loading models:', err);
        setErrorMessage('Failed to load facial recognition models: ' + (err.message || err.toString()));
      } finally {
        setModelsLoading(false);
      }
    };
    initModels();
  }, []);

  // Filter students by selected class
  const classStudents = students.filter((s) => s.classId === selectedClass);

  // Start Camera
  const startCamera = async () => {
    if (!areModelsLoaded()) {
      setErrorMessage('Facial recognition models are not loaded. Cannot start camera. Check your internet connection or reload the page.');
      setRegisterStatus('error');
      return;
    }
    setRegisterStatus('idle');
    setCapturedImages([]);
    setCaptureProgress(0);
    setErrorMessage('');
    descriptorsRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (err) {
      console.error('Error starting camera:', err);
      setErrorMessage('Could not access camera. Please check camera permissions.');
      setRegisterStatus('error');
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
    setIsCapturing(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Real face scanning and descriptor extraction loop
  const startFaceScan = () => {
    if (!selectedStudent) {
      setErrorMessage('Please select a student first.');
      return;
    }
    setIsCapturing(true);
    setRegisterStatus('capturing');
    setCaptureProgress(0);
    setCapturedImages([]);
    descriptorsRef.current = [];

    const scanLoop = async () => {
      if (!videoRef.current || !isCameraActive) return;

      try {
        const detection = await detectFace(videoRef.current);
        
        if (detection && detection.descriptor) {
          descriptorsRef.current.push(detection.descriptor);
          const currentCount = descriptorsRef.current.length;
          
          setCaptureProgress(currentCount);
          setCapturedImages((prev) => [
            ...prev,
            { id: currentCount, url: 'captured' }
          ]);

          // Stop if we have captured 5 descriptors
          if (currentCount >= 5) {
            // Calculate Average Descriptor
            const average = new Float32Array(128);
            for (let i = 0; i < 128; i++) {
              let sum = 0;
              for (let j = 0; j < 5; j++) {
                sum += descriptorsRef.current[j][i];
              }
              average[i] = sum / 5;
            }

            // Save to IndexedDB
            await offlineDB.faceDescriptors.put({
              id: selectedStudent,
              studentId: selectedStudent,
              descriptor: Array.from(average) // serialize to standard array
            });

            // Refresh global attendance context state
            if (refreshFaceRegistrations) {
              await refreshFaceRegistrations();
            }

            setRegisterStatus('success');
            stopCamera();
            return;
          }
        }
      } catch (err) {
        console.error('Error during live scan:', err);
        setErrorMessage(`Scan Error: ${err.message || err.toString()}`);
        setRegisterStatus('error');
        stopCamera();
        return;
      }

      // Continue loop if not finished
      if (descriptorsRef.current.length < 5 && isCameraActive) {
        // Run loop slightly throttled to avoid UI lag (approx 3 frames per second check)
        setTimeout(() => {
          animationFrameRef.current = requestAnimationFrame(scanLoop);
        }, 300);
      }
    };

    animationFrameRef.current = requestAnimationFrame(scanLoop);
  };

  return (
    <div className="face-register-page">
      <div className="page-header">
        <div>
          <h1>Face Registration</h1>
          <p>Register student face data for automated attendance</p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 350px', gap: 'var(--space-xl)', alignItems: 'start' }}>
        {/* Left: Camera Feed & Capture slots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <div className="card" style={{ padding: 'var(--space-lg)', position: 'relative' }}>
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
                  {isCapturing && (
                    <div className="face-capture-guide animate-pulse" />
                  )}
                  {registerStatus === 'capturing' && (
                    <div className="face-capture-status detecting">
                      <Scan className="animate-spin" size={16} />
                      Scanning... {captureProgress * 20}%
                    </div>
                  )}
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-tertiary)', padding: 'var(--space-2xl)' }}>
                  <Camera size={64} style={{ marginBottom: 'var(--space-md)', opacity: 0.3 }} />
                  {registerStatus === 'success' ? (
                    <div style={{ textAlign: 'center', color: 'var(--success)' }}>
                      <CheckCircle size={48} style={{ margin: '0 auto var(--space-md)' }} />
                      <h3>Face Registered Successfully!</h3>
                      <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Descriptor files saved locally</p>
                    </div>
                  ) : (
                    <>
                      <h3>Camera is Offline</h3>
                      <p style={{ fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>Select a student and start the camera to begin registration</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Camera Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
              {!isCameraActive ? (
                <button className="btn btn-primary" onClick={startCamera} disabled={registerStatus === 'capturing' || modelsLoading}>
                  <Play size={16} /> Start Camera
                </button>
              ) : (
                <>
                  <button className="btn btn-ghost" onClick={stopCamera}>
                    <Square size={16} /> Stop Camera
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={startFaceScan}
                    disabled={isCapturing || !selectedStudent}
                  >
                    <Scan size={16} /> Start Scan
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Slots / Progress */}
          <div className="card" style={{ padding: 'var(--space-lg)' }}>
            <h4 style={{ marginBottom: 'var(--space-md)' }}>Scan Captures (5 required)</h4>
            <div className="photo-capture-grid">
              {[1, 2, 3, 4, 5].map((slot) => {
                const isCaptured = capturedImages.length >= slot;
                return (
                  <div key={slot} className={`photo-capture-slot ${isCaptured ? 'captured' : ''}`}>
                    {isCaptured ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--success)' }}>
                        <CheckCircle size={24} />
                        <span style={{ fontSize: 'var(--font-size-xs)', marginTop: '4px' }}>Captured</span>
                      </div>
                    ) : (
                      <>
                        <Camera size={20} />
                        <span>Slot {slot}</span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Registration Options & Selected Student Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <div className="card" style={{ padding: 'var(--space-lg)' }}>
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Enroll Student</h3>
            
            {errorMessage && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: 'var(--space-md)', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--danger-light)', marginBottom: 'var(--space-lg)', fontSize: 'var(--font-size-sm)' }}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Class</label>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setSelectedStudent('');
                }}
                style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>Class {cls.name}-{cls.section}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
              >
                <option value="">-- Select Student --</option>
                {classStudents.map((stud) => (
                  <option key={stud.id} value={stud.id}>
                    Roll #{stud.rollNo} - {stud.name} {stud.faceRegistered ? '✓' : ''}
                  </option>
                ))}
              </select>
            </div>

            {selectedStudent && (() => {
              const student = students.find((s) => s.id === selectedStudent);
              if (!student) return null;
              return (
                <div style={{ padding: 'var(--space-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                      {student.avatar}
                    </div>
                    <div>
                      <h4 style={{ margin: 0 }}>{student.name}</h4>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Roll #{student.rollNo} · Class {student.className}</span>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-sm)', marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                    <span style={{ fontWeight: 600, color: student.faceRegistered ? 'var(--success)' : 'var(--danger)' }}>
                      {student.faceRegistered ? 'Face Registered' : 'Not Registered'}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceRegisterPage;
