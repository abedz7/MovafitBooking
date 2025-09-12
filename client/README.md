# Movafit Clinic Booking System - Frontend

A beautiful, responsive booking system for Movafit clinic built with React. The system supports Hebrew language and includes user authentication, appointment booking, package management, and more. Currently focused on frontend development with mock data.

## Features

### Frontend (React)
- **Responsive Design**: Mobile-first design with burger menu
- **Hebrew Language Support**: Full RTL support and Hebrew text
- **User Authentication**: Login, registration, and profile management
- **Appointment Booking**: Multi-step booking process with date/time selection
- **Package Management**: Browse and purchase treatment packages
- **Dashboard**: User dashboard with appointment history and statistics
- **Contact Form**: Contact page with FAQ and form submission
- **Modern UI**: Beautiful design with Tailwind CSS and Framer Motion animations

### Mock Data System
- **Local State Management**: All data stored in React context
- **Simulated API Calls**: Realistic loading states and delays
- **Sample Data**: Pre-populated packages and appointments
- **No Backend Required**: Works completely offline

## Technology Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Framer Motion
- React Hook Form
- React Hot Toast
- Axios
- Lucide React (Icons)

### Mock Data
- React Context API
- Local Storage (for persistence)
- Simulated API delays
- Sample Hebrew data

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Mock Data Features

### Authentication
- **Login**: Accept any email/password combination
- **Registration**: Create new user accounts with mock data
- **Session Management**: Uses localStorage for persistence
- **User Profile**: Mock user data with Hebrew names

### Appointments
- **Available Slots**: Randomly generated time slots
- **Booking**: Create new appointments with mock data
- **Management**: View, cancel, and reschedule appointments
- **Status Tracking**: Different appointment statuses

### Packages
- **6 Sample Packages**: Different categories and pricing
- **Hebrew Content**: All package names and descriptions in Hebrew
- **Categories**: בסיסי, פרימיום, VIP, מיוחד
- **Gender Options**: Packages for men, women, or both

## Data Structure

### User (Mock)
- firstName, lastName, email, phone, gender
- role, _id (generated)

### Appointment (Mock)
- date, time, gender, status, type
- package (optional), notes
- _id (generated), createdAt

### Package (Mock)
- name, description, numberOfSessions, price
- originalPrice, category, gender
- features, validityDays, isPopular

## Usage

### For Users
1. **Registration**: Create an account with personal details
2. **Login**: Access your account
3. **Browse Packages**: View available treatment packages
4. **Book Appointment**: Select date, time, and treatment type
5. **Manage Appointments**: View, cancel, or reschedule appointments
6. **Contact**: Use the contact form for inquiries

### For Development
1. **Mock Data**: All data is simulated and stored in memory
2. **No Backend**: Works completely offline
3. **Realistic UX**: Simulated loading states and API delays
4. **Easy Testing**: No database setup required

## Configuration

### Business Hours (Mock)
The system simulates:
- Sunday-Thursday: 8:00 AM - 8:00 PM
- Friday: 8:00 AM - 2:00 PM
- Saturday: Closed

### Appointment Slots (Mock)
- 30-minute appointment slots
- Available from 8:00 AM to 7:30 PM
- Randomly generated availability

## Development Features

- **Mock Authentication**: No real security, accepts any credentials
- **Local Storage**: Persists user session across browser refreshes
- **Simulated Delays**: Realistic loading states for better UX
- **Hebrew Support**: Full RTL and Hebrew text support

## Development

### Project Structure
```
movafit-booking/
├── public/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   └── ...
└── package.json
```

### Scripts
- `npm start` - Start React development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact:
- Email: info@movafit.co.il
- Phone: 03-1234567

## Future Enhancements

- **Backend Integration**: Connect to real API endpoints
- **Database**: Add MongoDB or PostgreSQL
- **Authentication**: Real JWT authentication
- **Payment Integration**: Stripe or PayPal
- **Email Notifications**: SendGrid or similar
- **Admin Dashboard**: Management interface
- **Mobile App**: React Native version
- **Analytics**: User behavior tracking
