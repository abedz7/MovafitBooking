import { ObjectId } from "mongodb";
import { User } from './Users.Type';
/**
 * Retrieves all users from the database.
 */
export declare function getAll(): Promise<import("bson").Document[]>;
/**
 * Retrieves a specific user by their unique identifier.
 * @param id - The ID of the user to retrieve.
 */
export declare function getById(id: string): Promise<import("bson").Document>;
/**
 * Retrieves a user by their phone number.
 * @param phone - The phone number of the user.
 */
export declare function getByPhone(phone: string): Promise<User | null>;
/**
 * Retrieves a user by their full name.
 * @param fullName - The full name of the user.
 */
export declare function getByName(fullName: string): Promise<User | null>;
/**
 * Creates a new user in the database.
 * @param userData - The user data to create.
 */
export declare function createNewUser(userData: Partial<User>): Promise<{
    success: boolean;
    insertedId: ObjectId;
    password: string;
}>;
/**
 * Updates an existing user's details in the database.
 * @param id - The ID of the user to update.
 * @param userData - The user data to update.
 */
export declare function updateUserById(id: string, userData: Partial<User>): Promise<import("mongodb").UpdateResult<import("bson").Document>>;
/**
 * Deletes a user by their unique identifier.
 * @param id - The ID of the user to delete.
 */
export declare function deleteUserById(id: string): Promise<import("mongodb").DeleteResult>;
/**
 * Authenticates a user by phone and password.
 * @param phone - The phone number of the user.
 * @param password - The password of the user.
 */
export declare function login(phone: string, password: string): Promise<User | null>;
/**
 * Updates a user's measurements.
 * @param id - The ID of the user.
 * @param measurements - The measurements to update.
 */
export declare function updateMeasurements(id: ObjectId, measurements: {
    chest: number | null;
    waist: number | null;
    hips: number | null;
    lastUpdated: Date | null;
}): Promise<import("mongodb").UpdateResult<import("bson").Document>>;
/**
 * Updates a user's weight.
 * @param id - The ID of the user.
 * @param weight - The new weight.
 */
export declare function updateWeight(id: ObjectId, weight: number): Promise<import("mongodb").UpdateResult<import("bson").Document>>;
/**
 * Retrieves a user by their ID.
 * @param id - The ID of the user.
 */
export declare function getUserById(id: ObjectId): Promise<User | null>;
//# sourceMappingURL=Users.model.d.ts.map