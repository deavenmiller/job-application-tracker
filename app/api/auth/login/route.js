import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, firstName } = body;

    if (!username || !firstName) {
      return NextResponse.json(
        { success: false, error: 'Username and first name are required' },
        { status: 400 }
      );
    }

    const result = await authenticateUser(username.trim(), firstName.trim());

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ 
      success: true, 
      user: { 
        _id: result.user._id.toString(),
        username: result.user.username,
        firstName: result.user.firstName 
      } 
    });

    // Set cookies
    response.cookies.set('username', result.user.username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    response.cookies.set('firstName', result.user.firstName, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

