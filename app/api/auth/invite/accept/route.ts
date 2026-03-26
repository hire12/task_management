import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: "Missing invitation token." }, { status: 400 });
    }

    const invitation = await db.invitation.findUnique({
      where: { token },
      include: { organization: true },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found or invalid." }, { status: 404 });
    }

    if (invitation.status === "accepted") {
      return NextResponse.json({ message: "Already accepted." }, { status: 200 });
    }

    if (invitation.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invitation has expired." }, { status: 400 });
    }

    // Add user as member to organization
    await db.member.upsert({
      where: {
        organizationId_userId: {
          organizationId: invitation.organizationId,
          userId: session.user.id,
        },
      },
      update: {
        role: invitation.role,
      },
      create: {
        organizationId: invitation.organizationId,
        userId: session.user.id,
        role: invitation.role,
      },
    });

    // Mark invitation as accepted
    await db.invitation.update({
      where: { id: invitation.id },
      data: { status: "accepted" },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        action: "MEMBER_JOINED",
        details: {
          organizationId: invitation.organizationId,
          userId: session.user.id,
          userName: session.user.name,
          role: invitation.role,
        },
      },
    });

    return NextResponse.json({
      success: true,
      organizationName: invitation.organization.name,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
