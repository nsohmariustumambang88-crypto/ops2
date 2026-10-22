import jwt from 'jsonwebtoken';

export type TokenUser = { id: string; email?: string; role: string };

export function getTokenUser(request: Request): TokenUser | null {
  const header = request.headers.get('authorization');
  const token = header?.split(' ')[1];
  if (!token || !process.env.JWT_SECRET) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET) as TokenUser;
  } catch {
    return null;
  }
}

export function requireUser(request: Request, roles?: string[]) {
  const user = getTokenUser(request);
  if (!user) return { error: 'Invalid token', status: 401 } as const;
  if (roles && !roles.includes(user.role)) return { error: 'Access denied', status: 403 } as const;
  return { user } as const;
}

export function signToken(user: { id: string; email: string; role: string }) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: (process.env.JWT_EXPIRY || '7d') as jwt.SignOptions['expiresIn'] }
  );
}
