/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, Router } from 'express'
import { Alternative } from '../entities/alternative.entity'
import { Answer } from '../entities/answer.entity'
import { ensureLoggedIn, ensureNotLoggedIn } from '../util/checkLogin.helper'
const alternativeRouter = Router()

alternativeRouter.get('/alternative', ensureLoggedIn, async (req: Request, res: Response) => {
    const alternatives = await Alternative.findAll()
    res.status(200).json(alternatives)
})

alternativeRouter.get('/alternative/:id', ensureLoggedIn, async (req: Request<Record<string, any>, Record<string, never>, Alternative>, res: Response) => {
    const foundAlternative = await Alternative.findByPk(req.params.id)
    if(!foundAlternative) {
        res.status(404).send()
        return
    }
    res.status(200).json(foundAlternative)
})

alternativeRouter.post('/alternative', ensureNotLoggedIn, async (req: Request<Record<string, never>, Record<string, never>, Alternative>, res: Response) => {
    const alternative = await Alternative.create({...req.body})
    if(alternative) {
        res.status(201).location(`/alternative/${alternative.id}`).json(alternative)
        return
    }
    res.status(500).send()
})

alternativeRouter.put('/alternative/:id', ensureLoggedIn, async (req: Request<Record<string, any>, Record<string, never>, Alternative>, res: Response) => {
    const foundAlternative = await Alternative.findByPk(req.params.id)
    if(!foundAlternative) {
        res.status(404).send()
        return
    }
    await foundAlternative.update({...req.body})
    res.status(204).send() 
})

alternativeRouter.get('/alternative/:id/answer', ensureLoggedIn, async (req: Request<Record<string, any>, Record<string, never>, Answer>, res: Response) => {
    const foundAlternative = await Alternative.findByPk(req.params.id)
    if(!foundAlternative) {
        res.status(404).send()
        return
    }
    res.status(200).json(foundAlternative.answers)
})

alternativeRouter.put('/alternative/:id/answer', ensureLoggedIn, async (req: Request<Record<string, any>, Record<string, never>, Answer>, res: Response) => {
    const foundAlternative = await Alternative.findByPk(req.params.id)
    if(!foundAlternative) {
        res.status(404).send()
        return
    }
    const foundAnswer = await Answer.findByPk(req.body.id)
    if(!foundAnswer) {
        res.status(404).send()
        return
    }
    await foundAnswer.update({alternativeId: foundAlternative.id})
    res.status(204).send() 
})

export default alternativeRouter