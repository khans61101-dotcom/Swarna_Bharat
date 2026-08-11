const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const newsRoutes = require('./routes/news');
const eventsRoutes = require('./routes/events');
const galleryRoutes = require('./routes/gallery');
const enquiriesRoutes = require('./routes/enquiries');
const blogsRoutes = require('./routes/blogs');
const uploadRoutes = require('./routes/upload');
const organizationRoutes = require('./routes/organization');
const referralRoutes = require('./routes/referrals');
const tasksRoutes = require('./routes/tasks');
const taskAssignmentsRoutes = require('./routes/taskAssignments');
const walletRoutes = require('./routes/wallet');
const partnersRoutes = require('./routes/partners');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files (Admin Panel) from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organization', organizationRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/task-assignments', taskAssignmentsRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/enquiries', enquiriesRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/partners', partnersRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
