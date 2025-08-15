export const runtime = "edge";

// Mois FR
function monthsFR(){ return ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"]; }

export async function GET(req){
  const { searchParams } = new URL(req.url);
  const asin   = searchParams.get("asin")   || "DEMO";
  const domain = (searchParams.get("domain") || "CA").toUpperCase(); // défaut CA
  const debug  = searchParams.get("debug") === "1";

  const key = process.env.KEEPA_API_KEY || "";
  const demo = monthsFR().map((m,i)=>({ m, units: Math.round(220 + Math.sin(i/2)*40 + (i%3===0?20:0)) }));

  // Pas de clé ou ASIN démo -> réponse claire
  if (!key || asin === "DEMO") {
    const avg = Math.round(demo.reduce((s,x)=>s+x.units,0)/demo.length);
    return json({
      asin, title: "DEMO",
      imageUrl: "https://placehold.co/600x400?text=ASIN+DEMO",
      sales: demo, avg,
      source: !key ? "no-env" : "demo",
      debug: { hasEnv: !!key, asin, domain }
    });
  }

  const map = { US:1, UK:2, DE:3, FR:4, JP:5, CA:6, IT:8, ES:9 };
  const domainCode = map[domain] || 1;

  try {
    const url = `https://api.keepa.com/product?key=${key}&domain=${domainCode}&asin=${encodeURIComponent(asin)}&stats=1`;
    const r   = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error("Keepa HTTP "+r.status);
    const j   = await r.json();
    const p   = j.products?.[0];
    if (!p) throw new Error("No product for ASIN");

    // Image Amazon via imagesCSV
    const imageKey = (p.imagesCSV || "").split(",")[0] || null;
    const imageUrl = imageKey
      ? `https://m.media-amazon.com/images/I/${imageKey}.jpg`
      : "https://placehold.co/600x400?text=Image+indisponible";

    // Estimation simple des ventes
    const drops  = p.stats?.salesRankDrops30 || 0;
    const factor = Math.max(0.2, Math.min(4, drops/40 || 1));
    const months = monthsFR().map((m,i)=>({ m, units: Math.round(220 + Math.sin(i/2)*40 + (i%3===0?20:0)) }));
    const sales  = months.map(x => ({ ...x, units: Math.round(x.units * factor) }));
    const avg    = Math.round(sales.reduce((s,x)=>s+x.units,0) / sales.length);

    return json({
      asin, title: p.title || "Sans titre", imageUrl, sales, avg, source: "keepa",
      debug: debug ? { hasEnv: !!key, domain, domainCode, tokensLeft: j.tokensLeft, hasImagesCSV: !!p.imagesCSV, imageKey } : undefined
    });
  } catch (e) {
    const avg = Math.round(demo.reduce((s,x)=>s+x.units,0)/demo.length);
    return json({
      asin, title: "Fallback",
      imageUrl: "https://placehold.co/600x400?text=Fallback",
      sales: demo, avg, source: "fallback",
      debug: debug ? { error: String(e), hasEnv: !!key, domain, domainCode } : undefined
    });
  }
}

function json(obj){ return new Response(JSON.stringify(obj), { headers: { "Content-Type":"application/json" } }); }


