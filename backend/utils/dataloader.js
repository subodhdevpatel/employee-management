import DataLoader from 'dataloader';
import Employee from '../models/Employee.js';

export const createEmployeeLoader = () => {
    return new DataLoader(async (ids) => {
        const employees = await Employee.find({ _id: { $in: ids } });
        const employeeMap = new Map(employees.map(emp => [emp._id.toString(), emp]));
        return ids.map(id => employeeMap.get(id.toString()));
    }, {
        cache: true,
        batchScheduleFn: callback => setTimeout(callback, 10)
    });
};

export const createEmployeesByDepartmentLoader = () => {
    return new DataLoader(async (departments) => {
        const employees = await Employee.find({
            department: { $in: departments }
        });

        const employeesByDept = departments.map(dept =>
            employees.filter(emp => emp.department === dept)
        );

        return employeesByDept;
    }, {
        cache: true
    });
};
