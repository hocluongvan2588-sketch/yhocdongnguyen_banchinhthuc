"use server"

import { createClient, getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

async function checkAdminAccess() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Người dùng chưa đăng nhập", isAdmin: false }
  }

  // Check if user has admin role
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("is_admin")
    .eq("email", user.email)
    .single()

  if (userError || !userData?.is_admin) {
    return { error: "Bạn không có quyền truy cập trang quản trị", isAdmin: false }
  }

  return { isAdmin: true, user }
}

/**
 * Update pricing for all solutions of a specific type
 */
export async function updateSolutionPricing(
  solutionType: "acupoint" | "prescription" | "symbol_number",
  newPrice: number,
) {
  const adminCheck = await checkAdminAccess()
  if (!adminCheck.isAdmin) {
    return { error: adminCheck.error }
  }

  const supabase = await createClient()

  // Update all solutions of this type
  const { error } = await supabase.from("solutions").update({ unlock_cost: newPrice }).eq("solution_type", solutionType)

  if (error) {
    console.error("[v0] Error updating solution pricing:", error)
    return { error: "Không thể cập nhật giá" }
  }

  revalidatePath("/admin/payments")
  return { success: true }
}

/**
 * Update payment method configuration
 */
export async function updatePaymentMethod(
  methodId: string,
  data: {
    account_number?: string
    account_name?: string
    is_active?: boolean
  },
) {
  const adminCheck = await checkAdminAccess()
  if (!adminCheck.isAdmin) {
    return { error: adminCheck.error }
  }

  const supabase = await createClient()

  const { error } = await supabase.from("payment_methods").update(data).eq("id", methodId)

  if (error) {
    console.error("[v0] Error updating payment method:", error)
    return { error: "Không thể cập nhật phương thức thanh toán" }
  }

  revalidatePath("/admin/payments")
  return { success: true }
}

/**
 * Get all solutions (for admin management)
 */
export async function getAllSolutions() {
  const adminCheck = await checkAdminAccess()
  if (!adminCheck.isAdmin) {
    return { error: adminCheck.error }
  }

  const supabase = await createClient()

  const { data: solutions, error } = await supabase
    .from("solutions")
    .select("*")
    .order("hexagram_key")

  if (error) {
    console.error("[v0] Error fetching solutions:", error)
    return { error: "Không thể tải danh sách gói dịch vụ" }
  }

  return { solutions }
}

/**
 * Update solution metadata (admin only)
 */
export async function updateSolution(
  solutionId: string,
  data: {
    title?: string
    description?: string
    unlock_cost?: number
    reference_source?: string
  },
) {
  const adminCheck = await checkAdminAccess()
  if (!adminCheck.isAdmin) {
    return { error: adminCheck.error }
  }

  const supabase = await createClient()

  const { error } = await supabase.from("solutions").update(data).eq("id", solutionId)

  if (error) {
    console.error("[v0] Error updating solution:", error)
    return { error: "Không thể cập nhật gói dịch vụ" }
  }

  revalidatePath("/admin/solutions")
  return { success: true }
}
