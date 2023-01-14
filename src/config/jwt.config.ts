import passport from 'passport'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { User } from '../models/user'
import { SECRET_KEY } from './constant.config'

// authentication Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY,
  passReqToCallback: true,
}
export const jwtAuth = new JwtStrategy(
  jwtOptions,
  async (req, payload, done) => {
    try {
      const user = await User.findOne({ username: payload.data })
      if (user) {
        req.user = user
        done(null, user)
      } else done(null, false)
    } catch (err) {
      done(err, false)
    }
  },
)
passport.use(jwtAuth)
export const requireJWTAuth = passport.authenticate('jwt', { session: false })
