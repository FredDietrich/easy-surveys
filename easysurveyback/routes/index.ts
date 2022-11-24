import alternativeRouter from './alternative.route'
import answerRouter from './answer.route'
import loginRouter from './login.route'
import questionRouter from './question.route'
import surveyRouter from './survey.route'
import userRouter from './user.route'

export const protectedRoutes = [alternativeRouter, answerRouter, questionRouter, surveyRouter]

export const openRoutes = [loginRouter, userRouter]