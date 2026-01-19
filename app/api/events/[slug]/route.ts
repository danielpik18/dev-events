import { Event, IEvent } from "@/database";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

type Params = {
    params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
    try {
        // Connect to db
        await connectToDatabase();

        // extract slug from params
        const { slug } = await params;
        

        // validate slug
        if (!slug || typeof slug !== 'string') {
            return NextResponse.json({message: "Slug is missing or invalid"}, {status: 400});
        }

        // sanitize slug
        const sanitizedSlug = slug.trim().toLowerCase();

        // query event by slug
        const event: IEvent | null = await Event.findOne({slug: sanitizedSlug}).lean();

        // handle event not found
        if(!event) {
            return NextResponse.json({message: "Event not found"}, {status: 404});
        }

        // return success response
        return NextResponse.json({message: "Event fetched successfully", event: event}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: "Failed to fetch event", error: error instanceof Error ? error.message : "Unknown error"}, {status: 500});
    }
}