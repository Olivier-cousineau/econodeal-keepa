
"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Tag, CheckCircle2, X, BarChart3 } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend
} from "recharts";

const FALLBACK_IMG = "https://placehold.co/800x600?text=EconoDeal";

const STORES = [
  { value: "all", fr: "Tous", en: "All" },
  { value: "ebay", fr: "eBay", en: "eBay" },
  { value: "walmart", fr: "Walmart", en: "Walmart" },
  { value: "costco", fr: "Costco", en: "Costco" },
  { value: "canadian tire", fr: "Canadian Tire", en: "Canadian Tire" },
  { value: "home depot", fr: "Home Depot", en: "Home Depot" },
  { value: "best buy", fr: "Best Buy", en: "Best Buy" },
];

const DEALS = [
  { id: "eb-1", title_fr: "Casque Bluetooth ANC", title_en: "Bluetooth ANC Headphones", img: "https://placehold.co/1200x800/28a745/FFF?text=eBay+1", price: 79.99, oldPrice: 189.99, store: "eBay", link: "https://www.ebay.ca/", badge: "-58%", asin: "DEMO" },
  { id: "wm-1", title_fr: "TV 55\" 4K", title_en: "55\" 4K TV", img: "https://placehold.co/1200x800/0d6efd/FFF?text=Walmart+1", price: 499.0, oldPrice: 799.0, store: "Walmart", link: "https://www.walmart.ca/", badge: "-38%", asin: "DEMO" },
  { id: "cc-1", title_fr: "Cafetière espresso", title_en: "Espresso Machine", img: "https://placehold.co/1200x800/20c997/FFF?text=Costco+1", price: 299.0, oldPrice: 499.0, store: "Costco", link: "https://www.costco.ca/", badge: "-40%", asin: "DEMO" },
  { id: "ct-1", title_fr: "Barbecue 4 brûleurs", title_en: "4-Burner BBQ", img: "https://placehold.co/1200x800/f39c12/FFF?text=Canadian+Tire+1", price: 399.0, oldPrice: 699.0, store: "Canadian Tire", link: "https://www.canadiantire.ca/", badge: "-43%", asin: "DEMO" },
  { id: "hd-1", title_fr: "Perceuse Pro 20V", title_en: "Pro Drill 20V", img: "https://placehold.co/1200x800/fd7e14/FFF?text=Home+Depot+1", price: 89.0, oldPrice: 159.0, store: "Home Depot", link: "https://www.homedepot.ca/", badge: "-44%", asin: "DEMO" },
  { id: "bb-1", title_fr: "Portable 15\" i5", title_en: "15\" Laptop i5", img: "https://placehold.co/1200x800/6610f2/FFF?text=Best+Buy+1", price: 699.0, oldPrice: 999.0, store: "Best Buy", link: "https://www.bestbuy.ca/", badge: "-30%", asin: "DEMO" },
];

const LANG = {
  fr:{slogan:"Le meilleur outil pour dénicher, revendre et économiser.",ctaPrimary:"Rejoindre la liste d’attente",ctaSecondary:"Voir les spéciaux",heroTitle:"EconoDeal",heroSub:"Liquidations en temps réel • Par magasin • Par SKU",sectionDeals:"Spéciaux (démo/Keepa)",badgeDemo:"Démo",footer:"© "+new Date().getFullYear()+" EconoDeal.",langSwitch:"EN",storeFilterLabel:"Magasins",storeEmpty:"Aucun deal pour ce magasin (démo).",keepaTitle:"Ventes Amazon (Keepa)",avgPerMonth:"Moyenne / mois"},
  en:{slogan:"The best tool to find, resell and save.",ctaPrimary:"Join the waitlist",ctaSecondary:"See specials",heroTitle:"EconoDeal",heroSub:"Real-time clearances • By store • By SKU",sectionDeals:"Specials (demo/Keepa)",badgeDemo:"Demo",footer:"© "+new Date().getFullYear()+" EconoDeal.",langSwitch:"FR",storeFilterLabel:"Stores",storeEmpty:"No deals for this store (demo).",keepaTitle:"Amazon Sales (Keepa)",avgPerMonth:"Average / month"},
};

function demoSales(){
  const m=["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"];
  return m.map((x,i)=>({m:x,units:Math.round(220+Math.sin(i/2)*40+(i%3===0?20:0))}));
}
const avg = arr=>Math.round(arr.reduce((s,x)=>s+x.units,0)/arr.length);

