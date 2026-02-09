"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server" // Declared the missing variable

export async function createConsultation(data: {
  name: string
  birth_date: string
  birth_time?: string
  gender: "male" | "female" | "other"
  question?: string
  hexagram_primary: string
  hexagram_mutual?: string
  hexagram_change?: string
  interpretation?: string
}) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Người dùng chưa đăng nhập" }
  }

  // Insert consultation
  const { data: consultation, error } = await supabase
    .from("consultations")
    .insert({
      user_id: user.id,
      ...data,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating consultation:", error)
    return { error: "Không thể tạo tư vấn" }
  }

  revalidatePath("/consultations")
  return { consultation }
}

export async function getUserConsultations() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Người dùng chưa đăng nhập" }
  }

  const { data: consultations, error } = await supabase
    .from("consultations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching consultations:", error)
    return { error: "Không thể tải danh sách tư vấn" }
  }

  return { consultations }
}

export async function getConsultationById(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Người dùng chưa đăng nhập" }
  }

  const { data: consultation, error } = await supabase
    .from("consultations")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    console.error("[v0] Error fetching consultation:", error)
    return { error: "Không thể tải thông tin tư vấn" }
  }

  return { consultation }
}
