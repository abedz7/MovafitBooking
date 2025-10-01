"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.getUserByPhone = getUserByPhone;
exports.getUserByName = getUserByName;
exports.authenticateUser = authenticateUser;
exports.updateUserMeasurements = updateUserMeasurements;
exports.updateUserWeight = updateUserWeight;
exports.getUserById = getUserById;
const mongodb_1 = require("mongodb");
// Data Base Info That we save in a variable
const DB_INFO = {
    host: process.env.MONGODB_URI,
    db: 'Movafit',
    Collection: 'Users'
};
// Password generation function
function generatePassword() {
    const randomNumbers = Math.floor(10000 + Math.random() * 90000); // Generates 5-digit number
    return `Mova${randomNumbers}`;
}
// async function to get all users, and to get a specific user by id
async function getUsers(query = {}, projection = {}) {
    let mongo = null;
    try {
        mongo = new mongodb_1.MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).find(query).project(projection).toArray();
    }
    catch (error) {
        throw error;
    }
    finally {
        if (mongo != null)
            mongo.close();
    }
}
// async function to create a new user in the database
async function addUser(user) {
    let mongo = null;
    try {
        // Generate password if not provided
        if (!user.password) {
            user.password = generatePassword();
        }
        mongo = new mongodb_1.MongoClient(DB_INFO.host);
        await mongo.connect();
        const result = await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).insertOne(user);
        return { success: true, insertedId: result.insertedId, password: user.password };
    }
    catch (error) {
        throw error;
    }
    finally {
        if (mongo != null)
            mongo.close();
    }
}
// function to Update an existing user's details in the database
async function updateUser(id, user) {
    let mongo = null;
    try {
        mongo = new mongodb_1.MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: user });
    }
    catch (error) {
        throw error;
    }
    finally {
        if (mongo != null)
            mongo.close();
    }
}
// async function to delete a user by id
async function deleteUser(id) {
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
// Function to get a user by phone number
async function getUserByPhone(phone) {
    let mongo = null;
    try {
        mongo = new mongodb_1.MongoClient(DB_INFO.host);
        await mongo.connect();
        const user = await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).findOne({ phone: phone });
        if (user) {
            return user;
        }
        return null;
    }
    catch (error) {
        throw error;
    }
    finally {
        if (mongo != null)
            mongo.close();
    }
}
// Function to get a user by full name
async function getUserByName(fullName) {
    let mongo = null;
    try {
        mongo = new mongodb_1.MongoClient(DB_INFO.host);
        await mongo.connect();
        const user = await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).findOne({ fullName: fullName });
        if (user) {
            return user;
        }
        return null;
    }
    catch (error) {
        throw error;
    }
    finally {
        if (mongo != null)
            mongo.close();
    }
}
// Function to authenticate user by phone and password
async function authenticateUser(phone, password) {
    let mongo = null;
    try {
        mongo = new mongodb_1.MongoClient(DB_INFO.host);
        await mongo.connect();
        const user = await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).findOne({
            phone: phone,
            password: password,
            isActive: true
        });
        if (user) {
            return user;
        }
        return null;
    }
    catch (error) {
        throw error;
    }
    finally {
        if (mongo != null)
            mongo.close();
    }
}
// Function to update user measurements
async function updateUserMeasurements(id, measurements) {
    let mongo = null;
    try {
        mongo = new mongodb_1.MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).updateOne({ _id: id }, { $set: { measurements: measurements } });
    }
    catch (error) {
        throw error;
    }
    finally {
        if (mongo != null)
            mongo.close();
    }
}
// Function to update user weight
async function updateUserWeight(id, weight) {
    let mongo = null;
    try {
        mongo = new mongodb_1.MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).updateOne({ _id: id }, { $set: { weight: weight } });
    }
    catch (error) {
        throw error;
    }
    finally {
        if (mongo != null)
            mongo.close();
    }
}
// Function to get user by ID
async function getUserById(id) {
    let mongo = null;
    try {
        mongo = new mongodb_1.MongoClient(DB_INFO.host);
        await mongo.connect();
        const user = await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).findOne({ _id: id });
        if (user) {
            return user;
        }
        return null;
    }
    catch (error) {
        throw error;
    }
    finally {
        if (mongo != null)
            mongo.close();
    }
}
//# sourceMappingURL=Users.db.js.map