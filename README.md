# Employee Management System

A modern full-stack employee management application built with GraphQL, React, and MongoDB. This project demonstrates enterprise-level architecture with a stunning user interface and robust backend.

## 🚀 Live Demo

- **Frontend (Vercel):** [https://employee-management-six-blue.vercel.app](https://employee-management-six-blue.vercel.app)
- **Backend API (Render):** [https://employee-management-api-l67b.onrender.com](https://employee-management-api-l67b.onrender.com)
- **GraphQL Playground:** [https://employee-management-api-l67b.onrender.com/graphql](https://employee-management-api-l67b.onrender.com/graphql)

### Demo Credentials
- **Admin:** `admin@company.com` / `admin123`
- **Employee:** `employee@company.com` / `employee123`

## Features

### Backend (GraphQL API)
- **Apollo Server** with Express for GraphQL API
- **MongoDB** database with Mongoose ODM
- **JWT Authentication** with role-based access control (Admin/Employee)
- **DataLoader** implementation for query optimization and N+1 problem prevention
- **Pagination, Filtering, and Sorting** on all employee queries
- **Input Validation** and comprehensive error handling
- **Performance Optimizations** including database indexing and query batching

### Frontend (React)
- **Premium Dark Mode UI** with glassmorphism effects and smooth animations
- **Hamburger Menu** with one-level deep submenus
- **Horizontal Navigation** with user profile and role badges
- **Grid View** displaying 10 columns of employee data
- **Tile View** with card-based layout showing essential information
- **Detail View Modal** with comprehensive employee information
- **Bun Button Menu** for quick actions (edit, flag, delete)
- **View Toggle** between grid and tile layouts
- **Advanced Filtering** by department, status, and search
- **Sorting** by multiple fields
- **Role-Based UI** rendering based on user permissions

## Tech Stack

### Backend
- Node.js
- Apollo Server (GraphQL)
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- DataLoader for batching and caching
- Express.js

### Frontend
- React 18
- Apollo Client (GraphQL)
- Vite (build tool)
- Framer Motion (animations)
- Tailwind CSS with custom configuration

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**
```bash
cd employee-management
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

### Configuration

#### Backend Environment Variables

The backend uses environment variables. A `.env` file should be created based on `.env.example`:

```bash
MONGODB_URI=mongodb://localhost:27017/employee_management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=4000
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173,http://localhost:4173
```

Make sure MongoDB is running on your system before starting the backend.

### Database Setup

Seed the database with sample data and test users:

```bash
cd backend
npm run seed
```

This creates:
- 50 sample employees with realistic data
- Admin user: `admin@company.com` / `admin123`
- Employee user: `employee@company.com` / `employee123`

### Running the Application

1. **Start MongoDB** (if not already running)
```bash
mongod
```

2. **Start the Backend Server**
```bash
cd backend
npm run dev
```
The GraphQL API will be available at `http://localhost:4000/graphql`

3. **Start the Frontend** (in a new terminal)
```bash
cd frontend
npm run dev
```
The application will open at `http://localhost:5173`

## Usage

### Login
Use one of the demo accounts:
- **Admin**: `admin@company.com` / `admin123` (full access)
- **Employee**: `employee@company.com` / `employee123` (read-only)

### Features Walkthrough

1. **Navigation**
   - Use the hamburger menu (top-left) for mobile-friendly navigation
   - Horizontal menu shows current user and role
   - Admin users see additional menu items
2. **View Modes**
   - Toggle between Grid and Tile views using the buttons in the header
   - Grid view shows all 10 columns in a table format

3. **Filtering & Sorting**
  - Filter by department, status, or search by name/email/position
  - Filters and sorting work in both view modes

4. **Employee Details**
  - Click any employee row (grid) or card (tile) to view full details
  - Modal shows comprehensive information including address, emergency contact, and skills
  - Click "Back to List" or outside the modal to close

5. **Actions (Admin Only)**
  - Click the three-dot menu on any tile
  - Edit, flag, or delete employees
  - Employee role users see "Admin Only" message
  - Add new employees from the Management menu:
    - Horizontal navigation: Management → "Add Employee"
    - Hamburger menu (mobile): Management → "Add Employee"
  - This opens the Add Employee modal. Fill in required fields (name, email, age, department, position, phone, salary; optional: join date, status, skills) and submit to create the employee.
  - After submitting, the employee list refreshes automatically. Only admins can see and use these controls.

## GraphQL API

### Queries
# Get all employees with optional filters and sorting
employees(filter: EmployeeFilterInput, sort: EmployeeSortInput): [Employee!]!

# Get paginated employees
employeesPaginated(page: Int, limit: Int, filter: EmployeeFilterInput, sort: EmployeeSortInput): PaginatedEmployees!

# Get single employee by ID
employee(id: ID!): Employee

# Get current user
me: User

# Get statistics
stats: EmployeeStats!
```
### Mutations

```graphql
# Authentication
login(email: String!, password: String!): AuthPayload!
register(username: String!, email: String!, password: String!, role: String): AuthPayload!

# Employee Management (Admin only)
addEmployee(input: CreateEmployeeInput!): Employee!
updateEmployee(id: ID!, input: UpdateEmployeeInput!): Employee!
deleteEmployee(id: ID!): Boolean!
toggleFlag(id: ID!): Employee!
```

### Security

1. **JWT Authentication**: Secure token-based authentication
2. **Password Hashing**: bcrypt with salt rounds for password security
3. **Role-Based Access Control**: Admin and Employee roles with different permissions
4. **Input Validation**: Mongoose schema validation and GraphQL type checking
5. **Authorization Middleware**: Protected mutations and queries

## Project Structure

```
employee-management/
├── backend/
│   ├── models/           # Mongoose schemas
│   ├── schema/           # GraphQL type definitions and resolvers
│   ├── utils/            # Auth, DataLoader, and seed utilities
│   ├── server.js         # Apollo Server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── context/      # Auth context
│   │   ├── graphql/      # GraphQL queries and mutations
│   │   ├── lib/          # Apollo Client setup
│   │   ├── App.jsx       # Main application
│   │   └── index.css     # Tailwind base styles and custom utilities
│   ├── tailwind.config.js # Tailwind configuration
│   ├── postcss.config.js  # PostCSS configuration
│   └── package.json
└── README.md
```

## Versions

- Node.js: requires v18+.
- Vite: v5.x (frontend uses `vite` build tool with `@vitejs/plugin-react`).

If you run into build errors related to modern syntax (e.g., nullish assignment), ensure your Node.js version is >= 18, then reinstall and rebuild the frontend:

```bash
cd frontend
npm ci
npm run build
```