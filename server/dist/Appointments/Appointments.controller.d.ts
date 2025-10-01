import { Request, Response } from "express";
/**
 * Retrieves all appointments from the database.
 */
export declare function getAllAppointments(req: Request, res: Response): Promise<void>;
/**
 * Retrieves a specific appointment by their unique identifier.
 */
export declare function getAppointmentById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Retrieves appointments by user ID.
 */
export declare function getAppointmentsByUserId(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Creates a new appointment in the database.
 */
export declare function createAppointment(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Updates an existing appointment's details in the database.
 */
export declare function updateAppointment(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Deletes an appointment by their unique identifier.
 */
export declare function deleteAppointment(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Books an appointment for a user.
 */
export declare function bookAppointment(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Cancels an appointment.
 */
export declare function cancelAppointment(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Completes an appointment with calories burnt.
 */
export declare function completeAppointment(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Gets upcoming appointments.
 */
export declare function getUpcomingAppointments(req: Request, res: Response): Promise<void>;
/**
 * Gets completed appointments.
 */
export declare function getCompletedAppointments(req: Request, res: Response): Promise<void>;
/**
 * Gets cancelled appointments.
 */
export declare function getCancelledAppointments(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=Appointments.controller.d.ts.map