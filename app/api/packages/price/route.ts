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

  return NextResponse.json({ 
    price: solution?.unlock_cost || 0,
    packageId 
  })
}

function getTypeFromPackageId(packageId: string): string {
  if (packageId === "package_1") return "acupoint"
  if (packageId === "package_2") return "prescription"
  if (packageId === "package_3") return "numerology"
  return "unknown"
}
