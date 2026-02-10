import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const packageId = searchParams.get("packageId")

  if (!packageId) {
    return NextResponse.json({ error: "Package ID is required" }, { status: 400 })
  }

  const supabase = await createClient()

  // Query solutions table for package price
  // Note: promo_message column may not exist yet until migration 19 is run
  const { data: solution, error } = await supabase
    .from("solutions")
    .select("unlock_cost")
    .eq("hexagram_key", packageId)
    .eq("solution_type", getTypeFromPackageId(packageId))
    .single()

  if (error) {
    console.error("[v0] Error fetching package price:", error)
    return NextResponse.json({ error: "Could not fetch package price" }, { status: 500 })
  }

  // Try to fetch promo_message separately (gracefully handle if column doesn't exist)
  let promoMessage = null
  try {
    const { data: promoData } = await supabase
      .from("solutions")
      .select("promo_message")
      .eq("hexagram_key", packageId)
      .eq("solution_type", getTypeFromPackageId(packageId))
      .single()
    
    promoMessage = promoData?.promo_message || null
  } catch (promoError) {
    // Column doesn't exist yet, ignore
    console.log("[v0] promo_message column not found (run migration 19)")
  }

  return NextResponse.json({ 
    price: solution?.unlock_cost || 0,
    promoMessage,
    packageId 
  })
}

function getTypeFromPackageId(packageId: string): string {
  if (packageId === "package_1") return "acupoint"
  if (packageId === "package_2") return "prescription"
  if (packageId === "package_3") return "numerology"
  return "unknown"
}
