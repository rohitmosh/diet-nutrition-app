# Diet & Nutrition App - Frontend

This is a standalone React frontend application for the Diet & Nutrition App, built with Vite and designed to work independently without requiring a backend server.

## Features

- **Standalone Operation**: Works completely independently with mock data
- **Demo Mode**: All API calls are intercepted and return realistic mock data
- **Full Functionality**: All features work including:
  - User authentication (demo login)
  - Admin dashboard with user management
  - Patient dashboard with profile management
  - Meal logging with calorie tracking
  - Exercise logging with activity tracking
  - Diet planning with nutritional goals
  - Appointment scheduling with dieticians
  - Reports generation with charts and analytics

## Demo Credentials

### Admin Access
- Email: `admin@nutritrack.com`
- Password: `admin123`

### Patient Access
- Email: `rohit@nutritrack.com`
- Password: `patient123`

**Note**: Only these specific credentials will work. Any other email/password combination will be rejected.

## Environment Configuration

The app uses environment variables to control its behavior:

- `VITE_API_URL=demo` - Enables standalone demo mode with mock data
- `VITE_API_URL=http://localhost:5000/api` - Connects to a real backend server

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Vercel Deployment

The app is configured for easy deployment to Vercel:

1. Connect your repository to Vercel
2. The `vercel.json` configuration will automatically:
   - Set `VITE_API_URL=demo` for standalone operation
   - Configure proper routing for SPA
   - Set up the build process

### Manual Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to any static hosting service
3. Ensure the hosting service supports SPA routing (redirects all routes to `index.html`)

## Architecture

### Mock Services

The app includes comprehensive mock services that simulate a real backend:

- **authService**: User authentication and registration
- **adminService**: User management for admin users
- **patientService**: Patient profile management
- **mealService**: Meal logging and calorie tracking
- **exerciseService**: Exercise logging and activity tracking
- **appointmentService**: Appointment scheduling with dieticians
- **reportService**: Report generation with analytics

### Data Persistence

In demo mode, data is stored in memory and will reset when the page is refreshed. This is intentional for demonstration purposes.

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animations and transitions
- **Heroicons** - Icon library
- **Axios** - HTTP client (used for mock API simulation)

## File Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── services/           # API services and mock data
├── App.jsx            # Main application component
└── main.jsx           # Application entry point
```

## Mock Data

The application includes realistic mock data for:

- User profiles and authentication
- Meal database with nutritional information
- Exercise activities and calorie calculations
- Dietician profiles and specializations
- Appointment scheduling
- Report analytics and charts

All mock data is designed to provide a realistic demonstration of the application's capabilities.
