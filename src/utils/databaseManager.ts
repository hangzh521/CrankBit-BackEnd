import mongoose from 'mongoose'

const createDatabase = async (companyName: string): Promise<void> => {
  try {
    const dbName = `db_${companyName}`

    await mongoose.connect(process.env.MONGO_URI)
    await mongoose.connection.db.admin().command({ create: dbName })
    await mongoose.disconnect()

    console.log(`Database created for company: ${companyName}`)
  } catch (error) {
    console.error('Error creating database:', error)
  }
}

export default createDatabase
