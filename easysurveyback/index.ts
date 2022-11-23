import express from 'express'
import dotenv from 'dotenv'
import initializeSequelize from './database/databaseConfig'
import routes from './routes'
import session from 'express-session'
import passport from 'passport'
import { initializePassport } from './authentication/passport.config'
import cors from 'cors'

dotenv.config()

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(session(
    {
        secret: process.env.SESSION_SECRET ?? 'chavesupersecreta',
        resave: false,
        saveUninitialized: false,
        cookie: {
            domain: 'localhost:5173',
            sameSite: 'none',
            httpOnly: true
        }
    }
))
app.use(passport.initialize())
app.use(passport.session())
app.use(cors({
    credentials: true
}))
app.use('/api', ...routes)

initializeSequelize().then(() => {
    console.log('⚡️[backend]: Sequelize synced')
})

initializePassport(passport)

app.listen(port, () => {
    console.log(`⚡️[backend]: Server running on http://localhost:${port}`)
})