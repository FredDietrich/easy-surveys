import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Alternative } from './alternative.entity'
import { Question } from './question.entity'
import { User } from './user.entity'

@Table
export class Answer extends Model {

    @Column
    declare value: string

    @ForeignKey(() => Alternative)
    @Column
    declare alternativeId: number

    @BelongsTo(() => Alternative, {
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    })
    declare alternative: Alternative

    @ForeignKey(() => Question)
    @Column
    declare questionId: number

    @BelongsTo(() => Question, {
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    })
    declare question: Question

    @ForeignKey(() => User)
    @Column
    declare userId: number

    @BelongsTo(() => User, {
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    })
    declare user: User

}