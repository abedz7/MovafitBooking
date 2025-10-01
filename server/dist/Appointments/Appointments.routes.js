"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Appointments_controller_1 = require("./Appointments.controller");
const AppointmentsRouter = (0, express_1.Router)();
// Retrieve all appointments
AppointmentsRouter.get('/getAllAppointments', Appointments_controller_1.getAllAppointments);
// Retrieve a specific appointment by ID
AppointmentsRouter.get('/getAppointmentById/:id', Appointments_controller_1.getAppointmentById);
// Retrieve appointments by user ID
AppointmentsRouter.get('/getAppointmentsByUserId/:userId', Appointments_controller_1.getAppointmentsByUserId);
// Create a new appointment
AppointmentsRouter.post('/createAppointment', Appointments_controller_1.createAppointment);
// Update an existing appointment
AppointmentsRouter.put('/updateAppointment/:id', Appointments_controller_1.updateAppointment);
// Delete an appointment by ID
AppointmentsRouter.delete('/deleteAppointment/:id', Appointments_controller_1.deleteAppointment);
// Book an appointment
AppointmentsRouter.post('/bookAppointment', Appointments_controller_1.bookAppointment);
// Cancel an appointment
AppointmentsRouter.put('/cancelAppointment/:id', Appointments_controller_1.cancelAppointment);
// Complete an appointment
AppointmentsRouter.put('/completeAppointment/:id', Appointments_controller_1.completeAppointment);
// Get upcoming appointments
AppointmentsRouter.get('/getUpcomingAppointments', Appointments_controller_1.getUpcomingAppointments);
// Get completed appointments
AppointmentsRouter.get('/getCompletedAppointments', Appointments_controller_1.getCompletedAppointments);
// Get cancelled appointments
AppointmentsRouter.get('/getCancelledAppointments', Appointments_controller_1.getCancelledAppointments);
exports.default = AppointmentsRouter;
//# sourceMappingURL=Appointments.routes.js.map