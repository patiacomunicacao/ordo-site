import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSiteConfig, saveSiteConfig } from "@/lib/site-config";
import { parseBody } from "@/lib/admin-api";
import { SiteConfigSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function GET() {
  const config = await getSiteConfig();
  return NextResponse.json(config);
}

export async function PUT(req: NextRequest) {
  const { data, error } = await parseBody(req, SiteConfigSchema);
  if (error) return error;

  try {
    await saveSiteConfig(data);
    revalidatePath("/");
    revalidatePath("/blog");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });
  }
}
