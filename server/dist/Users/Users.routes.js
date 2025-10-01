"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Users_controller_1 = require("./Users.controller");
const UsersRouter = (0, express_1.Router)();
// Retrieve all users
UsersRouter.get('/getAllUsers', Users_controller_1.getAllUsers);
// Retrieve a specific user by ID
UsersRouter.get('/getUserById/:id', Users_controller_1.getUserById);
// Retrieve a specific user by phone number
UsersRouter.get('/getUserByPhone/:phone', Users_controller_1.getUserByPhone);
// Retrieve a specific user by full name
UsersRouter.get('/getUserByName/:fullName', Users_controller_1.getUserByName);
// Create a new user
UsersRouter.post('/createUser', Users_controller_1.createUser);
// Update an existing user
UsersRouter.put('/updateUser/:id', Users_controller_1.updateUser);
// Authenticate a user
UsersRouter.post('/authenticateUser', Users_controller_1.authenticateUser);
// Delete a user by ID
UsersRouter.delete('/deleteUser/:id', Users_controller_1.deleteUser);
// Update user measurements
UsersRouter.put('/updateUserMeasurements/:id', Users_controller_1.updateUserMeasurements);
// Update user weight
UsersRouter.put('/updateUserWeight/:id', Users_controller_1.updateUserWeight);
exports.default = UsersRouter;
//# sourceMappingURL=Users.routes.js.map