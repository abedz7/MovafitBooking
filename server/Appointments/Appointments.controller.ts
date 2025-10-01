// Appointments.controller.ts
import { Request, Response } from "express";
import { 
    getAll, 
    getById, 
    getByUserId, 
    getByDate, 
    getByStatus, 
    getByDateRange, 
    createNewAppointment, 
    updateAppointmentById, 
    deleteAppointmentById, 
    updateStatus, 
    updateCalories, 
    updateNotes, 
    getUpcoming, 
    getCompleted, 
    getCancelled, 
    getAppointmentById as getAppointmentByIdFromModel, 
    bookAppointment as bookAppointmentFromModel, 
    cancelAppointment as cancelAppointmentFromModel, 
    completeAppointment as completeAppointmentFromModel, 
    rescheduleAppointment 
} from "./Appointments.model";
import { ObjectId } from "mongodb";

/**
 * Retrieves all appointments from the database.
 */
export async function getAllAppointments(req: Request, res: Response) {
    try {
        let appointments = await getAll();
        res.status(200).json({ appointments });
    } catch (error) {
        res.status(500).json({ error });
    }
}

/**
 * Retrieves a specific appointment by their unique identifier.
 */
export async function getAppointmentById(req: Request, res: Response) {
    try {
        let { id } = req.params;
        if (id.length != 24)
            return res.status(403).json({ error: 'Invalid Appointment ID' });

        let appointment = await getById(id);
        if (!appointment)
            res.status(404).json({ error: 'Appointment Not Found' });
        else
            res.status(200).json({ appointment });
    } catch (error) {
        res.status(500).json({ error });
    }
}

/**
 * Retrieves appointments by user ID.
 */
export async function getAppointmentsByUserId(req: Request, res: Response) {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        if (userId.length != 24)
            return res.status(403).json({ error: 'Invalid User ID' });

        const appointments = await getByUserId(userId);

        res.status(200).json({ appointments });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving appointments' });
    }
}

/**
 * Creates a new appointment in the database.
 */
export async function createAppointment(req: Request, res: Response) {
    try {
        let appointmentData = req.body;
        
        if (!appointmentData.userId)
            return res.status(400).json({ error: 'User ID is required' });
        if (!appointmentData.date)
            return res.status(400).json({ error: 'Date is required' });
        if (!appointmentData.time)
            return res.status(400).json({ error: 'Time is required' });

        let result = await createNewAppointment(appointmentData);
        res.status(201).json({ 
            message: 'Appointment created successfully',
            appointment: result
        });
    } catch (error) {
        res.status(500).json({ error });
    }
}

/**
 * Updates an existing appointment's details in the database.
 */
export async function updateAppointment(req: Request, res: Response) {
    try {
        let { id } = req.params;
        let appointmentData = req.body;
        
        if (id.length != 24)
            return res.status(403).json({ error: 'Invalid Appointment ID' });

        let result = await updateAppointmentById(id, appointmentData);

        if (result.modifiedCount == 0)
            res.status(404).json({ error: 'Appointment Not Found' });
        else
            res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error });
    }
}

/**
 * Deletes an appointment by their unique identifier.
 */
export async function deleteAppointment(req: Request, res: Response) {
    try {
        let { id } = req.params;
        if (id.length != 24)
            return res.status(403).json({ error: 'Invalid Appointment ID' });

        let result = await deleteAppointmentById(id);
        if (result.deletedCount === 0)
            res.status(404).json({ error: 'Appointment Not Found' });
        else
            res.status(200).json({ message: 'Appointment Deleted Successfully' });
    } catch (error) {
        res.status(500).json({ error });
    }
}

/**
 * Books an appointment for a user.
 */
export async function bookAppointment(req: Request, res: Response) {
    try {
        const { userId, date, time, notes } = req.body;

        if (!userId || !date || !time) {
            return res.status(400).json({ error: 'User ID, date, and time are required' });
        }

        if (userId.length != 24)
            return res.status(403).json({ error: 'Invalid User ID' });

        let result = await bookAppointmentFromModel(userId, date, time, notes || '');
        res.status(201).json({ 
            message: 'Appointment booked successfully',
            appointment: result
        });
    } catch (error) {
        res.status(500).json({ error });
    }
}

/**
 * Cancels an appointment.
 */
export async function cancelAppointment(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (id.length != 24)
            return res.status(403).json({ error: 'Invalid Appointment ID' });

        let result = await cancelAppointmentFromModel(id);

        if (result && result.modifiedCount == 0)
            res.status(404).json({ error: 'Appointment Not Found' });
        else
            res.status(200).json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        res.status(500).json({ error });
    }
}

/**
 * Completes an appointment with calories burnt.
 */
export async function completeAppointment(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { caloriesBurnt, notes } = req.body;

        if (id.length != 24)
            return res.status(403).json({ error: 'Invalid Appointment ID' });

        if (!caloriesBurnt || caloriesBurnt < 0)
            return res.status(400).json({ error: 'Valid calories burnt is required' });

        let result = await completeAppointmentFromModel(id, caloriesBurnt, notes || '');

        if (result && result.modifiedCount == 0)
            res.status(404).json({ error: 'Appointment Not Found' });
        else
            res.status(200).json({ message: 'Appointment completed successfully' });
    } catch (error) {
        res.status(500).json({ error });
    }
}

/**
 * Gets upcoming appointments.
 */
export async function getUpcomingAppointments(req: Request, res: Response) {
    try {
        let appointments = await getUpcoming();
        res.status(200).json({ appointments });
    } catch (error) {
        res.status(500).json({ error });
    }
}

/**
 * Gets completed appointments.
 */
export async function getCompletedAppointments(req: Request, res: Response) {
    try {
        let appointments = await getCompleted();
        res.status(200).json({ appointments });
    } catch (error) {
        res.status(500).json({ error });
    }
}

/**
 * Gets cancelled appointments.
 */
export async function getCancelledAppointments(req: Request, res: Response) {
    try {
        let appointments = await getCancelled();
        res.status(200).json({ appointments });
    } catch (error) {
        res.status(500).json({ error });
    }
}
