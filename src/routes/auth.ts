import { Router } from 'express'
import { register, login, updatePassword, sendEmailResetPassword } from '../controllers/auth'

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
 * '/api/v1/auth/update-password':
 *  post:
 *    summary: Update user password
 *    tags: [Auth]
 *    requestBody:
 *      description: User password update data
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - newPassword
 *              - token
 *            properties:
 *              newPassword:
 *                type: string
 *              token:
 *                type: string
 *    responses:
 *      200:
 *        description: Password updated successfully
 *      400:
 *        description: Invalid credentials or password requirements not met
 *      401:
 *        description: Unauthorized access
 */

authRouter.route('/update-password').post(updatePassword)

/**
 * @openapi
 * '/api/v1/auth/sendEmailToResetPassword':
 *  post:
 *    summary: Send Email to reset password
 *    tags: [Auth]
 *    requestBody:
 *      description: Send Email to reset password
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *            properties:
 *              token:
 *                type: string
 *    responses:
 *      200:
 *        description: Email sent successfully
 *     npm 400:
 *        description: Email sent failed
 */

authRouter.route('/sendEmailToResetPassword').post(sendEmailResetPassword)
export default authRouter
