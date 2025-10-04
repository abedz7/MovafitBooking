import { useState } from 'react';
import { User } from '../types/dashboard';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const fetchUsers = async (forceRefresh = false, lastFetchTime = { users: 0 }) => {
    // Cache for 60 seconds
    const now = Date.now();
    if (!forceRefresh && now - lastFetchTime.users < 60000) {
      return;
    }

    try {
      setUsersLoading(true);
      const response = await fetch('https://movafit-booking-server.vercel.app/api/users/getAllUsers');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const usersArray = data.users || [];
      setUsers(usersArray);
      return now; // Return timestamp for cache update
    } catch (error) {
      setUsers([]);
      return now;
    } finally {
      setUsersLoading(false);
    }
  };

  return {
    users,
    usersLoading,
    setUsers,
    fetchUsers
  };
};
