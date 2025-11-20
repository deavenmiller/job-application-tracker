import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import JobApplication from '@/models/JobApplication';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const user = await getCurrentUserFromRequest(request);
    
    if (!user || !user._id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const job = await JobApplication.findOne({ 
      _id: params.id,
      userId: user._id 
    });
    
    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const user = await getCurrentUserFromRequest(request);
    
    if (!user || !user._id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    const body = await request.json();
    
    // Validate required fields
    if (body.company !== undefined && !body.company.trim()) {
      return NextResponse.json(
        { success: false, error: 'Company name is required' },
        { status: 400 }
      );
    }
    if (body.jobTitle !== undefined && !body.jobTitle.trim()) {
      return NextResponse.json(
        { success: false, error: 'Job title is required' },
        { status: 400 }
      );
    }
    
    // Convert dateApplied string to Date if provided
    const updateData = { ...body };
    if (updateData.dateApplied && typeof updateData.dateApplied === 'string') {
      updateData.dateApplied = new Date(updateData.dateApplied);
    }
    
    // Trim string fields
    if (updateData.company) updateData.company = updateData.company.trim();
    if (updateData.jobTitle) updateData.jobTitle = updateData.jobTitle.trim();
    if (updateData.jobLink) updateData.jobLink = updateData.jobLink.trim();
    if (updateData.payRange) updateData.payRange = updateData.payRange.trim();
    if (updateData.benefits) updateData.benefits = updateData.benefits.trim();
    if (updateData.jobDescription) updateData.jobDescription = updateData.jobDescription.trim();
    
    const job = await JobApplication.findOneAndUpdate(
      { _id: params.id, userId: user._id },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const user = await getCurrentUserFromRequest(request);
    
    if (!user || !user._id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    const job = await JobApplication.findOneAndDelete({ 
      _id: params.id,
      userId: user._id 
    });
    
    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

