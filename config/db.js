const mongoose = require('mongoose');
require('dotenv').config();
const db= process.env.MONGO_URI;
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
       const conn= await mongoose.connect(db)
        console.log('MongoDB connected')
    } catch (error) {
        console.error('MongoDB connection failed:', error)
        process.exit(1)
    }
}

module.exports = connectDB
