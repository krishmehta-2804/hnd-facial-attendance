/**
 * Login Page - Beautiful dark login with school branding
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { demoUsers } from '../services/demoData';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (user) => {
    setEmail(user.email);
    setPassword(user.password);
    setError('');
    setLoading(true);
    try {
      await login(user.email, user.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg-orb orb-1"></div>
        <div className="login-bg-orb orb-2"></div>
        <div className="login-bg-orb orb-3"></div>
      </div>

      <div className="login-container">
        <div className="login-card glass animate-scale-in">
          <div className="login-header">
            <div className="login-logo">
              <GraduationCap size={32} />
            </div>
            <h1>HND Attendance</h1>
            <p>Facial Recognition Attendance System</p>
          </div>

          {error && (
            <div className="login-error animate-fade-in">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <Lock size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin" style={{ display: 'inline-block' }}>⟳</span>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>Quick Demo Login</span>
          </div>

          <div className="demo-logins">
            {demoUsers.map((user) => (
              <button
                key={user.id}
                className="demo-login-btn"
                onClick={() => handleDemoLogin(user)}
                disabled={loading}
              >
                <div className="demo-avatar">{user.avatar}</div>
                <div className="demo-info">
                  <div className="demo-name">{user.name}</div>
                  <div className="demo-role">{user.role}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="login-footer">
          <p>© 2026 HND Facial Attendance System · Haryana</p>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .login-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
        }

        .login-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          background: rgba(59, 130, 246, 0.15);
          top: -100px;
          right: -100px;
          animation: float 8s ease-in-out infinite;
        }

        .orb-2 {
          width: 300px;
          height: 300px;
          background: rgba(139, 92, 246, 0.12);
          bottom: -50px;
          left: -50px;
          animation: float 10s ease-in-out infinite reverse;
        }

        .orb-3 {
          width: 200px;
          height: 200px;
          background: rgba(16, 185, 129, 0.1);
          top: 50%;
          left: 50%;
          animation: float 12s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(30px, -30px); }
          66% { transform: translate(-20px, 20px); }
        }

        .login-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 440px;
          padding: var(--space-lg);
        }

        .login-card {
          padding: var(--space-2xl);
          border-radius: var(--radius-xl);
        }

        .login-header {
          text-align: center;
          margin-bottom: var(--space-xl);
        }

        .login-logo {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, var(--accent) 0%, #8B5CF6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto var(--space-md);
          color: white;
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.3);
        }

        .login-header h1 {
          font-size: var(--font-size-2xl);
          font-weight: 800;
          margin-bottom: 4px;
        }

        .login-header p {
          font-size: var(--font-size-sm);
          color: var(--text-tertiary);
        }

        .login-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: var(--danger-bg);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: var(--radius);
          color: var(--danger-light);
          font-size: var(--font-size-sm);
          margin-bottom: var(--space-lg);
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .input-with-icon {
          position: relative;
        }

        .input-with-icon svg {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-tertiary);
        }

        .input-with-icon input {
          padding-left: 44px;
          padding-right: 44px;
          height: 48px;
        }

        .password-toggle {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-tertiary);
          cursor: pointer;
          padding: 6px;
          border-radius: var(--radius-sm);
          transition: var(--transition-fast);
        }

        .password-toggle:hover {
          color: var(--text);
          background: var(--bg-glass-light);
        }

        .login-divider {
          text-align: center;
          margin: var(--space-xl) 0;
          position: relative;
        }

        .login-divider::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 100%;
          height: 1px;
          background: var(--border);
        }

        .login-divider span {
          position: relative;
          background: var(--bg-glass);
          padding: 0 var(--space-md);
          font-size: var(--font-size-xs);
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .demo-logins {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-sm);
        }

        .demo-login-btn {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: 10px 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          cursor: pointer;
          transition: var(--transition);
          text-align: left;
        }

        .demo-login-btn:hover {
          border-color: var(--accent);
          background: rgba(59, 130, 246, 0.05);
          transform: translateY(-1px);
        }

        .demo-login-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .demo-avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, var(--accent) 0%, #8B5CF6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 11px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .demo-name {
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--text);
          line-height: 1.2;
        }

        .demo-role {
          font-size: 10px;
          color: var(--text-tertiary);
          text-transform: capitalize;
        }

        .login-footer {
          text-align: center;
          margin-top: var(--space-xl);
        }

        .login-footer p {
          font-size: var(--font-size-xs);
          color: var(--text-tertiary);
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
