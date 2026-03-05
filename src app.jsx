import { useState, useCallback } from "react";

const STAGES = ["Neu", "Kontaktiert", "Qualifiziert", "Angebot", "Gewonnen", "Verloren"];
const STAGE_COLORS = {
  "Neu": "bg-blue-100 text-blue-800 border-blue-200",
  "Kontaktiert": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Qualifiziert": "bg-purple-100 text-purple-800 border-purple-200",
  "Angebot": "bg-orange-100 text-orange-800 border-orange-200",
  "Gewonnen": "bg-green-100 text-green-800 border-green-200",
  "Verloren": "bg-red-100 text-red-800 border-red-200",
};
const COLORS = ["bg-blue-500","bg-purple-500","bg-green-500","bg-orange-500","bg-pink-500","bg-teal-500","bg-red-500","bg-indigo-500"];
const fmt = n => new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR"}).format(n||0);
const fmtN = n => new Intl.NumberFormat("de-DE").format(n||0);

function stageColor(stage) {
  return STAGE_COLORS[stage] || "bg-gray-100 text-gray-700 border-gray-200";
}

if (!window._crm) {
  window._crm = {
    leads: [
      {id:"l1",name:"Anna Müller",email:"anna@example.com",phone:"+49 151 1234567",city:"Berlin",product:"Solar Anlage",listId:"list1",campaign:"Sommer Kampagne",stage:"Neu",deal:1200,created:"2026-03-01",comments:[]},
      {id:"l2",name:"Thomas Becker",email:"thomas@example.com",phone:"+49 170 9876543",city:"München",product:"Wärmepumpe",listId:"list2",campaign:"Frühling Aktion",stage:"Kontaktiert",deal:2500,created:"2026-03-02",comments:["Hat Interesse gezeigt"]},
      {id:"l3",name:"Sara Klein",email:"sara@example.com",phone:"+49 160 5554433",city:"Hamburg",product:"Solar Anlage",listId:"list1",campaign:"Sommer Kampagne",stage:"Qualifiziert",deal:3800,created:"2026-02-20",comments:["Budget bestätigt"]},
      {id:"l4",name:"Max Weber",email:"max@example.com",phone:"+49 172 3334455",city:"Frankfurt",product:"Wärmepumpe",listId:"list2",campaign:"Retargeting Q1",stage:"Angebot",deal:5000,created:"2026-02-15",comments:["Angebot gesendet"]},
      {id:"l5",name:"Julia Hoffmann",email:"julia@example.com",phone:"+49 163 7778899",city:"Köln",product:"Solar Anlage",listId:"list1",campaign:"Frühling Aktion",stage:"Gewonnen",deal:4200,created:"2026-02-10",comments:["Deal abgeschlossen! 🎉"]},
      {id:"l6",name:"Peter Schulz",email:"peter@example.com",phone:"+49 157 2221100",city:"Düsseldorf",product:"Beratung",listId:"list3",campaign:"Retargeting Q1",stage:"Erstgespräch",deal:0,created:"2026-02-05",comments:[]},
      {id:"l7",name:"Lisa Braun",email:"lisa@example.com",phone:"+49 176 6665544",city:"Stuttgart",product:"Solar Anlage",listId:"list1",campaign:"Sommer Kampagne",stage:"Gewonnen",deal:3100,created:"2026-02-28",comments:[]},
      {id:"l8",name:"David Fischer",email:"david@example.com",phone:"+49 151 9990011",city:"Leipzig",product:"Wärmepumpe",listId:"list2",campaign:"Frühling Aktion",stage:"Neu",deal:1800,created:"2026-03-04",comments:[]},
    ],
    lists: [
      {id:"list1",name:"Solar Anlage",color:"bg-orange-500",stages:["Neu","Kontaktiert","Qualifiziert","Angebot","Gewonnen","Verloren"],campaign:"Sommer Kampagne"},
      {id:"list2",name:"Wärmepumpe",color:"bg-blue-500",stages:["Neu","Kontaktiert","Qualifiziert","Angebot","Gewonnen","Verloren"],campaign:"Frühling Aktion"},
      {id:"list3",name:"Beratung",color:"bg-purple-500",stages:["Erstgespräch","Analyse","Angebot","Abschluss","Verloren"],campaign:"Retargeting Q1"},
    ],
    config: {token:"",adAccount:""},
    campaigns: [
      {id:"c1",name:"Sommer Kampagne",status:"ACTIVE",spend:1240.50,impressions:85400,clicks:1820,leads:34,cpl:36.49},
      {id:"c2",name:"Frühling Aktion",status:"ACTIVE",spend:980.00,impressions:62000,clicks:1340,leads:28,cpl:35.00},
      {id:"c3",name:"Retargeting Q1",status:"PAUSED",spend:450.00,impressions:21000,clicks:890,leads:12,cpl:37.50},
    ],
  };
}

