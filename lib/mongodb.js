import mongoose from 'mongoose';

let isConnected = false;
 async function connectToDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'photoApp',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  isConnected = true;
}


export default connectToDB