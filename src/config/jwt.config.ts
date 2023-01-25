import passport from 'passport'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { User } from '../models/user'
import { SECRET_KEY } from './constant.config'

// authentication Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY,
}

const jwtAuth = new JwtStrategy(jwtOptions, async (payload, done) => {
  const user = await User.findOne({ username: payload.data })
  if (user) done(null, true)
  else done(null, false)
})

passport.use(jwtAuth)

export const requireJWTAuth = passport.authenticate('jwt', { session: false })
