import Answer from "./answer.model"
import Survey from "./survey.model"

export interface User {
    id: number

    username: string

    email: string

    password: string

    name: string

    roles: string

    surveys: Survey[]

    answers: Answer[]
}