import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 100
    },
    department: {
        type: String,
        required: true,
        enum: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product']
    },
    position: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true,
        min: 0
    },
    joinDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'on-leave'],
        default: 'active'
    },
    skills: [{
        type: String
    }],
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
    },
    flagged: {
        type: Boolean,
        default: false
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

employeeSchema.index({ email: 1 });
employeeSchema.index({ department: 1, status: 1 });
employeeSchema.index({ name: 'text', position: 'text' });
employeeSchema.index({ joinDate: -1 });

export default mongoose.model('Employee', employeeSchema);
