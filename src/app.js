require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('./config/passport');
const connectDB = require('./config/database');

const sessionsRouter = require('./routes/sessions.router');
const usersRouter = require('./routes/users.router');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);

app.get('/', (req, res) => {
    res.json({ 
        message: 'E-commerce API with Authentication',
        endpoints: {
            sessions: {
                register: 'POST /api/sessions/register',
                login: 'POST /api/sessions/login',
                current: 'GET /api/sessions/current',
                logout: 'POST /api/sessions/logout'
            },
            users: {
                getAll: 'GET /api/users',
                getById: 'GET /api/users/:id',
                create: 'POST /api/users',
                update: 'PUT /api/users/:id',
                updatePassword: 'PUT /api/users/:id/password',
                delete: 'DELETE /api/users/:id'
            }
        }
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB();
    
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();

module.exports = app;