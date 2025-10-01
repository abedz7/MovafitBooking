import { MongoClient, ObjectId } from "mongodb";
import { User } from "./Users.Type";

// Data Base Info That we save in a variable
const DB_INFO = {
    host: process.env.MONGODB_URI as string,
    db: 'Movafit',
    Collection: 'Users'
};

// Password generation function
function generatePassword(): string {
    const randomNumbers = Math.floor(10000 + Math.random() * 90000); // Generates 5-digit number
    return `Mova${randomNumbers}`;
}

// async function to get all users, and to get a specific user by id
export async function getUsers(query = {}, projection = {}) {
    let mongo: MongoClient | null = null;
    try {
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).find(query).project(projection).toArray();
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null)
            mongo.close();
    }
}

// async function to create a new user in the database
export async function addUser(user: User) {
    let mongo: MongoClient | null = null;
    try {
        // Generate password if not provided
        if (!user.password) {
            user.password = generatePassword();
        }
        
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        const result = await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).insertOne(user);
        return { success: true, insertedId: result.insertedId, password: user.password };
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null)
            mongo.close();
    }
}

// function to Update an existing user's details in the database
export async function updateUser(id: string, user: Partial<User>) {
    let mongo: MongoClient | null = null;
    try {
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).updateOne(
            { _id: new ObjectId(id) },
            { $set: user }
        );
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null)
            mongo.close();
    }
}

// async function to delete a user by id
export async function deleteUser(id: ObjectId) {
    let mongo: MongoClient | null = null;
    try {
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).deleteOne({ _id: id });
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null)
            mongo.close();
    }
}

// Function to get a user by phone number
export async function getUserByPhone(phone: string): Promise<User | null> {
    let mongo: MongoClient | null = null;
    try {
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        const user = await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).findOne({ phone: phone });

        if (user) {
            return user as User;
        }
        return null;
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null) mongo.close();
    }
}

// Function to get a user by full name
export async function getUserByName(fullName: string): Promise<User | null> {
    let mongo: MongoClient | null = null;
    try {
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        const user = await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).findOne({ fullName: fullName });

        if (user) {
            return user as User;
        }
        return null;
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null) mongo.close();
    }
}

// Function to authenticate user by phone and password
export async function authenticateUser(phone: string, password: string): Promise<User | null> {
    let mongo: MongoClient | null = null;
    try {
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        const user = await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).findOne({ 
            phone: phone, 
            password: password,
            isActive: true 
        });

        if (user) {
            return user as User;
        }
        return null;
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null) mongo.close();
    }
}

// Function to update user measurements
export async function updateUserMeasurements(id: ObjectId, measurements: {
    chest: number | null,
    waist: number | null,
    hips: number | null,
    lastUpdated: Date | null
}) {
    let mongo: MongoClient | null = null;
    try {
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).updateOne(
            { _id: id },
            { $set: { measurements: measurements } }
        );
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null) mongo.close();
    }
}

// Function to update user weight
export async function updateUserWeight(id: ObjectId, weight: number) {
    let mongo: MongoClient | null = null;
    try {
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).updateOne(
            { _id: id },
            { $set: { weight: weight } }
        );
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null) mongo.close();
    }
}

// Function to get user by ID
export async function getUserById(id: ObjectId): Promise<User | null> {
    let mongo: MongoClient | null = null;
    try {
        mongo = new MongoClient(DB_INFO.host);
        await mongo.connect();
        const user = await mongo.db(DB_INFO.db).collection(DB_INFO.Collection).findOne({ _id: id });

        if (user) {
            return user as User;
        }
        return null;
    } catch (error) {
        throw error;
    } finally {
        if (mongo != null) mongo.close();
    }
}
