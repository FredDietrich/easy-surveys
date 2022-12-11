/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, Router } from 'express'
import { Alternative } from '../entities/alternative.entity'
import { Answer } from '../entities/answer.entity'
import { Question } from '../entities/question.entity'
const questionRouter = Router()

questionRouter.get('/question', async (req: Request, res: Response) => {
    const questions = await Question.findAll()
    res.status(200).json(questions)
})

questionRouter.get('/question/:id', async (req: Request<Record<string, any>, Record<string, never>, Question>, res: Response) => {
    const foundQuestion = await Question.findByPk(req.params.id, { include: [Alternative, Answer] })
    if (!foundQuestion) {
        res.status(404).send()
        return
    }
    res.status(200).json(foundQuestion)
})

questionRouter.post('/question', async (req: Request<Record<string, never>, Record<string, never>, Question>, res: Response) => {
    const question = await Question.create({ ...req.body })
    if (question) {
        res.status(201).location(`/question/${question.id}`).json(question)
        return
    }
    res.status(500).send()
})

questionRouter.put('/question/:id', async (req: Request<Record<string, any>, Record<string, never>, Question>, res: Response) => {
    const foundQuestion = await Question.findByPk(req.params.id, { include: Alternative })
    if (!foundQuestion) {
        res.status(404).send()
        return
    }
    (req.body.alternatives ?? []).forEach(async alternative => {
        const foundAlternative = await Alternative.findByPk(alternative.id)
        if (!foundAlternative) return
        foundAlternative.update({ ...alternative })
    })
    if (req.body.alternatives.length < foundQuestion.alternatives.length) {
        const different = foundQuestion.alternatives.filter(foundAlternative => {
            return !req.body.alternatives.some(bodyAlternative => {
                return foundAlternative.id === bodyAlternative.id
            })
        })
        different.forEach(alternativeToBeDeleted => {
            alternativeToBeDeleted.destroy()
        })
    }
    await foundQuestion.update({ ...req.body })
    res.status(204).send()
})

questionRouter.get('/question/:id/alternative', async (req: Request<Record<string, any>, Record<string, never>, Alternative>, res: Response) => {
    const foundQuestion = await Question.findByPk(req.params.id, { include: Alternative })
    if (!foundQuestion) {
        res.status(404).send()
        return
    }
    res.status(200).json(foundQuestion.alternatives)
})

questionRouter.put('/question/:id/alternative', async (req: Request<Record<string, any>, Record<string, never>, Alternative>, res: Response) => {
    const foundQuestion = await Question.findByPk(req.params.id)
    if (!foundQuestion) {
        res.status(404).send()
        return
    }
    const foundAlternative = await Alternative.findByPk(req.body.id)
    if (!foundAlternative) {
        res.status(404).send()
        return
    }
    await foundAlternative.update({ questionId: foundQuestion.id })
    res.status(204).send()
})

questionRouter.get('/question/:id/answer', async (req: Request<Record<string, any>, Record<string, never>, never>, res: Response) => {
    const foundQuestion = await Question.findByPk(req.params.id)
    if (!foundQuestion) {
        res.status(404).send()
        return
    }
    const foundAnswers = await Answer.findAll({where: {questionId: foundQuestion.id, userId: req.query.userId}})
    if (!foundAnswers) {
        res.status(404).send()
        return
    }
    return res.status(200).json(foundAnswers[0])
    
})

questionRouter.put('/question/:id/answer', async (req: Request<Record<string, any>, Record<string, never>, Answer>, res: Response) => {
    const foundQuestion = await Question.findByPk(req.params.id)
    if (!foundQuestion) {
        res.status(404).send()
        return
    }
    const foundAnswer = await Answer.findByPk(req.body.id)
    if (!foundAnswer) {
        res.status(404).send()
        return
    }
    await foundAnswer.update({ questionId: foundQuestion.id })
    res.status(204).send()
})

export default questionRouter