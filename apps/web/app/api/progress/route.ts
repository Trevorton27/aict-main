// apps/web/app/api/progress/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/server-db';

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

    // Fetch all progress records for the user
    const progressRecords = await prisma.progress.findMany({
      where: { userId },
      include: {
        concept: {
          select: {
            id: true,
            name: true,
            description: true,
            difficulty: true,
          },
        },
      },
      orderBy: { mastery: 'desc' },
    });

    // Calculate overall mastery score
    const totalMastery = progressRecords.reduce((sum: number, p: any) => sum + p.mastery, 0);
    const avgMastery = progressRecords.length > 0
      ? Math.round(totalMastery / progressRecords.length)
      : 800; // Default starting mastery

    // Calculate total attempts and successes
    const totalAttempts = progressRecords.reduce((sum: number, p: any) => sum + p.attempts, 0);
    const totalSuccesses = progressRecords.reduce((sum: number, p: any) => sum + p.successes, 0);
    const successRate = totalAttempts > 0
      ? ((totalSuccesses / totalAttempts) * 100).toFixed(1)
      : '0';

    return NextResponse.json({
      progress: progressRecords,
      overall: {
        mastery: avgMastery,
        totalAttempts,
        totalSuccesses,
        successRate: parseFloat(successRate),
      },
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}
