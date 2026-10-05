// Next.js 16 renamed the `middleware.ts` convention to `proxy.ts` (same
// mechanism, new file/export name). See node_modules/next/dist/docs/01-app/
// 03-api-reference/03-file-conventions/proxy.md.
export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|sitemap.xml|robots.txt).*)"],
};
