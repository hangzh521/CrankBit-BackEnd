import { Router } from 'express'
import { register, login } from '../controllers/auth'
import { googleLoginController, googleLoginCallbackController } from '../controllers/Googlelogin'

const authRouter = Router()

/**
 * @openapi
 * '/api/v1/auth/register':
 *  post:
 *    summary: Register new user
 *    tags: [Auth]
 *    requestBody:
 *      description: User registration data
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - email
 *              - password
 *            properties:
 *              name:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      201:
 *        description: Successful registration
 *      400:
 *        description: Invalid registration data
 */
authRouter.route('/register').post(register)

/**
 * @openapi
 * '/api/v1/auth/login':
 *  post:
 *    summary: Login user
 *    tags: [Auth]
 *    requestBody:
 *      description: User login data
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      200:
 *        description: Successful login
 *      400:
 *        description: Bad login data
 *      401:
 *        description: Invalid credentials
 */
authRouter.route('/login').post(login)
/**
 * @openapi
 * /api/v1/auth/google:
 *   get:
 *     summary: 用户使用 Google 登录
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 成功发起 Google 登录流程
 *       401:
 *         description: 未经授权或登录失败
 */
authRouter.route('/google').get(googleLoginController)

/**
 * @openapi
 * /api/v1/auth/google/callback:
 *   get:
 *     summary: Google 登录回调
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Google 登录回调处理成功
 *       401:
 *         description: 未经授权或登录失败
 */
authRouter.route('/google/callback').get(googleLoginCallbackController)
export default authRouter
