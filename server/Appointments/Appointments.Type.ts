import { ObjectId } from "mongodb";

export type Appointment = {
    _id?: ObjectId,
    userId: ObjectId,
    date: string,
    time: string,
    caloriesBurnt: number,
    notes: string,
    status: "scheduled" | "completed" | "cancelled",
    createdAt: Date
}
