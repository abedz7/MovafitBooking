"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAppointments = getAllAppointments;
exports.getAppointmentById = getAppointmentById;
exports.getAppointmentsByUserId = getAppointmentsByUserId;
exports.createAppointment = createAppointment;
exports.updateAppointment = updateAppointment;
exports.deleteAppointment = deleteAppointment;
exports.bookAppointment = bookAppointment;
exports.cancelAppointment = cancelAppointment;
exports.completeAppointment = completeAppointment;
exports.getUpcomingAppointments = getUpcomingAppointments;
exports.getCompletedAppointments = getCompletedAppointments;
exports.getCancelledAppointments = getCancelledAppointments;
const Appointments_model_1 = require("./Appointments.model");
/**
 * Retrieves all appointments from the database.
 */
async function getAllAppointments(req, res) {
    try {
        let appointments = await (0, Appointments_model_1.getAll)();
        res.status(200).json({ appointments });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
/**
 * Retrieves a specific appointment by their unique identifier.
 */
async function getAppointmentById(req, res) {
    try {
        let { id } = req.params;
        if (id.length != 24)
            return res.status(403).json({ error: 'Invalid Appointment ID' });
        let appointment = await (0, Appointments_model_1.getById)(id);
        if (!appointment)
            res.status(404).json({ error: 'Appointment Not Found' });
        else
            res.status(200).json({ appointment });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
/**
 * Retrieves appointments by user ID.
 */
async function getAppointmentsByUserId(req, res) {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        if (userId.length != 24)
            return res.status(403).json({ error: 'Invalid User ID' });
        const appointments = await (0, Appointments_model_1.getByUserId)(userId);
        res.status(200).json({ appointments });
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving appointments' });
    }
}
/**
 * Creates a new appointment in the database.
 */
async function createAppointment(req, res) {
    try {
        let appointmentData = req.body;
        if (!appointmentData.userId)
            return res.status(400).json({ error: 'User ID is required' });
        if (!appointmentData.date)
            return res.status(400).json({ error: 'Date is required' });
        if (!appointmentData.time)
            return res.status(400).json({ error: 'Time is required' });
        let result = await (0, Appointments_model_1.createNewAppointment)(appointmentData);
        res.status(201).json({
            message: 'Appointment created successfully',
            appointment: result
        });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
/**
 * Updates an existing appointment's details in the database.
 */
async function updateAppointment(req, res) {
    try {
        let { id } = req.params;
        let appointmentData = req.body;
        if (id.length != 24)
            return res.status(403).json({ error: 'Invalid Appointment ID' });
        let result = await (0, Appointments_model_1.updateAppointmentById)(id, appointmentData);
        if (result.modifiedCount == 0)
            res.status(404).json({ error: 'Appointment Not Found' });
        else
            res.status(200).json({ result });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
/**
 * Deletes an appointment by their unique identifier.
 */
async function deleteAppointment(req, res) {
    try {
        let { id } = req.params;
        if (id.length != 24)
            return res.status(403).json({ error: 'Invalid Appointment ID' });
        let result = await (0, Appointments_model_1.deleteAppointmentById)(id);
        if (result.deletedCount === 0)
            res.status(404).json({ error: 'Appointment Not Found' });
        else
            res.status(200).json({ message: 'Appointment Deleted Successfully' });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
/**
 * Books an appointment for a user.
 */
async function bookAppointment(req, res) {
    try {
        const { userId, date, time, notes } = req.body;
        if (!userId || !date || !time) {
            return res.status(400).json({ error: 'User ID, date, and time are required' });
        }
        if (userId.length != 24)
            return res.status(403).json({ error: 'Invalid User ID' });
        let result = await (0, Appointments_model_1.bookAppointment)(userId, date, time, notes || '');
        res.status(201).json({
            message: 'Appointment booked successfully',
            appointment: result
        });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
/**
 * Cancels an appointment.
 */
async function cancelAppointment(req, res) {
    try {
        const { id } = req.params;
        if (id.length != 24)
            return res.status(403).json({ error: 'Invalid Appointment ID' });
        let result = await (0, Appointments_model_1.cancelAppointment)(id);
        if (result && result.modifiedCount == 0)
            res.status(404).json({ error: 'Appointment Not Found' });
        else
            res.status(200).json({ message: 'Appointment cancelled successfully' });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
/**
 * Completes an appointment with calories burnt.
 */
async function completeAppointment(req, res) {
    try {
        const { id } = req.params;
        const { caloriesBurnt, notes } = req.body;
        if (id.length != 24)
            return res.status(403).json({ error: 'Invalid Appointment ID' });
        if (!caloriesBurnt || caloriesBurnt < 0)
            return res.status(400).json({ error: 'Valid calories burnt is required' });
        let result = await (0, Appointments_model_1.completeAppointment)(id, caloriesBurnt, notes || '');
        if (result && result.modifiedCount == 0)
            res.status(404).json({ error: 'Appointment Not Found' });
        else
            res.status(200).json({ message: 'Appointment completed successfully' });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
/**
 * Gets upcoming appointments.
 */
async function getUpcomingAppointments(req, res) {
    try {
        let appointments = await (0, Appointments_model_1.getUpcoming)();
        res.status(200).json({ appointments });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
/**
 * Gets completed appointments.
 */
async function getCompletedAppointments(req, res) {
    try {
        let appointments = await (0, Appointments_model_1.getCompleted)();
        res.status(200).json({ appointments });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
/**
 * Gets cancelled appointments.
 */
async function getCancelledAppointments(req, res) {
    try {
        let appointments = await (0, Appointments_model_1.getCancelled)();
        res.status(200).json({ appointments });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
//# sourceMappingURL=Appointments.controller.js.map