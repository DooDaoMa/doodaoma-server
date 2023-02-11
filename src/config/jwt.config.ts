import passport from 'passport'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { User } from '../models/user'
import { SECRET_KEY } from './constant.config'

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY,
}
export const jwtAuth = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findOne({ username: payload.data })
    if (user) {
      return done(null, user)
    } else return done(null, false)
  } catch (err) {
    return done(err, false)
  }
})

passport.use(jwtAuth)

export const requireJWTAuth = passport.authenticate('jwt', { session: false })
