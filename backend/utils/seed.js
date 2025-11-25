import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from '../models/Employee.js';
import User from '../models/User.js';

dotenv.config();

const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product'];
const positions = {
    Engineering: ['Senior Engineer', 'Software Engineer', 'DevOps Engineer', 'QA Engineer', 'Tech Lead'],
    Marketing: ['Marketing Manager', 'Content Writer', 'SEO Specialist', 'Social Media Manager'],
    Sales: ['Sales Manager', 'Account Executive', 'Business Development', 'Sales Representative'],
    HR: ['HR Manager', 'Recruiter', 'HR Coordinator', 'Training Specialist'],
    Finance: ['Financial Analyst', 'Accountant', 'Finance Manager', 'Payroll Specialist'],
    Operations: ['Operations Manager', 'Project Manager', 'Coordinator', 'Analyst'],
    Design: ['UI/UX Designer', 'Graphic Designer', 'Product Designer', 'Design Lead'],
    Product: ['Product Manager', 'Product Owner', 'Product Analyst', 'Product Designer']
};

const skills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'GraphQL', 'MongoDB', 'SQL',
    'Communication', 'Leadership', 'Project Management', 'Data Analysis',
    'Marketing Strategy', 'SEO', 'Content Creation', 'Sales', 'Negotiation',
    'UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Agile', 'Scrum'
];

const cities = ['New York', 'San Francisco', 'Austin', 'Seattle', 'Boston', 'Chicago', 'Denver', 'Portland'];
const states = ['NY', 'CA', 'TX', 'WA', 'MA', 'IL', 'CO', 'OR'];

const generateEmployee = (index) => {
    const dept = departments[Math.floor(Math.random() * departments.length)];
    const position = positions[dept][Math.floor(Math.random() * positions[dept].length)];
    const cityIndex = Math.floor(Math.random() * cities.length);

    return {
        name: `Employee ${index + 1}`,
        email: `employee${index + 1}@company.com`,
        age: Math.floor(Math.random() * 30) + 25,
        department: dept,
        position,
        phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        salary: Math.floor(Math.random() * 100000) + 50000,
        joinDate: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        status: ['active', 'active', 'active', 'inactive', 'on-leave'][Math.floor(Math.random() * 5)],
        skills: Array.from({ length: Math.floor(Math.random() * 5) + 2 }, () =>
            skills[Math.floor(Math.random() * skills.length)]
        ).filter((v, i, a) => a.indexOf(v) === i),
        address: {
            street: `${Math.floor(Math.random() * 9999) + 1} Main Street`,
            city: cities[cityIndex],
            state: states[cityIndex],
            zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
            country: 'USA'
        },
        emergencyContact: {
            name: `Emergency Contact ${index + 1}`,
            relationship: ['Spouse', 'Parent', 'Sibling', 'Friend'][Math.floor(Math.random() * 4)],
            phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
        },
        flagged: Math.random() > 0.9,
        notes: Math.random() > 0.7 ? 'Excellent performance and team player' : ''
    };
};

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Employee.deleteMany({});
        await User.deleteMany({});
        console.log('Cleared existing data');

        const admin = new User({
            username: 'admin',
            email: 'admin@company.com',
            password: 'admin123',
            role: 'admin'
        });
        await admin.save();
        console.log('✅ Admin user created (email: admin@company.com, password: admin123)');

        const employee = new User({
            username: 'employee',
            email: 'employee@company.com',
            password: 'employee123',
            role: 'employee'
        });
        await employee.save();
        console.log('✅ Employee user created (email: employee@company.com, password: employee123)');

        const employees = Array.from({ length: 50 }, (_, i) => generateEmployee(i));
        await Employee.insertMany(employees);
        console.log(`✅ Seeded ${employees.length} employees`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\nLogin credentials:');
        console.log('Admin - email: admin@company.com, password: admin123');
        console.log('Employee - email: employee@company.com, password: employee123');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
