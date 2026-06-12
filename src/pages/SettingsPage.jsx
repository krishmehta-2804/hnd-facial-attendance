/**
 * Settings Page - System configurations and settings
 */
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SCHOOL_CONFIG, FACE_DETECTION_CONFIG } from '../utils/constants';
import { Save, School, Clock, Camera, ShieldAlert, CloudLightning, ToggleLeft, ToggleRight, Check } from 'lucide-react';

const SettingsPage = () => {
  const { currentUser } = useAuth();
  
  // Tabs: general, attendance, facial, sync
  const [activeTab, setActiveTab] = useState('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // States for configs
  const [schoolName, setSchoolName] = useState(SCHOOL_CONFIG.name);
  const [academicYear, setAcademicYear] = useState(SCHOOL_CONFIG.academicYear);
  const [startTime, setStartTime] = useState(SCHOOL_CONFIG.schoolStartTime);
  const [endTime, setEndTime] = useState(SCHOOL_CONFIG.schoolEndTime);
  const [lateThreshold, setLateThreshold] = useState(SCHOOL_CONFIG.lateThresholdMinutes);
  const [minAttendance, setMinAttendance] = useState(SCHOOL_CONFIG.minAttendancePercentage);
  const [faceThreshold, setFaceThreshold] = useState(FACE_DETECTION_CONFIG.threshold);
  const [offlineSync, setOfflineSync] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>System Settings</h1>
          <p>Configure academic calendars, camera inputs, and sync rules</p>
        </div>
        <div className="page-actions">
          {savedSuccess && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
              <Check size={16} />
              <span>Settings saved!</span>
            </div>
          )}
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} />
            Save Settings
          </button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '250px 1fr', gap: 'var(--space-xl)', marginTop: 'var(--space-lg)', alignItems: 'start' }}>
        {/* Sidebar tabs */}
        <div className="card" style={{ padding: 'var(--space-md)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              className={`btn ${activeTab === 'general' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('general')}
              style={{ justifyContent: 'flex-start', gap: '10px' }}
            >
              <School size={16} />
              <span>School Profile</span>
            </button>
            <button
              className={`btn ${activeTab === 'attendance' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('attendance')}
              style={{ justifyContent: 'flex-start', gap: '10px' }}
            >
              <Clock size={16} />
              <span>Timings & Thresholds</span>
            </button>
            <button
              className={`btn ${activeTab === 'facial' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('facial')}
              style={{ justifyContent: 'flex-start', gap: '10px' }}
            >
              <Camera size={16} />
              <span>Facial Recognition</span>
            </button>
            <button
              className={`btn ${activeTab === 'sync' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('sync')}
              style={{ justifyContent: 'flex-start', gap: '10px' }}
            >
              <CloudLightning size={16} />
              <span>Database & Sync</span>
            </button>
          </div>
        </div>

        {/* Tab contents */}
        <div className="card" style={{ padding: 'var(--space-xl)' }}>
          <form onSubmit={handleSave}>
            {activeTab === 'general' && (
              <div>
                <h3 style={{ marginBottom: 'var(--space-lg)' }}>School Profile</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>School Name</label>
                    <input
                      type="text"
                      className="input"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                    />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>School Code</label>
                    <input
                      type="text"
                      className="input"
                      defaultValue={SCHOOL_CONFIG.code}
                      disabled
                      style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-tertiary)', cursor: 'not-allowed' }}
                    />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Academic Year</label>
                    <input
                      type="text"
                      className="input"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                    />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>District</label>
                    <input
                      type="text"
                      className="input"
                      defaultValue="Karnal"
                      disabled
                      style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-tertiary)', cursor: 'not-allowed' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div>
                <h3 style={{ marginBottom: 'var(--space-lg)' }}>Timings & Attendance Rules</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>School Start Time</label>
                    <input
                      type="time"
                      className="input"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                    />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>School End Time</label>
                    <input
                      type="time"
                      className="input"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                    />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Late Grace Period (Minutes)</label>
                    <input
                      type="number"
                      className="input"
                      value={lateThreshold}
                      onChange={(e) => setLateThreshold(Number(e.target.value))}
                      style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                    />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Minimum Required Attendance %</label>
                    <input
                      type="number"
                      className="input"
                      value={minAttendance}
                      onChange={(e) => setMinAttendance(Number(e.target.value))}
                      style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'facial' && (
              <div>
                <h3 style={{ marginBottom: 'var(--space-lg)' }}>Facial Recognition Config</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-lg)' }}>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Detection Confidence Threshold (0.1 - 1.0)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={faceThreshold}
                        onChange={(e) => setFaceThreshold(parseFloat(e.target.value))}
                        style={{ flex: 1 }}
                      />
                      <span style={{ fontWeight: 'bold', minWidth: '40px' }}>{faceThreshold}</span>
                    </div>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Higher values reduce false positives but might miss faces. Recommended: 0.5 - 0.6.</span>
                  </div>

                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: 'var(--space-md)' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Default Camera Device</label>
                    <select
                      style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                    >
                      <option>Front-Facing Camera (Tablet default)</option>
                      <option>Back-Facing Camera</option>
                      <option>External USB Camera</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sync' && (
              <div>
                <h3 style={{ marginBottom: 'var(--space-lg)' }}>Centralized Database & Offline Sync</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                    <div>
                      <h4 style={{ margin: 0 }}>Offline Mode / Local Cache</h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Allow database sync to wait until stable internet is active</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOfflineSync(!offlineSync)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)' }}
                    >
                      {offlineSync ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: 'var(--space-md)', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: 'var(--radius)', color: 'var(--accent-light)' }}>
                    <ShieldAlert size={20} />
                    <span style={{ fontSize: 'var(--font-size-sm)' }}>
                      Firebase central DB credentials can be configured using environment variable: <code>REACT_APP_FIREBASE_API_KEY</code>.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
