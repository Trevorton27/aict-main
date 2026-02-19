// apps/web/app/api/attempts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/server-db';

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      taskId,
      challengeId,
      code,
      passed,
      passedTests,
      failedTests,
      hintsUsed,
      maxHintLevel,
      timeSpentMs,
    } = body;

    // Validate required fields
    if (!taskId && !challengeId) {
      return NextResponse.json(
        { error: 'Either taskId or challengeId is required' },
        { status: 400 }
      );
    }

    if (!code || typeof passed !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields: code, passed' },
        { status: 400 }
      );
    }

    // Use challengeId as taskId if taskId is not provided
    const finalTaskId = taskId || challengeId;

    // Create attempt record
    const attempt = await prisma.attempt.create({
      data: {
        userId,
        taskId: finalTaskId,
        code,
        passed,
        passedTests: passedTests || [],
        failedTests: failedTests || [],
        hintsUsed: hintsUsed || 0,
        maxHintLevel: maxHintLevel || 0,
        timeSpentMs: timeSpentMs || null,
      },
    });

    return NextResponse.json({
      success: true,
      attempt,
    });
  } catch (error) {
    console.error('Error saving attempt:', error);
    return NextResponse.json(
      { error: 'Failed to save attempt' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('taskId');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build query
    const where: any = { userId };
    if (taskId) {
      where.taskId = taskId;
    }

    // Fetch attempts
    const attempts = await prisma.attempt.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        task: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
      },
    });

    // Calculate statistics
    const totalAttempts = attempts.length;
    const successfulAttempts = attempts.filter((a: any) => a.passed).length;
    const successRate = totalAttempts > 0
      ? ((successfulAttempts / totalAttempts) * 100).toFixed(1)
      : '0';

    return NextResponse.json({
      attempts,
      stats: {
        total: totalAttempts,
        successful: successfulAttempts,
        successRate: parseFloat(successRate),
      },
    });
  } catch (error) {
    console.error('Error fetching attempts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attempts' },
      { status: 500 }
    );
  }
}
