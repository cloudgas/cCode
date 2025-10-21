import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all progress for a job
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: progress, error } = await supabase
      .from('daily_progress')
      .select('*')
      .eq('job_id', id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching progress:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ progress }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST toggle daily progress
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { date, completed, notes } = body;

    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      );
    }

    // Check if progress entry exists for this date
    const { data: existing } = await supabase
      .from('daily_progress')
      .select('*')
      .eq('job_id', id)
      .eq('date', date)
      .single();

    let result;

    if (existing) {
      // Update existing entry
      const { data, error } = await supabase
        .from('daily_progress')
        .update({ completed, notes })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating progress:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      result = data;
    } else {
      // Create new entry
      const { data, error } = await supabase
        .from('daily_progress')
        .insert([{ job_id: id, date, completed, notes }])
        .select()
        .single();

      if (error) {
        console.error('Error creating progress:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      result = data;
    }

    return NextResponse.json({ progress: result }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
