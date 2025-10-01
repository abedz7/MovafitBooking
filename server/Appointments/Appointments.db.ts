// Appointments.db.ts
import { MongoClient, ObjectId } from "mongodb";
import { Appointment } from "./Appointments.Type";

const DB_INFO = {
    host: process.env.MONGODB_URI as string,
    db: 'Movafit',
    Collection: 'Appointments'
};

// async function to get all appointments, and to get a specific appointment by id
export async function getAppointments(query = {}, projection = {}) {
    let mongo: MongoClient | null = null;
    try {
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).find(query, projection).toArray();
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null)
            mongo.close();
    }
}

// async function to create a new appointment in the database
export async function addAppointment(appointment: Appointment) {
    let mongo: MongoClient | null = null;
    try {
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        const result = await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).insertOne(appointment);
        return { success: true, insertedId: result.insertedId };
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null)
            mongo.close();
    }
}

// function to Update an existing appointment's details in the database
export async function updateAppointment(id: string, appointment: Partial<Appointment>) {
    let mongo: MongoClient | null = null;
    try {
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).updateOne({ _id: new ObjectId(id) }, { $set: appointment });
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null)
            mongo.close();
    }
}

// function to delete an appointment by its unique identifier
export async function deleteAppointment(id: ObjectId) {
    let mongo: MongoClient | null = null;
    try {
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).deleteOne({ _id: id });
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null)
            mongo.close();
    }
}

// function to get appointments by user ID
export async function getAppointmentsByUserId(userId: ObjectId): Promise<Appointment[]> {
    let mongo: MongoClient | null = null;
    try {
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).find({ userId: userId }).toArray() as Appointment[];
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null)
            mongo.close();
    }
}

// function to get appointments by date
export async function getAppointmentsByDate(date: string): Promise<Appointment[]> {
    let mongo: MongoClient | null = null;
    try {
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).find({ date: date }).toArray() as Appointment[];
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null)
            mongo.close();
    }
}

// function to get appointments by status
export async function getAppointmentsByStatus(status: "scheduled" | "completed" | "cancelled"): Promise<Appointment[]> {
    let mongo: MongoClient | null = null;
    try {
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).find({ status: status }).toArray() as Appointment[];
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null)
            mongo.close();
    }
}

// function to get appointments by date range
export async function getAppointmentsByDateRange(startDate: string, endDate: string): Promise<Appointment[]> {
    let mongo: MongoClient | null = null;
    try {
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).find({ 
            date: { $gte: startDate, $lte: endDate } 
        }).toArray() as Appointment[];
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null)
            mongo.close();
    }
}

// function to get appointment by ID
export async function getAppointmentById(id: ObjectId): Promise<Appointment | null> {
    let mongo: MongoClient | null = null;
    try {
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).findOne({ _id: id }) as Appointment | null;
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null)
            mongo.close();
    }
}

// function to update appointment status
export async function updateAppointmentStatus(id: ObjectId, status: "scheduled" | "completed" | "cancelled") {
    let mongo: MongoClient | null = null;
    try {
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).updateOne(
            { _id: id }, 
            { $set: { status: status } }
        );
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null)
            mongo.close();
    }
}

// function to update appointment calories
export async function updateAppointmentCalories(id: ObjectId, caloriesBurnt: number) {
    let mongo: MongoClient | null = null;
    try {
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).updateOne(
            { _id: id }, 
            { $set: { caloriesBurnt: caloriesBurnt } }
        );
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null)
            mongo.close();
    }
}

// function to update appointment notes
export async function updateAppointmentNotes(id: ObjectId, notes: string) {
    let mongo: MongoClient | null = null;
    try {
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).updateOne(
            { _id: id }, 
            { $set: { notes: notes } }
        );
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null)
            mongo.close();
    }
}

// function to get upcoming appointments (scheduled status)
export async function getUpcomingAppointments(): Promise<Appointment[]> {
    let mongo: MongoClient | null = null;
    try {
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).find({ 
            status: "scheduled",
            date: { $gte: today }
        }).sort({ date: 1, time: 1 }).toArray() as Appointment[];
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null)
            mongo.close();
    }
}

// function to get completed appointments
export async function getCompletedAppointments(): Promise<Appointment[]> {
    let mongo: MongoClient | null = null;
    try {
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).find({ 
            status: "completed"
        }).sort({ date: -1, time: -1 }).toArray() as Appointment[];
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null)
            mongo.close();
    }
}

// function to get cancelled appointments
export async function getCancelledAppointments(): Promise<Appointment[]> {
    let mongo: MongoClient | null = null;
    try {
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).find({ 
            status: "cancelled"
        }).sort({ date: -1, time: -1 }).toArray() as Appointment[];
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null)
            mongo.close();
    }
}
