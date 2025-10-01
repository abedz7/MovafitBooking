import { Router } from 'express';
import { 
    getAllAppointments, 
    getAppointmentById, 
    getAppointmentsByUserId, 
    createAppointment, 
    updateAppointment, 
    deleteAppointment, 
    bookAppointment, 
    cancelAppointment, 
    completeAppointment, 
    getUpcomingAppointments, 
    getCompletedAppointments, 
    getCancelledAppointments 
} from './Appointments.controller';

const AppointmentsRouter = Router();

// Retrieve all appointments
AppointmentsRouter.get('/getAllAppointments', getAllAppointments);

// Retrieve a specific appointment by ID
AppointmentsRouter.get('/getAppointmentById/:id', getAppointmentById);

// Retrieve appointments by user ID
AppointmentsRouter.get('/getAppointmentsByUserId/:userId', getAppointmentsByUserId);

// Create a new appointment
AppointmentsRouter.post('/createAppointment', createAppointment);

// Update an existing appointment
AppointmentsRouter.put('/updateAppointment/:id', updateAppointment);

// Delete an appointment by ID
AppointmentsRouter.delete('/deleteAppointment/:id', deleteAppointment);

// Book an appointment
AppointmentsRouter.post('/bookAppointment', bookAppointment);

// Cancel an appointment
AppointmentsRouter.put('/cancelAppointment/:id', cancelAppointment);

// Complete an appointment
AppointmentsRouter.put('/completeAppointment/:id', completeAppointment);

// Get upcoming appointments
AppointmentsRouter.get('/getUpcomingAppointments', getUpcomingAppointments);

// Get completed appointments
AppointmentsRouter.get('/getCompletedAppointments', getCompletedAppointments);

// Get cancelled appointments
AppointmentsRouter.get('/getCancelledAppointments', getCancelledAppointments);

export default AppointmentsRouter;
