import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import { Answer } from './answer.entity'
import { Question } from './question.entity'

@Table
export class Alternative extends Model {

    @Column
    declare name: string

    @ForeignKey(() => Question)
    @Column
    declare questionId: number

    @BelongsTo(() => Question)
    declare question: Question

    @HasMany(() => Answer)
    declare answers: Answer[]

}