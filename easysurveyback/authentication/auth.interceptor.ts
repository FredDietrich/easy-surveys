import { Request, Response } from 'express'
import passport from 'passport'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function authenticate(req: Request, res: Response, next: (...arg0: any) => void) {
    passport.authenticate('jwt', { session: false })(req, res, next)
}