import { handleAuth } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';

// In Next.js 15+, dynamic route parameters are technically synchronous if accessed directly,
// but the underlying Auth0 SDK expects the App Router format where the second argument 
// has params. If there is a compatibility issue with how @auth0/nextjs-auth0 unwraps them internally,
// we can wrap the standard handleAuth so it doesn't trip up Next 16's strict asynchronous param checks.
const authHandler = handleAuth();

export async function GET(request: NextRequest, ctx: any) {
  // If ctx.params is a Promise in Next.js 15.2+, unwrap it so the Auth0 SDK gets the raw object.
  const resolvedParams = await Promise.resolve(ctx.params);
  return authHandler(request, { params: resolvedParams });
}
