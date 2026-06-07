import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'china-asean-platform-jwt-secret-key-2026'

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '24h' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}
