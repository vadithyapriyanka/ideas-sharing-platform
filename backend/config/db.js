//Database connection logic
// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // These are good practice but might be deprecated depending on Mongoose version.
            // Mongoose 6+ handles these by default.
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true, // if using older mongoose versions
            // useFindAndModify: false // if using older mongoose versions
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;