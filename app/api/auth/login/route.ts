import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock user for demo (replace with database query)
const DEMO_USER = {
  id: '1',
  email: 'admin@demo.com',
  password: 'demo123456',
  name: 'Admin User',
  role: 'super-admin',
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Demo authentication (replace with database query using Prisma)
    // const user = await prisma.user.findUnique({ where: { email } });
    if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: DEMO_USER.id,
        email: DEMO_USER.email,
        role: DEMO_USER.role,
      },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '7d' }
    );

    // Return response with token
    return NextResponse.json(
      {
        token,
        user: {
          id: DEMO_USER.id,
          email: DEMO_USER.email,
          name: DEMO_USER.name,
          role: DEMO_USER.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
