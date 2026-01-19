import { Event } from "@/database";
import connectToDatabase from "@/lib/mongodb";
import {v2 as cloudinary} from "cloudinary";

/*
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
*/

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await connectToDatabase();

        const formData = await request.formData();

        let event;

        try {
            event = Object.fromEntries(formData.entries());
        } catch (error) {
            return NextResponse.json({error: "Invalid form data"}, {status: 400});
        }

        const file = formData.get("image") as File | null;

        if(!file) return NextResponse.json({error: "Image file is required"}, {status: 400});

        const tags = JSON.parse(formData.get("tags") as string);
        const agenda = JSON.parse(formData.get("agenda") as string);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({resource_type: 'image', folder: 'events'}, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }).end(buffer);
        });

        event.image = (uploadResult as { secure_url: string }).secure_url;

        const createdEvent = await Event.create({
            ...event,
            tags,
            agenda
        });

        if (createdEvent) {
            return NextResponse.json({message: "Event created successfully", data: createdEvent}, {status: 201});
        }

    } catch (error) {
        return NextResponse.json({message: "Failed to create event", error: error instanceof Error ? error.message : "Unknown error"}, {status: 500});
    }
}

export async function GET() {
    try {
        await connectToDatabase();

        const events = await Event.find().sort({createdAt: -1});

        return NextResponse.json({message: "Events fetched successfully", data: events}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: "Failed to fetch events", error: error instanceof Error ? error.message : "Unknown error"}, {status: 500});
    }
}