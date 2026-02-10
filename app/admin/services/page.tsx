import { redirect } from "next/navigation"

// Redirect old services route to new solutions route
export default function AdminServicesRedirect() {
  redirect("/admin/solutions")
}
