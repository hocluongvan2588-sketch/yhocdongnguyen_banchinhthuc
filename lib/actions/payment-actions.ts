"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function processPayment(data: {
  solutionId: string
  paymentMethod: string
  amount: number
  cardInfo?: {
    cardNumber: string
    cardName: string
    expiry: string
    cvv: string
  }
}) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Người dùng chưa đăng nhập" }
  }

  // In a real app, this would integrate with a payment gateway like Stripe
  // For now, we'll simulate a successful payment

  // Generate a mock payment ID
  const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substring(7)}`

  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Check if solution exists
  const { data: solution, error: solutionError } = await supabase
    .from("solutions")
    .select("*")
    .eq("id", data.solutionId)
    .single()

  if (solutionError || !solution) {
    console.error("[v0] Solution not found:", solutionError)
    return { error: "Không tìm thấy giải pháp" }
  }

  // Grant access to the solution
  const { data: access, error: accessError } = await supabase
    .from("user_access")
    .insert({
      user_id: user.id,
      solution_id: data.solutionId,
      payment_id: paymentId,
      expires_at: null, // Lifetime access
    })
    .select()
    .single()

  if (accessError) {
    console.error("[v0] Error granting access:", accessError)
    return { error: "Không thể cấp quyền truy cập" }
  }

  revalidatePath("/treatment")
  return {
    success: true,
    paymentId,
    access,
  }
}

export async function grantAccessToSolution(solutionId: string, userId?: string) {
  const supabase = await getSupabaseServerClient()

  // If no userId provided, use current user
  let targetUserId = userId
  if (!targetUserId) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { error: "Người dùng chưa đăng nhập" }
    }
    targetUserId = user.id
  }

  // Check if access already exists
  const { data: existing } = await supabase
    .from("user_access")
    .select("*")
    .eq("user_id", targetUserId)
    .eq("solution_id", solutionId)
    .maybeSingle()

  if (existing) {
    return { error: "Người dùng đã có quyền truy cập" }
  }

  // Grant access
  const { data: access, error } = await supabase
    .from("user_access")
    .insert({
      user_id: targetUserId,
      solution_id: solutionId,
      expires_at: null,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error granting access:", error)
    return { error: "Không thể cấp quyền truy cập" }
  }

  revalidatePath("/treatment")
  return { success: true, access }
}

export async function revokeAccessToSolution(solutionId: string, userId?: string) {
  const supabase = await getSupabaseServerClient()

  // If no userId provided, use current user
  let targetUserId = userId
  if (!targetUserId) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { error: "Người dùng chưa đăng nhập" }
    }
    targetUserId = user.id
  }

  const { error } = await supabase
    .from("user_access")
    .delete()
    .eq("user_id", targetUserId)
    .eq("solution_id", solutionId)

  if (error) {
    console.error("[v0] Error revoking access:", error)
    return { error: "Không thể thu hồi quyền truy cập" }
  }

  revalidatePath("/treatment")
  return { success: true }
}
