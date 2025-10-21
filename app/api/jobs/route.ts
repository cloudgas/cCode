import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { CreateJobInput } from '@/types';

// GET all jobs
export async function GET() {
  try {
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new job
export async function POST(request: NextRequest) {
  try {
    const body: CreateJobInput = await request.json();

    const { title, description, client_name, amount } = body;

    // Validate required fields
    if (!title || !client_name || amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: title, client_name, amount' },
        { status: 400 }
      );
    }

    const { data: job, error } = await supabase
      .from('jobs')
      .insert([
        {
          title,
          description: description || '',
          client_name,
          amount,
          is_paid: false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating job:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
