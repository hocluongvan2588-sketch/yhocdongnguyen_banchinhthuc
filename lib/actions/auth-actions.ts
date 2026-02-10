"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server" // Declare the variable before using it

export async function signUp(email: string, password: string, fullName?: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${process.env.NEXT_PUBLIC_SITE_URL}/`,
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    console.error("[v0] Sign up error:", error)
    return { error: error.message }
  }

  // Update user profile in profiles table (trigger handles creation)
  if (data.user && fullName) {
    await supabase.from("profiles").update({ full_name: fullName }).eq("id", data.user.id)
  }

  revalidatePath("/")
  return { user: data.user }
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("[v0] Sign in error:", error)
    return { error: error.message }
  }

  revalidatePath("/")
  return { user: data.user }
}

export async function signOut() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("[v0] Sign out error:", error)
    return { error: error.message }
  }

  revalidatePath("/")
  redirect("/")
}

export async function getCurrentUser() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("[v0] getCurrentUser - auth user:", user?.id)

  if (!user) {
    console.log("[v0] getCurrentUser - no auth user found")
    return { user: null }
  }

  // Fetch additional user data including role from public.profiles table
  const { data: profileData, error } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single()

  console.log("[v0] getCurrentUser - profileData:", profileData)
  console.log("[v0] getCurrentUser - error:", error)

  return {
    user: {
      ...user,
      is_admin: profileData?.role === "admin",
      full_name: profileData?.full_name,
    },
  }
}
