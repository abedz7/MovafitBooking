import { ObjectId } from "mongodb";
import { User } from "./Users.Type";
export declare function getUsers(query?: {}, projection?: {}): Promise<import("bson").Document[]>;
export declare function addUser(user: User): Promise<{
    success: boolean;
    insertedId: ObjectId;
    password: string;
}>;
export declare function updateUser(id: string, user: Partial<User>): Promise<import("mongodb").UpdateResult<import("bson").Document>>;
export declare function deleteUser(id: ObjectId): Promise<import("mongodb").DeleteResult>;
export declare function getUserByPhone(phone: string): Promise<User | null>;
export declare function getUserByName(fullName: string): Promise<User | null>;
export declare function authenticateUser(phone: string, password: string): Promise<User | null>;
export declare function updateUserMeasurements(id: ObjectId, measurements: {
    chest: number | null;
    waist: number | null;
    hips: number | null;
    lastUpdated: Date | null;
}): Promise<import("mongodb").UpdateResult<import("bson").Document>>;
export declare function updateUserWeight(id: ObjectId, weight: number): Promise<import("mongodb").UpdateResult<import("bson").Document>>;
export declare function getUserById(id: ObjectId): Promise<User | null>;
//# sourceMappingURL=Users.db.d.ts.map