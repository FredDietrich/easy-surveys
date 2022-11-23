/* eslint-disable @typescript-eslint/no-explicit-any */
import { PassportStatic } from 'passport'
import { User } from '../entities/user.entity'
import { compare } from 'bcrypt'
import { Strategy } from 'passport-local'
import { BasicStrategy } from 'passport-http'
export function initializePassport(passport: PassportStatic) {
    async function authenticateUser(username: string, password: string, done: (arg0: null, arg1: boolean | User) => void) {
        const foundUsers = await User.findAll(
            {
                where: {
                    username: username
                }
            }
        )
        if(foundUsers.length < 1) {
            return done(null, false)
        }
        const user = foundUsers[0]
        try {
            if(await compare(password, user.password)) {
                return done(null, user)
            }
            return done(null, false)
        } catch (e) {
            console.error(e)
        }
    }

    passport.use(new Strategy(authenticateUser))

    passport.use(new BasicStrategy(authenticateUser))

    passport.serializeUser((user: any, done: (err: unknown, id?: number | undefined) => void) => {
        return done(null, user.id)    
    })
    
    passport.deserializeUser(async (id: any, done: (err: unknown, user?: false | Express.User | null | undefined) => void) => {
        const user = await User.findByPk(id)
        done(null, user)
    })
}