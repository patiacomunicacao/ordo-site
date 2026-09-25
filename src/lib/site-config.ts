import { sql } from "@/lib/neon";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SiteConfig {
  // Contato
  email: string;
  phone: string;          // exibição: (41) 99999-0000
  whatsapp: string;       // número puro para wa.me: 5541999990000
  address: string;        // linha curta: São José dos Pinhais / PR
  addressFull: string;    // rodapé: São José dos Pinhais · Curitiba e região
  businessHours: string;  // Seg–Sex, 8h às 18h
  // Redes sociais
  linkedin: string;
  instagram: string;
}

// ─── Default ──────────────────────────────────────────────────────────────────

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  email: "ordooperacional@gmail.com",
  phone: "+55 (15) 99193-0437",
  whatsapp: "5515991930437",
  address: "São José dos Pinhais / PR",
  addressFull: "São José dos Pinhais · Curitiba e região",
  businessHours: "Seg–Sex, 9h às 18h",
  linkedin: "https://linkedin.com/company/ordo-consultoria",
  instagram: "https://www.instagram.com/ordo_automacao/",
};

// ─── Schema ───────────────────────────────────────────────────────────────────

let schemaReady = false;

async function ensureSchema() {
  if (schemaReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS site_config (
      id   INTEGER PRIMARY KEY DEFAULT 1,
      data JSONB NOT NULL
    )
  `;
  await sql`
    INSERT INTO site_config (id, data)
    VALUES (1, ${JSON.stringify(DEFAULT_SITE_CONFIG)})
    ON CONFLICT (id) DO UPDATE
      SET data = EXCLUDED.data
      WHERE site_config.data->>'email' = 'contato@ordoautomacao.com.br'
         OR site_config.data->>'phone' = '(41) 99999-0000'
  `;
  schemaReady = true;
}

// ─── Public API ───────────────────────────────────────────────────────────────

const LEGACY_INSTAGRAM = /instagram\.com\/ordoconsultoria\/?$/i;

export async function getSiteConfig(): Promise<SiteConfig> {
  await ensureSchema();
  const rows = await sql`SELECT data FROM site_config WHERE id = 1`;
  const cfg = (rows[0]?.data as SiteConfig) ?? DEFAULT_SITE_CONFIG;
  // O perfil oficial é @ordo_automacao; ignora o endereço antigo salvo no banco.
  if (!cfg.instagram || LEGACY_INSTAGRAM.test(cfg.instagram)) {
    return { ...cfg, instagram: DEFAULT_SITE_CONFIG.instagram };
  }
  return cfg;
}

export async function saveSiteConfig(config: SiteConfig): Promise<void> {
  await ensureSchema();
  await sql`
    INSERT INTO site_config (id, data) VALUES (1, ${JSON.stringify(config)})
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
  `;
}
