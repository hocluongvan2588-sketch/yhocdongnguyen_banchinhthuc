"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"

const DAILY_LIMIT = 3 // Theo nguyên tắc "Nhất Sự Nhất Chiêm"
const MIN_SPACING_MINUTES = 15 // Thời gian tối thiểu giữa 2 lần gieo
const SIMILARITY_THRESHOLD = 0.75 // 75% giống nhau = cùng câu hỏi

// Nguyên tắc 1: BẤT ĐỘNG BẤT CHIÊM
// Kiểm tra xem user có spam trong 1 giờ không
export async function checkRapidDivination(): Promise<{
  isSpamming: boolean
  count: number
  message?: string
}> {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { isSpamming: false, count: 0 }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

  const { data: recentConsultations } = await supabase
    .from("consultations")
    .select("id, created_at")
    .eq("user_id", user.id)
    .gte("created_at", oneHourAgo.toISOString())

  const count = recentConsultations?.length || 0

  if (count >= 3) {
    return {
      isSpamming: true,
      count,
      message:
        "Tiên sinh Thiệu Khang Tiết dạy: 'Bất động bất chiêm' - không nên gieo quẻ liên tục trong thời gian ngắn. Hãy tịnh tâm và quay lại sau ít nhất 1 giờ.",
    }
  }

  return { isSpamming: false, count }
}

// Nguyên tắc 2: NHẤT SỰ NHẤT CHIÊM
// Kiểm tra xem user đã hỏi câu tương tự trong 24h chưa
export async function checkDuplicateQuestion(healthConcern: string): Promise<{
  isDuplicate: boolean
  previousQuestion?: {
    id: string
    created_at: string
    diagnosis_text: string
    hexagram_name: string
    similarity: number
  }
  message?: string
}> {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { isDuplicate: false }

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const { data: recentConsultations } = await supabase
    .from("consultations")
    .select("id, created_at, diagnosis_text, hexagram_name")
    .eq("user_id", user.id)
    .gte("created_at", twentyFourHoursAgo.toISOString())
    .order("created_at", { ascending: false })

  if (!recentConsultations || recentConsultations.length === 0) {
    return { isDuplicate: false }
  }

  // Simple similarity check: normalize and compare
  const normalizedInput = normalizeText(healthConcern)

  for (const consultation of recentConsultations) {
    const normalizedPrevious = normalizeText(consultation.diagnosis_text)
    const similarity = calculateSimilarity(normalizedInput, normalizedPrevious)

    if (similarity >= SIMILARITY_THRESHOLD) {
      const hoursAgo = Math.floor((Date.now() - new Date(consultation.created_at).getTime()) / (1000 * 60 * 60))

      return {
        isDuplicate: true,
        previousQuestion: {
          ...consultation,
          similarity,
        },
        message: `Kinh Dịch dạy: "Sơ thệ cáo, tái tam độc, độc tắc bất cáo" (Lần đầu thì bảo, hỏi lại nhiều lần thì không linh nữa).\n\nBạn đã hỏi về vấn đề tương tự "${consultation.diagnosis_text}" cách đây ${hoursAgo} giờ và nhận được quẻ ${consultation.hexagram_name}.\n\nĐể quẻ có độ ứng nghiệm cao, bạn nên chờ ít nhất 24 giờ trước khi hỏi lại về cùng vấn đề này.`,
      }
    }
  }

  return { isDuplicate: false }
}

// Nguyên tắc 3: Kiểm tra spacing 15 phút giữa các lần gieo
export async function checkMinimumSpacing(): Promise<{
  canDivine: boolean
  minutesRemaining: number
  message?: string
}> {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { canDivine: false, minutesRemaining: 0 }

  const { data: lastConsultation } = await supabase
    .from("consultations")
    .select("created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (!lastConsultation) {
    return { canDivine: true, minutesRemaining: 0 }
  }

  const lastTime = new Date(lastConsultation.created_at).getTime()
  const now = Date.now()
  const minutesSinceLastDivination = (now - lastTime) / (1000 * 60)

  if (minutesSinceLastDivination < MIN_SPACING_MINUTES) {
    const remaining = Math.ceil(MIN_SPACING_MINUTES - minutesSinceLastDivination)
    return {
      canDivine: false,
      minutesRemaining: remaining,
      message: `Để "khí" được bình ổn và quẻ có độ chính xác cao, vui lòng chờ ${remaining} phút nữa trước khi gieo quẻ tiếp theo.`,
    }
  }

  return { canDivine: true, minutesRemaining: 0 }
}

