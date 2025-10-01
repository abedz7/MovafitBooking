import { ObjectId } from "mongodb";

export type User = {
    _id?: ObjectId,
    fullName: string,
    phone: string,
    password: string,
    gender: "male" | "female",
    isAdmin: boolean,
    weight: number | null,
    measurements: {
        chest: number | null,
        waist: number | null,
        hips: number | null,
        lastUpdated: Date | null
    },
    createdAt: Date,
    isActive: boolean
}
