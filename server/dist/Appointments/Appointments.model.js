"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getById = getById;
exports.getByUserId = getByUserId;
exports.getByDate = getByDate;
exports.getByStatus = getByStatus;
exports.getByDateRange = getByDateRange;
exports.createNewAppointment = createNewAppointment;
exports.updateAppointmentById = updateAppointmentById;
exports.deleteAppointmentById = deleteAppointmentById;
exports.updateStatus = updateStatus;
exports.updateCalories = updateCalories;
exports.updateNotes = updateNotes;
exports.getUpcoming = getUpcoming;
exports.getCompleted = getCompleted;
exports.getCancelled = getCancelled;
exports.getAppointmentById = getAppointmentById;
exports.bookAppointment = bookAppointment;
exports.cancelAppointment = cancelAppointment;
exports.completeAppointment = completeAppointment;
exports.rescheduleAppointment = rescheduleAppointment;
// Appointments.model.ts
const mongodb_1 = require("mongodb");
const Appointments_db_1 = require("./Appointments.db");
/**
 * Retrieves all appointments from the database.
 */
async function getAll() {
    return await (0, Appointments_db_1.getAppointments)();
}
/**
 * Retrieves a specific appointment by their unique identifier.
 * @param id - The ID of the appointment to retrieve.
 */
async function getById(id) {
    let query = mongodb_1.ObjectId.isValid(id) ? { _id: new mongodb_1.ObjectId(id) } : { date: id };
    let appointments = await (0, Appointments_db_1.getAppointments)(query);
    return appointments[0]; // Return the first appointment found
}
/**
 * Retrieves appointments by user ID.
 * @param userId - The user ID.
 */
async function getByUserId(userId) {
    return await (0, Appointments_db_1.getAppointmentsByUserId)(new mongodb_1.ObjectId(userId));
}
/**
 * Retrieves appointments by date.
 * @param date - The date in YYYY-MM-DD format.
 */
async function getByDate(date) {
    return await (0, Appointments_db_1.getAppointmentsByDate)(date);
}
/**
 * Retrieves appointments by status.
 * @param status - The appointment status.
 */
async function getByStatus(status) {
    return await (0, Appointments_db_1.getAppointmentsByStatus)(status);
}
/**
 * Retrieves appointments by date range.
 * @param startDate - Start date in YYYY-MM-DD format.
 * @param endDate - End date in YYYY-MM-DD format.
 */
async function getByDateRange(startDate, endDate) {
    return await (0, Appointments_db_1.getAppointmentsByDateRange)(startDate, endDate);
}
/**
 * Creates a new appointment in the database.
 * @param appointmentData - The appointment data to create.
 */
async function createNewAppointment(appointmentData) {
    let newAppointment = {
        _id: new mongodb_1.ObjectId(),
        userId: new mongodb_1.ObjectId(appointmentData.userId),
        date: appointmentData.date || '',
        time: appointmentData.time || '',
        caloriesBurnt: appointmentData.caloriesBurnt || 0,
        notes: appointmentData.notes || '',
        status: appointmentData.status || 'scheduled',
        createdAt: new Date()
    };
    return await (0, Appointments_db_1.addAppointment)(newAppointment);
}
/**
 * Updates an existing appointment's details in the database.
 * @param id - The ID of the appointment to update.
 * @param appointmentData - The appointment data to update.
 */
async function updateAppointmentById(id, appointmentData) {
    return await (0, Appointments_db_1.updateAppointment)(id, appointmentData);
}
/**
 * Deletes an appointment by their unique identifier.
 * @param id - The ID of the appointment to delete.
 */
async function deleteAppointmentById(id) {
    return await (0, Appointments_db_1.deleteAppointment)(new mongodb_1.ObjectId(id));
}
/**
 * Updates appointment status.
 * @param id - The ID of the appointment.
 * @param status - The new status.
 */
async function updateStatus(id, status) {
    return await (0, Appointments_db_1.updateAppointmentStatus)(new mongodb_1.ObjectId(id), status);
}
/**
 * Updates appointment calories.
 * @param id - The ID of the appointment.
 * @param caloriesBurnt - The calories burnt.
 */
async function updateCalories(id, caloriesBurnt) {
    return await (0, Appointments_db_1.updateAppointmentCalories)(new mongodb_1.ObjectId(id), caloriesBurnt);
}
/**
 * Updates appointment notes.
 * @param id - The ID of the appointment.
 * @param notes - The notes.
 */
async function updateNotes(id, notes) {
    return await (0, Appointments_db_1.updateAppointmentNotes)(new mongodb_1.ObjectId(id), notes);
}
/**
 * Gets upcoming appointments (scheduled and future dates).
 */
async function getUpcoming() {
    return await (0, Appointments_db_1.getUpcomingAppointments)();
}
/**
 * Gets completed appointments.
 */
async function getCompleted() {
    return await (0, Appointments_db_1.getCompletedAppointments)();
}
/**
 * Gets cancelled appointments.
 */
async function getCancelled() {
    return await (0, Appointments_db_1.getCancelledAppointments)();
}
/**
 * Gets appointment by ID.
 * @param id - The appointment ID.
 */
async function getAppointmentById(id) {
    return await (0, Appointments_db_1.getAppointmentById)(new mongodb_1.ObjectId(id));
}
/**
 * Books an appointment for a user.
 * @param userId - The user ID.
 * @param date - The appointment date.
 * @param time - The appointment time.
 * @param notes - Optional notes.
 */
async function bookAppointment(userId, date, time, notes = '') {
    let newAppointment = {
        _id: new mongodb_1.ObjectId(),
        userId: new mongodb_1.ObjectId(userId),
        date: date,
        time: time,
        caloriesBurnt: 0,
        notes: notes,
        status: 'scheduled',
        createdAt: new Date()
    };
    return await (0, Appointments_db_1.addAppointment)(newAppointment);
}
/**
 * Cancels an appointment.
 * @param id - The appointment ID.
 */
async function cancelAppointment(id) {
    return await (0, Appointments_db_1.updateAppointmentStatus)(new mongodb_1.ObjectId(id), 'cancelled');
}
/**
 * Completes an appointment with calories burnt.
 * @param id - The appointment ID.
 * @param caloriesBurnt - The calories burnt.
 * @param notes - Optional completion notes.
 */
async function completeAppointment(id, caloriesBurnt, notes = '') {
    const updateData = {
        status: 'completed',
        caloriesBurnt: caloriesBurnt,
        notes: notes
    };
    return await (0, Appointments_db_1.updateAppointment)(id, updateData);
}
/**
 * Reschedules an appointment.
 * @param id - The appointment ID.
 * @param newDate - The new date.
 * @param newTime - The new time.
 */
async function rescheduleAppointment(id, newDate, newTime) {
    const updateData = {
        date: newDate,
        time: newTime
    };
    return await (0, Appointments_db_1.updateAppointment)(id, updateData);
}
//# sourceMappingURL=Appointments.model.js.map