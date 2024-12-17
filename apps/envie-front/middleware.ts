import { withAuth } from "next-auth/middleware"
import { UserRole } from "./enums/UserRole"

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      // If the route start with /Admin, only allow admins
      if (req.nextUrl.pathname.startsWith("/Admin")) {
        return token?.role === UserRole.SUPER_ADMIN || token?.role === UserRole.ADMIN
      }

      // If the route start with /Companies, only allow super admins
      if (req.nextUrl.pathname.startsWith("/Companies")) {
        return token?.role === UserRole.SUPER_ADMIN || token?.role === UserRole.ADMIN
      }

      // If the route start with /StorageLocationsList, only allow super admins, admins and operators
      if (req.nextUrl.pathname.startsWith("/StorageLocationsList")) {
        return token?.role !== UserRole.USER
      }

      // If the route start with /Storage, only allow super admins and admins
      if (req.nextUrl.pathname.startsWith("/Storage")) {
        return token?.role === UserRole.SUPER_ADMIN || token?.role === UserRole.ADMIN
      }

      // If the route is /Stock, only allow super admins and users
      if (req.nextUrl.pathname === "/Stock") {
        // Allow users to see the stock page without being logged in
        if (!token) return true

        return token?.role === UserRole.SUPER_ADMIN || token?.role === UserRole.USER
      }

      // If the route ends with /Add, only allow super admins, admins and operators
      if (req.nextUrl.pathname.endsWith("/Add")) {
        return token?.role === UserRole.SUPER_ADMIN || token?.role === UserRole.ADMIN || token?.role === UserRole.OPERATOR || token?.role === UserRole.WAREHOUSEMAN
      }

      // If the route is /Order, only allow super admins, admins, operators and warehousemen
      if (req.nextUrl.pathname === "/Order") {
         return token?.role === UserRole.SUPER_ADMIN || token?.role === UserRole.ADMIN || token?.role === UserRole.OPERATOR || token?.role === UserRole.WAREHOUSEMAN
      }

        // If the route is /PreparationOrder, only allow super admins, admins and warehousemen
      if (req.nextUrl.pathname === "/PreparationOrder") {
        return token?.role === UserRole.SUPER_ADMIN || token?.role === UserRole.ADMIN || token?.role === UserRole.WAREHOUSEMAN
      }

      return !!token
    },
  }
})

// List of routes to check
export const config = {
  matcher: [
    "/Admin/:path*", // Match all admin routes
    "/Companies",
    "/Storage",
    "/StorageLocationsList",
    "/Stock",
    "/Stock/:path*/Add",
    "/Add",
    "/Order",
    "/PreparationOrder",
  ]
}
