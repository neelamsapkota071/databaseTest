"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const ormconfig_1 = require("./ormconfig");
const Student_1 = require("./entity/Student");
const Employee_1 = require("./entity/Employee");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.get('/students/:studentId?', async (req, res) => {
    const studentRepository = ormconfig_1.AppDataSource.getRepository(Student_1.Student);
    const { studentId } = req.params;
    try {
        if (studentId) {
            const id = parseInt(studentId, 10); // Convert string to number
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid student ID' });
                return;
            }
            const student = await studentRepository.findOneBy({ studentId: id });
            if (!student) {
                res.status(404).json({ message: 'Student not found' });
                return;
            }
            res.json(student);
        }
        else {
            const students = await studentRepository.find();
            res.json(students);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching students', error });
    }
});
app.post('/students', async (req, res) => {
    const studentRepository = ormconfig_1.AppDataSource.getRepository(Student_1.Student);
    const { firstName, lastName, age } = req.body;
    try {
        const newStudent = studentRepository.create({ firstName, lastName, age });
        await studentRepository.save(newStudent);
        res.status(201).json(newStudent);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating student', error });
    }
});
app.put('/students/:studentId', async (req, res) => {
    const studentRepository = ormconfig_1.AppDataSource.getRepository(Student_1.Student);
    const { studentId } = req.params;
    const { firstName, lastName, age } = req.body;
    try {
        const id = parseInt(studentId, 10); // Convert string to number
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid student ID' });
            return;
        }
        const student = await studentRepository.findOneBy({ studentId: id });
        if (!student) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        student.firstName = firstName;
        student.lastName = lastName;
        student.age = age;
        await studentRepository.save(student);
        res.json(student);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating student', error });
    }
});
app.delete('/students/:studentId', async (req, res) => {
    const studentRepository = ormconfig_1.AppDataSource.getRepository(Student_1.Student);
    const { studentId } = req.params;
    try {
        const id = parseInt(studentId, 10); // Convert string to number
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid student ID' });
            return;
        }
        const student = await studentRepository.findOneBy({ studentId: id });
        if (!student) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        await studentRepository.remove(student);
        res.json({ message: 'Student deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting student', error });
    }
});
//////////////////////////Employee////////////////////////////////////////////////////////
app.get('/employees/:employeeId?', async (req, res) => {
    const employeeRepository = ormconfig_1.AppDataSource.getRepository(Employee_1.Employee);
    const { employeeId } = req.params;
    try {
        if (employeeId) {
            const id = parseInt(employeeId, 10); // Convert string to number
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid employee ID' });
                return;
            }
            const employee = await employeeRepository.findOneBy({ employeeId: id });
            if (!employee) {
                res.status(404).json({ message: 'Employee not found' });
                return;
            }
            res.json(employee);
        }
        else {
            const employees = await employeeRepository.find();
            res.json(employees);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching employees', error });
    }
});

app.post('/employees', async (req, res) => {
    const employeeRepository = ormconfig_1.AppDataSource.getRepository(Employee_1.Employee);
    const { address, phone, email } = req.body;
    try {
        const newEmployee = employeeRepository.create({ address, phone, email });
        await employeeRepository.save(newEmployee);
        res.status(201).json(newEmployee);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating employee', error });
    }
});
app.put('/employees/:employeeId', async (req, res) => {
    const employeeRepository = ormconfig_1.AppDataSource.getRepository(Employee_1.Employee);
    const { employeeId } = req.params;
    const { address, phone, email } = req.body;
    try {
        const id = parseInt(employeeId, 10); // Convert string to number
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid employee ID' });
            return;
        }
        const employee = await employeeRepository.findOneBy({ employeeId: id });
        if (!employee) {
            res.status(404).json({ message: 'Employee not found' });
            return;
        }
        employee.address = address;
        employee.phone = phone;
        employee.email = email;
        await employeeRepository.save(employee);
        res.json(employee);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating employee', error });
    }
});
app.delete('/employees/:employeeId', async (req, res) => {
    const employeeRepository = ormconfig_1.AppDataSource.getRepository(Employee_1.Employee);
    const { employeeId } = req.params;
    try {
        const id = parseInt(employeeId, 10); // Convert string to number
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid employee ID' });
            return;
        }
        const employee = await employeeRepository.findOneBy({ employeeId: id });
        if (!employee) {
            res.status(404).json({ message: 'Employee not found' });
            return;
        }
        await employeeRepository.remove(employee);
        res.json({ message: 'Employee deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error });
    }
});
ormconfig_1.AppDataSource.initialize()
    .then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
})
    .catch((error) => console.log(error));
