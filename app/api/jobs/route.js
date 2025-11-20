import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import JobApplication from '@/models/JobApplication';
import { parseJobDescription } from '@/lib/job-parser';

export async function GET() {
  try {
    await connectDB();
    const jobs = await JobApplication.find({}).sort({ dateApplied: -1 });
    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
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

    const jobData = {
      company: company.trim(),
      jobTitle: jobTitle.trim(),
      status: manualFields.status || 'Applied',
      jobLink: (manualFields.jobLink || parsedData.jobLink || '').trim(),
      payRange: (manualFields.payRange || parsedData.payRange || '').trim(),
      benefits: (manualFields.benefits || parsedData.benefits || '').trim(),
      employmentType: manualFields.employmentType || parsedData.employmentType || 'Full-time',
      dateApplied: manualFields.dateApplied ? new Date(manualFields.dateApplied) : new Date(),
      jobDescription: (jobDescription || '').trim(),
    };

    const job = await JobApplication.create(jobData);
    return NextResponse.json({ success: true, data: job }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

