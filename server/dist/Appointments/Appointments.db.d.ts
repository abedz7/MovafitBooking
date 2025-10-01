import { ObjectId } from "mongodb";
import { Appointment } from "./Appointments.Type";
export declare function getAppointments(query?: {}, projection?: {}): Promise<import("mongodb").WithId<import("bson").Document>[]>;
export declare function addAppointment(appointment: Appointment): Promise<{
    success: boolean;
    insertedId: ObjectId;
}>;
export declare function updateAppointment(id: string, appointment: Partial<Appointment>): Promise<import("mongodb").UpdateResult<import("bson").Document>>;
export declare function deleteAppointment(id: ObjectId): Promise<import("mongodb").DeleteResult>;
export declare function getAppointmentsByUserId(userId: ObjectId): Promise<Appointment[]>;
export declare function getAppointmentsByDate(date: string): Promise<Appointment[]>;
export declare function getAppointmentsByStatus(status: "scheduled" | "completed" | "cancelled"): Promise<Appointment[]>;
export declare function getAppointmentsByDateRange(startDate: string, endDate: string): Promise<Appointment[]>;
export declare function getAppointmentById(id: ObjectId): Promise<Appointment | null>;
export declare function updateAppointmentStatus(id: ObjectId, status: "scheduled" | "completed" | "cancelled"): Promise<import("mongodb").UpdateResult<import("bson").Document>>;
export declare function updateAppointmentCalories(id: ObjectId, caloriesBurnt: number): Promise<import("mongodb").UpdateResult<import("bson").Document>>;
export declare function updateAppointmentNotes(id: ObjectId, notes: string): Promise<import("mongodb").UpdateResult<import("bson").Document>>;
export declare function getUpcomingAppointments(): Promise<Appointment[]>;
export declare function getCompletedAppointments(): Promise<Appointment[]>;
export declare function getCancelledAppointments(): Promise<Appointment[]>;
//# sourceMappingURL=Appointments.db.d.ts.map