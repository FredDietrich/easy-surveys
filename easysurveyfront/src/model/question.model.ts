import Alternative from "./alternative.model";

export default interface Question {
    id: number,
    title: string,
    type: QuestionType,
    alternatives?: Alternative[]
}

export enum QuestionType {
    MULTIPLE_ANSWER,
    TEXT,
    MULTIPLE_ANSWER_OTHER
}