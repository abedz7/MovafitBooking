import React from 'react';
import { User } from '../types/dashboard';

interface UsersSectionProps {
  users: User[];
  usersLoading: boolean;
  onRefresh: () => void;
  currentAdmin?: any;
}

export const UsersSection: React.FC<UsersSectionProps> = ({ users, usersLoading, onRefresh, currentAdmin }) => {
  // Filter out admin users - only show regular clients
  let clientUsers = users.filter(user => !user.isAdmin);
  
  // Filter by admin's own gender - male admin sees male clients, female admin sees female clients
  if (currentAdmin?.gender) {
    clientUsers = clientUsers.filter(user => user.gender === currentAdmin.gender);
  }
  
  return (
    <div className="content-section">
      <div className="section-header">
        <h2>ניהול לקוחות</h2>
        <button 
          onClick={onRefresh} 
          className="refresh-btn"
          disabled={usersLoading}
        >
          {usersLoading ? 'טוען...' : 'רענן'}
        </button>
      </div>

      {usersLoading ? (
        <div className="loading-state">
          <p>טוען לקוחות...</p>
        </div>
      ) : clientUsers.length === 0 ? (
        <div className="empty-state">
          <p>לא נמצאו לקוחות</p>
        </div>
      ) : (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>שם מלא</th>
                <th>טלפון</th>
                <th>מין</th>
                <th>משקל</th>
                <th>סטטוס</th>
                <th>תאריך רישום</th>
              </tr>
            </thead>
            <tbody>
              {clientUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.fullName}</td>
                  <td>{user.phone}</td>
                  <td>{user.gender === 'male' ? 'זכר' : 'נקבה'}</td>
                  <td>{user.weight ? `${user.weight} ק"ג` : 'לא רשום'}</td>
                  <td>
                    <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? 'פעיל' : 'לא פעיל'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString('he-IL')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
