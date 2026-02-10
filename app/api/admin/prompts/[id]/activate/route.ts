import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Call the database function to activate this version
    const { error } = await supabase.rpc('activate_prompt_version', {
      prompt_id: id
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error activating prompt:', error);
    return NextResponse.json({ error: 'Failed to activate prompt' }, { status: 500 });
  }
}
