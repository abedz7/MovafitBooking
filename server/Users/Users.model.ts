// Users.model.ts
import { ObjectId } from "mongodb";
import {
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    getUserByPhone,
    getUserByName,
    authenticateUser,
    updateUserMeasurements,
    updateUserWeight,
    getUserById as getUserByIdFromDb
} from './Users.db';
import { User } from './Users.Type';

/**
 * Retrieves all users from the database.
 */
export async function getAll() {
    return await getUsers();
}

/**
 * Retrieves a specific user by their unique identifier.
 * @param id - The ID of the user to retrieve.
 */
export async function getById(id: string) {
    let query: any = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { phone: id };
    let users = await getUsers(query);
    return users[0]; // Return the first user found
}

/**
 * Retrieves a user by their phone number.
 * @param phone - The phone number of the user.
 */
export async function getByPhone(phone: string) {
    return await getUserByPhone(phone);
}

/**
 * Retrieves a user by their full name.
 * @param fullName - The full name of the user.
 */
export async function getByName(fullName: string) {
    return await getUserByName(fullName);
}

/**
 * Creates a new user in the database.
 * @param userData - The user data to create.
 */
export async function createNewUser(userData: Partial<User>) {
    let newUser: User = {
        _id: new ObjectId(),
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
    return await addUser(newUser);
}

/**
 * Updates an existing user's details in the database.
 * @param id - The ID of the user to update.
 * @param userData - The user data to update.
 */
export async function updateUserById(id: string, userData: Partial<User>) {
    return await updateUser(id, userData);
}

/**
 * Deletes a user by their unique identifier.
 * @param id - The ID of the user to delete.
 */
export async function deleteUserById(id: string) {
    return await deleteUser(new ObjectId(id));
}

/**
 * Authenticates a user by phone and password.
 * @param phone - The phone number of the user.
 * @param password - The password of the user.
 */
export async function login(phone: string, password: string) {
    return await authenticateUser(phone, password);
}

/**
 * Updates a user's measurements.
 * @param id - The ID of the user.
 * @param measurements - The measurements to update.
 */
export async function updateMeasurements(id: ObjectId, measurements: { chest: number | null, waist: number | null, hips: number | null, lastUpdated: Date | null }) {
    return await updateUserMeasurements(id, measurements);
}

/**
 * Updates a user's weight.
 * @param id - The ID of the user.
 * @param weight - The new weight.
 */
export async function updateWeight(id: ObjectId, weight: number) {
    return await updateUserWeight(id, weight);
}

/**
 * Retrieves a user by their ID.
 * @param id - The ID of the user.
 */
export async function getUserById(id: ObjectId) {
    return await getUserByIdFromDb(id);
}
