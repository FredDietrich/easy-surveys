import { Sequelize } from 'sequelize-typescript'

import dotenv from 'dotenv'
import entities from '../entities'

dotenv.config()

export default async function initializeSequelize() {
    const sequelize = new Sequelize({
        database: 'surveyapp',
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        username: process.env.PSQL_USER,
        password: process.env.PSQL_PASS,
    })

    sequelize.addModels(entities)

    return sequelize.sync()
}
