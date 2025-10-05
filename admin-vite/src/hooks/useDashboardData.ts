import { useState, useCallback } from 'react';
import type { DashboardStats, LastFetchTime, User, Appointment } from '../types/dashboard';

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    upcomingAppointments: 0,
    completedSessions: 0,
    totalCaloriesBurnt: 0
  });
  const [loading, setLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<LastFetchTime>({
    users: 0,
    appointments: 0,
    stats: 0
  });

  const fetchDashboardStats = useCallback(async (forceRefresh = false, users: User[] = [], appointments: Appointment[] = []) => {
    // Cache for 30 seconds
    const now = Date.now();
    if (!forceRefresh && now - lastFetchTime.stats < 30000) {
      console.log('Using cached dashboard stats');
      return;
    }

    try {
      console.log('Fetching dashboard stats...');
      setLoading(true);
      
      // Use cached data if available and recent
      if (users.length > 0 && appointments.length > 0 && !forceRefresh) {
        const totalUsers = users.length;
        const upcomingAppointments = appointments.filter((apt: any) => apt.status === 'scheduled').length;
        const completedSessions = appointments.filter((apt: any) => apt.status === 'completed').length;
        const totalCaloriesBurnt = appointments
          .filter((apt: any) => apt.status === 'completed')
          .reduce((total: number, apt: any) => total + (apt.caloriesBurnt || 0), 0);

        setStats({
          totalUsers,
          upcomingAppointments,
          completedSessions,
          totalCaloriesBurnt
        });
        setLastFetchTime(prev => ({ ...prev, stats: now }));
        setLoading(false);
        return;
      }

      // Fetch fresh data only if needed
      console.log('Making API calls...');
      console.log('Current origin:', window.location.origin);
      
      const [usersResponse, appointmentsResponse] = await Promise.all([
        fetch('https://movafit-booking-server.vercel.app/api/users/getAllUsers'),
        fetch('https://movafit-booking-server.vercel.app/api/appointments/getAllAppointments')
      ]);

      console.log('API responses:', { 
        usersResponse: { 
          ok: usersResponse.ok, 
          status: usersResponse.status, 
          statusText: usersResponse.statusText 
        },
        appointmentsResponse: { 
          ok: appointmentsResponse.ok, 
          status: appointmentsResponse.status, 
          statusText: appointmentsResponse.statusText 
        }
      });

      const [usersData, appointmentsData] = await Promise.all([
        usersResponse.json(),
        appointmentsResponse.json()
      ]);

      console.log('API data:', { usersData, appointmentsData });

      const totalUsers = usersData.users ? usersData.users.length : 0;
      const appointmentsList = appointmentsData.appointments || [];

      // Calculate stats
      const upcomingAppointments = appointmentsList.filter((apt: any) => apt.status === 'scheduled').length;
      const completedSessions = appointmentsList.filter((apt: any) => apt.status === 'completed').length;
      const totalCaloriesBurnt = appointmentsList
        .filter((apt: any) => apt.status === 'completed')
        .reduce((total: number, apt: any) => total + (apt.caloriesBurnt || 0), 0);

      const newStats = {
        totalUsers,
        upcomingAppointments,
        completedSessions,
        totalCaloriesBurnt
      };
      
      console.log('Setting stats:', newStats);
      setStats(newStats);
      setLastFetchTime(prev => ({ ...prev, stats: now }));
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  }, [lastFetchTime.stats]);

  return {
    stats,
    loading,
    lastFetchTime,
    setLastFetchTime,
    fetchDashboardStats
  };
};
