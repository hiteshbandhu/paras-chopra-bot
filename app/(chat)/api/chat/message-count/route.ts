import { type NextRequest, NextResponse } from 'next/server';
import { getMessageCountByUserId } from '@/lib/db/queries';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 },
      );
    }

    // Get message count for the last 24 hours (24 * 60 = 1440 minutes)
    const messageCount = await getMessageCountByUserId({
      id: userId,
      differenceInHours: 24,
    });

    return NextResponse.json({ count: messageCount });
  } catch (error) {
    console.error('Error fetching message count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch message count' },
      { status: 500 },
    );
  }
}
