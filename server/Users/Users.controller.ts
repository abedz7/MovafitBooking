// Users.controller.ts
import { Request, Response } from "express";
import { 
    getAll, 
    getById, 
    createNewUser, 
    updateUserById, 
    deleteUserById, 
    getByPhone, 
    getByName, 
    login, 
    updateMeasurements, 
    updateWeight
} from "./Users.model";
import { ObjectId } from "mongodb";

/**
 * Retrieves all users from the database.
 */
export async function getAllUsers(req: Request, res: Response) {
    try {
        let users = await getAll();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error });
    }
}

/**
 * Retrieves a specific user by their unique identifier.
 */
export async function getUserById(req: Request, res: Response) {
    try {
        let { id } = req.params;
        if (id.length != 24)
            return res.status(403).json({ error: 'Invalid User ID' });

        let user = await getById(id);
        if (!user)
            res.status(404).json({ error: 'User Not Found' });
        else
            res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error });
    }
}

/**
 * Retrieves a specific user by their phone number.
 */
export async function getUserByPhone(req: Request, res: Response) {
    try {
        const { phone } = req.params;

        if (!phone) {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        const user = await getByPhone(phone);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the user' });
    }
}

/**
 * Retrieves a specific user by their full name.
 */
export async function getUserByName(req: Request, res: Response) {
    try {
        const { fullName } = req.params;

        if (!fullName) {
            return res.status(400).json({ error: 'Full name is required' });
        }

        const user = await getByName(fullName);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the user' });
    }
}

/**
 * Creates a new user in the database.
 */
export async function createUser(req: Request, res: Response) {
    try {
        let userData = req.body;
        let result = await createNewUser(userData);
        res.status(201).json({ 
            message: 'User created successfully',
            user: result,
            password: result.password // Return the generated password
        });
    } catch (error) {
        res.status(500).json({ error });
    }
}

/**
 * Updates an existing user's details in the database.
 */
export async function updateUser(req: Request, res: Response) {
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

        let result = await updateUserById(id, userData);

        if (result.modifiedCount == 0)
            res.status(404).json({ error: 'User Not Found' });
        else
            res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error });
    }
}

/**
 * Handles user login, typically checks credentials and returns a token.
 */
export async function authenticateUser(req: Request, res: Response) {
    try {
        const phone = req.body.phone;
        const password = req.body.password;

        if (!phone || !password) {
            return res.status(400).json({ error: 'Phone and password are required' });
        }

        const user = await login(phone, password);
        if (!user) {
            return res.status(404).json({ error: 'User not found or invalid credentials' });
        }

        res.status(200).json({ 
            message: 'Authentication successful',
            user: user
        });
    } catch (error) {
        res.status(500).json({ error });
    }
}

/**
 * Deletes a user by their unique identifier.
 */
export async function deleteUser(req: Request, res: Response) {
    try {
        let { id } = req.params;
        if (id.length != 24)
            return res.status(403).json({ error: 'Invalid User ID' });

        let result = await deleteUserById(id);
        if (result.deletedCount === 0)
            res.status(404).json({ error: 'User Not Found' });
        else
            res.status(200).json({ message: 'User Deleted Successfully' });
    } catch (error) {
        res.status(500).json({ error });
    }
}

/**
 * Updates a user's measurements.
 */
export async function updateUserMeasurements(req: Request, res: Response) {
    try {
        let { id } = req.params;
        let { measurements } = req.body;

        if (id.length != 24) 
            return res.status(403).json({ error: 'Invalid User ID' });
        
        if (!measurements) 
            return res.status(400).json({ error: 'Measurements are required' });

        let result = await updateMeasurements(new ObjectId(id), measurements);

        if (result.modifiedCount == 0) 
            res.status(404).json({ error: 'User Not Found' });
        else 
            res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error });
    }
}

/**
 * Updates a user's weight.
 */
export async function updateUserWeight(req: Request, res: Response) {
    try {
        let { id } = req.params;
        let { weight } = req.body;

        if (id.length != 24) 
            return res.status(403).json({ error: 'Invalid User ID' });
        
        if (!weight || weight <= 0) 
            return res.status(400).json({ error: 'Valid weight is required' });

        let result = await updateWeight(new ObjectId(id), weight);

        if (result.modifiedCount == 0) 
            res.status(404).json({ error: 'User Not Found' });
        else 
            res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error });
    }
}
