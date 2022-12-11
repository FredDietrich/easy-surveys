import Alternative from "./alternative.model"
import { User } from "./user.model"

export default interface Answer {
    id: number
    
    value: string

    alternativeId: number

    alternative: Alternative

    userId: number

    user: User
}