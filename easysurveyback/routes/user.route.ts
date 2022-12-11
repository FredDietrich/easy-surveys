/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, Router } from 'express'
import { User } from '../entities/user.entity'
import { Survey } from '../entities/survey.entity'
import { Answer } from '../entities/answer.entity'
const userRouter = Router()

userRouter.get('/user', async (req: Request, res: Response) => {
    const users = await User.findAll()
    res.status(200).json(users)
})

userRouter.get('/user/:id', async (req: Request<Record<string, any>, Record<string, never>, User>, res: Response) => {
    const foundUser = await User.findByPk(req.params.id)
    if(!foundUser) {
        res.status(404).send()
        return
    }
    res.status(200).json(foundUser)
})

userRouter.put('/user/:id', async (req: Request<Record<string, any>, Record<string, never>, User>, res: Response) => {
    const foundUser = await User.findByPk(req.params.id)
    if(!foundUser) {
        res.status(404).send()
        return
    }
    await foundUser.update({...req.body})
    res.status(204).send() 
})

userRouter.get('/user/:id/survey', async (req: Request<Record<string, any>, Record<string, never>, Record<string, never>>, res: Response) => {
    const foundUser = await User.findByPk(req.params.id, {include: Survey})
    if(!foundUser) {
        res.status(404).send()
        return
    }
    res.status(200).json(foundUser.surveys)
})

userRouter.put('/user/:id/survey', async (req: Request<Record<string, any>, Record<string, never>, Record<string, any>>, res: Response) => {
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

userRouter.put('/user/:id/answer', async (req: Request<Record<string, any>, Record<string, never>, Answer>, res: Response) => {
    const foundUser = await User.findByPk(req.params.id)
    if (!foundUser) {
        res.status(404).send()
        return
    }
    const foundAnswer = await Answer.findByPk(req.body.id)
    if (!foundAnswer) {
        res.status(404).send()
        return
    }
    await foundAnswer.update({ userId: foundUser.id })
    res.status(204).send()
})

export default userRouter