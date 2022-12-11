import Question from "./question.model";
import { User } from "./user.model";

export default interface Survey {
    id: number

    name: string

    description: string

    bannerImgUrl: string

    shortUid: string
    
    userId: number

    user: User

    questions: Question[]
}