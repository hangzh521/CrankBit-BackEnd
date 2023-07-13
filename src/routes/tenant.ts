import { Router } from 'express'
import { getTenantById, updateTenant, checkLogin } from '../controllers/tenant'

const tenantRouter = Router()

tenantRouter.route('/:id').get(getTenantById).patch(updateTenant)
tenantRouter.route('/check-login').get(checkLogin)

export default tenantRouter
