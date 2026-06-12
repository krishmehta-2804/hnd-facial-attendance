/**
 * AlertsPanel - Real-time alerts for attendance issues
 */
import { AlertTriangle, AlertCircle, Info, Clock } from 'lucide-react';
import { getRelativeTime } from '../../utils/dateUtils';

const severityConfig = {
  critical: { icon: AlertTriangle, dotClass: 'critical', color: 'var(--danger-light)' },
  warning: { icon: AlertCircle, dotClass: 'warning', color: 'var(--warning-light)' },
  info: { icon: Info, dotClass: 'info', color: 'var(--info-light)' },
};

const AlertsPanel = ({ alerts = [] }) => {
  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="alerts-panel">
      <div className="card-header">
        <div>
          <div className="card-title">
            Alerts
            {unreadCount > 0 && (
              <span
                style={{
                  marginLeft: '8px',
                  background: 'var(--danger)',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <div className="card-subtitle">Attendance alerts and notifications</div>
        </div>
      </div>
      <div>
        {alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--text-tertiary)' }}>
            <Info size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
            <p>No alerts at this time</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const config = severityConfig[alert.severity] || severityConfig.info;
            return (
              <div
                key={alert.id}
                className="alert-item"
                style={{ opacity: alert.read ? 0.6 : 1 }}
              >
                <div className={`alert-dot ${config.dotClass}`} />
                <div className="alert-content">
                  <div className="alert-message">{alert.message}</div>
                  <div className="alert-time">
                    <Clock size={10} style={{ display: 'inline', marginRight: '4px' }} />
                    {getRelativeTime(alert.timestamp)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;
