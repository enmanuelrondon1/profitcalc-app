//src/app/api/callback/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL a la que redirigir después de que se complete el proceso de inicio de sesión
  return NextResponse.redirect(new URL('/projects', requestUrl.origin));
}