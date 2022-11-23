/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, Router } from 'express'
import { User } from '../entities/user.entity'
import { hash } from 'bcrypt' 
import { ensureLoggedIn, ensureNotLoggedIn } from '../util/checkLogin.helper'
import { Survey } from '../entities/survey.entity'
const userRouter = Router()

userRouter.get('/user', ensureLoggedIn, async (req: Request, res: Response) => {
    const users = await User.findAll()
    res.status(200).json(users)
})

userRouter.get('/user/:id', ensureLoggedIn, async (req: Request<Record<string, any>, Record<string, never>, User>, res: Response) => {
    const foundUser = await User.findByPk(req.params.id)
    if(!foundUser) {
        res.status(404).send()
        return
    }
    res.status(200).json(foundUser)
})

userRouter.post('/user', ensureNotLoggedIn, async (req: Request<Record<string, never>, Record<string, never>, User>, res: Response) => {
    let user = User.build({...req.body})
    user.password = await hash(user.password, 10)
    if(user) {
        user = await user.save()
        res.status(201).location(`/user/${user.id}`).json(user)
        return
    }
    res.status(500).send()
})

userRouter.put('/user/:id', ensureLoggedIn, async (req: Request<Record<string, any>, Record<string, never>, User>, res: Response) => {
    const foundUser = await User.findByPk(req.params.id)
    if(!foundUser) {
        res.status(404).send()
        return
    }
    await foundUser.update({...req.body})
    res.status(204).send() 
})

userRouter.get('/user/:id/survey', ensureLoggedIn, async (req: Request<Record<string, any>, Record<string, never>, Record<string, never>>, res: Response) => {
    const foundUser = await User.findByPk(req.params.id, {include: Survey})
    if(!foundUser) {
        res.status(404).send()
        return
    }
    res.status(200).json(foundUser.surveys)
})

userRouter.put('/user/:id/survey', ensureLoggedIn, async (req: Request<Record<string, any>, Record<string, never>, Record<string, any>>, res: Response) => {
    const foundUser = await User.findByPk(req.params.id)
    if(!foundUser) {
        res.status(404).send()
        return
    }
    const foundSurvey = await Survey.findByPk(req.body.id)
    if(!foundSurvey) {
        res.status(404).send()
        return
    }
    await foundSurvey.update({userId: foundUser.id})
    res.status(204).send() 
})

export default userRouter