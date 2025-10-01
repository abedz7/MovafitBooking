"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppointments = getAppointments;
exports.addAppointment = addAppointment;
exports.updateAppointment = updateAppointment;
exports.deleteAppointment = deleteAppointment;
exports.getAppointmentsByUserId = getAppointmentsByUserId;
exports.getAppointmentsByDate = getAppointmentsByDate;
exports.getAppointmentsByStatus = getAppointmentsByStatus;
exports.getAppointmentsByDateRange = getAppointmentsByDateRange;
exports.getAppointmentById = getAppointmentById;
exports.updateAppointmentStatus = updateAppointmentStatus;
exports.updateAppointmentCalories = updateAppointmentCalories;
exports.updateAppointmentNotes = updateAppointmentNotes;
exports.getUpcomingAppointments = getUpcomingAppointments;
exports.getCompletedAppointments = getCompletedAppointments;
exports.getCancelledAppointments = getCancelledAppointments;
// Appointments.db.ts
const mongodb_1 = require("mongodb");
const DB_INFO = {
    host: process.env.MONGODB_URI,
    db: 'Movafit',
    Collection: 'Appointments'
};
// async function to get all appointments, and to get a specific appointment by id
async function getAppointments(query = {}, projection = {}) {
    let mongo = null;
    try {
        mongo = new mongodb_1.MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).find(query, projection).toArray();
    }
    catch (error) {
        throw error;
    }
    finally {
        if (mongo != null)
            mongo.close();
    }
}
// async function to create a new appointment in the database
async function addAppointment(appointment) {
    let mongo = null;
    try {
        mongo = new mongodb_1.MongoClient(DB_INFO.host);
        await mongo.connect();
        const result = await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).insertOne(appointment);
        return { success: true, insertedId: result.insertedId };
    }
    catch (error) {
        throw error;
    }
    finally {
        if (mongo != null)
            mongo.close();
    }
}
// function to Update an existing appointment's details in the database
async function updateAppointment(id, appointment) {
    let mongo = null;
    try {
        mongo = new mongodb_1.MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: appointment });
    }
    catch (error) {
        throw error;
    }
    finally {
        if (mongo != null)
            mongo.close();
    }
}
// function to delete an appointment by its unique identifier
async function deleteAppointment(id) {
    let mongo = null;
    try {
        mongo = new mongodb_1.MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).deleteOne({ _id: id });
    }
    catch (error) {
        throw error;
    }
    finally {
        if (mongo != null)
            mongo.close();
    }
}
// function to get appointments by user ID
async function getAppointmentsByUserId(userId) {
    let mongo = null;
    try {
        mongo = new mongodb_1.MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).find({ userId: userId }).toArray();
    }
    catch (error) {
        throw error;
    }
    finally {
        if (mongo != null)
            mongo.close();
    }
}
// function to get appointments by date
async function getAppointmentsByDate(date) {
    let mongo = null;
    try {
        mongo = new mongodb_1.MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).find({ date: date }).toArray();
    }
    catch (error) {
        throw error;
    }
    finally {
        if (mongo != null)
            mongo.close();
    }
}
// function to get appointments by status
async function getAppointmentsByStatus(status) {
    let mongo = null;
    try {
        mongo = new mongodb_1.MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).find({ status: status }).toArray();
    }
    catch (error) {
        throw error;
    }
    finally {
        if (mongo != null)
            mongo.close();
    }
}
// function to get appointments by date range
async function getAppointmentsByDateRange(startDate, endDate) {
    let mongo = null;
    try {
        mongo = new mongodb_1.MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).find({
            date: { $gte: startDate, $lte: endDate }
        }).toArray();
    }
    catch (error) {
        throw error;
    }
    finally {
        if (mongo != null)
            mongo.close();
    }
}
// function to get appointment by ID
async function getAppointmentById(id) {
    let mongo = null;
    try {
        mongo = new mongodb_1.MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).findOne({ _id: id });
    }
    catch (error) {
        throw error;
    }
    finally {
        if (mongo != null)
            mongo.close();
    }
}
// function to update appointment status
async function updateAppointmentStatus(id, status) {
    let mongo = null;
    try {
        mongo = new mongodb_1.MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).updateOne({ _id: id }, { $set: { status: status } });
    }
    catch (error) {
        throw error;
    }
    finally {
        if (mongo != null)
            mongo.close();
    }
}
// function to update appointment calories
async function updateAppointmentCalories(id, caloriesBurnt) {
    let mongo = null;
    try {
        mongo = new mongodb_1.MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).updateOne({ _id: id }, { $set: { caloriesBurnt: caloriesBurnt } });
    }
    catch (error) {
        throw error;
    }
    finally {
        if (mongo != null)
            mongo.close();
    }
}
// function to update appointment notes
async function updateAppointmentNotes(id, notes) {
    let mongo = null;
    try {
        mongo = new mongodb_1.MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).updateOne({ _id: id }, { $set: { notes: notes } });
    }
    catch (error) {
        throw error;
    }
    finally {
        if (mongo != null)
            mongo.close();
    }
}
// function to get upcoming appointments (scheduled status)
async function getUpcomingAppointments() {
    let mongo = null;
    try {
        mongo = new mongodb_1.MongoClient(DB_INFO.host);
        await mongo.connect();
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).find({
            status: "scheduled",
            date: { $gte: today }
        }).sort({ date: 1, time: 1 }).toArray();
    }
    catch (error) {
        throw error;
    }
    finally {
        if (mongo != null)
            mongo.close();
    }
}
// function to get completed appointments
async function getCompletedAppointments() {
    let mongo = null;
    try {
        mongo = new mongodb_1.MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).find({
            status: "completed"
        }).sort({ date: -1, time: -1 }).toArray();
    }
    catch (error) {
        throw error;
    }
    finally {
        if (mongo != null)
            mongo.close();
    }
}
// function to get cancelled appointments
async function getCancelledAppointments() {
    let mongo = null;
    try {
        mongo = new mongodb_1.MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).find({
            status: "cancelled"
        }).sort({ date: -1, time: -1 }).toArray();
    }
    catch (error) {
        throw error;
    }
    finally {
        if (mongo != null)
            mongo.close();
    }
}
//# sourceMappingURL=Appointments.db.js.map