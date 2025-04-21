import crypto from 'crypto'

export const users: { [email: string]: { passwordHash: string; sessions: { [token: string]: { createdAt: number } } } } = {}

export const hashPassword = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, 'salt', 64, (err, derivedKey) => {
      if (err) reject(err)
      resolve(derivedKey.toString('hex'))
    })
  })
}

export const verifyPassword = (password: string, passwordHash: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, 'salt', 64, (err, derivedKey) => {
      if (err) reject(err)
      resolve(derivedKey.toString('hex') === passwordHash)
    })
  })
}

export const createSession = (email: string): string => {
  const token = crypto.randomBytes(32).toString('hex')
  users[email].sessions[token] = { createdAt: Date.now() }
  return token
}

export const verifySession = (token: string): boolean => {
  return Object.values(users).some(user =>
    Object.keys(user.sessions).includes(token)
  )
}

export const getUserFromSession = (token: string): string | null => {
  for (const email in users) {
    if (users[email].sessions[token]) {
      return email
    }
  }
  return null
}

export const logout = (token: string): void => {
  for (const email in users) {
    if (users[email].sessions[token]) {
      delete users[email].sessions[token]
      break
    }
  }
}
