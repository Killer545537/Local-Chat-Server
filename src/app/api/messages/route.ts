import { NextRequest, NextResponse } from 'next/server';
import { addMessage, getMessages } from '@/db/message_query';

export const GET = async (request: NextRequest) => {
    console.log(`Received GET request. URL: ${request.nextUrl.pathname}${request.nextUrl.search}`);

    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    let queryLimit: number | undefined = undefined;

    if (limitParam) {
        const parsedLimit = parseInt(limitParam, 10);
        if (!isNaN(parsedLimit) && parsedLimit > 0) {
            queryLimit = parsedLimit;
        } else {
            console.warn(`Invalid limit parameter received: ${limitParam}`);
            return NextResponse.json({ error: 'Invalid limit parameter. Must be a positive number.' }, { status: 400 });
        }
    }

    try {
        const allMessages = await getMessages({ limit: queryLimit, order: 'desc' });

        console.log(`Successfully processed request. Returning ${allMessages.length} messages.`);

        return NextResponse.json({ messages: allMessages }, { status: 200 });
    } catch (error) {
        console.log(`Failed to process request:`, error instanceof Error ? error.message : error);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 400 });
    }
};

export const POST = async (request: NextRequest) => {
    console.log(`Received POST request to add message URL: ${request.nextUrl.pathname}`);

    try {
        const body = await request.json();
        const { senderId, content } = body;

        if (!senderId || !content) {
            console.warn('Missing senderId or content in request body');
            return NextResponse.json({ error: 'Missing senderId or content' }, { status: 400 });
        }

        if (typeof senderId !== 'string' || typeof content !== 'string') {
            console.log('Invalid type for senderId or content');
            return NextResponse.json({ error: 'senderId or content must be strings' }, { status: 400 });
        }

        const newMessage = await addMessage({ senderId, content });

        console.log(`Successfully created new message with id: ${newMessage.id}`);
        return NextResponse.json({ message: 'Message created successfully', data: newMessage }, { status: 201 });
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.error('Invalid JSON in request body:', error);
            return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
        }

        console.error(`Failed to process POST request:`, error instanceof Error ? error.message : error);
        return NextResponse.json({ error: 'Failed to create message' }, { status: 400 });
    }
};