'use client';

import { AccordionContent } from "@/components/ui/accordion"
import { AccordionTrigger } from "@/components/ui/accordion"
import { AccordionItem } from "@/components/ui/accordion"
import { Accordion } from "@/components/ui/accordion"
import Link from "next/link"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { calculateMaiHua } from '@/lib/utils/maihua-engine';
import { CHI_NAMES } from '@/lib/utils/lunar-calendar';
import { performDiagnosis, type DiagnosticResult } from '@/lib/utils/diagnostic-engine';
import type { MaiHuaResult } from '@/lib/utils/maihua-engine';
import Header from '@/components/Header';
import LoginModal from '@/components/LoginModal';
import { createClient } from '@/lib/supabase/client';
import { Loader2, BookOpen, ArrowRight, AlertCircle, Info } from 'lucide-react';
import { checkGuestRateLimit } from '@/lib/utils/rate-limit';

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();
  
  // Use fixed initial values to avoid hydration mismatch
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2026);
  const [hour, setHour] = useState(12);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Auth and rate limit state
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [queriesRemaining, setQueriesRemaining] = useState<number | null>(null);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Set actual date after hydration
  useEffect(() => {
    const now = new Date();
    setDay(now.getDate());
    setMonth(now.getMonth() + 1);
    setYear(now.getFullYear());
    setHour(now.getHours());
    setIsHydrated(true);
  }, []);

  // Check auth and rate limit on mount, and listen for auth changes
  useEffect(() => {
    let isMounted = true;
    
    const checkAuthAndRateLimit = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!isMounted) return;
        
        setUser(currentUser);
        
        if (currentUser) {
          // Close login modal if user is logged in
          setShowLoginModal(false);
          
          // Check rate limit via RPC function
          const { data: canQuery, error } = await supabase.rpc('can_user_query', {
            p_user_id: currentUser.id
          });
          
          if (!isMounted) return;
          
          if (!error && canQuery !== null) {
            // canQuery returns true if user can still query
            // Get remaining count
            const { data: countData } = await supabase.rpc('get_user_query_count_today', {
              p_user_id: currentUser.id
            });
            if (!isMounted) return;
            const count = countData || 0;
            setQueriesRemaining(3 - count);
          }
          
          // Restore form data if user just logged in
          const savedFormData = sessionStorage.getItem('pending-diagnosis-form');
          if (savedFormData) {
            try {
              const formData = JSON.parse(savedFormData);
              // Only restore if saved within last 10 minutes
              if (Date.now() - formData.timestamp < 10 * 60 * 1000) {
                setDay(formData.day);
                setMonth(formData.month);
                setYear(formData.year);
                setHour(formData.hour);
                setAge(formData.age);
                setGender(formData.gender);
                setSubject(formData.subject);
                setQuestion(formData.question);
                
                // Clear saved data
                sessionStorage.removeItem('pending-diagnosis-form');
                
                // Auto-trigger calculation after a brief delay
                setTimeout(() => {
                  handleCalculate();
                }, 500);
              } else {
                // Clear expired data
                sessionStorage.removeItem('pending-diagnosis-form');
              }
            } catch (e) {
              console.error('Error restoring form data:', e);
              sessionStorage.removeItem('pending-diagnosis-form');
            }
          }
        } else {
          // For guest users, check localStorage
          const { remaining } = checkGuestRateLimit();
          setQueriesRemaining(remaining);
        }
      } catch (err) {
        if (!isMounted) return;
        // Only log non-abort errors
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Auth check error:', err);
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };
    
    checkAuthAndRateLimit();
    
    // Listen for auth state changes (for OAuth callbacks)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && isMounted) {
        setUser(session.user);
        setShowLoginModal(false);
        checkAuthAndRateLimit();
      }
    });
    
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);
  
  const [result, setResult] = useState<MaiHuaResult | null>(null);
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);
  
  // Guest rate limiting using localStorage
  const checkGuestRateLimit = () => {
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    const storageKey = 'guest_query_limit';
    
    try {
      const stored = localStorage.getItem(storageKey);
      const data = stored ? JSON.parse(stored) : { date: today, count: 0 };
      
      // Reset if new day
      if (data.date !== today) {
        data.date = today;
        data.count = 0;
      }
      
      // Check if limit reached
      if (data.count >= 3) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return { allowed: false, remaining: 0, resetTime: tomorrow.getTime() };
      }
      
      return { allowed: true, remaining: 3 - data.count, resetTime: 0 };
    } catch (e) {
      console.error('Error checking guest rate limit:', e);
      return { allowed: true, remaining: 3, resetTime: 0 };
    }
  };
  
  const incrementGuestQueryCount = () => {
    const today = new Date().toLocaleDateString('en-CA');
    const storageKey = 'guest_query_limit';
    
    try {
      const stored = localStorage.getItem(storageKey);
      const data = stored ? JSON.parse(stored) : { date: today, count: 0 };
      
      if (data.date !== today) {
        data.date = today;
        data.count = 0;
      }
      
      data.count += 1;
      localStorage.setItem(storageKey, JSON.stringify(data));
      
      // Update remaining count display
      setQueriesRemaining(3 - data.count);
    } catch (e) {
      console.error('Error incrementing guest query count:', e);
    }
  };
  
  // Thông tin người bệnh
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'nam' | 'nu'>('nam');
  const [subject, setSubject] = useState<string>('banthan');
  const [question, setQuestion] = useState<string>('');
  
  const [patientContext, setPatientContext] = useState<{
    age: number;
    gender: string;
    subject: string;
    question: string;
} | null>(null);
  
  const handleCalculate = async () => {
    setRateLimitError(null);
    
    // Check rate limit for both logged-in and guest users
    const { allowed, remaining, resetTime } = checkGuestRateLimit();
    
    if (!allowed) {
      const resetDate = new Date(resetTime);
      const hours = resetDate.getHours().toString().padStart(2, '0');
      const minutes = resetDate.getMinutes().toString().padStart(2, '0');
      
      if (user) {
        setRateLimitError(`Bạn đã sử dụng hết 3 lượt hỏi quẻ trong ngày. Vui lòng quay lại vào ngày mai sau ${hours}:${minutes}.`);
      } else {
        setRateLimitError(
          `Bạn đã sử dụng hết 3 lượt hỏi quẻ miễn phí trong ngày. Đăng nhập để tiếp tục sử dụng và lưu lịch sử các lần gieo quẻ. Reset sau ${hours}:${minutes}.`
        );
      }
      return;
    }
    
    // For logged-in users, also check database rate limit
    if (user && queriesRemaining !== null && queriesRemaining <= 0) {
      setRateLimitError('Bạn đã sử dụng hết 3 lượt hỏi quẻ trong ngày. Vui lòng quay lại vào ngày mai.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const calculatedResult = calculateMaiHua(day, month, year, hour);
      setResult(calculatedResult);
      
      const diagnosticResult = performDiagnosis(calculatedResult);
      setDiagnostic(diagnosticResult);
      
      const context = {
        age: age ? Number.parseInt(age, 10) : 0,
        gender: gender === 'nam' ? 'Nam' : 'Nữ',
        subject,
        question: question.trim() || 'Chẩn đoán tổng quát về sức khỏe',
      };
      
      setPatientContext(context);
      
      // Save query to database for logged-in users only
      if (user) {
        const { error: insertError } = await supabase.from('query_history').insert({
          user_id: user.id,
          query_date: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD format
          query_time: new Date().toISOString(),
          main_hexagram: calculatedResult.mainHexagram.name,
          changed_hexagram: calculatedResult.changedHexagram.name,
          mutual_hexagram: calculatedResult.mutualHexagram.name,
          moving_line: calculatedResult.movingLine,
          patient_age: context.age || null,
          patient_gender: context.gender,
          patient_subject: context.subject,
          question: context.question,
          input_data: {
            day, month, year, hour,
            lunarDate: calculatedResult.lunarDate
          }
        });
        
        if (insertError) {
          console.error('Error saving query:', insertError);
          // Continue anyway - don't block user
        } else {
          // Update remaining queries
          if (queriesRemaining !== null) {
            setQueriesRemaining(queriesRemaining - 1);
          }
        }
      } else {
        // For guest users, increment localStorage count
        incrementGuestQueryCount();
      }
      
      // Lưu vào localStorage thay vì sessionStorage để dữ liệu không bị mất 
      // khi user đăng nhập qua Google OAuth (redirect qua domain Google)
      localStorage.setItem('diagnostic-results', JSON.stringify({
        maihua: calculatedResult,
        diagnostic: diagnosticResult,
        patientContext: context
      }));
      
      // Chuyển đến trang kết quả
      router.push('/results');
    } catch (err) {
      console.error('Calculate error:', err);
      setRateLimitError('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderHexagramLines = (lines: boolean[]) => {
    return (
      <div className="flex flex-col gap-1.5">
        {[...lines].reverse().map((isYang, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-12">Hào {6 - idx}</span>
            <div className="flex gap-1">
              {isYang ? (
                <div className="h-2 w-16 bg-primary rounded" />
              ) : (
                <>
                  <div className="h-2 w-7 bg-primary rounded" />
                  <div className="h-2 w-7 bg-primary rounded" />
                </>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {isYang ? 'Dương —' : 'Âm - -'}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header title="Y Dịch Đồng Nguyên" subtitle="ydichdongnguyen" />

      {/* Login Modal */}
      <LoginModal 
        open={showLoginModal} 
        onOpenChange={setShowLoginModal}
        onLoginSuccess={async () => {
          // Refresh auth state after login
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          setUser(currentUser);
          if (currentUser) {
            const { data: countData } = await supabase.rpc('get_user_query_count_today', {
              p_user_id: currentUser.id
            });
            const count = countData || 0;
            setQueriesRemaining(3 - count);
          }
        }}
      />

       {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-background.jpg"
            alt="Hình nền y học cổ truyền"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        </div>
        <div className="container relative z-10 mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/50 bg-primary/5 text-primary">
              Y học cổ truyền kết hợp công nghệ xử lý ngôn ngữ lớn
            </Badge>
            <h1 className="mb-4 text-balance text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
              Chào mừng bạn đến với <span className="text-primary">Y Dịch Đồng Nguyên</span>
            </h1>
            <h2 className="mb-2 text-balance text-xl font-semibold text-foreground/80 md:text-2xl">
              Tìm hiểu sức khỏe của bạn qua Mai Hoa Dịch Số
            </h2>
            <p className="mb-6 text-pretty text-base text-muted-foreground md:text-lg">
              Khi tinh thần và cơ thể mất nhịp, bạn dễ mệt, khó ngủ, căng thẳng.
Y Dịch Đồng Nguyên giúp bạn nhận diện trạng thái thân – tâm và gợi ý cách cân bằng lại đơn giản, an toàn.
            </p>
            <Button size="lg" onClick={() => document.getElementById('lap-que')?.scrollIntoView({ behavior: 'smooth' })}>
              Gieo quẻ ngay
            </Button>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="lap-que" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">Xem quẻ về sức khỏe</h2>
            <p className="mx-auto max-w-2xl text-pretty text-muted-foreground">
              Nhập thời gian và thông tin người hỏi để hệ thống hỗ trợ phân tích tình trạng thân – tâm theo Mai Hoa Dịch Số. 
            </p>

          </div>

          <div className="mx-auto max-w-4xl">
            {/* Methodology Banner - Ngôn ngữ gần gũi hơn */}
            <div className="mb-6 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-amber-500/10 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">Bạn muốn hiểu cách hoạt động?</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Ví dụ: Nếu bạn đang stress kéo dài, hệ thống sẽ giúp bạn nhìn ra cơ thể đang chịu áp lực ở đâu, ảnh hưởng đến giấc ngủ và tinh thần như thế nào, rồi gợi ý cách điều chỉnh bằng sinh hoạt, hít thở và thói quen hằng ngày.
                    </p>
                  </div>
                </div>
                <Link href="/methodology">
                  <Button variant="outline" className="shrink-0 gap-2 border-primary/50 bg-transparent text-primary hover:bg-primary/10">
                    Tìm hiểu thêm
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="border-border/50 bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Thông tin lập quẻ</CardTitle>
                <CardDescription>
                  Nhập đầy đủ thông tin để nhận được kết quả chẩn đoán chính xác
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Thời gian */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Thời gian (Dương lịch)</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-foreground">Ngày</label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={day}
                        onChange={(e) => setDay(Number(e.target.value))}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-foreground">Tháng</label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-foreground">Năm</label>
                      <input
                        type="number"
                        min="1900"
                        max="2100"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-foreground">Giờ</label>
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={hour}
                        onChange={(e) => setHour(Number(e.target.value))}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                        placeholder="VD: 22"
                      />
                    </div>
                  </div>
                  <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
                    <p className="mb-1 text-xs font-medium text-foreground">
                      Giờ địa chi: <span className="text-primary">{CHI_NAMES[Math.floor((hour + 1) / 2) % 12]}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Nhập giờ theo định dạng 24h (0-23). VD: 22:20 → nhập 22 (Giờ Hợi: 21h-23h)
                    </p>
                  </div>
                </div>

                {/* Thông tin người bệnh */}
                <div className="space-y-4 border-t border-border pt-6">
                  <h3 className="text-sm font-semibold text-foreground">Thông tin người bệnh</h3>
                  
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-foreground">Tuổi</label>
                      <input
                        type="number"
                        min="0"
                        max="120"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Nhập tuổi"
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-foreground">Giới tính</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as 'nam' | 'nu')}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                      >
                        <option value="nam">Nam</option>
                        <option value="nu">Nữ</option>
                      </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="mb-1.5 block text-xs font-medium text-foreground">Đối tượng</label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                      >
                        <option value="banthan">Bản thân</option>
                        <option value="cha">Cha</option>
                        <option value="me">Mẹ</option>
                        <option value="con">Con</option>
                        <option value="vo">Vợ</option>
                        <option value="chong">Chồng</option>
                        <option value="anh-chi-em">Anh chị em</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-foreground">
                      Câu hỏi / Mục đích <span className="text-muted-foreground">(Tùy chọn)</span>
                    </label>
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ví dụ: Tình trạng sức khỏe hiện tại của tôi như thế nào?"
                      rows={2}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                    />
                  </div>
                </div>

                {/* Hướng dẫn gieo quẻ */}
                <div className="rounded-lg border border-primary/30 bg-gradient-to-r from-primary/5 to-amber-500/5 p-4">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-lg">🧘</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-foreground">Lưu ý khi gieo quẻ</h4>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        <strong className="text-foreground">Tâm tĩnh, ý chuyên</strong> - Chỉ gieo quẻ vào đúng thời khắc <em className="text-primary font-medium">động tâm</em>, 
                        khi tâm trí thực sự có câu hỏi cần giải đáp. Không gieo quẻ bừa bãi hoặc thử nghiệm, 
                        điều này sẽ làm mất tính linh nghiệm của quẻ.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rate Limit Status */}
                {!isCheckingAuth && (
                  <div className="space-y-3">
                    {queriesRemaining !== null && (
                      <div className="flex items-center justify-between rounded-md border border-border/50 bg-muted/30 px-4 py-2">
                        <span className="text-sm text-muted-foreground">
                          {user ? 'Số lượt hỏi còn lại hôm nay:' : 'Số lượt gieo quẻ còn lại:'}
                        </span>
                        <Badge variant={queriesRemaining > 0 ? "secondary" : "destructive"}>
                          {queriesRemaining}/3
                        </Badge>
                      </div>
                    )}
                    
                    {rateLimitError && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{rateLimitError}</AlertDescription>
                      </Alert>
                    )}
                    
                    {!user && queriesRemaining !== null && queriesRemaining > 0 && (
                      <Alert className="mt-4 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertDescription className="text-blue-800 dark:text-blue-200">
                          Bạn có thể gieo quẻ mà không cần đăng nhập (còn {queriesRemaining} lượt hôm nay). 
                          <button 
                            onClick={() => setShowLoginModal(true)}
                            className="ml-1 font-semibold underline hover:no-underline"
                          >
                            Đăng nhập
                          </button> để lưu lịch sử và nhiều tính năng khác.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                <Button 
                  onClick={handleCalculate} 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting || (queriesRemaining !== null && queriesRemaining <= 0)}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : user ? 'Lập quẻ chẩn đoán' : 'Lập quẻ chẩn đoán'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {result && patientContext && (
        <section id="results" className="bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <h2 className="text-2xl font-bold text-foreground">Kết quả chẩn đoán</h2>
              <div className="rounded-lg border border-border/50 bg-background p-3 text-sm">
                <p className="font-semibold text-foreground">Thông tin ngữ cảnh:</p>
                <p className="text-muted-foreground">
                  {patientContext.gender}{patientContext.age ? `, ${patientContext.age} tuổi` : ''} - {
                    patientContext.subject === 'banthan' ? 'Bản thân' :
                    patientContext.subject === 'cha' ? 'Cha' :
                    patientContext.subject === 'me' ? 'Mẹ' :
                    patientContext.subject === 'con' ? 'Con' :
                    patientContext.subject === 'vo' ? 'Vợ' :
                    patientContext.subject === 'chong' ? 'Chồng' : 'Anh chị em'
                  }
                </p>
                {patientContext.question && (
                  <p className="mt-1 italic text-muted-foreground">"{patientContext.question}"</p>
                )}
              </div>
            </div>

            {/* Hexagrams Display */}
            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <Card className="border-border/50 bg-card">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">☰☰☰</span>
                    <CardTitle className="text-foreground">Quẻ Chủ</CardTitle>
                  </div>
                  <CardDescription className="font-semibold text-foreground">
                    {result.mainHexagram.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderHexagramLines(result.mainHexagram.lines)}
                  <p className="mt-3 text-sm text-muted-foreground">
                    {result.mainHexagram.description}
                  </p>
                  <Badge variant="secondary" className="mt-3">
                    Hào động: {result.movingLine}
                  </Badge>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">☷☷☷</span>
                    <CardTitle className="text-foreground">Quẻ Biến</CardTitle>
                  </div>
                  <CardDescription className="font-semibold text-primary">
                    {result.changedHexagram.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderHexagramLines(result.changedHexagram.lines)}
                  <p className="mt-3 text-sm text-muted-foreground">
                    {result.changedHexagram.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">☶☶☶</span>
                    <CardTitle className="text-foreground">Quẻ Hổ</CardTitle>
                  </div>
                  <CardDescription className="font-semibold text-secondary">
                    {result.mutualHexagram.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderHexagramLines(result.mutualHexagram.lines)}
                  <p className="mt-3 text-sm text-muted-foreground">
                    {result.mutualHexagram.description}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Diagnostic Results */}
            {diagnostic && (
              <div className="space-y-6">
                {/* Mapping */}
                <Card className="border-border/50 bg-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Ma trận Ánh xạ Chẩn đoán</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <h4 className="mb-2 font-semibold text-foreground">
                          {diagnostic.mapping.upperTrigram.symbol} {diagnostic.mapping.upperTrigram.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          <strong>Cơ quan:</strong> {diagnostic.mapping.upperTrigram.primaryOrgans.join(', ')}
                        </p>
                      </div>
                      <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-4">
                        <h4 className="mb-2 font-semibold text-foreground">
                          {diagnostic.mapping.lowerTrigram.symbol} {diagnostic.mapping.lowerTrigram.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          <strong>Cơ quan:</strong> {diagnostic.mapping.lowerTrigram.primaryOrgans.join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                      <h4 className="mb-2 font-semibold text-foreground">
                        Hào {diagnostic.mapping.movingYao.position} - {diagnostic.mapping.movingYao.bodyLevel}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {diagnostic.mapping.movingYao.clinicalSignificance}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Expert Analysis */}
                <Card className="border-border/50 bg-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Phân tích Chuyên gia</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className={`rounded-lg border p-4 ${
                      diagnostic.expertAnalysis.tiDung.severity === 'nặng' 
                        ? 'border-red-500/30 bg-red-500/10' 
                        : 'border-green-500/30 bg-green-500/10'
                    }`}>
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-semibold text-foreground">Quan hệ Thể - Dụng</h4>
                        <Badge variant={diagnostic.expertAnalysis.tiDung.severity === 'nặng' ? 'destructive' : 'default'}>
                          {diagnostic.expertAnalysis.tiDung.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {diagnostic.expertAnalysis.tiDung.prognosis}
                      </p>
                    </div>

                    {diagnostic.expertAnalysis.diseaseFlags.needsAttention.length > 0 && (
                      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                        <h4 className="mb-2 font-semibold text-foreground">Lưu ý</h4>
                        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                          {diagnostic.expertAnalysis.diseaseFlags.needsAttention.map((note, idx) => (
                            <li key={idx}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Giới thiệu Section */}
      <section id="gioi-thieu" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">Về Mai Hoa Tâm Pháp</h2>
            <p className="mx-auto max-w-2xl text-pretty text-muted-foreground">
              Kết hợp tinh hoa y học cổ truyền với công nghệ xử lý ngôn ngữ lớn hiện đại
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="overflow-hidden border-border/50 bg-card p-0">
              <div className="relative h-56 w-full">
                <Image
                  src="/images/bagua-symbol.jpg"
                  alt="Bát Quái"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-foreground">Hệ thống Bát Quái</CardTitle>
                <CardDescription>
                  Ánh xạ 8 quẻ với cơ quan cơ thể
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden border-border/50 bg-card p-0">
              <div className="relative h-56 w-full">
                <Image
                  src="/images/yin-yang-balance.jpg"
                  alt="Ngũ Hành"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-foreground">Ngũ Hành</CardTitle>
                <CardDescription>
                  Mối quan hệ sinh khắc giữa các nguyên tố
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden border-border/50 bg-card p-0">
              <div className="relative h-56 w-full">
                <Image
                  src="/images/ancient-wisdom.jpg"
                  alt="Tri thức"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-foreground">Tri thức Cổ truyền</CardTitle>
                <CardDescription>
                  Phương pháp Thiệu Khang Tiết
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample Results Section - Ví dụ kết quả mẫu */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <Badge variant="secondary" className="mb-4">
              Ví dụ kết quả
            </Badge>
            <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
              Kết quả trả về như thế nào?
            </h2>
            <p className="mx-auto max-w-2xl text-pretty text-muted-foreground">
              Dưới đây là một ví dụ về cách hệ thống phân tích và đưa ra lời khuyên dễ hiểu cho bạn
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                    <Info className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-foreground">Tình huống: Stress và mệt mỏi kéo dài</CardTitle>
                    <CardDescription>Nữ, 32 tuổi, làm việc văn phòng</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-border/50 bg-background/80 p-4">
                  <h4 className="mb-2 font-semibold text-foreground flex items-center gap-2">
                    <span className="text-primary">1.</span> Nhận định tổng quan
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Quẻ cho thấy tình trạng Can Khí Uất Kết - gan bị tắc nghẽn do stress. 
                    Biểu hiện thường gặp: đau đầu, khó ngủ, hay cáu gắt, đau tức ngực sườn.
                  </p>
                </div>
                
                <div className="rounded-lg border border-border/50 bg-background/80 p-4">
                  <h4 className="mb-2 font-semibold text-foreground flex items-center gap-2">
                    <span className="text-primary">2.</span> Cơ quan cần chú ý
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/30">Gan (Can)</Badge>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/30">Lá lách (Tỳ)</Badge>
                    <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-500/30">Tim (Tâm)</Badge>
                  </div>
                </div>
                
                <div className="rounded-lg border border-border/50 bg-background/80 p-4">
                  <h4 className="mb-2 font-semibold text-foreground flex items-center gap-2">
                    <span className="text-primary">3.</span> Lời khuyên cụ thể
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span><strong className="text-foreground">Sinh hoạt:</strong> Tập thở sâu 5-10 phút mỗi sáng, đi bộ nhẹ sau bữa ăn</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span><strong className="text-foreground">Ăn uống:</strong> Uống trà hoa cúc hoặc bạc hà, tránh đồ cay nóng và rượu bia</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span><strong className="text-foreground">Huyệt vị:</strong> Bấm huyệt Thái Xung (mu bàn chân) và Hợp Cốc (hổ khẩu tay)</span>
                    </li>
                  </ul>
                </div>
                
                <Alert className="border-amber-500/30 bg-amber-500/10">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    Đây là lời khuyên tham khảo dựa trên y học cổ truyền. Nếu triệu chứng kéo dài, 
                    vui lòng tham khảo ý kiến bác sĩ chuyên khoa.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section - Dạng Q&A thân thiện */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <Badge variant="secondary" className="mb-4">
              Giải đáp thắc mắc
            </Badge>
            <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
              Những câu hỏi bạn có thể đang thắc mắc
            </h2>
            <p className="mx-auto max-w-2xl text-pretty text-muted-foreground">
              Chúng tôi giải thích mọi thứ bằng ngôn ngữ đời thường, không học thuật
            </p>
          </div>

          <Accordion type="single" collapsible className="mx-auto max-w-3xl">
            <AccordionItem value="item-1" className="border-border/50">
              <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                Đây có phải là bói toán hay mê tín không?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Không hẳn như bạn nghĩ. Mai Hoa Dịch Số là phương pháp phân tích có lịch sử hơn 1000 năm, 
                dựa trên triết học Kinh Dịch - một hệ thống logic về âm dương và ngũ hành. Chúng tôi sử dụng 
                phương pháp này kết hợp với công nghệ AI để đưa ra <strong className="text-foreground">lời khuyên về sức khỏe theo cách dễ hiểu</strong>, 
                không phải để "đoán vận mệnh".
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-border/50">
              <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                Kết quả có đáng tin cậy không?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Kết quả là <strong className="text-foreground">góc nhìn tham khảo từ y học cổ truyền</strong>, giúp bạn hiểu hơn 
                về cơ thể theo quan điểm Đông y. Chúng tôi không thay thế bác sĩ - nếu bạn có triệu chứng bất thường, 
                hãy đi khám ngay. Phương pháp này hiệu quả nhất khi được dùng như <strong className="text-foreground">công cụ định hướng 
                chăm sóc sức khỏe hàng ngày</strong>.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-border/50">
              <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                Tại sao phải nhập đúng thời gian?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Giống như khi bạn đo huyết áp - kết quả phụ thuộc vào thời điểm đo. Cơ thể chúng ta có <strong className="text-foreground">nhịp sinh học 
                (Circadian rhythm)</strong> - hormone, năng lượng thay đổi theo từng giờ trong ngày. Thời gian bạn nhập 
                giúp hệ thống "chụp" đúng trạng thái cơ thể tại khoảnh khắc đó để phân tích chính xác hơn.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-border/50">
              <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                Quẻ là gì? Tôi không hiểu Dịch học
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Đừng lo, bạn không cần hiểu Dịch học! Hệ thống sẽ tự động tính toán và <strong className="text-foreground">giải thích kết quả 
                bằng ngôn ngữ đời thường</strong>. Quẻ đơn giản là "bức ảnh" về trạng thái năng lượng cơ thể bạn - 
                giống như khi bạn xem kết quả xét nghiệm máu, bạn không cần hiểu hóa học để biết mình khỏe hay không.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-border/50">
              <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                Ai nên sử dụng hệ thống này?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Hệ thống phù hợp với những ai: <strong className="text-foreground">muốn tìm hiểu sức khỏe từ góc nhìn Đông y</strong>; 
                quan tâm đến phòng bệnh và chăm sóc bản thân; đang tìm kiếm sự cân bằng giữa tâm và thân. 
                <strong className="text-foreground"> Không khuyến khích</strong> cho người đang trong tình trạng sức khỏe nghiêm trọng 
                cần can thiệp y tế khẩn cấp.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Image
                  src="/logo.jpg"
                  alt="Y Dịch Đồng Nguyên Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-bold text-foreground">Y Dịch Đồng Nguyên</h3>
                  <p className="text-xs text-muted-foreground">ydichdongnguyen</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Hệ thống chẩn đoán sức khỏe dựa trên Dịch học cổ truyền
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-foreground">Liên kết</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#lap-que" className="transition-colors hover:text-foreground">
                    Lập quẻ
                  </a>
                </li>
                <li>
                  <a href="/knowledge" className="transition-colors hover:text-foreground">
                    Knowledge Base
                  </a>
                </li>
                <li>
                  <a href="#gioi-thieu" className="transition-colors hover:text-foreground">
                    Giới thiệu
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-foreground">Tri thức</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/knowledge" className="transition-colors hover:text-foreground">
                    Bát Quái
                  </a>
                </li>
                <li>
                  <a href="/knowledge" className="transition-colors hover:text-foreground">
                    Lục Thần & Lục Thân
                  </a>
                </li>
                <li>
                  <a href="/knowledge" className="transition-colors hover:text-foreground">
                    Hệ thống Hào vị
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-foreground">Hỗ trợ</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: support@maihoatamphat.com</li>
                <li>Hotline: 0786779493</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-border/40 pt-6">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-4 text-sm">
              <a href="/privacy" className="text-foreground font-medium underline hover:text-primary transition-colors">
                Chính sách bảo mật
              </a>
              <span className="text-muted-foreground">•</span>
              <a href="/terms" className="text-foreground font-medium underline hover:text-primary transition-colors">
                Điều khoản dịch vụ
              </a>
            </div>
            <p className="text-center text-sm text-muted-foreground">© 2026 Y Dịch Đồng Nguyên. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
