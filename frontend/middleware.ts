import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Paths that do not require authentication (e.g., public routes)
  const publicPaths = ["/sign-in", "/sign-up"]

  // Check if the request is to a public route
  const isPublicPath = publicPaths.some((path) => pathname === path);

  // Retrieve the session information
  const userAuth = req.cookies.get('auth')?.value || null

  if(userAuth){
    // If the user is logged in and accessing a public route, redirect to the home page
    if (isPublicPath) {
      const homeUrl = new URL("/", req.url);
      return NextResponse.redirect(homeUrl);
    }
    // Allow access to other routes
    return NextResponse.next();
  }

  // If not logged in and trying to access a protected route, redirect to login page
  if (!isPublicPath) {
    const loginUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next()
}

export const config = {
    // Define routes where middleware should apply
    matcher: [
      "/((?!api|_next/static|_next/image|favicon.ico).*)", // Protect all except specific paths
    ],
  };