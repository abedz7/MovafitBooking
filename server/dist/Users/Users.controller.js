"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.getUserByPhone = getUserByPhone;
exports.getUserByName = getUserByName;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.authenticateUser = authenticateUser;
exports.deleteUser = deleteUser;
exports.updateUserMeasurements = updateUserMeasurements;
exports.updateUserWeight = updateUserWeight;
const Users_model_1 = require("./Users.model");
const mongodb_1 = require("mongodb");
/**
 * Retrieves all users from the database.
 */
async function getAllUsers(req, res) {
    try {
        let users = await (0, Users_model_1.getAll)();
        res.status(200).json({ users });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
/**
 * Retrieves a specific user by their unique identifier.
 */
async function getUserById(req, res) {
    try {
        let { id } = req.params;
        if (id.length != 24)
            return res.status(403).json({ error: 'Invalid User ID' });
        let user = await (0, Users_model_1.getById)(id);
        if (!user)
            res.status(404).json({ error: 'User Not Found' });
        else
            res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
/**
 * Retrieves a specific user by their phone number.
 */
async function getUserByPhone(req, res) {
    try {
        const { phone } = req.params;
        if (!phone) {
            return res.status(400).json({ error: 'Phone number is required' });
        }
        const user = await (0, Users_model_1.getByPhone)(phone);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the user' });
    }
}
/**
 * Retrieves a specific user by their full name.
 */
async function getUserByName(req, res) {
    try {
        const { fullName } = req.params;
        if (!fullName) {
            return res.status(400).json({ error: 'Full name is required' });
        }
        const user = await (0, Users_model_1.getByName)(fullName);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the user' });
    }
}
/**
 * Creates a new user in the database.
 */
async function createUser(req, res) {
    try {
        let userData = req.body;
        let result = await (0, Users_model_1.createNewUser)(userData);
        res.status(201).json({
            message: 'User created successfully',
            user: result,
            password: result.password // Return the generated password
        });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
/**
 * Updates an existing user's details in the database.
 */
async function updateUser(req, res) {
    try {
        let { id } = req.params;
        let userData = req.body;
        if (id.length != 24)
            return res.status(403).json({ error: 'Invalid User ID' });
        if (!userData.fullName)
            return res.status(400).json({ error: 'Full name is required' });
        if (!userData.phone)
            return res.status(400).json({ error: 'Phone number is required' });
        if (!userData.gender)
            return res.status(400).json({ error: 'Gender is required' });
        let result = await (0, Users_model_1.updateUserById)(id, userData);
        if (result.modifiedCount == 0)
            res.status(404).json({ error: 'User Not Found' });
        else
            res.status(200).json({ result });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
/**
 * Handles user login, typically checks credentials and returns a token.
 */
async function authenticateUser(req, res) {
    try {
        const phone = req.body.phone;
        const password = req.body.password;
        if (!phone || !password) {
            return res.status(400).json({ error: 'Phone and password are required' });
        }
        const user = await (0, Users_model_1.login)(phone, password);
        if (!user) {
            return res.status(404).json({ error: 'User not found or invalid credentials' });
        }
        res.status(200).json({
            message: 'Authentication successful',
            user: user
        });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
/**
 * Deletes a user by their unique identifier.
 */
async function deleteUser(req, res) {
    try {
        let { id } = req.params;
        if (id.length != 24)
            return res.status(403).json({ error: 'Invalid User ID' });
        let result = await (0, Users_model_1.deleteUserById)(id);
        if (result.deletedCount === 0)
            res.status(404).json({ error: 'User Not Found' });
        else
            res.status(200).json({ message: 'User Deleted Successfully' });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
/**
 * Updates a user's measurements.
 */
async function updateUserMeasurements(req, res) {
    try {
        let { id } = req.params;
        let { measurements } = req.body;
        if (id.length != 24)
            return res.status(403).json({ error: 'Invalid User ID' });
        if (!measurements)
            return res.status(400).json({ error: 'Measurements are required' });
        let result = await (0, Users_model_1.updateMeasurements)(new mongodb_1.ObjectId(id), measurements);
        if (result.modifiedCount == 0)
            res.status(404).json({ error: 'User Not Found' });
        else
            res.status(200).json({ result });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
/**
 * Updates a user's weight.
 */
async function updateUserWeight(req, res) {
    try {
        let { id } = req.params;
        let { weight } = req.body;
        if (id.length != 24)
            return res.status(403).json({ error: 'Invalid User ID' });
        if (!weight || weight <= 0)
            return res.status(400).json({ error: 'Valid weight is required' });
        let result = await (0, Users_model_1.updateWeight)(new mongodb_1.ObjectId(id), weight);
        if (result.modifiedCount == 0)
            res.status(404).json({ error: 'User Not Found' });
        else
            res.status(200).json({ result });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
//# sourceMappingURL=Users.controller.js.map