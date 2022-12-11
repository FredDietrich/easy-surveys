import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import { Alternative } from './alternative.entity'
import { Answer } from './answer.entity'
import { Survey } from './survey.entity'

export enum QuestionTypeEnum {
    MULTIPLE_ANSWER,
    FREE_TEXT,
    MULTIPLE_ANSWER_OTHER
}

@Table
export class Question extends Model {

    @Column
    declare title: string
    
    @Column
    declare type: QuestionTypeEnum

    @Column
    declare order: number

    @ForeignKey(() => Survey)
    @Column
    declare surveyId: number

    @BelongsTo(() => Survey)
    declare survey: Survey

    @HasMany(() => Alternative)
    declare alternatives: Alternative[]

    @HasMany(() => Answer)
    declare answers: Answer[]

}