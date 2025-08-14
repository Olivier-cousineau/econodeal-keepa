
export const runtime = "edge";

function monthsFR(){ return ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"]; }

export async function GET(req){
  const { searchParams } = new URL(req.url);
  const asin = searchParams.get("asin") || "DEMO";
  const domain = (searchParams.get("domain") || "US").toUpperCase();
  const key = process.env.KEEPA_API_KEY;
  const demo = monthsFR().map((m,i)=>({ m, units: Math.round(220 + Math.sin(i/2)*40 + (i%3===0?20:0)) }));

  if (!key || asin === "DEMO"){
    const avg = Math.round(demo.reduce((s,x)=>s+x.units,0)/demo.length);
    return new Response(JSON.stringify({ asin, title: "Produit démo", imageUrl: "https://placehold.co/600x400?text=ASIN+DEMO", sales: demo, avg, source:"demo" }), { headers: { "Content-Type":"application/json" } });
  }

  const map = { US:1, UK:2, DE:3, FR:4, JP:5, CA:6, IT:8, ES:9 };
  const domainCode = map[domain] || 1;

  try{
    const url = `https://api.keepa.com/product?key=${key}&domain=${domainCode}&asin=${encodeURIComponent(asin)}&stats=1`;
    const r = await fetch(url);
    if(!r.ok) throw new Error("Keepa error");
    const j = await r.json();
    const p = j.products?.[0];
    if(!p) throw new Error("No product");

    const imageKey = (p.imagesCSV || "").split(",")[0] || null;
    const imageUrl = imageKey ? `https://m.media-amazon.com/images/I/${imageKey}.jpg` : "https://placehold.co/600x400?text=Image+non+disponible";
    const drops = p.stats?.salesRankDrops30 || 0;
    const factor = Math.max(0.2, Math.min(4, drops/40 || 1));
    const sales = demo.map(x=>({ ...x, units: Math.round(x.units * factor) }));
    const avg = Math.round(sales.reduce((s,x)=>s+x.units,0)/sales.length);

    return new Response(JSON.stringify({ asin, title: p.title || "Sans titre", imageUrl, sales, avg, source:"keepa" }), { headers: { "Content-Type":"application/json" } });
  }catch(e){
    const avg = Math.round(demo.reduce((s,x)=>s+x.units,0)/demo.length);
    return new Response(JSON.stringify({ asin, title: "Indispo", imageUrl: "https://placehold.co/600x400?text=Indisponible", sales: demo, avg, source:"fallback" }), { headers: { "Content-Type":"application/json" } });
  }
}
