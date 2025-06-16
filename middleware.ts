import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Support both new and old environment variable names
  const envValue =
    process.env.NEXT_PUBLIC_MAINTENANCE_MODE ?? process.env.MAINTENANCE_MODE;
  const maintenanceMode = envValue?.trim().toLowerCase() === "true";

  // Maintenance mode activated
  if (
    maintenanceMode &&
    request.nextUrl.pathname !== "/maintenance" &&
    !request.nextUrl.pathname.startsWith("/_next") &&
    !request.nextUrl.pathname.startsWith("/static")
  ) {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  // Maintenance mode deactivated
  if (!maintenanceMode && request.nextUrl.pathname === "/maintenance") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/:path*"],
};
