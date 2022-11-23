import { Request, Response } from 'express'

export function ensureLoggedIn(req: Request, res: Response, next: () => void) {
    if(req.isAuthenticated()) {
        return next()
    }
    res.status(401).send()
}

export function ensureNotLoggedIn(req: Request, res: Response, next: () => void) {
    if(req.isUnauthenticated()) {
        return next()
    }
    res.status(401).send()
}