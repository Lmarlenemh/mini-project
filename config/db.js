const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://lmarlene_mh:examplePassword@cluster.ivi8x.mongodb.net/Juego?retryWrites=true&w=majority&appName=Cluster', {
      // Opciones obsoletas eliminadas
      /*useNewUrlParser: true,
      useUnifiedTopology: true*/
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