// Kiểm tra daily limit
export async function checkDailyDivinationLimit(): Promise<{
  canDivine: boolean
  remaining: number
  total: number
  todayCount: number
  message?: string
}> {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      canDivine: false,
      remaining: 0,
      total: DAILY_LIMIT,
      todayCount: 0,
      message: "Vui lòng đăng nhập để sử dụng dịch vụ gieo quẻ.",
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: consultations, error } = await supabase
    .from("consultations")
    .select("id")
    .eq("user_id", user.id)
    .gte("created_at", today.toISOString())

  if (error) {
    console.error("[v0] Error checking divination limit:", error)
    return { canDivine: true, remaining: DAILY_LIMIT, total: DAILY_LIMIT, todayCount: 0 }
  }

  const todayCount = consultations?.length || 0
  const remaining = Math.max(0, DAILY_LIMIT - todayCount)

  if (remaining === 0) {
    return {
      canDivine: false,
      remaining: 0,
      total: DAILY_LIMIT,
      todayCount,
      message:
        "Theo triết lý Mai Hoa Dịch Số, một ngày không nên quá lao tâm vào việc chiêm đoán. Bạn đã sử dụng hết 3 lần gieo quẻ hôm nay. Hãy nghỉ ngơi và quay lại vào ngày mai.",
    }
  }

  return {
    canDivine: true,
    remaining,
    total: DAILY_LIMIT,
    todayCount,
  }
}

// Comprehensive check trước khi cho phép gieo quẻ
export async function canUserDivine(healthConcern?: string): Promise<{
  allowed: boolean
  reason?: string
  details?: {
    dailyLimit?: { remaining: number; total: number }
    spacing?: { minutesRemaining: number }
    duplicate?: { previousQuestion: any }
  }
}> {
  // Check 1: Authentication
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      allowed: false,
      reason: "Vui lòng đăng nhập để sử dụng dịch vụ gieo quẻ Mai Hoa Dịch Số.",
    }
  }

  // Check 2: Rapid divination (Bất động bất chiêm)
  const rapidCheck = await checkRapidDivination()
  if (rapidCheck.isSpamming) {
    return {
      allowed: false,
      reason: rapidCheck.message,
    }
  }

  // Check 3: Minimum spacing
  const spacingCheck = await checkMinimumSpacing()
  if (!spacingCheck.canDivine) {
    return {
      allowed: false,
      reason: spacingCheck.message,
      details: {
        spacing: { minutesRemaining: spacingCheck.minutesRemaining },
      },
    }
  }

  // Check 4: Daily limit
  const dailyCheck = await checkDailyDivinationLimit()
  if (!dailyCheck.canDivine) {
    return {
      allowed: false,
      reason: dailyCheck.message,
      details: {
        dailyLimit: { remaining: dailyCheck.remaining, total: dailyCheck.total },
      },
    }
  }

  // Check 5: Duplicate question (Nhất sự nhất chiêm)
  if (healthConcern) {
    const duplicateCheck = await checkDuplicateQuestion(healthConcern)
    if (duplicateCheck.isDuplicate) {
      return {
        allowed: false,
        reason: duplicateCheck.message,
        details: {
          duplicate: { previousQuestion: duplicateCheck.previousQuestion },
        },
      }
    }
  }

  return { allowed: true }
}

export async function saveDivinationRecord(data: {
  year: number
  month: number
  day: number
  hour: number
  upperTrigram: number
  lowerTrigram: number
  movingLine: number
  hexagramName: string
  healthConcern: string
}): Promise<{ success: boolean; error?: string; consultationId?: string }> {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "User not authenticated" }
  }

  const { data: consultation, error } = await supabase
    .from("consultations")
    .insert({
      user_id: user.id,
      year: data.year,
      month: data.month,
      day: data.day,
      hour: data.hour,
      upper_trigram: data.upperTrigram,
      lower_trigram: data.lowerTrigram,
      moving_line: data.movingLine,
      hexagram_name: data.hexagramName,
      diagnosis_text: data.healthConcern,
    })
    .select("id")
    .single()

  if (error) {
    console.error("[v0] Error saving divination record:", error)
    return { success: false, error: error.message }
  }

  return { success: true, consultationId: consultation.id }
}

export async function getPreviousDivinations(limit = 10): Promise<{
  consultations: Array<{
    id: string
    created_at: string
    diagnosis_text: string
    hexagram_name: string
  }>
}> {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { consultations: [] }
  }

  const { data: consultations, error } = await supabase
    .from("consultations")
    .select("id, created_at, diagnosis_text, hexagram_name")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[v0] Error fetching previous divinations:", error)
    return { consultations: [] }
  }

  return { consultations: consultations || [] }
}

// Helper functions
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[đ]/g, "d")
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
    .replace(/[èéẹẻẽêềếệểễ]/g, "e")
    .replace(/[ìíịỉĩ]/g, "i")
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
    .replace(/[ùúụủũưừứựửữ]/g, "u")
    .replace(/[ỳýỵỷỹ]/g, "y")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
}

function calculateSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.split(/\s+/))
  const words2 = new Set(str2.split(/\s+/))

  const intersection = new Set([...words1].filter((x) => words2.has(x)))
  const union = new Set([...words1, ...words2])

  return intersection.size / union.size
}
