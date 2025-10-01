import { ObjectId } from "mongodb";
import { Appointment } from './Appointments.Type';
/**
 * Retrieves all appointments from the database.
 */
export declare function getAll(): Promise<import("mongodb").WithId<import("bson").Document>[]>;
/**
 * Retrieves a specific appointment by their unique identifier.
 * @param id - The ID of the appointment to retrieve.
 */
export declare function getById(id: string): Promise<import("mongodb").WithId<import("bson").Document>>;
/**
 * Retrieves appointments by user ID.
 * @param userId - The user ID.
 */
export declare function getByUserId(userId: string): Promise<Appointment[]>;
/**
 * Retrieves appointments by date.
 * @param date - The date in YYYY-MM-DD format.
 */
export declare function getByDate(date: string): Promise<Appointment[]>;
/**
 * Retrieves appointments by status.
 * @param status - The appointment status.
 */
export declare function getByStatus(status: "scheduled" | "completed" | "cancelled"): Promise<Appointment[]>;
/**
 * Retrieves appointments by date range.
 * @param startDate - Start date in YYYY-MM-DD format.
 * @param endDate - End date in YYYY-MM-DD format.
 */
export declare function getByDateRange(startDate: string, endDate: string): Promise<Appointment[]>;
/**
 * Creates a new appointment in the database.
 * @param appointmentData - The appointment data to create.
 */
export declare function createNewAppointment(appointmentData: Partial<Appointment>): Promise<{
    success: boolean;
    insertedId: ObjectId;
}>;
/**
 * Updates an existing appointment's details in the database.
 * @param id - The ID of the appointment to update.
 * @param appointmentData - The appointment data to update.
 */
export declare function updateAppointmentById(id: string, appointmentData: Partial<Appointment>): Promise<import("mongodb").UpdateResult<import("bson").Document>>;
/**
 * Deletes an appointment by their unique identifier.
 * @param id - The ID of the appointment to delete.
 */
export declare function deleteAppointmentById(id: string): Promise<import("mongodb").DeleteResult>;
/**
 * Updates appointment status.
 * @param id - The ID of the appointment.
 * @param status - The new status.
 */
export declare function updateStatus(id: string, status: "scheduled" | "completed" | "cancelled"): Promise<import("mongodb").UpdateResult<import("bson").Document>>;
/**
 * Updates appointment calories.
 * @param id - The ID of the appointment.
 * @param caloriesBurnt - The calories burnt.
 */
export declare function updateCalories(id: string, caloriesBurnt: number): Promise<import("mongodb").UpdateResult<import("bson").Document>>;
/**
 * Updates appointment notes.
 * @param id - The ID of the appointment.
 * @param notes - The notes.
 */
export declare function updateNotes(id: string, notes: string): Promise<import("mongodb").UpdateResult<import("bson").Document>>;
/**
 * Gets upcoming appointments (scheduled and future dates).
 */
export declare function getUpcoming(): Promise<Appointment[]>;
/**
 * Gets completed appointments.
 */
export declare function getCompleted(): Promise<Appointment[]>;
/**
 * Gets cancelled appointments.
 */
export declare function getCancelled(): Promise<Appointment[]>;
/**
 * Gets appointment by ID.
 * @param id - The appointment ID.
 */
export declare function getAppointmentById(id: string): Promise<Appointment | null>;
/**
 * Books an appointment for a user.
 * @param userId - The user ID.
 * @param date - The appointment date.
 * @param time - The appointment time.
 * @param notes - Optional notes.
 */
export declare function bookAppointment(userId: string, date: string, time: string, notes?: string): Promise<{
    success: boolean;
    insertedId: ObjectId;
}>;
/**
 * Cancels an appointment.
 * @param id - The appointment ID.
 */
export declare function cancelAppointment(id: string): Promise<import("mongodb").UpdateResult<import("bson").Document>>;
/**
 * Completes an appointment with calories burnt.
 * @param id - The appointment ID.
 * @param caloriesBurnt - The calories burnt.
 * @param notes - Optional completion notes.
 */
export declare function completeAppointment(id: string, caloriesBurnt: number, notes?: string): Promise<import("mongodb").UpdateResult<import("bson").Document>>;
/**
 * Reschedules an appointment.
 * @param id - The appointment ID.
 * @param newDate - The new date.
 * @param newTime - The new time.
 */
export declare function rescheduleAppointment(id: string, newDate: string, newTime: string): Promise<import("mongodb").UpdateResult<import("bson").Document>>;
//# sourceMappingURL=Appointments.model.d.ts.map