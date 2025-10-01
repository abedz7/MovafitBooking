"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const Users_routes_1 = __importDefault(require("./Users/Users.routes"));
const Appointments_routes_1 = __importDefault(require("./Appointments/Appointments.routes"));
const uri = process.env.MONGODB_URI;
console.log("Mongo URI:", uri); // Debug: check if it's loaded
mongoose_1.default.connect(uri)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'https://movafit-booking.vercel.app'],
    credentials: true
}));
app.use(express_1.default.json());
// API Routes
app.use('/api/users', Users_routes_1.default);
app.use('/api/appointments', Appointments_routes_1.default);
// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Movafit Server is running!' });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map