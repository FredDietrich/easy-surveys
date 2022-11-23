import Question from "./question.model";

export default interface Survey {
    id: number,
    title: string,
    questions?: Question[]
}