import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // Support both 'next' and 'redirectTo' params for flexibility
  const rawRedirectTo = searchParams.get('next') ?? searchParams.get('redirectTo');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Get current user and ensure profile exists
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();
        
        // Create profile if it doesn't exist
        if (!existingProfile) {
          await supabase.from('profiles').insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
            role: 'user', // Default role
          });
        }
      }
      
      // Nếu có redirectTo, truyền qua redirect-handler để xử lý
      // Điều này giúp giữ lại URL đích khi đi qua Google OAuth
      if (rawRedirectTo && rawRedirectTo !== '/' && rawRedirectTo !== '/auth/redirect-handler') {
        const decodedRedirect = decodeURIComponent(rawRedirectTo);
        // Truyền redirectTo qua query params để redirect-handler có thể đọc được
        // (sessionStorage có thể bị mất khi qua Google OAuth)
        return NextResponse.redirect(`${origin}/auth/redirect-handler?redirectTo=${encodeURIComponent(decodedRedirect)}`);
      }
      
      // Nếu không có redirect cụ thể, về trang chủ
      return NextResponse.redirect(`${origin}/`);
    }
  }

  // Redirect to error page on failure
  return NextResponse.redirect(`${origin}/auth/error?message=Could not authenticate user`);
}
