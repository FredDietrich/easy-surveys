/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, Router } from 'express'
import { Answer } from '../entities/answer.entity'
import { ensureLoggedIn, ensureNotLoggedIn } from '../util/checkLogin.helper'
const answerRouter = Router()

answerRouter.get('/answer', ensureLoggedIn, async (req: Request, res: Response) => {
    const answers = await Answer.findAll()
    res.status(200).json(answers)
})

answerRouter.get('/answer/:id', ensureLoggedIn, async (req: Request<Record<string, any>, Record<string, never>, Answer>, res: Response) => {
    const foundAnswers = await Answer.findByPk(req.params.id)
    if(!foundAnswers) {
        res.status(404).send()
        return
    }
    res.status(200).json(foundAnswers)
})

answerRouter.post('/answer', ensureNotLoggedIn, async (req: Request<Record<string, never>, Record<string, never>, Answer>, res: Response) => {
    const answer = await Answer.create({...req.body})
    if(answer) {
        res.status(201).location(`/answer/${answer.id}`).json(answer)
        return
    }
    res.status(500).send()
})

answerRouter.put('/answer/:id', ensureLoggedIn, async (req: Request<Record<string, any>, Record<string, never>, Answer>, res: Response) => {
    const foundAnswer = await Answer.findByPk(req.params.id)
    if(!foundAnswer) {
        res.status(404).send()
        return
    }
    await foundAnswer.update({...req.body})
    res.status(204).send() 
})

export default answerRouter