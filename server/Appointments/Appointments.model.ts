// Appointments.model.ts
import { ObjectId } from "mongodb";
import {
    getAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByUserId,
    getAppointmentsByDate,
    getAppointmentsByStatus,
    getAppointmentsByDateRange,
    getAppointmentById as getAppointmentByIdFromDb,
    updateAppointmentStatus,
    updateAppointmentCalories,
    updateAppointmentNotes,
    getUpcomingAppointments,
    getCompletedAppointments,
    getCancelledAppointments
} from './Appointments.db';
import { Appointment } from './Appointments.Type';

/**
 * Retrieves all appointments from the database.
 */
export async function getAll() {
    return await getAppointments();
}

/**
 * Retrieves a specific appointment by their unique identifier.
 * @param id - The ID of the appointment to retrieve.
 */
export async function getById(id: string) {
    let query: any = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { date: id };
    let appointments = await getAppointments(query);
    return appointments[0]; // Return the first appointment found
}

/**
 * Retrieves appointments by user ID.
 * @param userId - The user ID.
 */
export async function getByUserId(userId: string) {
    return await getAppointmentsByUserId(new ObjectId(userId));
}

/**
 * Retrieves appointments by date.
 * @param date - The date in YYYY-MM-DD format.
 */
export async function getByDate(date: string) {
    return await getAppointmentsByDate(date);
}

/**
 * Retrieves appointments by status.
 * @param status - The appointment status.
 */
export async function getByStatus(status: "scheduled" | "completed" | "cancelled") {
    return await getAppointmentsByStatus(status);
}

/**
 * Retrieves appointments by date range.
 * @param startDate - Start date in YYYY-MM-DD format.
 * @param endDate - End date in YYYY-MM-DD format.
 */
export async function getByDateRange(startDate: string, endDate: string) {
    return await getAppointmentsByDateRange(startDate, endDate);
}

/**
 * Creates a new appointment in the database.
 * @param appointmentData - The appointment data to create.
 */
export async function createNewAppointment(appointmentData: Partial<Appointment>) {
    let newAppointment: Appointment = {
        _id: new ObjectId(),
        userId: new ObjectId(appointmentData.userId!),
        date: appointmentData.date || '',
        time: appointmentData.time || '',
        caloriesBurnt: appointmentData.caloriesBurnt || 0,
        notes: appointmentData.notes || '',
        status: appointmentData.status || 'scheduled',
        createdAt: new Date()
    };
    return await addAppointment(newAppointment);
}

/**
 * Updates an existing appointment's details in the database.
 * @param id - The ID of the appointment to update.
 * @param appointmentData - The appointment data to update.
 */
export async function updateAppointmentById(id: string, appointmentData: Partial<Appointment>) {
    return await updateAppointment(id, appointmentData);
}

/**
 * Deletes an appointment by their unique identifier.
 * @param id - The ID of the appointment to delete.
 */
export async function deleteAppointmentById(id: string) {
    return await deleteAppointment(new ObjectId(id));
}

/**
 * Updates appointment status.
 * @param id - The ID of the appointment.
 * @param status - The new status.
 */
export async function updateStatus(id: string, status: "scheduled" | "completed" | "cancelled") {
    return await updateAppointmentStatus(new ObjectId(id), status);
}

/**
 * Updates appointment calories.
 * @param id - The ID of the appointment.
 * @param caloriesBurnt - The calories burnt.
 */
export async function updateCalories(id: string, caloriesBurnt: number) {
    return await updateAppointmentCalories(new ObjectId(id), caloriesBurnt);
}

/**
 * Updates appointment notes.
 * @param id - The ID of the appointment.
 * @param notes - The notes.
 */
export async function updateNotes(id: string, notes: string) {
    return await updateAppointmentNotes(new ObjectId(id), notes);
}

/**
 * Gets upcoming appointments (scheduled and future dates).
 */
export async function getUpcoming() {
    return await getUpcomingAppointments();
}

/**
 * Gets completed appointments.
 */
export async function getCompleted() {
    return await getCompletedAppointments();
}

/**
 * Gets cancelled appointments.
 */
export async function getCancelled() {
    return await getCancelledAppointments();
}

/**
 * Gets appointment by ID.
 * @param id - The appointment ID.
 */
export async function getAppointmentById(id: string) {
    return await getAppointmentByIdFromDb(new ObjectId(id));
}

/**
 * Books an appointment for a user.
 * @param userId - The user ID.
 * @param date - The appointment date.
 * @param time - The appointment time.
 * @param notes - Optional notes.
 */
export async function bookAppointment(userId: string, date: string, time: string, notes: string = '') {
    let newAppointment: Appointment = {
        _id: new ObjectId(),
        userId: new ObjectId(userId),
        date: date,
        time: time,
        caloriesBurnt: 0,
        notes: notes,
        status: 'scheduled',
        createdAt: new Date()
    };
    return await addAppointment(newAppointment);
}

/**
 * Cancels an appointment.
 * @param id - The appointment ID.
 */
export async function cancelAppointment(id: string) {
    return await updateAppointmentStatus(new ObjectId(id), 'cancelled');
}

/**
 * Completes an appointment with calories burnt.
 * @param id - The appointment ID.
 * @param caloriesBurnt - The calories burnt.
 * @param notes - Optional completion notes.
 */
export async function completeAppointment(id: string, caloriesBurnt: number, notes: string = '') {
    const updateData: Partial<Appointment> = {
        status: 'completed',
        caloriesBurnt: caloriesBurnt,
        notes: notes
    };
    return await updateAppointment(id, updateData);
}

/**
 * Reschedules an appointment.
 * @param id - The appointment ID.
 * @param newDate - The new date.
 * @param newTime - The new time.
 */
export async function rescheduleAppointment(id: string, newDate: string, newTime: string) {
    const updateData: Partial<Appointment> = {
        date: newDate,
        time: newTime
    };
    return await updateAppointment(id, updateData);
}
