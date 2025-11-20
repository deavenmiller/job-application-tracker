import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear cookies
  response.cookies.delete('username');
  response.cookies.delete('firstName');
  
  return response;
}

