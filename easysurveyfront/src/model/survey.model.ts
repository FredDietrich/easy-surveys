import Question from "./question.model";
import { User } from "./user.model";

export default interface Survey {
    name: string

    description: string

    bannerImgUrl: string

    shortUid: string
    
    userId: number

    user: User

    questions: Question[]
}