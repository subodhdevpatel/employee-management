import Employee from '../models/Employee.js';
import User from '../models/User.js';
import { requireAuth, requireAdmin } from '../utils/auth.js';

export const resolvers = {
    Query: {
        employees: async (_, { filter, sort }, { user }) => {
            requireAuth(user);

            const query = {};

            if (filter) {
                if (filter.department) query.department = filter.department;
                if (filter.status) query.status = filter.status;
                if (filter.minSalary || filter.maxSalary) {
                    query.salary = {};
                    if (filter.minSalary) query.salary.$gte = filter.minSalary;
                    if (filter.maxSalary) query.salary.$lte = filter.maxSalary;
                }
                if (filter.search) {
                    query.$or = [
                        { name: { $regex: filter.search, $options: 'i' } },
                        { position: { $regex: filter.search, $options: 'i' } },
                        { email: { $regex: filter.search, $options: 'i' } }
                    ];
                }
            }

            let queryBuilder = Employee.find(query);

            if (sort) {
                const sortOrder = sort.order === 'desc' ? -1 : 1;
                queryBuilder = queryBuilder.sort({ [sort.field]: sortOrder });
            } else {
                queryBuilder = queryBuilder.sort({ createdAt: -1 });
            }

            return await queryBuilder.lean().exec();
        },

        employee: async (_, { id }, { user, employeeLoader }) => {
            requireAuth(user);
            return await employeeLoader.load(id);
        },

        employeesPaginated: async (_, { page = 1, limit = 10, filter, sort }, { user }) => {
            requireAuth(user);

            const query = {};

            if (filter) {
                if (filter.department) query.department = filter.department;
                if (filter.status) query.status = filter.status;
                if (filter.minSalary || filter.maxSalary) {
                    query.salary = {};
                    if (filter.minSalary) query.salary.$gte = filter.minSalary;
                    if (filter.maxSalary) query.salary.$lte = filter.maxSalary;
                }
                if (filter.search) {
                    query.$or = [
                        { name: { $regex: filter.search, $options: 'i' } },
                        { position: { $regex: filter.search, $options: 'i' } },
                        { email: { $regex: filter.search, $options: 'i' } }
                    ];
                }
            }

            const skip = (page - 1) * limit;
            const totalCount = await Employee.countDocuments(query);
            const totalPages = Math.ceil(totalCount / limit);

            let queryBuilder = Employee.find(query).skip(skip).limit(limit);

            if (sort) {
                const sortOrder = sort.order === 'desc' ? -1 : 1;
                queryBuilder = queryBuilder.sort({ [sort.field]: sortOrder });
            } else {
                queryBuilder = queryBuilder.sort({ createdAt: -1 });
            }

            const employees = await queryBuilder.lean().exec();

            return {
                employees,
                totalCount,
                pageInfo: {
                    currentPage: page,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1
                }
            };
        },

        me: async (_, __, { user }) => {
            return user;
        },

        stats: async (_, __, { user }) => {
            requireAuth(user);

            const [totalEmployees, activeEmployees, departmentCounts, salaryStats] = await Promise.all([
                Employee.countDocuments(),
                Employee.countDocuments({ status: 'active' }),
                Employee.aggregate([
                    { $group: { _id: '$department', count: { $sum: 1 } } },
                    { $project: { department: '$_id', count: 1, _id: 0 } }
                ]),
                Employee.aggregate([
                    { $group: { _id: null, avgSalary: { $avg: '$salary' } } }
                ])
            ]);

            return {
                totalEmployees,
                activeEmployees,
                departmentCounts,
                averageSalary: salaryStats[0]?.avgSalary || 0
            };
        }
    },

    Mutation: {
        register: async (_, { username, email, password, role }) => {
            const existingUser = await User.findOne({ $or: [{ email }, { username }] });
            if (existingUser) {
                throw new Error('User already exists with this email or username');
            }

            const user = new User({
                username,
                email,
                password,
                role: role || 'employee'
            });
            await user.save();

            const token = user.generateToken();

            return {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt
                }
            };
        },

        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('Invalid credentials');
            }

            const isValid = await user.comparePassword(password);
            if (!isValid) {
                throw new Error('Invalid credentials');
            }

            const token = user.generateToken();

            return {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt
                }
            };
        },

        addEmployee: async (_, { input }, { user }) => {
            requireAdmin(user);

            const existingEmployee = await Employee.findOne({ email: input.email });
            if (existingEmployee) {
                throw new Error('Employee with this email already exists');
            }

            const employee = new Employee(input);
            await employee.save();
            return employee;
        },

        updateEmployee: async (_, { id, input }, { user }) => {
            requireAdmin(user);

            if (input.email) {
                const existingEmployee = await Employee.findOne({
                    email: input.email,
                    _id: { $ne: id }
                });
                if (existingEmployee) {
                    throw new Error('Another employee with this email already exists');
                }
            }

            const employee = await Employee.findByIdAndUpdate(
                id,
                { $set: input },
                { new: true, runValidators: true }
            );

            if (!employee) {
                throw new Error('Employee not found');
            }

            return employee;
        },

        deleteEmployee: async (_, { id }, { user }) => {
            requireAdmin(user);

            const employee = await Employee.findByIdAndDelete(id);
            if (!employee) {
                throw new Error('Employee not found');
            }

            return true;
        },

        toggleFlag: async (_, { id }, { user }) => {
            requireAdmin(user);

            const employee = await Employee.findById(id);
            if (!employee) {
                throw new Error('Employee not found');
            }

            employee.flagged = !employee.flagged;
            await employee.save();

            return employee;
        }
    },

    Employee: {
        id: (parent) => parent._id.toString(),
        joinDate: (parent) => parent.joinDate.toISOString(),
        createdAt: (parent) => parent.createdAt.toISOString(),
        updatedAt: (parent) => parent.updatedAt.toISOString()
    },

    User: {
        id: (parent) => {
            if (parent.id) return parent.id;
            return parent._id ? parent._id.toString() : null;
        },
        createdAt: (parent) => {
            if (typeof parent.createdAt === 'string') return parent.createdAt;
            return parent.createdAt ? parent.createdAt.toISOString() : null;
        }
    }
};
