import { NextRequest, NextResponse } from 'next/server';

type RouteContext = {
    params: Promise<{ auth0?: string[] }>;
};

async function redirectToAuthRoute(request: NextRequest, context: RouteContext) {
    const { auth0 = [] } = await context.params;
    const authPath = auth0.join('/');
    const target = new URL(`/auth/${authPath}`, request.url);

    target.search = request.nextUrl.search;

    return NextResponse.redirect(target, 307);
}

export async function GET(request: NextRequest, context: RouteContext) {
    return redirectToAuthRoute(request, context);
}

export async function HEAD(request: NextRequest, context: RouteContext) {
    return redirectToAuthRoute(request, context);
}
