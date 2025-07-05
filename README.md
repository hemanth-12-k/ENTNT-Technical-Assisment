# Dental Center Management System

A comprehensive dental practice management dashboard built with Next.js, React, and TypeScript. This system provides role-based access for both administrators (dentists) and patients to manage appointments, patient records, and treatment history.

## 🚀 Features

### Admin Features
- **Dashboard Overview**: KPIs including total patients, appointments, revenue, and treatment status
- **Patient Management**: Full CRUD operations for patient records
- **Appointment Management**: Schedule, edit, and manage patient appointments
- **Calendar View**: Monthly calendar with appointment visualization
- **File Upload**: Support for treatment documents, invoices, and images
- **Treatment Tracking**: Monitor treatment status and follow-up appointments

### Patient Features
- **Personal Dashboard**: Overview of upcoming appointments and treatment history
- **Appointment History**: View past and upcoming appointments with details
- **File Access**: Download treatment documents and invoices
- **Treatment Records**: Access to completed treatments and costs

### Technical Features
- **Role-Based Authentication**: Secure login system with admin and patient roles
- **Responsive Design**: Fully responsive across all devices
- **Local Storage**: All data persisted in browser localStorage
- **File Upload**: Base64 encoding for file storage
- **Form Validation**: Comprehensive client-side validation
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: React Context API
- **Routing**: Next.js App Router
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Storage**: localStorage (no backend required)

## 📦 Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd dental-management-system
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Demo Credentials

### Admin Access
- **Email**: admin@entnt.in
- **Password**: admin123

### Patient Access
- **Email**: john@entnt.in
- **Password**: patient123
- **Email**: jane@entnt.in
- **Password**: patient123

## 🏗️ Project Structure

\`\`\`
src/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   │   ├── appointments/  # Appointment management
│   │   ├── calendar/      # Calendar view
│   │   ├── patients/      # Patient management
│   │   └── my-appointments/ # Patient appointment view
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Login page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── AdminDashboard.tsx
│   ├── PatientDashboard.tsx
│   ├── AppointmentForm.tsx
│   ├── PatientForm.tsx
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── LoginForm.tsx
├── contexts/             # React contexts
│   ├── AuthContext.tsx   # Authentication state
│   └── DataContext.tsx   # Data management
├── hooks/                # Custom hooks
└── lib/                  # Utility functions
\`\`\`

## 💾 Data Structure

### Users
\`\`\`typescript
interface User {
  id: string
  role: 'Admin' | 'Patient'
  email: string
  patientId?: string // For patient users
}
\`\`\`

### Patients
\`\`\`typescript
interface Patient {
  id: string
  name: string
  dob: string
  contact: string
  email?: string
  healthInfo: string
  createdAt: string
}
\`\`\`

### Appointments/Incidents
\`\`\`typescript
interface Incident {
  id: string
  patientId: string
  title: string
  description: string
  comments: string
  appointmentDate: string
  cost?: number
  treatment?: string
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Pending'
  nextDate?: string
  files: { name: string; url: string; type: string }[]
  createdAt: string
}
\`\`\`

## 🔧 Key Features Implementation

### Authentication System
- Simulated authentication using hardcoded users
- Session persistence via localStorage
- Role-based route protection
- Automatic redirect based on user role

### Data Management
- Context API for global state management
- localStorage for data persistence
- CRUD operations for patients and appointments
- File upload with base64 encoding

### Calendar Integration
- Monthly calendar view with appointment visualization
- Date selection and appointment filtering
- Responsive calendar grid layout

### File Upload System
- Support for multiple file types (PDF, images, documents)
- Base64 encoding for storage
- File preview and download functionality

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Components**: shadcn/ui component library
- **Intuitive Navigation**: Role-based sidebar navigation
- **Form Validation**: Real-time validation with error messages
- **Loading States**: Loading indicators for better UX
- **Toast Notifications**: Success and error notifications

## 🚀 Deployment

The application can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **GitHub Pages**

### Vercel Deployment
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Deploy with default settings

## 🔍 Technical Decisions

### Why Next.js?
- Server-side rendering capabilities
- Built-in routing system
- Excellent developer experience
- Easy deployment options

### Why Context API over Redux?
- Simpler setup for this application size
- Built-in React solution
- Sufficient for the current state complexity

### Why localStorage?
- No backend requirement as specified
- Persistent data across sessions
- Simple implementation
- Suitable for demo purposes

### Why Tailwind CSS?
- Utility-first approach
- Consistent design system
- Responsive design utilities
- Great developer experience

## 🐛 Known Issues & Limitations

1. **Data Persistence**: Data is stored in localStorage, so it's browser-specific
2. **File Storage**: Files are stored as base64, which can impact performance with large files
3. **No Real Authentication**: Uses simulated authentication for demo purposes
4. **Browser Compatibility**: Requires modern browsers with localStorage support

## 🔮 Future Enhancements

- Real backend integration with database
- Email notifications for appointments
- SMS reminders
- Payment processing integration
- Advanced reporting and analytics
- Multi-clinic support
- Real-time updates with WebSocket

## 📝 License

This project is created for educational and demonstration purposes.

## 🤝 Contributing

This is a technical assignment project. For any questions or issues, please contact the development team.
\`\`\`

This comprehensive Dental Center Management System includes all the required features:

1. **Role-based Authentication** with Admin and Patient access
2. **Patient Management** with full CRUD operations
3. **Appointment/Incident Management** with file uploads
4. **Calendar View** for appointment scheduling
5. **Dashboard** with KPIs and overview
6. **Patient Portal** for viewing personal data
7. **Responsive Design** that works on all devices
8. **localStorage** for data persistence
9. **File Upload** functionality with base64 storage

The system is built with modern React patterns, includes comprehensive form validation, and provides an excellent user experience for both administrators and patients.
