// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//   const isAuthenticated = req.cookies.get("isAuthenticated")?.value === "true";
//   console.log('middleware is runnning')
//   if (req.nextUrl.pathname.startsWith("/dashboard") && !isAuthenticated) {
//     return NextResponse.redirect(new URL("/", req.url)); // Redirect to home if not authenticated
//   }

//   return NextResponse.next();
// }
