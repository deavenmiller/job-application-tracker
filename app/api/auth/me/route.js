import { NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getCurrentUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      user: { 
        _id: user._id.toString(),
        username: user.username,
        firstName: user.firstName 
      } 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

