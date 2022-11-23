import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Alternative } from './alternative.entity'
import { User } from './user.entity'

@Table
export class Answer extends Model {

    @Column
    declare value: string

    @ForeignKey(() => Alternative)
    @Column
    declare alternativeId: number

    @BelongsTo(() => Alternative)
    declare alternative: Alternative

    @ForeignKey(() => User)
    @Column
    declare userId: number

    @BelongsTo(() => User)
    declare user: User

}