import { Request, Response, Router } from 'express'
import passport from 'passport'

const loginRouter = Router()

loginRouter.post('/login', passport.authenticate('local'))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
loginRouter.delete('/login', (req: Request, res: Response, next: (err: any) => void) => {
    req.logOut({keepSessionInfo: false}, next)
    res.redirect('/')
})

export default loginRouter