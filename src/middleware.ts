import { analytics } from "@/utils/analytics";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req:NextRequest) {
    if (req.nextUrl.pathname === '/') {
        //track analytics event
        try {
            analytics.track("pageview", {
                page: '/',
                country: req.geo?.country
            })
        } catch (error) {
            //fail sliently
            console.error(error);
        }
    }

    return NextResponse.next()
}

export const matcher = {
    matcher:['/'],
}