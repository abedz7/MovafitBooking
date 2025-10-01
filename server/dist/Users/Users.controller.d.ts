import { Request, Response } from "express";
/**
 * Retrieves all users from the database.
 */
export declare function getAllUsers(req: Request, res: Response): Promise<void>;
/**
 * Retrieves a specific user by their unique identifier.
 */
export declare function getUserById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Retrieves a specific user by their phone number.
 */
export declare function getUserByPhone(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Retrieves a specific user by their full name.
 */
export declare function getUserByName(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Creates a new user in the database.
 */
export declare function createUser(req: Request, res: Response): Promise<void>;
/**
 * Updates an existing user's details in the database.
 */
export declare function updateUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Handles user login, typically checks credentials and returns a token.
 */
export declare function authenticateUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Deletes a user by their unique identifier.
 */
export declare function deleteUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Updates a user's measurements.
 */
export declare function updateUserMeasurements(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Updates a user's weight.
 */
export declare function updateUserWeight(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=Users.controller.d.ts.map