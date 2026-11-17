import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/api";
import { getDb } from "@/lib/db";

export async function GET() {
  const auth = await requireUser(["admin"]);
  if ("response" in auth) return auth.response;

  try {
    const requests = await getDb().clientRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
      select: {
        id: true,
        reference: true,
        title: true,
        clientName: true,
        organization: true,
        submitter: { select: { name: true, organization: true } },
      },
    });

    return NextResponse.json(requests.map((request) => ({
      id: request.id,
      reference: request.reference,
      title: request.title,
      clientName: request.clientName || request.submitter?.name || request.organization || request.submitter?.organization || "Client",
    })));
  } catch (error) {
    console.error("Shipment request options lookup failed", error);
    return NextResponse.json({ error: "Could not load client requests." }, { status: 500 });
  }
}
