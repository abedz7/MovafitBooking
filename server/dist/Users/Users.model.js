"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getById = getById;
exports.getByPhone = getByPhone;
exports.getByName = getByName;
exports.createNewUser = createNewUser;
exports.updateUserById = updateUserById;
exports.deleteUserById = deleteUserById;
exports.login = login;
exports.updateMeasurements = updateMeasurements;
exports.updateWeight = updateWeight;
exports.getUserById = getUserById;
// Users.model.ts
const mongodb_1 = require("mongodb");
const Users_db_1 = require("./Users.db");
/**
 * Retrieves all users from the database.
 */
async function getAll() {
    return await (0, Users_db_1.getUsers)();
}
/**
 * Retrieves a specific user by their unique identifier.
 * @param id - The ID of the user to retrieve.
 */
async function getById(id) {
    let query = mongodb_1.ObjectId.isValid(id) ? { _id: new mongodb_1.ObjectId(id) } : { phone: id };
    let users = await (0, Users_db_1.getUsers)(query);
    return users[0]; // Return the first user found
}
/**
 * Retrieves a user by their phone number.
 * @param phone - The phone number of the user.
 */
async function getByPhone(phone) {
    return await (0, Users_db_1.getUserByPhone)(phone);
}
/**
 * Retrieves a user by their full name.
 * @param fullName - The full name of the user.
 */
async function getByName(fullName) {
    return await (0, Users_db_1.getUserByName)(fullName);
}
/**
 * Creates a new user in the database.
 * @param userData - The user data to create.
 */
async function createNewUser(userData) {
    let newUser = {
        _id: new mongodb_1.ObjectId(),
        fullName: userData.fullName || '',
        phone: userData.phone || '',
        password: '', // Will be generated in addUser function
        gender: userData.gender || 'male',
        isAdmin: userData.isAdmin || false,
        weight: userData.weight || null,
        measurements: {
            chest: null,
            waist: null,
            hips: null,
            lastUpdated: null
        },
        createdAt: new Date(),
        isActive: true
    };
    return await (0, Users_db_1.addUser)(newUser);
}
/**
 * Updates an existing user's details in the database.
 * @param id - The ID of the user to update.
 * @param userData - The user data to update.
 */
async function updateUserById(id, userData) {
    return await (0, Users_db_1.updateUser)(id, userData);
}
/**
 * Deletes a user by their unique identifier.
 * @param id - The ID of the user to delete.
 */
async function deleteUserById(id) {
    return await (0, Users_db_1.deleteUser)(new mongodb_1.ObjectId(id));
}
/**
 * Authenticates a user by phone and password.
 * @param phone - The phone number of the user.
 * @param password - The password of the user.
 */
async function login(phone, password) {
    return await (0, Users_db_1.authenticateUser)(phone, password);
}
/**
 * Updates a user's measurements.
 * @param id - The ID of the user.
 * @param measurements - The measurements to update.
 */
async function updateMeasurements(id, measurements) {
    return await (0, Users_db_1.updateUserMeasurements)(id, measurements);
}
/**
 * Updates a user's weight.
 * @param id - The ID of the user.
 * @param weight - The new weight.
 */
async function updateWeight(id, weight) {
    return await (0, Users_db_1.updateUserWeight)(id, weight);
}
/**
 * Retrieves a user by their ID.
 * @param id - The ID of the user.
 */
async function getUserById(id) {
    return await (0, Users_db_1.getUserById)(id);
}
//# sourceMappingURL=Users.model.js.map