import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password, first_name, last_name, business_name } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const exists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userResult = await db.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [email, passwordHash, first_name, last_name, 'customer']
    );
    const userId = userResult.rows[0].id;

    await db.query('INSERT INTO customers (user_id, business_name) VALUES ($1, $2)', [
      userId,
      business_name || '',
    ]);

    const token = signToken({ id: userId, email, role: 'customer' });
    return NextResponse.json(
      {
        message: 'Registration successful',
        token,
        user: { id: userId, email, first_name, last_name },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
