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
            'local',
            async (err, user) => {
                try {
                    if (err) {
                        const error = new Error('An error occurred.')
                        return next(error)
                    } else if (!user) {
                        return res.status(401).send('Usuário ou senha inválidos!')
                    }
                    req.login(
                        user,
                        { session: false },
                        async (error) => {
                            if (error) return next(error)
                            console.log(user)
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