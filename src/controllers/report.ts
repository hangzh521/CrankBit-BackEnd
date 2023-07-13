import { Request, Response } from 'express'
import { IReport } from '../models/Report'
import reportService from '../services/reportService'

export const createReportController = async (req: Request, res: Response): Promise<void> => {
  try {
    const reportData = req.body as Partial<IReport>
    const newReport = await reportService.createReport(reportData)
    res.status(201).json(newReport)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getReportByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const reportId = req.params.id
    const report = await reportService.getReportById(reportId)
    if (!report) {
      res.status(404).json({ error: 'Report not found' })
    } else {
      res.json(report)
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const updateReportController = async (req: Request, res: Response): Promise<void> => {
  try {
    const reportId = req.params.id
    const updatedData = req.body as Partial<IReport>
    const updatedReport = await reportService.updateReport(reportId, updatedData)
    if (!updatedReport) {
      res.status(404).json({ error: 'Report not found' })
    } else {
      res.json(updatedReport)
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const deleteReportController = async (req: Request, res: Response): Promise<void> => {
  try {
    const reportId = req.params.id
    const deletedReport = await reportService.deleteReport(reportId)
    if (!deletedReport) {
      res.status(404).json({ error: 'Report not found' })
    } else {
      res.json(deletedReport)
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
