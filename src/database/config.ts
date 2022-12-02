import mongoose from 'mongoose'

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN as string)

        console.log('Database online');

    } catch (error) {
        console.log(error);
        throw new Error('Error failed to initialize database')
    }
}

export const connDB = async () => {
    await dbConnection()
}


