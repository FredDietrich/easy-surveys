/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, Router } from 'express'
import { Alternative } from '../entities/alternative.entity'
import { Question } from '../entities/question.entity'
import { ensureLoggedIn, ensureNotLoggedIn } from '../util/checkLogin.helper'
const questionRouter = Router()

questionRouter.get('/question', ensureLoggedIn, async (req: Request, res: Response) => {
    const questions = await Question.findAll()
    res.status(200).json(questions)
})

questionRouter.get('/question/:id', ensureLoggedIn, async (req: Request<Record<string, any>, Record<string, never>, Question>, res: Response) => {
    const foundQuestion = await Question.findByPk(req.params.id)
    if(!foundQuestion) {
        res.status(404).send()
        return
    }
    res.status(200).json(foundQuestion)
})

questionRouter.post('/question', ensureNotLoggedIn, async (req: Request<Record<string, never>, Record<string, never>, Question>, res: Response) => {
    const question = await Question.create({...req.body})
    if(question) {
        res.status(201).location(`/question/${question.id}`).json(question)
        return
    }
    res.status(500).send()
})

questionRouter.put('/question/:id', ensureLoggedIn, async (req: Request<Record<string, any>, Record<string, never>, Question>, res: Response) => {
    const foundQuestion = await Question.findByPk(req.params.id)
    if(!foundQuestion) {
        res.status(404).send()
        return
    }
    await foundQuestion.update({...req.body})
    res.status(204).send() 
})

questionRouter.get('/question/:id/alternative', ensureLoggedIn, async (req: Request<Record<string, any>, Record<string, never>, Alternative>, res: Response) => {
    const foundQuestion = await Question.findByPk(req.params.id, {include: Alternative})
    if(!foundQuestion) {
        res.status(404).send()
        return
    }
    res.status(200).json(foundQuestion.alternatives)
})

questionRouter.put('/question/:id/alternative', ensureLoggedIn, async (req: Request<Record<string, any>, Record<string, never>, Alternative>, res: Response) => {
    const foundQuestion = await Question.findByPk(req.params.id)
    if(!foundQuestion) {
        res.status(404).send()
        return
    }
    const foundAlternative = await Alternative.findByPk(req.body.id)
    if(!foundAlternative) {
        res.status(404).send()
        return
    }
    await foundAlternative.update({questionId: foundQuestion.id})
    res.status(204).send() 
})

export default questionRouter