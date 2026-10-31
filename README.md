# HRM Portal (MERN)

Role-based Human Resource Management system: **HR**, **Manager**, **Employee**.
React (Vite) + Node/Express + MongoDB (Mongoose) + JWT. Backend follows MVC (models / controllers / routes).

## Run (2 commands)
```bash
npm run setup     # installs root, server and client packages (needs internet, once)
npm start         # starts backend (5000) + frontend (5173) together
```
Open http://localhost:5173

**MongoDB:** if MongoDB is running locally (`mongodb://127.0.0.1:27017/hrm`) it is used.
If not, the server automatically starts an in-memory MongoDB (first run downloads it once). Demo data is seeded automatically when the database is empty.
To use Atlas or another URI, edit `server/.env` -> `MONGO_URI`.

### Run separately (as in the project guide)
```bash
cd server && npm install && npm run dev     # http://localhost:5000
cd client && npm install && npm run dev     # http://localhost:5173
```

## Demo logins (password: `password123`)
| Role     | Email             |
|----------|-------------------|
| HR       | hr@demo.com       |
| Manager  | manager@demo.com  |
| Employee | employee@demo.com |

## Demo video flow (suggested)
1. Landing page -> Register a new Employee -> lands on Employee dashboard.
2. Employee: mark attendance, apply for leave, edit profile, view announcements + training.
3. Logout -> login as Manager: approve/reject the leave, create a training and assign it, post an announcement.
4. Logout -> login as HR: add/edit/delete employee, review leaves, post announcement, view attendance + export CSV.

## API
`/api/auth` (register, login, me) · `/api/employees` · `/api/leaves` · `/api/attendance` · `/api/announcements` · `/api/trainings`
