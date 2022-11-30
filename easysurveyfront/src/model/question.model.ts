import Alternative from "./alternative.model";
import Survey from "./survey.model";

export default interface Question {
    
    id: number

    title: string
    
    type: QuestionTypeEnum

    order: number

    surveyId: number

    survey: Survey

    alternatives: Alternative[]
}

export enum QuestionTypeEnum {
    MULTIPLE_ANSWER,
    FREE_TEXT,
    MULTIPLE_ANSWER_OTHER
}