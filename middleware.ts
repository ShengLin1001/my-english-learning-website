import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const expectedUser = process.env.DEMO_USER;
  const expectedPassword = process.env.DEMO_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    return NextResponse.next();
  }

  const authorization = request.headers.get("authorization");

  if (authorization?.toLowerCase().startsWith("basic ")) {
    try {
      const bytes = Uint8Array.from(atob(authorization.slice(6)), (character) => character.charCodeAt(0));
      const credentials = new TextDecoder().decode(bytes);
      const separator = credentials.indexOf(":");

      if (
        separator >= 0 &&
        credentials.slice(0, separator) === expectedUser &&
        credentials.slice(separator + 1) === expectedPassword
      ) {
        return NextResponse.next();
      }
    } catch {
      // Invalid Basic Auth is handled by the challenge below.
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "Cache-Control": "no-store",
      "WWW-Authenticate": 'Basic realm="ResearchLoop Demo", charset="UTF-8"'
    }
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
