import React from 'react';
import { DashboardStats } from '../types/dashboard';

interface StatsSectionProps {
  stats: DashboardStats;
  loading: boolean;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats, loading }) => {
  return (
    <>
      <div className="welcome-section">
        <h2>ברוכים הבאים, מנהל!</h2>
        <p>נהל את פעילות מרפאת מובפיט</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>משתמשים רשומים</h3>
            <p className="stat-number">
              {loading ? '...' : stats.totalUsers.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>תורים קרובים</h3>
            <p className="stat-number">
              {loading ? '...' : stats.upcomingAppointments.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>מפגשים שהושלמו</h3>
            <p className="stat-number">
              {loading ? '...' : stats.completedSessions.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>קלוריות שנשרפו</h3>
            <p className="stat-number">
              {loading ? '...' : stats.totalCaloriesBurnt.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
