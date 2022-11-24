import { Request, Response, Router } from 'express'
import passport from 'passport'
import * as jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'

dotenv.config()

const loginRouter = Router()

const jwtSecret = process.env.JWT_SECRET ?? 'superDuperSecretSecret'

loginRouter.post(
    '/login',
    async (req, res, next) => {
        passport.authenticate(
            'login',
            async (err, user) => {
                try {
                    if (err || !user) {
                        const error = new Error('An error occurred.')
                        return next(error)
                    }
                    req.login(
                        user,
                        { session: false },
                        async (error) => {
                            if (error) return next(error)

                            const body = { id: user.id, username: user.username }
                            const token = jwt.sign({ user: body }, jwtSecret)

                            return res.json({ token })
                        }
                    )
                } catch (error) {
                    return next(error)
                }
            }
        )(req, res, next)
    }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
loginRouter.delete('/login', (req: Request, res: Response, next: (err: any) => void) => {
    req.logOut({ keepSessionInfo: false }, next)
    res.redirect('/')
})

export default loginRouter