function useStore(key) {
  const [val, setVal] = useState(() => window._crm[key]);
  const save = useCallback(v => {
    const next = typeof v === "function" ? v(window._crm[key]) : v;
    window._crm[key] = next;
    setVal(next);
  }, [key]);
  return [val, save];
}

function Modal({ onClose, children, wide }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl ${wide ? "w-full max-w-2xl" : "w-full max-w-lg"} max-h-[90vh] overflow-y-auto`}>
        {children}
      </div>
    </div>
  );
}

function ListConfig({ list, campaigns, onSave, onClose }) {
  const isNew = !list.id;
  const [name, setName] = useState(list.name || "");
  const [color, setColor] = useState(list.color || COLORS[0]);
  const [campaign, setCampaign] = useState(list.campaign || "");
  const [stages, setStages] = useState(list.stages || [...STAGES]);
  const [newStage, setNewStage] = useState("");

  const addStage = () => { if (newStage.trim()) { setStages(s => [...s, newStage.trim()]); setNewStage(""); }};
  const removeStage = i => setStages(s => s.filter((_,j)=>j!==i));
  const moveStage = (i, dir) => {
    const arr = [...stages]; const j = i+dir;
    if (j<0||j>=arr.length) return;
    [arr[i],arr[j]]=[arr[j],arr[i]]; setStages(arr);
  };

  return (
    <Modal onClose={onClose} wide>
      <div className="flex items-center justify-between p-5 border-b">
        <h3 className="text-lg font-bold text-gray-800">{isNew?"Neue Liste erstellen":"Liste konfigurieren"}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
      </div>
      <div className="p-5 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Listen-Name</label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={name} onChange={e=>setName(e.target.value)} placeholder="z.B. Solar Anlage"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Verknüpfte Kampagne</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={campaign} onChange={e=>setCampaign(e.target.value)}>
              <option value="">– Keine Kampagne –</option>
              {campaigns.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
              <option value="__manual__">Manuelle Eingabe...</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">Listenfarbe</label>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map(c=>(
              <button key={c} onClick={()=>setColor(c)} className={`w-8 h-8 rounded-full ${c} ${color===c?"ring-2 ring-offset-2 ring-blue-500":""} transition`}/>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">Pipeline-Stufen</label>
          <div className="space-y-2 mb-3">
            {stages.map((s,i)=>(
              <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <span className="flex-1 text-sm text-gray-700">{s}</span>
                <button onClick={()=>moveStage(i,-1)} disabled={i===0} className="text-gray-400 hover:text-gray-600 disabled:opacity-20 text-xs px-1">▲</button>
                <button onClick={()=>moveStage(i,1)} disabled={i===stages.length-1} className="text-gray-400 hover:text-gray-600 disabled:opacity-20 text-xs px-1">▼</button>
                <button onClick={()=>removeStage(i)} className="text-red-400 hover:text-red-600 text-xs px-1">✕</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Neue Stufe..." value={newStage} onChange={e=>setNewStage(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addStage()}/>
            <button onClick={addStage} className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700">+ Hinzufügen</button>
          </div>
        </div>
      </div>
      <div className="p-5 border-t flex gap-3">
        <button onClick={()=>onSave({...list,id:list.id||("list"+Date.now()),name,color,campaign:campaign==="__manual__"?"":campaign,stages})} disabled={!name.trim()} className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {isNew?"Liste erstellen":"Änderungen speichern"}
        </button>
        <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-200">Abbrechen</button>
      </div>
    </Modal>
  );
}

function LeadModal({ lead, lists, onClose, onSave }) {
  const [l, setL] = useState({...lead});
  const [comment, setComment] = useState("");
  const currentList = lists.find(x=>x.id===l.listId)||lists[0];
  const stages = currentList?.stages||STAGES;

  const addComment = () => {
    if (!comment.trim()) return;
    const ts = new Date().toLocaleDateString("de-DE");
    setL(p=>({...p,comments:[...p.comments,`[${ts}] ${comment}`]}));
    setComment("");
  };

  return (
    <Modal onClose={onClose} wide>
      <div className="flex items-center justify-between p-5 border-b">
        <h3 className="text-lg font-bold text-gray-800">Lead bearbeiten</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[["Name","name","text"],["E-Mail","email","email"],["Telefon","phone","text"],["Stadt/Ort","city","text"],["Produkt-Interesse","product","text"]].map(([label,key,type])=>(
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
              <input type={type} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={l[key]||""} onChange={e=>setL(p=>({...p,[key]:e.target.value}))}/>
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Deal Wert (€)</label>
            <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={l.deal||0} onChange={e=>setL(p=>({...p,deal:parseFloat(e.target.value)||0}))}/>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Liste</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={l.listId} onChange={e=>setL(p=>({...p,listId:e.target.value,stage:lists.find(x=>x.id===e.target.value)?.stages[0]||"Neu"}))}>
              {lists.map(li=><option key={li.id} value={li.id}>{li.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Stage</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={l.stage} onChange={e=>setL(p=>({...p,stage:e.target.value}))}>
              {stages.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Kampagne</label>
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500" value={l.campaign||""} readOnly/>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">Kommentare</label>
          <div className="space-y-1 mb-2 max-h-32 overflow-y-auto">
            {l.comments.length===0&&<p className="text-xs text-gray-400 italic">Noch keine Kommentare.</p>}
            {l.comments.map((c,i)=><div key={i} className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-700">{c}</div>)}
          </div>
          <div className="flex gap-2">
            <input className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Kommentar hinzufügen..." value={comment} onChange={e=>setComment(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addComment()}/>
            <button onClick={addComment} className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700">+</button>
          </div>
        </div>
      </div>
      <div className="p-5 border-t flex gap-3">
        <button onClick={()=>onSave(l)} className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700">Speichern</button>
        <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-200">Abbrechen</button>
      </div>
    </Modal>
  );
}

function Campaigns({ config, campaigns, setCampaigns, leads }) {
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const fetchMeta = async () => {
    if (!config.token||!config.adAccount) return;
    setLoading(true);
    try {
      const url = `https://graph.facebook.com/v19.0/${config.adAccount}/campaigns?fields=name,status,insights{spend,impressions,clicks}&access_token=${config.token}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.data) {
        const mapped = data.data.map(c=>({id:c.id,name:c.name,status:c.status,spend:parseFloat(c.insights?.data?.[0]?.spend||0),impressions:parseInt(c.insights?.data?.[0]?.impressions||0),clicks:parseInt(c.insights?.data?.[0]?.clicks||0),leads:leads.filter(l=>l.campaign===c.name).length,cpl:0}));
        mapped.forEach(c=>{c.cpl=c.leads>0?c.spend/c.leads:0;});
        setCampaigns(mapped);
        setLastSync(new Date().toLocaleTimeString("de-DE"));
      }
    } catch(e){console.error(e);}
    setLoading(false);
  };

  const totSpend=campaigns.reduce((s,c)=>s+c.spend,0);
  const totLeads=campaigns.reduce((s,c)=>s+c.leads,0);
  const totImpr=campaigns.reduce((s,c)=>s+c.impressions,0);
  const avgCPL=totLeads>0?totSpend/totLeads:0;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📊 Kampagnen-Übersicht</h2>
        <div className="flex items-center gap-3">
          {lastSync&&<span className="text-xs text-gray-400">Sync: {lastSync}</span>}
          <button onClick={fetchMeta} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            {loading?"⏳ Lädt...":"🔄 Meta Sync"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[{label:"Gesamtausgaben",val:fmt(totSpend),icon:"💶"},{label:"Gesamt Leads",val:fmtN(totLeads),icon:"👥"},{label:"Impressionen",val:fmtN(totImpr),icon:"👁️"},{label:"Ø CPL",val:fmt(avgCPL),icon:"🎯"}].map(m=>(
          <div key={m.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="text-2xl mb-1">{m.icon}</div>
            <div className="text-xl font-bold text-gray-800">{m.val}</div>
            <div className="text-xs text-gray-500">{m.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["Kampagne","Status","Ausgaben","Impressionen","Klicks","CTR","Leads","CPL"].map(h=>(
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {campaigns.map((c,i)=>(
              <tr key={c.id} className={i%2===0?"bg-white":"bg-gray-50/50"}>
                <td className="px-4 py-3 font-medium text-gray-800">{c.name}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.status==="ACTIVE"?"bg-green-100 text-green-700":"bg-gray-100 text-gray-600"}`}>{c.status==="ACTIVE"?"Aktiv":"Pausiert"}</span></td>
                <td className="px-4 py-3">{fmt(c.spend)}</td>
                <td className="px-4 py-3">{fmtN(c.impressions)}</td>
                <td className="px-4 py-3">{fmtN(c.clicks)}</td>
                <td className="px-4 py-3">{c.impressions?((c.clicks/c.impressions)*100).toFixed(2)+"%":"–"}</td>
                <td className="px-4 py-3 font-semibold text-blue-700">{c.leads}</td>
                <td className="px-4 py-3">{fmt(c.cpl)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Pipeline({ leads, setLeads, lists }) {
  const [activeList, setActiveList] = useState(lists[0]?.id||"");
  const [dragging, setDragging] = useState(null);
  const [over, setOver] = useState(null);
  const list = lists.find(l=>l.id===activeList)||lists[0];
  const stages = list?.stages||STAGES;
  const filtered = leads.filter(l=>l.listId===activeList);

  const drop = stage => {
    if (!dragging) return;
    setLeads(prev=>prev.map(l=>l.id===dragging?{...l,stage}:l));
    setDragging(null); setOver(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🔀 Vertrieb Pipeline</h2>
        <div className="flex gap-2 flex-wrap">
          {lists.map(l=>(
            <button key={l.id} onClick={()=>setActiveList(l.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition flex items-center gap-1.5 ${activeList===l.id?"text-white shadow-sm "+l.color:"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {l.name} <span className="text-xs opacity-75">{leads.filter(x=>x.listId===l.id).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-4" style={{minHeight:"480px"}}>
        {stages.map(stage=>{
          const stageBg=stage==="Gewonnen"?"bg-green-50 border-green-200":stage==="Verloren"?"bg-red-50 border-red-200":stage==="Neu"?"bg-blue-50 border-blue-200":"bg-gray-50 border-gray-200";
          const stageLeads=filtered.filter(l=>l.stage===stage);
          return (
            <div key={stage} className={`flex-shrink-0 w-52 rounded-2xl border-2 transition ${over===stage?"scale-[1.02] shadow-lg":""} ${stageBg}`}
              onDragOver={e=>{e.preventDefault();setOver(stage);}} onDragLeave={()=>setOver(null)} onDrop={()=>drop(stage)}>
              <div className="px-3 py-2 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-700">{stage}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600">{stageLeads.length}</span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{fmt(stageLeads.reduce((s,l)=>s+(l.deal||0),0))}</div>
              </div>
              <div className="p-2 space-y-2 min-h-20">
                {stageLeads.map(lead=>(
                  <div key={lead.id} draggable onDragStart={()=>setDragging(lead.id)}
                    className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition">
                    <div className="font-semibold text-sm text-gray-800">{lead.name}</div>
                    <div className="text-xs text-gray-400">{lead.city}</div>
                    {lead.deal>0&&<div className="text-xs font-bold text-green-600 mt-1">{fmt(lead.deal)}</div>}
                    {lead.comments.length>0&&<div className="text-xs text-gray-400 mt-1 truncate">💬 {lead.comments[lead.comments.length-1]}</div>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 mt-2">💡 Leads per Drag & Drop verschieben</p>
    </div>
  );
}

function LeadsTab({ leads, setLeads, lists, setLists, campaigns }) {
  const [activeList, setActiveList] = useState("all");
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("Alle");
  const [showAdd, setShowAdd] = useState(false);
  const [showListConfig, setShowListConfig] = useState(null);
  const [newLead, setNewLead] = useState({name:"",email:"",phone:"",city:"",product:"",stage:"Neu",deal:0,comments:[]});

  const currentList = lists.find(l=>l.id===activeList);
  const stages = currentList?.stages||STAGES;

  const visible = leads.filter(l=>
    (activeList==="all"||l.listId===activeList)&&
    (filterStage==="Alle"||l.stage===filterStage)&&
    (l.name?.toLowerCase().includes(search.toLowerCase())||l.email?.toLowerCase().includes(search.toLowerCase())||l.campaign?.toLowerCase().includes(search.toLowerCase()))
  );

  const saveLead = updated=>{setLeads(prev=>prev.map(l=>l.id===updated.id?updated:l));setEditing(null);};
  const deleteLead = id=>setLeads(prev=>prev.filter(l=>l.id!==id));
  const addLead = ()=>{
    const list=lists.find(l=>l.id===activeList)||lists[0];
    const lead={...newLead,id:"l"+Date.now(),listId:list?.id||lists[0]?.id,campaign:list?.campaign||"",created:new Date().toISOString().split("T")[0]};
    setLeads(prev=>[...prev,lead]);
    setNewLead({name:"",email:"",phone:"",city:"",product:"",stage:list?.stages[0]||"Neu",deal:0,comments:[]});
    setShowAdd(false);
  };
  const saveList = l=>{
    if(lists.find(x=>x.id===l.id)) setLists(prev=>prev.map(x=>x.id===l.id?l:x));
    else setLists(prev=>[...prev,l]);
    setShowListConfig(null);
  };
  const deleteList = id=>{
    if(lists.length<=1) return;
    setLists(prev=>prev.filter(l=>l.id!==id));
    setLeads(prev=>prev.filter(l=>l.listId!==id));
    setActiveList("all");
  };

  return (
    <div className="p-6">
      {editing&&<LeadModal lead={editing} lists={lists} onClose={()=>setEditing(null)} onSave={saveLead}/>}
      {showListConfig&&<ListConfig list={showListConfig} campaigns={campaigns} onSave={saveList} onClose={()=>setShowListConfig(null)}/>}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">👥 Lead Dashboard</h2>
        <button onClick={()=>setShowAdd(!showAdd)} className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition">+ Lead hinzufügen</button>
      </div>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button onClick={()=>{setActiveList("all");setFilterStage("Alle");}}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${activeList==="all"?"bg-gray-700 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
          Alle ({leads.length})
        </button>
        {lists.map(l=>(
          <div key={l.id} className="flex items-center">
            <button onClick={()=>{setActiveList(l.id);setFilterStage("Alle");}}
              className={`px-3 py-1.5 rounded-l-full text-sm font-semibold transition flex items-center gap-1.5 ${activeList===l.id?"text-white "+l.color:"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {l.name} <span className="text-xs opacity-75">{leads.filter(x=>x.listId===l.id).length}</span>
            </button>
            <button onClick={()=>setShowListConfig(l)} className={`px-2 py-1.5 text-xs border-l border-white/30 transition ${activeList===l.id?"text-white "+l.color+" hover:opacity-80":"bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>⚙️</button>
            <button onClick={()=>deleteList(l.id)} className={`px-2 py-1.5 rounded-r-full text-xs border-l border-white/30 transition ${activeList===l.id?"text-white "+l.color+" hover:opacity-80":"bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>✕</button>
          </div>
        ))}
        <button onClick={()=>setShowListConfig({name:"",color:COLORS[lists.length%COLORS.length],stages:[...STAGES],campaign:""})}
          className="px-3 py-1.5 rounded-full text-sm font-semibold border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition">
          + Neue Liste
        </button>
      </div>
      {showAdd&&(
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[["Name *","name","text"],["E-Mail","email","email"],["Telefon","phone","text"],["Stadt/Ort","city","text"],["Produkt-Interesse","product","text"],["Deal (€)","deal","number"]].map(([label,key,type])=>(
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                <input type={type} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={newLead[key]} onChange={e=>setNewLead(p=>({...p,[key]:type==="number"?parseFloat(e.target.value)||0:e.target.value}))}/>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Stage</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={newLead.stage} onChange={e=>setNewLead(p=>({...p,stage:e.target.value}))}>
                {stages.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addLead} disabled={!newLead.name} className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">Hinzufügen</button>
            <button onClick={()=>setShowAdd(false)} className="bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-300">Abbrechen</button>
          </div>
        </div>
      )}
      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <input className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="🔍 Suchen..." value={search} onChange={e=>setSearch(e.target.value)}/>
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={filterStage} onChange={e=>setFilterStage(e.target.value)}>
          <option>Alle</option>
          {stages.map(s=><option key={s}>{s}</option>)}
        </select>
        <span className="text-sm text-gray-400">{visible.length} Leads</span>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["Name","E-Mail","Telefon","Stadt","Produkt","Liste","Stage","Deal","Erstellt","💬",""].map(h=>(
              <th key={h} className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {visible.map((lead,i)=>{
              const li=lists.find(l=>l.id===lead.listId);
              return (
                <tr key={lead.id} className={`${i%2===0?"bg-white":"bg-gray-50/50"} hover:bg-blue-50/30 transition`}>
                  <td className="px-3 py-2.5 font-medium text-gray-800">{lead.name}</td>
                  <td className="px-3 py-2.5 text-gray-500 text-xs">{lead.email}</td>
                  <td className="px-3 py-2.5 text-gray-500 text-xs">{lead.phone}</td>
                  <td className="px-3 py-2.5 text-gray-500 text-xs">{lead.city}</td>
                  <td className="px-3 py-2.5 text-gray-600 text-xs">{lead.product}</td>
                  <td className="px-3 py-2.5">{li&&<span className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${li.color}`}>{li.name}</span>}</td>
                  <td className="px-3 py-2.5"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${stageColor(lead.stage)}`}>{lead.stage}</span></td>
                  <td className="px-3 py-2.5 font-semibold text-green-600 text-xs">{lead.deal>0?fmt(lead.deal):"–"}</td>
                  <td className="px-3 py-2.5 text-gray-400 text-xs">{lead.created}</td>
                  <td className="px-3 py-2.5 text-gray-400 text-xs">{lead.comments.length>0?`💬 ${lead.comments.length}`:"–"}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex gap-1">
                      <button onClick={()=>setEditing(lead)} className="text-blue-500 hover:text-blue-700 text-xs px-1.5 py-1 rounded hover:bg-blue-50">✏️</button>
                      <button onClick={()=>deleteLead(lead.id)} className="text-red-400 hover:text-red-600 text-xs px-1.5 py-1 rounded hover:bg-red-50">🗑️</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {visible.length===0&&<div className="text-center py-12 text-gray-400">Keine Leads gefunden.</div>}
      </div>
    </div>
  );
}

function Revenue({ leads, lists }) {
  const now = new Date();
  const thisM=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
  const lastMDate=new Date(now.getFullYear(),now.getMonth()-1,1);
  const lastM=`${lastMDate.getFullYear()}-${String(lastMDate.getMonth()+1).padStart(2,"0")}`;
  const won=leads.filter(l=>l.stage==="Gewonnen");
  const totalRev=won.reduce((s,l)=>s+(l.deal||0),0);
  const thisRev=won.filter(l=>l.created?.startsWith(thisM)).reduce((s,l)=>s+(l.deal||0),0);
  const lastRev=won.filter(l=>l.created?.startsWith(lastM)).reduce((s,l)=>s+(l.deal||0),0);
  const diff=thisRev-lastRev;
  const diffPct=lastRev>0?((diff/lastRev)*100).toFixed(1):null;
  const pipeline=leads.filter(l=>l.stage!=="Gewonnen"&&l.stage!=="Verloren").reduce((s,l)=>s+(l.deal||0),0);
  const conv=leads.length>0?((won.length/leads.length)*100).toFixed(1):0;
  const byList=lists.map(l=>({list:l,total:leads.filter(x=>x.listId===l.id).length,won:leads.filter(x=>x.listId===l.id&&x.stage==="Gewonnen").length,rev:leads.filter(x=>x.listId===l.id&&x.stage==="Gewonnen").reduce((s,x)=>s+(x.deal||0),0)}));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">💰 Umsatz Dashboard</h2>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-4 shadow">
          <div className="text-xs font-semibold opacity-80 mb-1">Gesamtumsatz</div>
          <div className="text-2xl font-bold">{fmt(totalRev)}</div>
          <div className="text-xs opacity-70 mt-1">{won.length} Deals gewonnen</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 mb-1">Dieser Monat</div>
          <div className="text-2xl font-bold text-gray-800">{fmt(thisRev)}</div>
          {diffPct&&<div className={`text-xs font-semibold mt-1 ${diff>=0?"text-green-600":"text-red-500"}`}>{diff>=0?"▲":"▼"} {Math.abs(diffPct)}% ggü. Vormonat</div>}
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 mb-1">Letzter Monat</div>
          <div className="text-2xl font-bold text-gray-800">{fmt(lastRev)}</div>
          <div className="text-xs text-gray-400 mt-1">{lastMDate.toLocaleString("de-DE",{month:"long"})}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 mb-1">Pipeline Wert</div>
          <div className="text-2xl font-bold text-blue-600">{fmt(pipeline)}</div>
          <div className="text-xs text-gray-400 mt-1">Conv. Rate: {conv}%</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <h3 className="font-bold text-gray-700 mb-4">📅 Monat vs. Vormonat</h3>
        {[{label:now.toLocaleString("de-DE",{month:"long",year:"numeric"}),val:thisRev,color:"bg-green-500"},{label:lastMDate.toLocaleString("de-DE",{month:"long",year:"numeric"}),val:lastRev,color:"bg-blue-400"}].map(item=>{
          const max=Math.max(thisRev,lastRev,1);
          return (
            <div key={item.label} className="mb-3">
              <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">{item.label}</span><span className="font-bold">{fmt(item.val)}</span></div>
              <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{width:`${(item.val/max)*100}%`}}/>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-700 mb-3">🎯 Umsatz nach Produkt-Liste</h3>
        <table className="w-full text-sm">
          <thead><tr className="text-xs text-gray-400 font-semibold uppercase border-b border-gray-100">
            <th className="text-left pb-2">Liste</th><th className="text-right pb-2">Leads</th><th className="text-right pb-2">Gewonnen</th><th className="text-right pb-2">Conv.</th><th className="text-right pb-2">Umsatz</th>
          </tr></thead>
          <tbody>
            {byList.map(({list,total,won:w,rev})=>(
              <tr key={list.id} className="border-b border-gray-50">
                <td className="py-2"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${list.color}`}>{list.name}</span></td>
                <td className="py-2 text-right text-gray-500">{total}</td>
                <td className="py-2 text-right text-green-600 font-semibold">{w}</td>
                <td className="py-2 text-right text-gray-500">{total>0?((w/total)*100).toFixed(1)+"%":"–"}</td>
                <td className="py-2 text-right font-bold text-gray-800">{fmt(rev)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Settings({ config, setConfig }) {
  const [token, setToken] = useState(config.token||"");
  const [adAccount, setAdAccount] = useState(config.adAccount||"");
  const [saved, setSaved] = useState(false);
  const save=()=>{setConfig({token,adAccount});setSaved(true);setTimeout(()=>setSaved(false),2000);};
  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">⚙️ Einstellungen</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Meta Access Token</label>
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="EAAxxxxx..." value={token} onChange={e=>setToken(e.target.value)}/>
          <p className="text-xs text-gray-400 mt-1">Meta Business Manager → System Users → Token generieren</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Ad Account ID</label>
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="act_123456789" value={adAccount} onChange={e=>setAdAccount(e.target.value)}/>
        </div>
        <button onClick={save} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
          {saved?"✅ Gespeichert!":"Speichern"}
        </button>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700 space-y-1">
          <p><strong>Benötigte Berechtigungen:</strong> ads_read, leads_retrieval, pages_read_engagement</p>
          <p><strong>Webhook URL:</strong> https://your-crm.vercel.app/api/webhook</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("leads");
  const [leads, setLeads] = useStore("leads");
  const [lists, setLists] = useStore("lists");
  const [config, setConfig] = useStore("config");
  const [campaigns, setCampaigns] = useStore("campaigns");

  const tabs=[
    {id:"kampagnen",label:"📊 Kampagnen"},
    {id:"pipeline",label:"🔀 Pipeline"},
    {id:"leads",label:"👥 Leads"},
    {id:"umsatz",label:"💰 Umsatz"},
    {id:"settings",label:"⚙️ Einstellungen"},
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="bg-white border-b border-gray-100 shadow-sm px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">CRM</div>
          <span className="font-bold text-gray-800 text-lg">Meta CRM</span>
        </div>
        <nav className="flex gap-1 ml-4">
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab===t.id?"bg-blue-600 text-white shadow-sm":"text-gray-500 hover:bg-gray-100"}`}>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="ml-auto text-xs text-gray-400">
          {config.adAccount?`🔗 ${config.adAccount}`:"⚠️ Keine Meta-Verbindung"}
        </div>
      </div>
      <div>
        {tab==="kampagnen"&&<Campaigns config={config} campaigns={campaigns} setCampaigns={setCampaigns} leads={leads}/>}
        {tab==="pipeline"&&<Pipeline leads={leads} setLeads={setLeads} lists={lists}/>}
        {tab==="leads"&&<LeadsTab leads={leads} setLeads={setLeads} lists={lists} setLists={setLists} campaigns={campaigns}/>}
        {tab==="umsatz"&&<Revenue leads={leads} lists={lists}/>}
        {tab==="settings"&&<Settings config={config} setConfig={setConfig}/>}
      </div>
    </div>
  );
}
