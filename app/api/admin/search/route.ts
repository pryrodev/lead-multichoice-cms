import { NextResponse } from "next/server";
import { requireEngagementPermission } from "@/lib/auth/api";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  const auth = await requireEngagementPermission();
  if ("response" in auth) return auth.response;

  const term = new URL(request.url).searchParams.get("q")?.trim().slice(0, 80) ?? "";
  if (term.length < 2) return NextResponse.json({ results: [] });

  try {
    const db = getDb();
    const requestRows = await db.clientRequest.findMany({
      where: { OR: [{ reference: { contains: term } }, { title: { contains: term } }, { clientName: { contains: term } }, { organization: { contains: term } }, { category: { contains: term } }] },
      orderBy: { updatedAt: "desc" }, take: 5,
      select: { id: true, reference: true, title: true, clientName: true, organization: true },
    });

    const results = requestRows.map((row) => ({
      id: `request-${row.id}`, kind: "Client request", title: row.title,
      description: [row.reference, row.clientName, row.organization].filter(Boolean).join(" · "),
      href: `/admin/client-requests?q=${encodeURIComponent(term)}`,
    }));

    if (auth.user.role === "admin") {
      const [opportunities, engagements, tenders, shipments] = await Promise.all([
        db.opportunity.findMany({
          where: { OR: [{ reference: { contains: term } }, { title: { contains: term } }, { buyer: { contains: term } }, { source: { contains: term } }, { externalReference: { contains: term } }] },
          orderBy: { updatedAt: "desc" }, take: 5,
          select: { id: true, reference: true, title: true, buyer: true, source: true },
        }),
        db.engagement.findMany({
          where: { OR: [{ reference: { contains: term } }, { title: { contains: term } }, { buyer: { contains: term } }, { supplier: { contains: term } }, { owner: { contains: term } }] },
          orderBy: { updatedAt: "desc" }, take: 5,
          select: { id: true, reference: true, title: true, buyer: true, supplier: true },
        }),
        db.tender.findMany({
          where: { OR: [{ reference: { contains: term } }, { title: { contains: term } }, { entity: { contains: term } }, { portal: { contains: term } }, { owner: { contains: term } }] },
          orderBy: { updatedAt: "desc" }, take: 5,
          select: { id: true, reference: true, title: true, entity: true, portal: true },
        }),
        db.shipment.findMany({
          where: { OR: [{ reference: { contains: term } }, { cargo: { contains: term } }, { corridor: { contains: term } }, { origin: { contains: term } }, { destination: { contains: term } }] },
          orderBy: { updatedAt: "desc" }, take: 5,
          select: { id: true, reference: true, cargo: true, origin: true, destination: true },
        }),
      ]);

      results.push(
        ...opportunities.map((row) => ({ id: `opportunity-${row.id}`, kind: "Opportunity", title: row.title, description: [row.reference, row.buyer, row.source].filter(Boolean).join(" · "), href: `/admin/opportunities?q=${encodeURIComponent(term)}` })),
        ...engagements.map((row) => ({ id: `engagement-${row.id}`, kind: "Engagement", title: row.title, description: [row.reference, row.buyer, row.supplier].filter(Boolean).join(" · "), href: `/admin/engagements?q=${encodeURIComponent(term)}` })),
        ...tenders.map((row) => ({ id: `tender-${row.id}`, kind: "Tender", title: row.title, description: [row.reference, row.entity, row.portal].filter(Boolean).join(" · "), href: `/admin/tenders?q=${encodeURIComponent(term)}` })),
        ...shipments.map((row) => ({ id: `shipment-${row.id}`, kind: "Shipment", title: row.cargo, description: [row.reference, `${row.origin} → ${row.destination}`].filter(Boolean).join(" · "), href: `/admin/logistics?q=${encodeURIComponent(term)}` })),
      );
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Admin search failed", error);
    return NextResponse.json({ error: "Could not search admin records." }, { status: 500 });
  }
}
