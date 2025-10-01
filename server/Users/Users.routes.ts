import { Router } from 'express';
import { 
    getAllUsers, 
    getUserById, 
    getUserByPhone, 
    getUserByName, 
    createUser, 
    updateUser, 
    authenticateUser, 
    deleteUser, 
    updateUserMeasurements, 
    updateUserWeight 
} from './Users.controller';

const UsersRouter = Router();

// Retrieve all users
UsersRouter.get('/getAllUsers', getAllUsers);

// Retrieve a specific user by ID
UsersRouter.get('/getUserById/:id', getUserById);

// Retrieve a specific user by phone number
UsersRouter.get('/getUserByPhone/:phone', getUserByPhone);

// Retrieve a specific user by full name
UsersRouter.get('/getUserByName/:fullName', getUserByName);

// Create a new user
UsersRouter.post('/createUser', createUser);

// Update an existing user
UsersRouter.put('/updateUser/:id', updateUser);

// Authenticate a user
UsersRouter.post('/authenticateUser', authenticateUser);

// Delete a user by ID
UsersRouter.delete('/deleteUser/:id', deleteUser);

// Update user measurements
UsersRouter.put('/updateUserMeasurements/:id', updateUserMeasurements);

// Update user weight
UsersRouter.put('/updateUserWeight/:id', updateUserWeight);

export default UsersRouter;
