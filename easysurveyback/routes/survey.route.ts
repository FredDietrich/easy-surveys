/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, Router } from 'express'
import passport from 'passport'
import { Question } from '../entities/question.entity'
import { Survey } from '../entities/survey.entity'
import { ensureLoggedIn } from '../util/checkLogin.helper'

const surveyRouter = Router()

surveyRouter.get('/survey', passport.authenticate(['basic'], {session: true}), ensureLoggedIn, async (req: Request, res: Response) => {
    const survey = await Survey.findAll()
    res.status(200).json(survey)
})

surveyRouter.get('/survey/:id', ensureLoggedIn, async (req: Request<Record<string, any>, Record<string, never>, Survey>, res: Response) => {
    const survey = await Survey.findByPk(req.params.id)
    if(!survey) {
        res.status(404).send()
        return
    }
    res.status(200).json(survey)
})

surveyRouter.post('/survey', ensureLoggedIn, async (req: Request<Record<string, never>, Record<string, never>, Survey>, res: Response) => {
    const survey = await Survey.create({...req.body})
    if(survey) {
        res.status(201).location(`/survey/${survey.id}`).json(survey)
    }
})

surveyRouter.put('/survey/:id', ensureLoggedIn, async (req: Request<Record<string, any>, Record<string, never>, Survey>, res: Response) => {
    const foundSurvey = await Survey.findByPk(req.params.id)
    if(!foundSurvey) {
        res.status(404).send()
        return
    }
    await foundSurvey.update({...req.body})
    res.status(204).send()
})

surveyRouter.get('/survey/:id/question', ensureLoggedIn, async (req: Request<Record<string, any>, Record<string, never>, Question>, res: Response) => {
    const foundSurvey = await Survey.findByPk(req.params.id)
    if(!foundSurvey) {
        res.status(404).send()
        return
    }
    res.status(200).json(foundSurvey.questions)
})

surveyRouter.put('/survey/:id/question', ensureLoggedIn, async (req: Request<Record<string, any>, Record<string, never>, Question>, res: Response) => {
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

export default surveyRouter