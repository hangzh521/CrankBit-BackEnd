import mongoose, { Document, Schema } from 'mongoose'

export interface IReport extends Document {
  title: string
}

const ReportSchema = new Schema({
  title: {
    type: String,
    required: [true, 'please enter your report title.'],
  },
})

ReportSchema.statics.createReport = async function (reportData: Partial<IReport>): Promise<IReport> {
  const report = await this.create(reportData)
  return report
}

ReportSchema.statics.getReportById = async function (reportId: string): Promise<IReport | null> {
  const report = await this.findById(reportId)
  return report
}

ReportSchema.statics.updateReport = async function (
  reportId: string,
  updatedData: Partial<IReport>
): Promise<IReport | null> {
  const report = await this.findByIdAndUpdate(reportId, updatedData, { new: true })
  return report
}

ReportSchema.statics.deleteReport = async function (reportId: string): Promise<IReport | null> {
  const report = await this.findByIdAndDelete(reportId)
  return report
}

export const Report = mongoose.model<IReport>('Report', ReportSchema)
