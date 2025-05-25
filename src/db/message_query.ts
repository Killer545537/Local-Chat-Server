import { db } from '@/db';
import { messages } from '@/db/schema';
import { asc, desc } from 'drizzle-orm';

interface GetMessagesOptions {
    limit?: number,
    order?: 'asc' | 'desc'
}

export const getMessages = async ({ limit, order = 'desc' }: GetMessagesOptions) => {
    console.log(`Attempting to fetch messages/ Limit: ${limit}, Order: ${order}`);

    try {
        const query = db.select().from(messages)
            .orderBy(order === 'asc' ? asc(messages.sentAt) : desc(messages.sentAt));

        if (limit !== undefined && limit > 0) {
            query.limit(limit);
        }

        const fetchedMessages = await query;
        console.log(`Successfully fetched ${fetchedMessages.length} messages`);
        return fetchedMessages;
    } catch (error) {
        console.error(`Error fetching messages:`, error);
        throw new Error('Failed to retrieve messages from database.');
    }
};

interface AddMessagePayload {
    senderId: string,
    content: string,
}

export const addMessage = async ({ senderId, content }: AddMessagePayload) => {
    console.log(`Attempting to add a new message for senderID: ${senderId}`);

    try {
        const [newMessage] = await db.insert(messages).values({
            senderId,
            content,
        }).returning();

        console.log(`Successfully added message with id: ${newMessage.id}`);
        return newMessage;
    } catch (error) {
        console.log(`Error adding message:`, error);
        throw new Error('Failed to add message to database');
    }
};