import passport from 'passport';
import { User } from '../models';
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;

export type User = {
  id: number;
  email: string;
}
export type JwtPayload = User & {
  iat: number;
  sub: string;
}
require('dotenv').config();

// authentication Strategy
const jwtOptions = {
   jwtFromRequest: ExtractJwt.fromHeader("authorization"),
   secretOrKey: process.env.SECRET_KEY,
}
export const jwtAuth = new JwtStrategy(jwtOptions, async (payload: JwtPayload, done: (arg0: null, arg1: boolean) => void) => {
  const user = await User.findOne({ username: payload.sub });
  if(user) done(null, true);
  else done(null, false);
});
passport.use(jwtAuth);
export const requireJWTAuth = passport.authenticate("jwt",{session:false});