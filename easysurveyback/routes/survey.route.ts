/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, Router } from 'express'
import { Alternative } from '../entities/alternative.entity'
import { Question } from '../entities/question.entity'
import { Survey } from '../entities/survey.entity'

const surveyRouter = Router()

surveyRouter.get('/survey', async (req: Request, res: Response) => {
    const survey = await Survey.findAll()
    res.status(200).json(survey)
})

surveyRouter.get('/survey/:id', async (req: Request<Record<string, any>, Record<string, never>, Survey>, res: Response) => {
    const survey = await Survey.findByPk(req.params.id, {include: [{
        model: Question,
        include: [Alternative]
    }]})
    if(!survey) {
        res.status(404).send()
        return
    }
    res.status(200).json(survey)
})

surveyRouter.post('/survey', async (req: Request<Record<string, never>, Record<string, never>, Survey>, res: Response) => {
    const survey = await Survey.create({...req.body})
    if(survey) {
        res.status(201).location(`/survey/${survey.id}`).json(survey)
    }
})

surveyRouter.put('/survey/:id', async (req: Request<Record<string, any>, Record<string, never>, Survey>, res: Response) => {
    const foundSurvey = await Survey.findByPk(req.params.id, {include: [Question]})
    if(!foundSurvey) {
        res.status(404).send()
        return
    }
    if (req.body.questions.length < foundSurvey?.questions.length) {
        const different = foundSurvey.questions.filter(foundQuestion => {
            return !req.body.questions.some(bodyQuestion => {
                return foundQuestion.id === bodyQuestion.id
            })
        })
        await Promise.all(different.map(async questionToBeDeleted => {
            questionToBeDeleted.destroy()
        }))
    }
    await foundSurvey.update({...req.body})
    res.status(204).send()
})

surveyRouter.get('/survey/:id/question', async (req: Request<Record<string, any>, Record<string, never>, Question>, res: Response) => {
    const foundSurvey = await Survey.findByPk(req.params.id, {include: Question})
    if(!foundSurvey) {
        res.status(404).send()
        return
    }
    res.status(200).json(foundSurvey.questions)
})

surveyRouter.put('/survey/:id/question', async (req: Request<Record<string, any>, Record<string, never>, Question>, res: Response) => {
    const foundSurvey = await Survey.findByPk(req.params.id)
    if(!foundSurvey) {
        res.status(404).send()
        return
    }
    const foundQuestion = await Question.findByPk(req.body.id)
    if(!foundQuestion) {
        res.status(404).send()
        return
    }
    await foundQuestion.update({surveyId: foundSurvey.id})
    res.status(204).send() 
})

surveyRouter.get('/survey/:id/alternativeResults', async (req: Request, res: Response) => {
    const foundSurvey = await Survey.findByPk(req.params.id)
    if(!foundSurvey) {
        res.status(404).send()
        return
    }
    const results = await Survey.sequelize?.query('select sl2.* from "Answers" a inner join "Questions" q on q.id = a."questionId" join (select value, count(*) from "Answers" group by value) sl2 on sl2.value = a.value where q.type = 1 group by sl2.value, sl2.count')
    if (!results) {
        return res.status(404).send()
    }
    return res.status(200).send(results[0])
})

export default surveyRouter