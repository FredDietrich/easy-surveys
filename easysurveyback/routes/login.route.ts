import { Request, Response, Router } from 'express'
import passport from 'passport'
import * as jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { hash } from 'bcrypt'
import { User } from '../entities/user.entity'

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
                            user.password = ''
                            const token = jwt.sign({ user: user }, jwtSecret)

                            return res.json({ token, user })
                        }
                    )
                } catch (error) {
                    return next(error)
                }
            }
        )(req, res, next)
    }
)

loginRouter.post('/user', async (req: Request<Record<string, never>, Record<string, never>, User>, res: Response) => {
    let user = User.build({...req.body})
    const foundUsersByUsername = await User.findAll({where: {
        username: user.username
    }})
    const foundUsersByEmail = await User.findAll({where: {
        email: user.email
    }})
    if (foundUsersByEmail.length > 0) {
        return res.status(422).send('Usuário existente com email!')
    }
    if (foundUsersByUsername.length > 0) {
        return res.status(422).send('Usuário existente com username!')
    }
    user.password = await hash(user.password, 10)
    if(user) {
        user = await user.save()
        res.status(201).location(`/user/${user.id}`).json(user)
        return
    }
    res.status(500).send()
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
loginRouter.delete('/login', (req: Request, res: Response, next: (err: any) => void) => {
    req.logOut({ keepSessionInfo: false }, next)
    res.redirect('/')
})

export default loginRouter