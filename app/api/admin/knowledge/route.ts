import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Lấy danh sách tất cả tài liệu
export async function GET(request: NextRequest) {
  try {
    console.log('[v0] GET /api/admin/knowledge - Starting request');
    const supabase = await createClient();
    console.log('[v0] Supabase client created successfully');

    // Check admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('[v0] Auth error:', authError);
      return NextResponse.json({ error: 'Auth failed' }, { status: 401 });
    }
    if (!user) {
      console.log('[v0] No user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('[v0] User authenticated:', user.id);

    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('[v0] Error fetching user profile:', profileError);
      return NextResponse.json({ error: 'Profile fetch failed' }, { status: 500 });
    }

    if (userProfile?.role !== 'admin') {
      console.log('[v0] User is not admin:', userProfile?.role);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.log('[v0] User is admin, fetching documents...');

    // Fetch all documents
    const { data, error } = await supabase
      .from('knowledge_documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[v0] Database error fetching documents:', error);
      throw error;
    }

    console.log('[v0] Successfully fetched', data?.length || 0, 'documents');
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('[v0] Error fetching knowledge documents:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch documents',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST - Tạo tài liệu mới
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, category, subcategory, tags } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert document
    const { data, error } = await supabase
      .from('knowledge_documents')
      .insert({
        title,
        content,
        category,
        subcategory: subcategory || null,
        tags: tags || [],
        upload_by: user.id,
        is_active: true,
        relevance_score: 0,
      })
      .select()
      .single();

    if (error) throw error;

    // TODO: Queue embedding generation in background
    // await fetch('/api/admin/knowledge/generate-embeddings', {
    //   method: 'POST',
    //   body: JSON.stringify({ documentId: data.id }),
    // });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('[v0] Error creating knowledge document:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
