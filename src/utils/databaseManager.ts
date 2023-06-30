import mongoose from 'mongoose'

export default async function createDatabase(companyName: string): Promise<void> {
  try {
    const dbName = `db_${companyName}`

    await mongoose.connect('mongodb://localhost:27017/admin')
    await mongoose.connection.db.admin().command({ create: dbName })
    await mongoose.disconnect()

    console.log(`Database created for company: ${companyName}`)
  } catch (error) {
    console.error('Error creating database:', error)
  }
}
