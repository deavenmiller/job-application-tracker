import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import JobApplication from '@/models/JobApplication';
import { parseJobDescription } from '@/lib/job-parser';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    const user = await getCurrentUserFromRequest(request);
    
    if (!user || !user._id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const jobs = await JobApplication.find({ userId: user._id }).sort({ dateApplied: -1 });
    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const user = await getCurrentUserFromRequest(request);
    
    if (!user || !user._id) {
      console.error('POST /api/jobs - No user found. Cookies:', request.headers.get('cookie'));
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    console.log('POST /api/jobs - User ID:', user._id.toString());

    const body = await request.json();
    const { jobDescription, ...manualFields } = body;

    let parsedData = {};
    if (jobDescription) {
      parsedData = parseJobDescription(jobDescription);
    }

    // Merge manual fields with parsed data (manual fields take precedence)
    const company = manualFields.company || parsedData.company || '';
    const jobTitle = manualFields.jobTitle || parsedData.jobTitle || '';

    // Validate required fields
    if (!company.trim()) {
      return NextResponse.json(
        { success: false, error: 'Company name is required' },
        { status: 400 }
      );
    }
    if (!jobTitle.trim()) {
      return NextResponse.json(
        { success: false, error: 'Job title is required' },
        { status: 400 }
      );
    }

    // Ensure userId is a valid ObjectId
    const userId = user._id;
    if (!userId) {
      console.error('POST /api/jobs - User ID is missing');
      return NextResponse.json(
        { success: false, error: 'Invalid user session' },
        { status: 401 }
      );
    }

    // Ensure userId is a proper Mongoose ObjectId
    let userIdObjectId;
    if (userId instanceof mongoose.Types.ObjectId) {
      userIdObjectId = userId;
    } else if (typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId)) {
      userIdObjectId = new mongoose.Types.ObjectId(userId);
    } else {
      console.error('POST /api/jobs - Invalid userId format:', userId, typeof userId);
      return NextResponse.json(
        { success: false, error: 'Invalid user ID format' },
        { status: 401 }
      );
    }

    const jobData = {
      userId: userIdObjectId,
      company: company.trim(),
      jobTitle: jobTitle.trim(),
      status: manualFields.status || 'Applied',
      jobLink: (manualFields.jobLink || parsedData.jobLink || '').trim(),
      payRange: (manualFields.payRange || parsedData.payRange || '').trim(),
      benefits: (manualFields.benefits || parsedData.benefits || '').trim(),
      employmentType: manualFields.employmentType || parsedData.employmentType || 'Full-time',
      remote: manualFields.remote || parsedData.remote || 'No',
      dateApplied: manualFields.dateApplied 
        ? (() => {
            // Parse date string as local date to avoid timezone conversion
            const dateStr = manualFields.dateApplied;
            if (dateStr.includes('T')) {
              // Already has time component
              return new Date(dateStr);
            }
            // Date input gives YYYY-MM-DD, parse as local date
            const [year, month, day] = dateStr.split('-').map(Number);
            return new Date(year, month - 1, day); // month is 0-indexed
          })()
        : new Date(),
      jobDescription: (jobDescription || '').trim(),
    };

    console.log('POST /api/jobs - Job data before create:', { 
      userId: userIdObjectId.toString(), 
      userIdType: typeof userIdObjectId,
      userIdIsObjectId: userIdObjectId instanceof mongoose.Types.ObjectId,
      company: jobData.company,
      jobTitle: jobData.jobTitle,
      fullJobData: JSON.stringify(jobData, null, 2)
    });

    console.log('POST /api/jobs - About to create job with userId:', jobData.userId);
    console.log('POST /api/jobs - jobData.userId type:', typeof jobData.userId, 'isObjectId:', jobData.userId instanceof mongoose.Types.ObjectId);
    
    // Create the job
    const job = await JobApplication.create(jobData);
    console.log('POST /api/jobs - Job created, _id:', job._id.toString());
    console.log('POST /api/jobs - Job object after create:', {
      _id: job._id.toString(),
      userId: job.userId?.toString(),
      userIdType: typeof job.userId,
      hasUserId: 'userId' in job,
      toObject: job.toObject ? job.toObject() : 'no toObject method'
    });
    
    // Verify userId was saved - query directly from database without lean first
    const savedJobDoc = await JobApplication.findById(job._id);
    console.log('POST /api/jobs - Saved job document:', {
      _id: savedJobDoc._id.toString(),
      userId: savedJobDoc.userId?.toString(),
      userIdType: typeof savedJobDoc.userId,
      toObject: savedJobDoc.toObject()
    });
    
    // Also check with lean
    const savedJob = await JobApplication.findById(job._id).lean();
    console.log('POST /api/jobs - Job created and verified (raw):', savedJob);
    console.log('POST /api/jobs - Job created and verified:', { 
      _id: savedJob._id.toString(), 
      userId: savedJob.userId?.toString(),
      userIdType: typeof savedJob.userId,
      allFields: Object.keys(savedJob)
    });
    
    if (!savedJob.userId) {
      console.error('POST /api/jobs - CRITICAL: userId was not saved to database!');
      console.error('Full job object:', JSON.stringify(savedJob, null, 2));
      // Delete the job if userId wasn't saved
      await JobApplication.findByIdAndDelete(job._id);
      return NextResponse.json(
        { success: false, error: 'Failed to save user association. Please try again.' },
        { status: 500 }
      );
    }
    
    // Convert back to Mongoose document for proper serialization
    const jobDoc = await JobApplication.findById(job._id);
    return NextResponse.json({ success: true, data: jobDoc }, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

