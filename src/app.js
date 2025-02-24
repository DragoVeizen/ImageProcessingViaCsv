// Import dependencies
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const uploadRoutes = require('./routes/uploadRoutes');
const statusRoutes = require('./routes/statusRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const db = require('./models');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS

// Setup file upload using multer
const upload = multer({ dest: 'uploads/' });

// Routes
app.use('/upload', uploadRoutes);
app.use('/status', statusRoutes);
app.use('/webhook', webhookRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 3000;
db.sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});