export default function Page(){
  const [lang,setLang]=useState("fr");
  const T = useMemo(()=>lang==="fr"?LANG.fr:LANG.en,[lang]);
  const [storeValue,setStoreValue]=useState("all");
  const [selected,setSelected]=useState(null);
  const [keepa,setKeepa]=useState(null);
  const [loading,setLoading]=useState(false);

  const filtered = useMemo(()=>DEALS.filter(d=>storeValue==="all"||d.store.toLowerCase()===storeValue),[storeValue]);

  async function openDealModal(d){
    setSelected(d); setKeepa(null); setLoading(true);
    try{
      const r = await fetch(`/api/keepa-asin?asin=${encodeURIComponent(d.asin||"DEMO")}&domain=CA`);
      const j = await r.json(); setKeepa(j);
    }catch(e){ setKeepa({ sales: demoSales(), avg: avg(demoSales()), source:"fallback"}); }
    finally{ setLoading(false); }
  }
  const closeModal=()=>{ setSelected(null); setKeepa(null); };

  return (<div className="min-h-screen text-slate-800">
    <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-emerald-100">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-sm"><Tag className="h-5 w-5 text-white"/></div>
          <div className="leading-tight"><p className="text-xl font-bold">EconoDeal</p><p className="text-xs text-slate-500">{T.slogan}</p></div>
        </div>
        <div className="flex items-center gap-2">
          <select value={storeValue} onChange={e=>setStoreValue(e.target.value)} className="text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">
            {STORES.map(o=><option key={o.value} value={o.value}>{lang==='fr'?o.fr:o.en}</option>)}
          </select>
          <button onClick={()=>setLang(l=>l==='fr'?'en':'fr')} className="text-sm px-3 py-1 rounded-full border border-slate-200 hover:bg-slate-50">{T.langSwitch}</button>
        </div>
      </div>
    </header>

    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.6}} className="text-4xl md:text-6xl font-extrabold tracking-tight">{T.heroTitle}</motion.h1>
          <p className="mt-3 text-lg text-slate-600">{T.heroSub}</p>
        </div>
        <motion.div initial={{opacity:0,scale:.98}} animate={{opacity:1,scale:1}} transition={{duration:.6,delay:.1}} className="relative">
          <div className="aspect-[16/10] w-full rounded-3xl bg-white shadow-lg p-4 border border-emerald-100">
            <div className="grid grid-cols-3 gap-3">
              {DEALS.slice(0,6).map(d=>(
                <div key={d.id} className="rounded-xl overflow-hidden border">
                  <img src={d.img} alt="deal" className="h-28 w-full object-cover" loading="lazy" onError={(e)=>{e.currentTarget.src=FALLBACK_IMG;}}/>
                  <div className="p-2 text-xs">
                    <p className="font-medium line-clamp-1">{lang==='fr'?d.title_fr:d.title_en}</p>
                    <div className="flex items-baseline gap-2 mt-1"><span className="font-semibold">${d.price.toFixed(2)}</span><span className="text-slate-400 line-through">${d.oldPrice.toFixed(2)}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-8" id="deals">
      <div className="flex items-end justify-between mb-4"><h2 className="text-2xl md:text-3xl font-bold">{T.sectionDeals}</h2><span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 border">{T.badgeDemo}</span></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map(d=>(
          <button key={d.id} onClick={()=>openDealModal(d)} className="text-left group rounded-2xl border bg-white overflow-hidden hover:shadow-md transition block">
            <div className="relative">
              <img src={d.img} alt={d.title_fr} className="h-48 w-full object-cover" loading="lazy" onError={(e)=>{e.currentTarget.src=FALLBACK_IMG;}}/>
              <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-black/70 text-white">{d.badge}</span>
            </div>
            <div className="p-4">
              <p className="font-semibold line-clamp-2 group-hover:underline">{lang==='fr'?d.title_fr:d.title_en}</p>
              <div className="mt-2 flex items-baseline gap-2"><span className="text-lg font-bold">${d.price.toFixed(2)}</span><span className="text-slate-400 line-through">${d.oldPrice.toFixed(2)}</span></div>
              <div className="mt-3 text-xs text-slate-500">{d.store}</div>
            </div>
          </button>
        ))}
        {filtered.length===0 && (<div className="col-span-full rounded-2xl border bg-white p-6 text-slate-600 text-center">Aucun deal pour ce magasin (démo).</div>)}
      </div>
    </section>

    {selected && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal>
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="h-14 w-20 overflow-hidden rounded-md border"><img src={selected.img} alt="deal" className="h-full w-full object-cover" onError={(e)=>{e.currentTarget.src=FALLBACK_IMG;}}/></div>
            <div><h3 className="font-semibold leading-tight">{lang==='fr'?selected.title_fr:selected.title_en}</h3><p className="text-sm text-slate-500 flex items-center gap-2"><BarChart3 className="h-4 w-4"/>{T.keepaTitle}{selected.asin&&(<span className="text-xs text-slate-400"> (ASIN: {selected.asin})</span>)}</p></div>
          </div>
          <button onClick={closeModal} className="text-slate-500 hover:text-slate-700 p-2 rounded-lg border"><X className="h-4 w-4"/></button>
        </div>
        <div className="grid md:grid-cols-2 gap-6 p-5">
          <div>
            <h4 className="font-medium mb-2">Ventes / mois {keepa?.source && <span className="text-xs text-slate-400">[{keepa.source}]</span>}</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={(keepa?.sales)||demoSales()} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="m" /><YAxis /><Tooltip /><Legend />
                  <Bar dataKey="units" name={lang==='fr'?'Ventes':'Sales'} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">{T.avgPerMonth}</h4>
            <div className="rounded-xl border p-5 bg-emerald-50">
              <p className="text-5xl font-extrabold text-emerald-700">{keepa?.avg ??  avg(demoSales())}</p>
              <p className="text-slate-600 mt-1">{lang==='fr'?'unités / mois (estimation)':'units / month (estimate)'}</p>
            </div>
            <a href={selected.link} target="_blank" rel="noreferrer" className="mt-4 inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">{lang==='fr'?'Voir le deal':'View deal'}</a>
          </div>
        </div>
      </div>
    </div>)}

    <footer className="border-t bg-white mt-8"><div className="mx-auto max-w-7xl px-4 py-6 text-sm text-slate-500">© {new Date().getFullYear()} EconoDeal</div></footer>
  </div>);
}
