// ...imports existants
import React, { useEffect } from "react";

// Dans ton composant Page() AVANT le return :
const [asinTest, setAsinTest] = useState("B0XXXXXXXX"); // mets un vrai ASIN ici
const [probe, setProbe] = useState(null);

useEffect(() => {
  (async () => {
    const r = await fetch(`/api/keepa-asin?asin=${encodeURIComponent(asinTest)}&domain=CA&debug=1`);
    const j = await r.json();
    setProbe(j);
  })();
}, [asinTest]);

// Dans le JSX, au-dessus du hero par ex. :
<div className="mx-auto max-w-7xl px-4 pt-6">
  <div className="rounded-xl border bg-white p-4">
    <div className="flex items-end gap-3">
      <input
        className="border rounded-md px-3 py-2 w-64"
        placeholder="ASIN (ex: B0C...)"
        value={asinTest}
        onChange={(e)=>setAsinTest(e.target.value)}
      />
      <a className="text-sm underline" href={`/api/keepa-asin?asin=${asinTest}&domain=CA&debug=1`} target="_blank">Voir JSON</a>
    </div>
    {probe && (
      <div className="mt-3 flex items-center gap-4">
        <img src={probe.imageUrl} alt="img" className="w-28 h-28 object-cover border rounded-md" />
        <div className="text-sm text-slate-700">
          <div><b>Source</b>: {probe.source}</div>
          <div><b>Titre</b>: {probe.title || "—"}</div>
          {probe.debug && <div className="text-xs text-slate-500 mt-1">
            ENV: {String(probe.debug.hasEnv)} • domain: {probe.debug.domain} • imageKey: {String(probe.debug.imageKey)}
          </div>}
        </div>
      </div>
    )}
  </div>
</div>

