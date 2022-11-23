import { Column, HasMany, Model, Table } from 'sequelize-typescript'
import { Answer } from './answer.entity'
import { Survey } from './survey.entity'

@Table
export class User extends Model {

    @Column
    declare username: string

    @Column
    declare email: string

    @Column
    declare password: string

    @Column
    declare name: string

    @Column
    declare roles: string

    @HasMany(() => Survey)
    declare surveys: Survey[]

    @HasMany(() => Answer)
    declare answers: Answer[]

}