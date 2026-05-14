import { NextResponse } from "next/server";
import { getLeads } from "@/lib/leads";

export const runtime = "nodejs";

export async function GET() {
  const leads = await getLeads();
  return NextResponse.json(leads);
}
