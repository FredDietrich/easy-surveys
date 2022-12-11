import Alternative from "./alternative.model";
import Answer from "./answer.model";
import Survey from "./survey.model";

export default interface Question {
    
    id: number

    title: string
    
    type: QuestionTypeEnum

    order: number

    surveyId: number

    survey: Survey

    alternatives: Alternative[]

    answers: Answer[]
}

export enum QuestionTypeEnum {
    FREE_TEXT,
    MULTIPLE_ANSWER,
    MULTIPLE_ANSWER_OTHER
}