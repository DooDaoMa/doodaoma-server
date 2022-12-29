import passport from 'passport'
import { User } from '../models'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import dotenv from 'dotenv'

dotenv.config()

export type User = {
  id: number
  email: string
}
export type JwtPayload = User & {
  iat: number
  sub: string
}

// authentication Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.SECRET_KEY,
}
export const jwtAuth = new JwtStrategy(
  jwtOptions,
  async (payload: JwtPayload, done: (arg0: null, arg1: boolean) => void) => {
    const user = await User.findOne({ username: payload.sub })
    if (user) done(null, true)
    else done(null, false)
  },
)
passport.use(jwtAuth)
export const requireJWTAuth = passport.authenticate('jwt', { session: false })
