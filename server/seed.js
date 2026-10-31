const User = require("./models/User");
const Employee = require("./models/Employee");
const Leave = require("./models/Leave");
const Attendance = require("./models/Attendance");
const Announcement = require("./models/Announcement");
const Training = require("./models/Training");

const dayStr = (offset) => new Date(Date.now() - offset * 86400000).toISOString().slice(0, 10);
const dayDate = (offset) => new Date(Date.now() + offset * 86400000);

// Fills an empty database with demo data so the app looks alive immediately.
module.exports = async () => {
  if ((await User.countDocuments()) > 0) return;
  console.log("Seeding demo data...");
  const defs = [
    { name: "Priya Sharma", email: "hr@demo.com", role: "HR", department: "Human Resources", position: "HR Manager", salary: 85000 },
    { name: "Rahul Verma", email: "manager@demo.com", role: "Manager", department: "Engineering", position: "Engineering Manager", salary: 120000 },
    { name: "Amit Patel", email: "employee@demo.com", role: "Employee", department: "Engineering", position: "Software Engineer", salary: 70000 },
    { name: "Sneha Iyer", email: "sneha@demo.com", role: "Employee", department: "Design", position: "UI Designer", salary: 62000 },
    { name: "Karan Singh", email: "karan@demo.com", role: "Employee", department: "Marketing", position: "Marketing Executive", salary: 55000 },
  ];
  const users = [];
  for (const d of defs) {
    const u = await User.create({ name: d.name, email: d.email, password: "password123", role: d.role, department: d.department });
    await Employee.create({ user: u._id, name: d.name, email: d.email, department: d.department, position: d.position, salary: d.salary, joinDate: dayDate(-400), phone: "98765" + Math.floor(10000 + Math.random() * 89999), address: "Bhopal, Madhya Pradesh" });
    users.push(u);
  }
  const [hr, mgr, emp1, emp2, emp3] = users;

  for (const [u, days] of [[emp1, [1, 2, 3, 4, 5]], [emp2, [1, 2, 4]], [emp3, [2, 3]], [mgr, [1, 2, 3]], [hr, [1, 2, 3, 4]]]) {
    for (const d of days) await Attendance.create({ user: u._id, date: dayStr(d), status: d === 3 ? "Late" : "Present", checkIn: d === 3 ? "10:25 AM" : "09:05 AM" });
  }

  await Leave.create([
    { user: emp1._id, startDate: dayDate(5), endDate: dayDate(7), reason: "Family function", status: "Pending" },
    { user: emp2._id, startDate: dayDate(10), endDate: dayDate(12), reason: "Medical appointment", status: "Pending" },
    { user: emp1._id, startDate: dayDate(-20), endDate: dayDate(-18), reason: "Personal work", status: "Approved", approverRole: "Manager" },
    { user: emp3._id, startDate: dayDate(-30), endDate: dayDate(-29), reason: "Travel", status: "Rejected", approverRole: "HR" },
  ]);

  await Announcement.create([
    { title: "Welcome to the new HRM Portal", message: "All leave, attendance and training activity now lives in one place. Please update your profile.", createdBy: hr._id, targetAudience: "All" },
    { title: "Diwali Holiday Schedule", message: "The office will remain closed from 1 to 3 November for the festival. Happy Diwali!", createdBy: hr._id, targetAudience: "All" },
    { title: "Quarterly Review Meeting", message: "Managers: please submit team performance summaries by Friday.", createdBy: hr._id, targetAudience: "Managers" },
  ]);

  await Training.create([
    { title: "React Advanced Patterns", description: "Hooks, context and performance optimisation.", date: dayDate(6), trainer: "Neha Gupta", createdBy: mgr._id, assignedTo: [emp1._id, emp2._id] },
    { title: "Effective Communication", description: "Workshop on clear written and verbal communication.", date: dayDate(14), trainer: "TBD", createdBy: mgr._id, assignedTo: [emp3._id] },
  ]);
  console.log("Demo data ready. Logins -> hr@demo.com / manager@demo.com / employee@demo.com  (password: password123)");
};
