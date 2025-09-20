import mongoose from "mongoose"

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log('Database is connected');
    } catch(err) {
        console.log("Database Error", err)
    }
}


export default connectDB
