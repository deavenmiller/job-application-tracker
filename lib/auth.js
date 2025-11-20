import { cookies } from 'next/headers';
import connectDB from './mongodb';
import User from '@/models/User';

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const username = cookieStore.get('username')?.value;
    const firstName = cookieStore.get('firstName')?.value;

    if (!username || !firstName) {
      return null;
    }

    await connectDB();
    const user = await User.findOne({ 
      username: username.toLowerCase(),
      firstName: firstName 
    });

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function getCurrentUserFromRequest(request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      console.log('getCurrentUserFromRequest: No cookie header');
      return null;
    }

    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map(cookie => {
        const [key, ...rest] = cookie.split('=');
        return [key, rest.join('=')];
      })
    );

    const username = cookies.username;
    const firstName = cookies.firstName;

    if (!username || !firstName) {
      console.log('getCurrentUserFromRequest: Missing username or firstName in cookies', { username: !!username, firstName: !!firstName });
      return null;
    }

    await connectDB();
    const decodedUsername = decodeURIComponent(username).toLowerCase();
    const decodedFirstName = decodeURIComponent(firstName);
    
    console.log('getCurrentUserFromRequest: Looking for user', { username: decodedUsername, firstName: decodedFirstName });
    
    const user = await User.findOne({ 
      username: decodedUsername,
      firstName: decodedFirstName
    });

    if (!user) {
      console.log('getCurrentUserFromRequest: User not found');
    } else {
      console.log('getCurrentUserFromRequest: User found', { _id: user._id.toString() });
    }

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function authenticateUser(username, firstName) {
  try {
    await connectDB();
    const user = await User.findOne({ 
      username: username.toLowerCase(),
      firstName: firstName 
    });

    if (!user) {
      return { success: false, error: 'Invalid username or first name' };
    }

    return { success: true, user };
  } catch (error) {
    console.error('Error authenticating user:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

export async function createUser(username, firstName) {
  try {
    await connectDB();
    
    // Check if user already exists
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return { success: false, error: 'Username already exists' };
    }

    const user = await User.create({
      username: username.toLowerCase(),
      firstName: firstName,
    });

    return { success: true, user };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message || 'Failed to create user' };
  }
}

