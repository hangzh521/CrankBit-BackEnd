import Joi from 'joi'
import { IReport, Report } from '../models/Report'
import ReportSchema from '../schemas/Report'

const reportService = {
  createReport: async (reportData: Partial<IReport>): Promise<IReport> => {
    const { error } = ReportSchema.validate(reportData)

    if (error) {
      throw new Error(error.details[0].message)
    }

    return Report.create(reportData)
  },

  getReportById: async (reportId: string): Promise<IReport | null> => {
    const { error } = Joi.string().required().validate(reportId)

    if (error) {
      throw new Error(error.details[0].message)
    }

    return Report.findById(reportId).lean()
  },

  updateReport: async (reportId: string, updatedData: Partial<IReport>): Promise<IReport | null> => {
    const { error: idError } = Joi.string().required().validate(reportId)

    if (idError) {
      throw new Error(idError.details[0].message)
    }

    const { error: dataError } = ReportSchema.validate(updatedData)

    if (dataError) {
      throw new Error(dataError.details[0].message)
    }

    return Report.findByIdAndUpdate(reportId, updatedData, { new: true }).lean()
  },

  deleteReport: async (reportId: string): Promise<IReport | null> => {
    const { error } = Joi.string().required().validate(reportId)

    if (error) {
      throw new Error(error.details[0].message)
    }

    return Report.findByIdAndDelete(reportId).lean()
  },
}

export default reportService
