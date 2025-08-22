import { auth, type UserType } from '@/app/(auth)/auth';
import { getRemainingMessagesByUserId } from '@/lib/db/queries';
import { ChatSDKError } from '@/lib/errors';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return new ChatSDKError('unauthorized:chat').toResponse();
    }

    const userType: UserType = session.user.type;

    const messageUsage = await getRemainingMessagesByUserId({
      id: session.user.id,
      userType,
    });

    return Response.json(messageUsage, { status: 200 });
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    console.error('Unexpected error in message-usage route:', error);
    return new ChatSDKError('offline:chat').toResponse();
  }
}
