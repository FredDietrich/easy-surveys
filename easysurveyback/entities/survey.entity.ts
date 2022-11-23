import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import { Question } from './question.entity'
import { User } from './user.entity'

@Table
export class Survey extends Model {

    @Column
    declare name: string

    @Column
    declare description: string

    @Column
    declare bannerImgUrl: string

    @Column
    declare shortUid: string
    
    @ForeignKey(() => User)
    @Column
    declare userId: number

    @BelongsTo(() => User)
    declare user: User

    @HasMany(() => Question)
    declare questions: Question[]

}