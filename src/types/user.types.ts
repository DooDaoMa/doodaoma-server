export interface IUser {
  username: string
  email: string
  hash?: string
  salt?: string
}

export interface IUserMethods {
  validPassword: (arg0: string) => boolean
  setPassword: (arg0: string) => void
}
