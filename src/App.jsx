import { useState, useCallback, useRef } from "react";

const STAGES_DEFAULT = ["Neu","Kontaktiert","Qualifiziert","Angebot","Gewonnen","Verloren"];
const LIST_COLORS = ["bg-orange-500","bg-blue-500","bg-purple-500","bg-green-500","bg-pink-500","bg-teal-500","bg-red-500","bg-indigo-500"];
const LIST_GRADIENTS = ["from-orange-500 to-pink-500","from-blue-500 to-indigo-500","from-purple-500 to-pink-500","from-green-500 to-teal-500","from-pink-500 to-rose-500","from-teal-400 to-cyan-500","from-red-500 to-rose-500","from-indigo-500 to-purple-500"];
const SOURCES = ["Meta Ad","Google Ad","Webseite","Empfehlung","LinkedIn","Messe","Sonstiges"];
const TEAM = ["Anna K.","Max M.","Sara L.","David F."];
const fmt = n => new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR"}).format(n||0);
const fmtN = n => new Intl.NumberFormat("de-DE").format(n||0);
const today = () => new Date().toISOString().split("T")[0];

if(!window._gd){
  window._gd={
    contacts:[
      {id:"c1",name:"Anna Müller",company:"Solar GmbH",title:"CEO",email:"anna@solar.de",phone:"+49 151 1234567",city:"Berlin",source:"Meta Ad",tags:["VIP"],notes:"Sehr interessiert",listIds:["list1"],created:"2026-03-01"},
      {id:"c2",name:"Thomas Becker",company:"Energie AG",title:"CFO",email:"thomas@energie.de",phone:"+49 170 9876543",city:"München",source:"Google Ad",tags:["Follow-up"],listIds:["list2"],created:"2026-03-02"},
      {id:"c3",name:"Sara Klein",company:"GreenTech",title:"Manager",email:"sara@green.de",phone:"+49 160 5554433",city:"Hamburg",source:"Empfehlung",tags:["Warm"],listIds:["list1","list2"],created:"2026-02-20"},
      {id:"c4",name:"Max Weber",company:"Weber & Co",title:"Inhaber",email:"max@weber.de",phone:"+49 172 3334455",city:"Frankfurt",source:"LinkedIn",tags:["VIP"],listIds:["list1"],created:"2026-02-15"},
    ],
    lists:[
      {id:"list1",name:"Solar Anlage",colorIdx:0,stages:[...STAGES_DEFAULT],campaign:"Sommer Kampagne"},
      {id:"list2",name:"Wärmepumpe",colorIdx:1,stages:[...STAGES_DEFAULT],campaign:"Frühling Aktion"},
      {id:"list3",name:"Beratung",colorIdx:2,stages:["Erstgespräch","Analyse","Angebot","Abschluss","Verloren"],campaign:"Retargeting Q1"},
    ],
    leads:[
      {id:"l1",name:"Anna Müller",email:"anna@solar.de",phone:"+49 151 1234567",city:"Berlin",product:"Solar Anlage",listId:"list1",campaign:"Sommer Kampagne",stage:"Neu",deal:1200,score:85,assignedTo:"Anna K.",followUp:"2026-03-10",source:"Meta Ad",created:"2026-03-01",comments:[]},
      {id:"l2",name:"Thomas Becker",email:"thomas@energie.de",phone:"+49 170 9876543",city:"München",product:"Wärmepumpe",listId:"list2",campaign:"Frühling Aktion",stage:"Kontaktiert",deal:2500,score:72,assignedTo:"Max M.",followUp:"2026-03-08",source:"Google Ad",created:"2026-03-02",comments:["Hat Interesse gezeigt"]},
      {id:"l3",name:"Sara Klein",email:"sara@green.de",phone:"+49 160 5554433",city:"Hamburg",product:"Solar Anlage",listId:"list1",campaign:"Sommer Kampagne",stage:"Qualifiziert",deal:3800,score:91,assignedTo:"Sara L.",followUp:"2026-03-07",source:"Empfehlung",created:"2026-02-20",comments:["Budget bestätigt"]},
      {id:"l4",name:"Max Weber",email:"max@weber.de",phone:"+49 172 3334455",city:"Frankfurt",product:"Wärmepumpe",listId:"list2",campaign:"Retargeting Q1",stage:"Angebot",deal:5000,score:88,assignedTo:"David F.",followUp:"2026-03-09",source:"LinkedIn",created:"2026-02-15",comments:["Angebot gesendet"]},
      {id:"l5",name:"Julia Hoffmann",email:"julia@example.com",phone:"+49 163 7778899",city:"Köln",product:"Solar Anlage",listId:"list1",campaign:"Frühling Aktion",stage:"Gewonnen",deal:4200,score:95,assignedTo:"Anna K.",followUp:"",source:"Meta Ad",created:"2026-02-10",comments:["Deal abgeschlossen! 🎉"]},
      {id:"l6",name:"Peter Schulz",email:"peter@example.com",phone:"+49 157 2221100",city:"Düsseldorf",product:"Beratung",listId:"list3",campaign:"Retargeting Q1",stage:"Neu",deal:0,score:45,assignedTo:"Max M.",followUp:"2026-03-12",source:"Webseite",created:"2026-02-05",comments:[]},
      {id:"l7",name:"Lisa Braun",email:"lisa@example.com",phone:"+49 176 6665544",city:"Stuttgart",product:"Solar Anlage",listId:"list1",campaign:"Sommer Kampagne",stage:"Gewonnen",deal:3100,score:90,assignedTo:"Sara L.",followUp:"",source:"Meta Ad",created:"2026-02-28",comments:[]},
      {id:"l8",name:"David Fischer",email:"david@example.com",phone:"+49 151 9990011",city:"Leipzig",product:"Wärmepumpe",listId:"list2",campaign:"Frühling Aktion",stage:"Neu",deal:1800,score:60,assignedTo:"David F.",followUp:"2026-03-11",source:"Google Ad",created:"2026-03-04",comments:[]},
    ],
    deals:[
      {id:"d1",name:"Solar Anlage XL",contact:"Anna Müller",value:12000,stage:"Angebot",probability:70,closeDate:"2026-04-01",assignedTo:"Anna K.",notes:"Großes Projekt"},
      {id:"d2",name:"Wärmepumpe Premium",contact:"Thomas Becker",value:8500,stage:"Qualifiziert",probability:50,closeDate:"2026-04-15",assignedTo:"Max M.",notes:""},
      {id:"d3",name:"Beratungspaket",contact:"Sara Klein",value:3200,stage:"Gewonnen",probability:100,closeDate:"2026-03-01",assignedTo:"Sara L.",notes:"Abgeschlossen"},
    ],
    campaigns:[
      {id:"c1",name:"Sommer Kampagne",platform:"Meta",status:"ACTIVE",spend:1240.50,impressions:85400,clicks:1820,leads:34,cpl:36.49,budget:2000},
      {id:"c2",name:"Frühling Aktion",platform:"Meta",status:"ACTIVE",spend:980.00,impressions:62000,clicks:1340,leads:28,cpl:35.00,budget:1500},
      {id:"c3",name:"Retargeting Q1",platform:"Google",status:"PAUSED",spend:450.00,impressions:21000,clicks:890,leads:12,cpl:37.50,budget:800},
      {id:"c4",name:"Brand Awareness",platform:"Google",status:"ACTIVE",spend:320.00,impressions:45000,clicks:560,leads:8,cpl:40.00,budget:600},
    ],
    posts:[
      {id:"p1",caption:"🌞 Sparen Sie bis zu 70% Ihrer Energiekosten mit unserer Solar Anlage!",platform:["Facebook","Instagram"],scheduledAt:"2026-03-10 10:00",status:"Geplant"},
      {id:"p2",caption:"💡 Wärmepumpen-Technologie der Zukunft — heute schon verfügbar.",platform:["LinkedIn"],scheduledAt:"2026-03-12 09:00",status:"Geplant"},
    ],
    config:{metaToken:"",metaAccount:"",googleAccount:""},
  };
}

function useStore(key){
  const [val,setVal]=useState(()=>window._gd[key]);
  const save=useCallback(v=>{const next=typeof v==="function"?v(window._gd[key]):v;window._gd[key]=next;setVal(next);},[key]);
  return [val,save];
}

const listColor = (l) => LIST_COLORS[l?.colorIdx||0] || "bg-indigo-500";
const listGradient = (l) => LIST_GRADIENTS[l?.colorIdx||0] || "from-indigo-500 to-purple-500";

// ── UI ────────────────────────────────────────────────────────
const Card = ({children, className=""}) => (
  <div className={`bg-gray-800 border border-gray-700 rounded-2xl ${className}`}>{children}</div>
);
const Modal = ({onClose, children, title, wide=false}) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
    <div className={`bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl ${wide?"w-full max-w-2xl":"w-full max-w-lg"} max-h-screen overflow-y-auto`}>
      {title && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h3 className="text-base font-bold text-white">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition">✕</button>
        </div>
      )}
      {children}
    </div>
  </div>
);
const Inp = ({label, value, onChange, type="text", placeholder="", readOnly=false, className=""}) => (
  <div className={className}>
    {label && <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">{label}</label>}
    <input type={type} value={value||""} onChange={onChange} readOnly={readOnly} placeholder={placeholder}
      className={`w-full bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${readOnly?"opacity-50":""}`}/>
  </div>
);
const Sel = ({label, value, onChange, options, className=""}) => (
  <div className={className}>
    {label && <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">{label}</label>}
    <select value={value||""} onChange={onChange} className="w-full bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
      {options.map(o => typeof o==="string" ? <option key={o} className="bg-gray-900">{o}</option> : <option key={o.value} value={o.value} className="bg-gray-900">{o.label}</option>)}
    </select>
  </div>
);
const Btn = ({onClick, children, variant="primary", size="md", disabled=false, className=""}) => {
  const sz = {sm:"px-3 py-1.5 text-xs", md:"px-4 py-2 text-sm", lg:"px-6 py-3 text-base"};
  const vr = {
    primary:"bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg",
    secondary:"bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600",
    ghost:"hover:bg-gray-700 text-gray-400 hover:text-white",
    danger:"bg-red-900 hover:bg-red-800 text-red-300 border border-red-700",
    success:"bg-emerald-900 hover:bg-emerald-800 text-emerald-300 border border-emerald-700",
  };
  return <button onClick={onClick} disabled={disabled} className={`font-semibold rounded-xl transition flex items-center gap-1.5 ${sz[size]} ${vr[variant]||vr.primary} ${disabled?"opacity-40 cursor-not-allowed":""} ${className}`}>{children}</button>;
};
const Badge = ({color="gray", children}) => {
  const m = {gray:"bg-gray-700 text-gray-300", indigo:"bg-indigo-900 text-indigo-300", green:"bg-emerald-900 text-emerald-400", red:"bg-red-900 text-red-400", orange:"bg-orange-900 text-orange-400", yellow:"bg-yellow-900 text-yellow-400", blue:"bg-blue-900 text-blue-400", purple:"bg-purple-900 text-purple-400"};
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${m[color]||m.gray}`}>{children}</span>;
};
const ColorDot = ({list}) => <span className={`inline-block w-2.5 h-2.5 rounded-full ${listColor(list)}`}/>;
const ListBadge = ({list}) => <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold text-white ${listColor(list)}`}>{list?.name}</span>;
const ScoreBadge = ({score}) => <Badge color={score>=80?"green":score>=60?"yellow":"red"}>{score}%</Badge>;
const StatCard = ({icon, label, value, sub, color="indigo"}) => {
  const bg = {indigo:"bg-indigo-600", green:"bg-emerald-600", blue:"bg-blue-600", orange:"bg-orange-600", purple:"bg-purple-600", pink:"bg-pink-600"};
  return (
    <Card className="p-5">
      <div className={`w-10 h-10 rounded-xl ${bg[color]||bg.indigo} flex items-center justify-center text-white text-lg mb-3`}>{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-gray-400 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </Card>
  );
};

// ── CONTACTS ──────────────────────────────────────────────────
function Contacts() {
  const [contacts,setContacts] = useStore("contacts");
  const [lists] = useStore("lists");
  const [search,setSearch] = useState("");
  const [editing,setEditing] = useState(null);
  const [showAdd,setShowAdd] = useState(false);
  const [assignModal,setAssignModal] = useState(null);
  const blank = {name:"",company:"",title:"",email:"",phone:"",city:"",source:SOURCES[0],tags:[],notes:"",listIds:[]};
  const [form,setForm] = useState(blank);
  const visible = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.company?.toLowerCase().includes(search.toLowerCase()));

  const save = () => {
    if(editing) setContacts(p => p.map(c => c.id===editing.id ? editing : c));
    else setContacts(p => [...p, {...form, id:"c"+Date.now(), created:today()}]);
    setEditing(null); setShowAdd(false); setForm(blank);
  };
  const toggleList = (contact, listId) => {
    const has = (contact.listIds||[]).includes(listId);
    setContacts(p => p.map(c => c.id===contact.id ? {...c, listIds: has ? (c.listIds||[]).filter(x=>x!==listId) : [...(c.listIds||[]),listId]} : c));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-white">Kontakte</h1><p className="text-sm text-gray-400 mt-0.5">{contacts.length} Kontakte</p></div>
        <Btn onClick={()=>setShowAdd(true)}>+ Neuer Kontakt</Btn>
      </div>

      {(showAdd||editing) && (
        <Modal title={editing?"Kontakt bearbeiten":"Neuer Kontakt"} onClose={()=>{setShowAdd(false);setEditing(null);}}>
          <div className="p-6 grid grid-cols-2 gap-4">
            {[["Name *","name"],["Unternehmen","company"],["Position","title"],["E-Mail","email"],["Telefon","phone"],["Stadt","city"]].map(([l,k])=>(
              <Inp key={k} label={l} value={editing?editing[k]:form[k]} onChange={e=>editing?setEditing(p=>({...p,[k]:e.target.value})):setForm(p=>({...p,[k]:e.target.value}))}/>
            ))}
            <Sel label="Quelle" value={editing?editing.source:form.source} onChange={e=>editing?setEditing(p=>({...p,source:e.target.value})):setForm(p=>({...p,source:e.target.value}))} options={SOURCES}/>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Listen</label>
              <div className="flex flex-wrap gap-1.5">
                {lists.map(l => {
                  const active = (editing?editing.listIds:form.listIds)?.includes(l.id);
                  return <button key={l.id} onClick={()=>editing?setEditing(p=>({...p,listIds:active?(p.listIds||[]).filter(x=>x!==l.id):[...(p.listIds||[]),l.id]})):setForm(p=>({...p,listIds:active?(p.listIds||[]).filter(x=>x!==l.id):[...(p.listIds||[]),l.id]}))}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition ${active?`${listColor(l)} text-white border-transparent`:"border-gray-600 text-gray-400 hover:border-gray-400"}`}>{l.name}</button>;
                })}
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Notizen</label>
              <textarea className="w-full bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20 resize-none" value={editing?editing.notes:form.notes} onChange={e=>editing?setEditing(p=>({...p,notes:e.target.value})):setForm(p=>({...p,notes:e.target.value}))}/>
            </div>
          </div>
          <div className="px-6 pb-6 flex gap-3">
            <Btn onClick={save} disabled={!(editing?editing.name:form.name)}>Speichern</Btn>
            <Btn variant="secondary" onClick={()=>{setShowAdd(false);setEditing(null);}}>Abbrechen</Btn>
          </div>
        </Modal>
      )}

      {assignModal && (
        <Modal title={`Listen: ${assignModal.name}`} onClose={()=>setAssignModal(null)}>
          <div className="p-6 space-y-2">
            {lists.map(l => {
              const active = (assignModal.listIds||[]).includes(l.id);
              return (
                <div key={l.id} onClick={()=>{toggleList(assignModal,l.id);setAssignModal(p=>({...p,listIds:active?(p.listIds||[]).filter(x=>x!==l.id):[...(p.listIds||[]),l.id]}));}}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${active?"border-indigo-500 bg-indigo-900 bg-opacity-30":"border-gray-700 hover:border-gray-500"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${listColor(l)} flex items-center justify-center text-white text-xs font-bold`}>{l.name.slice(0,2)}</div>
                    <div><div className="text-sm font-semibold text-white">{l.name}</div><div className="text-xs text-gray-400">{l.campaign||"Keine Kampagne"}</div></div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active?"border-indigo-500 bg-indigo-500":"border-gray-500"}`}>
                    {active && <span className="text-white text-xs">✓</span>}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-6 pb-6"><Btn onClick={()=>setAssignModal(null)}>Fertig</Btn></div>
        </Modal>
      )}

      <input className="w-64 bg-gray-900 border border-gray-600 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4" placeholder="🔍 Suchen..." value={search} onChange={e=>setSearch(e.target.value)}/>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-700">
            <tr>{["Kontakt","Unternehmen","E-Mail","Stadt","Quelle","Listen",""].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {visible.map(c => (
              <tr key={c.id} className="hover:bg-gray-750 transition" style={{backgroundColor:"transparent"}}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-800 flex items-center justify-center text-indigo-300 font-bold text-xs">{c.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                    <div><div className="font-semibold text-white">{c.name}</div><div className="text-xs text-gray-400">{c.title}</div></div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-300">{c.company||"–"}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{c.email}</td>
                <td className="px-4 py-3 text-gray-300">{c.city||"–"}</td>
                <td className="px-4 py-3"><Badge>{c.source}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(c.listIds||[]).map(lid=>{const l=lists.find(x=>x.id===lid);return l?<ListBadge key={lid} list={l}/>:null;})}
                    <button onClick={()=>setAssignModal({...c})} className="px-2 py-0.5 rounded-full text-xs border border-dashed border-gray-600 text-gray-500 hover:border-indigo-500 hover:text-indigo-400 transition">+ Liste</button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Btn size="sm" variant="ghost" onClick={()=>setEditing({...c})}>✏️</Btn>
                    <Btn size="sm" variant="ghost" onClick={()=>setContacts(p=>p.filter(x=>x.id!==c.id))}>🗑️</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length===0 && <div className="text-center py-16 text-gray-500 text-sm">Keine Kontakte</div>}
      </Card>
    </div>
  );
}

// ── LISTS ─────────────────────────────────────────────────────
function Lists() {
  const [lists,setLists] = useStore("lists");
  const [contacts,setContacts] = useStore("contacts");
  const [leads] = useStore("leads");
  const [campaigns] = useStore("campaigns");
  const [editing,setEditing] = useState(null);
  const [showAdd,setShowAdd] = useState(false);
  const [activeList,setActiveList] = useState(null);
  const [showImport,setShowImport] = useState(false);
  const [importText,setImportText] = useState("");
  const [newContact,setNewContact] = useState({name:"",email:"",phone:"",city:"",source:SOURCES[0]});
  const fileRef = useRef();

  const ListForm = ({list, onSave, onClose}) => {
    const isNew = !list.id;
    const [name,setName] = useState(list.name||"");
    const [colorIdx,setColorIdx] = useState(list.colorIdx||0);
    const [campaign,setCampaign] = useState(list.campaign||"");
    const [stages,setStages] = useState(list.stages||[...STAGES_DEFAULT]);
    const [ns,setNs] = useState("");
    const addS = ()=>{if(ns.trim()){setStages(s=>[...s,ns.trim()]);setNs("");}};
    const remS = i=>setStages(s=>s.filter((_,j)=>j!==i));
    const movS = (i,d)=>{const a=[...stages];const j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];setStages(a);};
    return (
      <Modal title={isNew?"Neue Liste":"Liste bearbeiten"} wide onClose={onClose}>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Inp label="Name" value={name} onChange={e=>setName(e.target.value)} placeholder="z.B. Solar Anlage"/>
            <Sel label="Kampagne" value={campaign} onChange={e=>setCampaign(e.target.value)} options={[{value:"",label:"– Keine –"},...campaigns.map(c=>({value:c.name,label:c.name}))]}/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Farbe</label>
            <div className="flex gap-2 flex-wrap">
              {LIST_COLORS.map((c,i)=><button key={i} onClick={()=>setColorIdx(i)} className={`w-8 h-8 rounded-full ${c} ${colorIdx===i?"ring-2 ring-offset-2 ring-offset-gray-800 ring-white":""} transition`}/>)}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Pipeline-Stufen</label>
            <div className="space-y-2 mb-3">
              {stages.map((s,i)=>(
                <div key={i} className="flex items-center gap-2 bg-gray-900 rounded-xl px-3 py-2">
                  <span className="flex-1 text-sm text-gray-200">{s}</span>
                  <button onClick={()=>movS(i,-1)} disabled={i===0} className="text-gray-500 hover:text-gray-300 disabled:opacity-20 text-xs">▲</button>
                  <button onClick={()=>movS(i,1)} disabled={i===stages.length-1} className="text-gray-500 hover:text-gray-300 disabled:opacity-20 text-xs">▼</button>
                  <button onClick={()=>remS(i)} className="text-red-500 hover:text-red-300 text-xs">✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="flex-1 bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Neue Stufe..." value={ns} onChange={e=>setNs(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addS()}/>
              <Btn onClick={addS} size="sm">+ Add</Btn>
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <Btn onClick={()=>onSave({...list, id:list.id||"list"+Date.now(), name, colorIdx, campaign, stages})} disabled={!name.trim()}>Speichern</Btn>
          <Btn variant="secondary" onClick={onClose}>Abbrechen</Btn>
        </div>
      </Modal>
    );
  };

  const saveList = l => {
    if(lists.find(x=>x.id===l.id)) setLists(p=>p.map(x=>x.id===l.id?l:x));
    else setLists(p=>[...p,l]);
    setEditing(null); setShowAdd(false);
  };
  const addContactToList = ()=>{
    if(!newContact.name||!activeList) return;
    setContacts(p=>[...p, {...newContact, id:"c"+Date.now(), created:today(), listIds:[activeList], tags:[]}]);
    setNewContact({name:"",email:"",phone:"",city:"",source:SOURCES[0]});
  };
  const handleCSV = e=>{
    const file=e.target.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>{
      const lines=ev.target.result.split("\n").filter(Boolean);
      const headers=lines[0].split(",").map(h=>h.trim().toLowerCase().replace(/["\r]/g,""));
      const newC=lines.slice(1).map((line,i)=>{
        const vals=line.split(",").map(v=>v.trim().replace(/["\r]/g,""));
        const obj={}; headers.forEach((h,j)=>{obj[h]=vals[j]||"";});
        return {id:"c"+Date.now()+i, name:obj.name||"", email:obj.email||"", phone:obj.phone||obj.telefon||"", city:obj.city||obj.stadt||"", company:obj.company||"", source:"CSV Import", tags:[], listIds:activeList?[activeList]:[], created:today()};
      }).filter(c=>c.name.trim());
      setContacts(p=>[...p,...newC]);
      setShowImport(false); e.target.value="";
    };
    reader.readAsText(file);
  };

  const viewList = lists.find(l=>l.id===activeList);
  const listContacts = contacts.filter(c=>(c.listIds||[]).includes(activeList));

  return (
    <div>
      {editing && <ListForm list={editing} onSave={saveList} onClose={()=>setEditing(null)}/>}
      {showAdd && <ListForm list={{name:"",colorIdx:lists.length%LIST_COLORS.length,stages:[...STAGES_DEFAULT],campaign:""}} onSave={saveList} onClose={()=>setShowAdd(false)}/>}
      {showImport && (
        <Modal title="CSV Importieren" wide onClose={()=>setShowImport(false)}>
          <div className="p-6 space-y-4">
            <div className="bg-gray-900 rounded-xl p-4 text-sm text-gray-400">
              Erwartet: <span className="text-indigo-400 font-mono">name, email, phone, city, company</span>
              <div className="mt-2"><input ref={fileRef} type="file" accept=".csv" onChange={handleCSV} className="hidden"/><Btn onClick={()=>fileRef.current.click()} variant="secondary">📂 CSV Datei wählen</Btn></div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Oder Text einfügen</label>
              <textarea className="w-full bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white font-mono h-28 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder={"name,email,phone\nAnna Müller,anna@example.com,+49151..."} value={importText} onChange={e=>setImportText(e.target.value)}/>
            </div>
            {importText && <Btn onClick={()=>{
              const lines=importText.split("\n").filter(Boolean);
              const headers=lines[0].split(",").map(h=>h.trim().toLowerCase());
              const newC=lines.slice(1).map((line,i)=>{
                const vals=line.split(",").map(v=>v.trim());
                const obj={}; headers.forEach((h,j)=>{obj[h]=vals[j]||"";});
                return {id:"c"+Date.now()+i, name:obj.name||"", email:obj.email||"", phone:obj.phone||"", city:obj.city||"", company:obj.company||"", source:"CSV Import", tags:[], listIds:activeList?[activeList]:[], created:today()};
              }).filter(c=>c.name);
              setContacts(p=>[...p,...newC]); setImportText(""); setShowImport(false);
            }}>✅ {importText.split("\n").filter(Boolean).length-1} Kontakte importieren</Btn>}
          </div>
        </Modal>
      )}

      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-white">Listen</h1><p className="text-sm text-gray-400 mt-0.5">{lists.length} Listen</p></div>
        <Btn onClick={()=>setShowAdd(true)}>+ Neue Liste</Btn>
      </div>

      {!activeList ? (
        <div className="grid grid-cols-3 gap-4">
          {lists.map(l => {
            const lc=contacts.filter(c=>(c.listIds||[]).includes(l.id));
            const ll=leads.filter(x=>x.listId===l.id);
            const won=ll.filter(x=>x.stage==="Gewonnen");
            return (
              <div key={l.id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:border-gray-500 transition cursor-pointer" onClick={()=>setActiveList(l.id)}>
                <div className={`h-2 ${listColor(l)}`}/>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="font-bold text-white text-lg">{l.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{l.campaign||"Keine Kampagne"}</div>
                    </div>
                    <div className="flex gap-1" onClick={e=>e.stopPropagation()}>
                      <Btn size="sm" variant="ghost" onClick={()=>setEditing(l)}>⚙️</Btn>
                      <Btn size="sm" variant="ghost" onClick={()=>{if(lists.length>1)setLists(p=>p.filter(x=>x.id!==l.id));}}>🗑️</Btn>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[["Kontakte",lc.length,"text-indigo-400"],["Leads",ll.length,"text-purple-400"],["Won",won.length,"text-emerald-400"]].map(([label,val,cls])=>(
                      <div key={label} className="bg-gray-900 rounded-xl p-2.5 text-center">
                        <div className={`text-xl font-bold ${cls}`}>{val}</div>
                        <div className="text-xs text-gray-500">{label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {l.stages.slice(0,3).map(s=><span key={s} className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">{s}</span>)}
                    {l.stages.length>3 && <span className="text-xs text-gray-500">+{l.stages.length-3}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <button onClick={()=>setActiveList(null)} className="text-gray-400 hover:text-white transition text-sm">← Zurück</button>
            <div className={`w-5 h-5 rounded ${listColor(viewList)}`}/>
            <h2 className="text-xl font-bold text-white">{viewList?.name}</h2>
            <Badge color="indigo">{listContacts.length} Kontakte</Badge>
            <div className="ml-auto flex gap-2">
              <Btn size="sm" variant="secondary" onClick={()=>setShowImport(true)}>📥 CSV Import</Btn>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="p-4 col-span-2">
              <label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">Neuen Kontakt hinzufügen</label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {[["Name *","name"],["E-Mail","email"],["Telefon","phone"],["Stadt","city"]].map(([l,k])=>(
                  <Inp key={k} label={l} value={newContact[k]} onChange={e=>setNewContact(p=>({...p,[k]:e.target.value}))}/>
                ))}
              </div>
              <Btn onClick={addContactToList} disabled={!newContact.name}>+ Hinzufügen</Btn>
            </Card>
            <Card className="p-4">
              <label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">Bestehende Kontakte</label>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {contacts.filter(c=>!(c.listIds||[]).includes(activeList)).map(c=>(
                  <div key={c.id} onClick={()=>setContacts(p=>p.map(x=>x.id===c.id?{...x,listIds:[...(x.listIds||[]),activeList]}:x))}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 cursor-pointer transition">
                    <div className="w-6 h-6 rounded-full bg-indigo-800 flex items-center justify-center text-indigo-300 text-xs font-bold">{c.name[0]}</div>
                    <span className="text-sm text-gray-300">{c.name}</span>
                    <span className="ml-auto text-gray-600 text-xs">+</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-700">
                <tr>{["Kontakt","E-Mail","Telefon","Stadt","Quelle",""].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {listContacts.map(c=>(
                  <tr key={c.id} className="hover:bg-gray-750 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-indigo-800 flex items-center justify-center text-indigo-300 text-xs font-bold">{c.name[0]}</div>
                        <span className="font-medium text-white">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{c.email||"–"}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{c.phone||"–"}</td>
                    <td className="px-4 py-3 text-gray-300">{c.city||"–"}</td>
                    <td className="px-4 py-3"><Badge>{c.source}</Badge></td>
                    <td className="px-4 py-3"><Btn size="sm" variant="danger" onClick={()=>setContacts(p=>p.map(x=>x.id===c.id?{...x,listIds:(x.listIds||[]).filter(y=>y!==activeList)}:x))}>Entfernen</Btn></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {listContacts.length===0 && <div className="text-center py-16 text-gray-500 text-sm">Noch keine Kontakte in dieser Liste</div>}
          </Card>
        </div>
      )}
    </div>
  );
}

// ── LEADS ─────────────────────────────────────────────────────
function Leads() {
  const [leads,setLeads] = useStore("leads");
  const [lists] = useStore("lists");
  const [search,setSearch] = useState("");
  const [filterList,setFilterList] = useState("Alle");
  const [filterStage,setFilterStage] = useState("Alle");
  const [editing,setEditing] = useState(null);
  const [showAdd,setShowAdd] = useState(false);
  const [form,setForm] = useState({name:"",email:"",phone:"",city:"",product:"",stage:"Neu",deal:0,score:50,assignedTo:TEAM[0],followUp:"",source:SOURCES[0],listId:lists[0]?.id||"",comments:[]});
  const currentList = lists.find(l=>l.id===filterList);
  const stages = currentList?.stages||STAGES_DEFAULT;
  const visible = leads.filter(l=>(filterList==="Alle"||l.listId===filterList)&&(filterStage==="Alle"||l.stage===filterStage)&&(l.name?.toLowerCase().includes(search.toLowerCase())||l.email?.toLowerCase().includes(search.toLowerCase())));

  const LeadForm = ({lead, onSave, onClose}) => {
    const [l,setL] = useState({...lead});
    const [comment,setComment] = useState("");
    const lstages = lists.find(x=>x.id===l.listId)?.stages||STAGES_DEFAULT;
    const addC = ()=>{if(!comment.trim())return;setL(p=>({...p,comments:[...p.comments,`[${today()}] ${comment}`]}));setComment("");};
    return (
      <Modal title="Lead bearbeiten" wide onClose={onClose}>
        <div className="p-6 grid grid-cols-2 gap-4">
          {[["Name","name"],["E-Mail","email"],["Telefon","phone"],["Stadt","city"],["Produkt","product"]].map(([lb,k])=>(
            <Inp key={k} label={lb} value={l[k]} onChange={e=>setL(p=>({...p,[k]:e.target.value}))}/>
          ))}
          <Inp label="Deal (€)" type="number" value={l.deal} onChange={e=>setL(p=>({...p,deal:parseFloat(e.target.value)||0}))}/>
          <Inp label="Score %" type="number" value={l.score} onChange={e=>setL(p=>({...p,score:parseInt(e.target.value)||0}))}/>
          <Inp label="Follow-up" type="date" value={l.followUp} onChange={e=>setL(p=>({...p,followUp:e.target.value}))}/>
          <Sel label="Zugewiesen" value={l.assignedTo} onChange={e=>setL(p=>({...p,assignedTo:e.target.value}))} options={TEAM}/>
          <Sel label="Liste" value={l.listId} onChange={e=>setL(p=>({...p,listId:e.target.value,stage:lists.find(x=>x.id===e.target.value)?.stages[0]||"Neu"}))} options={lists.map(x=>({value:x.id,label:x.name}))}/>
          <Sel label="Stage" value={l.stage} onChange={e=>setL(p=>({...p,stage:e.target.value}))} options={lstages}/>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Kommentare</label>
            <div className="space-y-1.5 mb-2 max-h-24 overflow-y-auto">{l.comments.map((c,i)=><div key={i} className="text-xs bg-gray-900 rounded-lg px-3 py-1.5 text-gray-300">{c}</div>)}</div>
            <div className="flex gap-2">
              <input className="flex-1 bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Kommentar..." value={comment} onChange={e=>setComment(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addC()}/>
              <Btn size="sm" onClick={addC}>+</Btn>
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3"><Btn onClick={()=>onSave(l)}>Speichern</Btn><Btn variant="secondary" onClick={onClose}>Abbrechen</Btn></div>
      </Modal>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-white">Leads</h1><p className="text-sm text-gray-400 mt-0.5">{leads.length} Leads</p></div>
        <Btn onClick={()=>setShowAdd(true)}>+ Neuer Lead</Btn>
      </div>
      {editing && <LeadForm lead={editing} onSave={l=>{setLeads(p=>p.map(x=>x.id===l.id?l:x));setEditing(null);}} onClose={()=>setEditing(null)}/>}
      {showAdd && (
        <Modal title="Neuer Lead" wide onClose={()=>setShowAdd(false)}>
          <div className="p-6 grid grid-cols-2 gap-4">
            {[["Name *","name"],["E-Mail","email"],["Telefon","phone"],["Stadt","city"],["Produkt","product"]].map(([l,k])=>(
              <Inp key={k} label={l} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}/>
            ))}
            <Inp label="Deal (€)" type="number" value={form.deal} onChange={e=>setForm(p=>({...p,deal:parseFloat(e.target.value)||0}))}/>
            <Sel label="Liste" value={form.listId} onChange={e=>setForm(p=>({...p,listId:e.target.value,stage:lists.find(x=>x.id===e.target.value)?.stages[0]||"Neu"}))} options={lists.map(x=>({value:x.id,label:x.name}))}/>
            <Sel label="Zugewiesen" value={form.assignedTo} onChange={e=>setForm(p=>({...p,assignedTo:e.target.value}))} options={TEAM}/>
          </div>
          <div className="px-6 pb-6 flex gap-3"><Btn onClick={()=>{const list=lists.find(l=>l.id===form.listId)||lists[0];setLeads(p=>[...p,{...form,id:"l"+Date.now(),listId:list?.id,campaign:list?.campaign||"",created:today()}]);setShowAdd(false);}} disabled={!form.name}>Hinzufügen</Btn><Btn variant="secondary" onClick={()=>setShowAdd(false)}>Abbrechen</Btn></div>
        </Modal>
      )}
      <div className="flex gap-3 mb-5 flex-wrap items-center">
        <input className="w-64 bg-gray-900 border border-gray-600 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="🔍 Suchen..." value={search} onChange={e=>setSearch(e.target.value)}/>
        <select className="bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" value={filterList} onChange={e=>setFilterList(e.target.value)}>
          <option className="bg-gray-900" value="Alle">Alle Listen</option>
          {lists.map(l=><option key={l.id} value={l.id} className="bg-gray-900">{l.name}</option>)}
        </select>
        <select className="bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" value={filterStage} onChange={e=>setFilterStage(e.target.value)}>
          <option className="bg-gray-900">Alle</option>
          {stages.map(s=><option key={s} className="bg-gray-900">{s}</option>)}
        </select>
        <span className="text-sm text-gray-400">{visible.length} Leads</span>
      </div>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-700">
            <tr>{["Name","Liste","Stage","Score","Deal","Zugewiesen","Follow-up",""].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {visible.map(lead=>{
              const li=lists.find(l=>l.id===lead.listId);
              return (
                <tr key={lead.id} className="hover:bg-gray-750 transition">
                  <td className="px-4 py-3"><div className="font-semibold text-white">{lead.name}</div><div className="text-xs text-gray-400">{lead.email}</div></td>
                  <td className="px-4 py-3">{li&&<ListBadge list={li}/>}</td>
                  <td className="px-4 py-3"><Badge color={lead.stage==="Gewonnen"?"green":lead.stage==="Verloren"?"red":lead.stage==="Neu"?"indigo":"gray"}>{lead.stage}</Badge></td>
                  <td className="px-4 py-3"><ScoreBadge score={lead.score}/></td>
                  <td className="px-4 py-3 font-semibold text-white">{lead.deal>0?fmt(lead.deal):"–"}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{lead.assignedTo}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{lead.followUp||"–"}</td>
                  <td className="px-4 py-3"><div className="flex gap-1"><Btn size="sm" variant="ghost" onClick={()=>setEditing({...lead})}>✏️</Btn><Btn size="sm" variant="ghost" onClick={()=>setLeads(p=>p.filter(l=>l.id!==lead.id))}>🗑️</Btn></div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {visible.length===0 && <div className="text-center py-16 text-gray-500 text-sm">Keine Leads</div>}
      </Card>
    </div>
  );
}

// ── PIPELINE ──────────────────────────────────────────────────
function Pipeline() {
  const [leads,setLeads] = useStore("leads");
  const [lists] = useStore("lists");
  const [activeList,setActiveList] = useState(lists[0]?.id||"");
  const [dragging,setDragging] = useState(null);
  const [over,setOver] = useState(null);
  const list = lists.find(l=>l.id===activeList)||lists[0];
  const stages = list?.stages||STAGES_DEFAULT;
  const filtered = leads.filter(l=>l.listId===activeList);
  const drop = stage=>{if(!dragging)return;setLeads(p=>p.map(l=>l.id===dragging?{...l,stage}:l));setDragging(null);setOver(null);};
  return (
    <div>
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div><h1 className="text-2xl font-bold text-white">Pipeline</h1><p className="text-sm text-gray-400 mt-0.5">Drag & Drop</p></div>
        <div className="flex gap-2 flex-wrap">
          {lists.map(l=>(
            <button key={l.id} onClick={()=>setActiveList(l.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${activeList===l.id?`${listColor(l)} text-white shadow-lg`:"bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
              {l.name} <span className="opacity-70 ml-1">{leads.filter(x=>x.listId===l.id).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-4" style={{minHeight:"480px"}}>
        {stages.map(stage=>{
          const sl=filtered.filter(l=>l.stage===stage);
          const isWon=stage==="Gewonnen"; const isLost=stage==="Verloren";
          return (
            <div key={stage} className={`flex-shrink-0 w-52 rounded-2xl border-2 transition-all ${over===stage?"shadow-2xl scale-105 border-indigo-500":"border-gray-700"} ${isWon?"bg-emerald-950":isLost?"bg-red-950":"bg-gray-800"}`}
              onDragOver={e=>{e.preventDefault();setOver(stage);}} onDragLeave={()=>setOver(null)} onDrop={()=>drop(stage)}>
              <div className="px-4 py-3 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-200">{stage}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">{sl.length}</span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5 font-semibold">{fmt(sl.reduce((s,l)=>s+(l.deal||0),0))}</div>
              </div>
              <div className="p-2 space-y-2 min-h-16">
                {sl.map(lead=>(
                  <div key={lead.id} draggable onDragStart={()=>setDragging(lead.id)}
                    className="bg-gray-900 border border-gray-700 rounded-xl p-3 cursor-grab hover:border-indigo-500 transition shadow-md">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-white">{lead.name}</span>
                      <ScoreBadge score={lead.score}/>
                    </div>
                    <div className="text-xs text-gray-400">{lead.city}</div>
                    {lead.deal>0 && <div className="text-xs font-bold text-indigo-400 mt-1">{fmt(lead.deal)}</div>}
                    <div className="text-xs text-gray-500 mt-1">{lead.assignedTo}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── DEALS ─────────────────────────────────────────────────────
function Deals() {
  const [deals,setDeals] = useStore("deals");
  const [showAdd,setShowAdd] = useState(false);
  const [form,setForm] = useState({name:"",contact:"",value:0,stage:"Qualifiziert",probability:50,closeDate:"",assignedTo:TEAM[0]});
  const totalOpen = deals.filter(d=>d.stage!=="Gewonnen"&&d.stage!=="Verloren").reduce((s,d)=>s+(d.value||0),0);
  const totalWon = deals.filter(d=>d.stage==="Gewonnen").reduce((s,d)=>s+(d.value||0),0);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-white">Deals</h1><p className="text-sm text-gray-400 mt-0.5">{deals.length} Deals</p></div>
        <Btn onClick={()=>setShowAdd(true)}>+ Neuer Deal</Btn>
      </div>
      {showAdd && (
        <Modal title="Neuer Deal" onClose={()=>setShowAdd(false)}>
          <div className="p-6 grid grid-cols-2 gap-4">
            <Inp label="Name *" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>
            <Inp label="Kontakt" value={form.contact} onChange={e=>setForm(p=>({...p,contact:e.target.value}))}/>
            <Inp label="Wert (€)" type="number" value={form.value} onChange={e=>setForm(p=>({...p,value:parseFloat(e.target.value)||0}))}/>
            <Inp label="Abschluss" type="date" value={form.closeDate} onChange={e=>setForm(p=>({...p,closeDate:e.target.value}))}/>
            <Sel label="Stage" value={form.stage} onChange={e=>setForm(p=>({...p,stage:e.target.value}))} options={STAGES_DEFAULT}/>
            <Sel label="Zugewiesen" value={form.assignedTo} onChange={e=>setForm(p=>({...p,assignedTo:e.target.value}))} options={TEAM}/>
          </div>
          <div className="px-6 pb-6 flex gap-3">
            <Btn onClick={()=>{setDeals(p=>[...p,{...form,id:"d"+Date.now()}]);setShowAdd(false);}} disabled={!form.name}>Hinzufügen</Btn>
            <Btn variant="secondary" onClick={()=>setShowAdd(false)}>Abbrechen</Btn>
          </div>
        </Modal>
      )}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard icon="💼" label="Offene Deals" value={fmt(totalOpen)} color="indigo"/>
        <StatCard icon="🏆" label="Gewonnen" value={fmt(totalWon)} color="green"/>
        <StatCard icon="📊" label="Gesamt" value={deals.length} color="blue"/>
      </div>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-700">
            <tr>{["Deal","Kontakt","Wert","Stage","Chance","Abschluss","Zugewiesen",""].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {deals.map(d=>(
              <tr key={d.id} className="hover:bg-gray-750 transition">
                <td className="px-4 py-3 font-semibold text-white">{d.name}</td>
                <td className="px-4 py-3 text-gray-300">{d.contact}</td>
                <td className="px-4 py-3 font-bold text-indigo-400">{fmt(d.value)}</td>
                <td className="px-4 py-3"><Badge color={d.stage==="Gewonnen"?"green":d.stage==="Verloren"?"red":"indigo"}>{d.stage}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-700 rounded-full"><div className="h-full bg-indigo-500 rounded-full" style={{width:`${d.probability}%`}}/></div>
                    <span className="text-xs text-gray-400">{d.probability}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{d.closeDate||"–"}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{d.assignedTo}</td>
                <td className="px-4 py-3"><Btn size="sm" variant="ghost" onClick={()=>setDeals(p=>p.filter(x=>x.id!==d.id))}>🗑️</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ── CAMPAIGNS ─────────────────────────────────────────────────
function CampaignsMgr() {
  const [campaigns,setCampaigns] = useStore("campaigns");
  const [config] = useStore("config");
  const [loading,setLoading] = useState(false);
  const [showAdd,setShowAdd] = useState(false);
  const [form,setForm] = useState({name:"",platform:"Meta",status:"ACTIVE",spend:0,impressions:0,clicks:0,leads:0,budget:0,cpl:0});
  const fetchMeta = async()=>{
    if(!config.metaToken||!config.metaAccount) return;
    setLoading(true);
    try{const res=await fetch(`https://graph.facebook.com/v19.0/${config.metaAccount}/campaigns?fields=name,status,insights{spend,impressions,clicks}&access_token=${config.metaToken}`);const data=await res.json();if(data.data)setCampaigns(data.data.map(c=>({id:c.id,name:c.name,platform:"Meta",status:c.status,spend:parseFloat(c.insights?.data?.[0]?.spend||0),impressions:parseInt(c.insights?.data?.[0]?.impressions||0),clicks:parseInt(c.insights?.data?.[0]?.clicks||0),leads:0,cpl:0,budget:0})));}catch(e){console.error(e);}
    setLoading(false);
  };
  const totSpend=campaigns.reduce((s,c)=>s+c.spend,0);
  const totLeads=campaigns.reduce((s,c)=>s+c.leads,0);
  const totImpr=campaigns.reduce((s,c)=>s+c.impressions,0);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-white">Kampagnen</h1><p className="text-sm text-gray-400 mt-0.5">{campaigns.length} Kampagnen</p></div>
        <div className="flex gap-2">
          <Btn variant="secondary" onClick={fetchMeta} disabled={loading}>{loading?"⏳":"🔄"} Meta Sync</Btn>
          <Btn onClick={()=>setShowAdd(true)}>+ Neue Kampagne</Btn>
        </div>
      </div>
      {showAdd && (
        <Modal title="Neue Kampagne" onClose={()=>setShowAdd(false)}>
          <div className="p-6 grid grid-cols-2 gap-4">
            <Inp label="Name *" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>
            <Sel label="Plattform" value={form.platform} onChange={e=>setForm(p=>({...p,platform:e.target.value}))} options={["Meta","Google","LinkedIn"]}/>
            <Inp label="Budget (€)" type="number" value={form.budget} onChange={e=>setForm(p=>({...p,budget:parseFloat(e.target.value)||0}))}/>
            <Sel label="Status" value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))} options={["ACTIVE","PAUSED","DRAFT"]}/>
          </div>
          <div className="px-6 pb-6 flex gap-3">
            <Btn onClick={()=>{setCampaigns(p=>[...p,{...form,id:"camp"+Date.now()}]);setShowAdd(false);}} disabled={!form.name}>Erstellen</Btn>
            <Btn variant="secondary" onClick={()=>setShowAdd(false)}>Abbrechen</Btn>
          </div>
        </Modal>
      )}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon="💶" label="Ausgaben" value={fmt(totSpend)} color="indigo"/>
        <StatCard icon="👥" label="Leads" value={fmtN(totLeads)} color="green"/>
        <StatCard icon="👁️" label="Impressionen" value={fmtN(totImpr)} color="blue"/>
        <StatCard icon="🎯" label="Ø CPL" value={fmt(totLeads>0?totSpend/totLeads:0)} color="orange"/>
      </div>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-700">
            <tr>{["Kampagne","Plattform","Status","Budget","Ausgaben","Impr.","Klicks","CTR","Leads","CPL",""].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {campaigns.map(c=>(
              <tr key={c.id} className="hover:bg-gray-750 transition">
                <td className="px-4 py-3 font-semibold text-white">{c.name}</td>
                <td className="px-4 py-3"><Badge color={c.platform==="Meta"?"blue":c.platform==="Google"?"orange":"indigo"}>{c.platform}</Badge></td>
                <td className="px-4 py-3"><Badge color={c.status==="ACTIVE"?"green":"gray"}>{c.status==="ACTIVE"?"Aktiv":"Pausiert"}</Badge></td>
                <td className="px-4 py-3 text-gray-300">{fmt(c.budget)}</td>
                <td className="px-4 py-3 font-semibold text-white">{fmt(c.spend)}</td>
                <td className="px-4 py-3 text-gray-300">{fmtN(c.impressions)}</td>
                <td className="px-4 py-3 text-gray-300">{fmtN(c.clicks)}</td>
                <td className="px-4 py-3 text-gray-300">{c.impressions?((c.clicks/c.impressions)*100).toFixed(2)+"%":"–"}</td>
                <td className="px-4 py-3 font-bold text-indigo-400">{c.leads}</td>
                <td className="px-4 py-3 text-gray-300">{fmt(c.cpl)}</td>
                <td className="px-4 py-3"><Btn size="sm" variant="ghost" onClick={()=>setCampaigns(p=>p.filter(x=>x.id!==c.id))}>🗑️</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ── AD ACCOUNTS ───────────────────────────────────────────────
function AdAccounts() {
  const [config,setConfig] = useStore("config");
  const [saved,setSaved] = useState(false);
  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-white">Ad Accounts</h1><p className="text-sm text-gray-400 mt-0.5">Werbekonten verbinden</p></div>
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">f</div>
            <div className="flex-1"><div className="font-bold text-white">Meta</div><div className="text-xs text-gray-400">Facebook & Instagram</div></div>
            <Badge color={config.metaToken?"green":"gray"}>{config.metaToken?"✓ Verbunden":"Nicht verbunden"}</Badge>
          </div>
          <div className="space-y-3">
            <Inp label="Access Token" value={config.metaToken} onChange={e=>setConfig(p=>({...p,metaToken:e.target.value}))} placeholder="EAAxxxxx..."/>
            <Inp label="Ad Account ID" value={config.metaAccount} onChange={e=>setConfig(p=>({...p,metaAccount:e.target.value}))} placeholder="act_123456789"/>
          </div>
          <div className="mt-4 p-3 bg-gray-900 rounded-xl text-xs text-gray-400"><strong className="text-gray-300">Benötigt:</strong> ads_read · leads_retrieval</div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold text-lg">G</div>
            <div className="flex-1"><div className="font-bold text-white">Google Ads</div><div className="text-xs text-gray-400">Google Ads API</div></div>
            <Badge color={config.googleAccount?"green":"gray"}>{config.googleAccount?"✓ Verbunden":"Nicht verbunden"}</Badge>
          </div>
          <Inp label="Customer ID" value={config.googleAccount} onChange={e=>setConfig(p=>({...p,googleAccount:e.target.value}))} placeholder="123-456-7890"/>
          <div className="mt-4 p-3 bg-gray-900 rounded-xl text-xs text-gray-400"><strong className="text-gray-300">Benötigt:</strong> Google Ads API · Developer Token</div>
        </Card>
        <Card className="p-6 col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white">🔗</div>
            <div><div className="font-bold text-white">Make.com Webhook</div><div className="text-xs text-gray-400">Auto Lead Import</div></div>
          </div>
          <div className="bg-gray-900 rounded-xl px-4 py-3 font-mono text-sm text-indigo-400 border border-indigo-900">https://your-crm.vercel.app/api/webhook</div>
        </Card>
      </div>
      <div className="mt-6"><Btn onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000);}}>{saved?"✅ Gespeichert!":"Einstellungen speichern"}</Btn></div>
    </div>
  );
}

// ── CONTENT CREATOR ───────────────────────────────────────────
function ContentCreator() {
  const [posts,setPosts] = useStore("posts");
  const [showAdd,setShowAdd] = useState(false);
  const [gen,setGen] = useState(false);
  const [form,setForm] = useState({caption:"",platform:[],scheduledAt:"",status:"Geplant",topic:""});
  const platforms = ["Facebook","Instagram","LinkedIn"];
  const platIcon = p => p==="Facebook"?"📘":p==="Instagram"?"📸":"💼";
  const toggleP = p => setForm(prev=>({...prev,platform:prev.platform.includes(p)?prev.platform.filter(x=>x!==p):[...prev.platform,p]}));
  const genCaption = async()=>{
    if(!form.topic) return; setGen(true);
    try{const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`Schreibe einen professionellen Social Media Post auf Deutsch für: "${form.topic}". Mit Emojis und Call-to-Action. Nur den Post-Text.`}]})});const data=await res.json();setForm(p=>({...p,caption:data.content?.[0]?.text||""}));}catch(e){setForm(p=>({...p,caption:"KI nicht verfügbar. Bitte manuell eingeben."}));}
    setGen(false);
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-white">Content Creator</h1><p className="text-sm text-gray-400 mt-0.5">Posts erstellen & planen</p></div>
        <Btn onClick={()=>setShowAdd(true)}>+ Neuer Post</Btn>
      </div>
      {showAdd && (
        <Modal title="Neuer Post" wide onClose={()=>setShowAdd(false)}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Plattformen</label>
              <div className="flex gap-2">{platforms.map(p=><button key={p} onClick={()=>toggleP(p)} className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition ${form.platform.includes(p)?"border-indigo-500 bg-indigo-900 text-indigo-300":"border-gray-600 text-gray-400 hover:border-gray-400"}`}>{platIcon(p)} {p}</button>)}</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">🤖 KI Caption Generator</label>
              <div className="flex gap-2">
                <input className="flex-1 bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Thema eingeben..." value={form.topic} onChange={e=>setForm(p=>({...p,topic:e.target.value}))}/>
                <Btn onClick={genCaption} disabled={gen||!form.topic} variant="secondary">{gen?"⏳":"✨"} Generieren</Btn>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Caption</label>
              <textarea className="w-full bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none" value={form.caption} onChange={e=>setForm(p=>({...p,caption:e.target.value}))}/>
            </div>
            <Inp label="📅 Geplant für" type="datetime-local" value={form.scheduledAt} onChange={e=>setForm(p=>({...p,scheduledAt:e.target.value}))}/>
          </div>
          <div className="px-6 pb-6 flex gap-3">
            <Btn onClick={()=>{setPosts(p=>[...p,{...form,id:"p"+Date.now()}]);setShowAdd(false);setForm({caption:"",platform:[],scheduledAt:"",status:"Geplant",topic:""}); }} disabled={!form.caption||form.platform.length===0}>Speichern</Btn>
            <Btn variant="secondary" onClick={()=>setShowAdd(false)}>Abbrechen</Btn>
          </div>
        </Modal>
      )}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard icon="📝" label="Geplant" value={posts.filter(p=>p.status==="Geplant").length} color="indigo"/>
        <StatCard icon="✅" label="Veröffentlicht" value={posts.filter(p=>p.status==="Veröffentlicht").length} color="green"/>
        <StatCard icon="📱" label="Plattformen" value="3" sub="Facebook · Instagram · LinkedIn" color="purple"/>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {posts.map(post=>(
          <Card key={post.id} className="p-5 hover:border-gray-600 transition">
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-1.5">{post.platform.map(p=><span key={p} className="text-xl">{platIcon(p)}</span>)}</div>
              <Badge color={post.status==="Veröffentlicht"?"green":"indigo"}>{post.status}</Badge>
            </div>
            <p className="text-sm text-gray-300 mb-4 line-clamp-3">{post.caption}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">📅 {post.scheduledAt||"Kein Datum"}</span>
              <div className="flex gap-1">
                <Btn size="sm" variant="success" onClick={()=>setPosts(p=>p.map(x=>x.id===post.id?{...x,status:"Veröffentlicht"}:x))}>✅</Btn>
                <Btn size="sm" variant="ghost" onClick={()=>setPosts(p=>p.filter(x=>x.id!==post.id))}>🗑️</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── UMSATZ ────────────────────────────────────────────────────
function Umsatz() {
  const [leads] = useStore("leads");
  const [lists] = useStore("lists");
  const now = new Date();
  const thisM = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
  const lastMDate = new Date(now.getFullYear(),now.getMonth()-1,1);
  const lastM = `${lastMDate.getFullYear()}-${String(lastMDate.getMonth()+1).padStart(2,"0")}`;
  const won = leads.filter(l=>l.stage==="Gewonnen");
  const totalRev = won.reduce((s,l)=>s+(l.deal||0),0);
  const thisRev = won.filter(l=>l.created?.startsWith(thisM)).reduce((s,l)=>s+(l.deal||0),0);
  const lastRev = won.filter(l=>l.created?.startsWith(lastM)).reduce((s,l)=>s+(l.deal||0),0);
  const diff = thisRev-lastRev;
  const diffPct = lastRev>0?((diff/lastRev)*100).toFixed(1):null;
  const pipeline = leads.filter(l=>l.stage!=="Gewonnen"&&l.stage!=="Verloren").reduce((s,l)=>s+(l.deal||0),0);
  const conv = leads.length>0?((won.length/leads.length)*100).toFixed(1):0;
  const byList = lists.map(l=>({list:l,total:leads.filter(x=>x.listId===l.id).length,won:leads.filter(x=>x.listId===l.id&&x.stage==="Gewonnen").length,rev:leads.filter(x=>x.listId===l.id&&x.stage==="Gewonnen").reduce((s,x)=>s+(x.deal||0),0)}));
  const byTeam = TEAM.map(t=>({name:t,won:leads.filter(l=>l.assignedTo===t&&l.stage==="Gewonnen").length,rev:leads.filter(l=>l.assignedTo===t&&l.stage==="Gewonnen").reduce((s,l)=>s+(l.deal||0),0)}));
  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-white">Umsatz Dashboard</h1></div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon="💶" label="Gesamtumsatz" value={fmt(totalRev)} sub={`${won.length} Deals`} color="green"/>
        <StatCard icon="📅" label="Dieser Monat" value={fmt(thisRev)} sub={diffPct?`${diff>=0?"▲":"▼"} ${Math.abs(diffPct)}%`:""} color="indigo"/>
        <StatCard icon="🔄" label="Pipeline" value={fmt(pipeline)} sub={`Conv. ${conv}%`} color="blue"/>
        <StatCard icon="📊" label="Ø Deal" value={fmt(won.length>0?totalRev/won.length:0)} color="purple"/>
      </div>
      <Card className="p-6 mb-5">
        <h3 className="font-bold text-white mb-4">📅 Monat vs. Vormonat</h3>
        {[{label:now.toLocaleString("de-DE",{month:"long",year:"numeric"}),val:thisRev,color:"bg-indigo-500"},{label:lastMDate.toLocaleString("de-DE",{month:"long",year:"numeric"}),val:lastRev,color:"bg-gray-600"}].map(item=>{
          const max=Math.max(thisRev,lastRev,1);
          return (
            <div key={item.label} className="mb-4">
              <div className="flex justify-between text-sm mb-1.5"><span className="text-gray-300">{item.label}</span><span className="font-bold text-white">{fmt(item.val)}</span></div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden"><div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{width:`${(item.val/max)*100}%`}}/></div>
            </div>
          );
        })}
      </Card>
      <div className="grid grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="font-bold text-white mb-4">🎯 Umsatz nach Produkt</h3>
          <div className="space-y-4">
            {byList.map(({list,total,won:w,rev})=>(
              <div key={list.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2"><ColorDot list={list}/><span className="text-sm text-gray-300">{list.name}</span></div>
                  <span className="text-sm font-bold text-white">{fmt(rev)}</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden"><div className={`h-full ${listColor(list)} rounded-full`} style={{width:`${totalRev>0?(rev/totalRev)*100:0}%`}}/></div>
                <div className="flex justify-between text-xs text-gray-500 mt-1"><span>{total} Leads</span><span>{w} Won</span></div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-bold text-white mb-4">👥 Team Performance</h3>
          <div className="space-y-4">
            {byTeam.sort((a,b)=>b.rev-a.rev).map(t=>(
              <div key={t.name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-800 flex items-center justify-center text-indigo-300 font-bold text-xs flex-shrink-0">{t.name.split(" ").map(n=>n[0]).join("")}</div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1"><span className="text-sm text-gray-300">{t.name}</span><span className="text-sm font-bold text-indigo-400">{fmt(t.rev)}</span></div>
                  <div className="h-1.5 bg-gray-700 rounded-full"><div className="h-full bg-indigo-500 rounded-full" style={{width:`${totalRev>0?(t.rev/totalRev)*100:0}%`}}/></div>
                </div>
                <Badge color="green">{t.won} Won</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── EINSTELLUNGEN ─────────────────────────────────────────────
function Einstellungen() {
  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-white">Einstellungen</h1></div>
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-white mb-4">👥 Team</h3>
          <div className="space-y-2">
            {TEAM.map(t=>(
              <div key={t} className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-indigo-800 flex items-center justify-center text-indigo-300 font-bold text-xs">{t.split(" ").map(n=>n[0]).join("")}</div>
                <div className="flex-1"><div className="text-sm font-medium text-white">{t}</div><div className="text-xs text-gray-400">Vertrieb</div></div>
                <Badge color="green">Aktiv</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold text-white mb-4">🚀 Deploy Guide</h3>
          <div className="space-y-3">
            {[["1","GitHub","github.com → Sign up → New repo","bg-blue-600"],["2","Code Upload","6 Dateien via Create new file","bg-purple-600"],["3","Vercel","Import repo → Vite → Deploy","bg-orange-600"],["4","Make.com","Facebook Lead Ads → Webhook","bg-green-600"]].map(([n,t,s,bg])=>(
              <div key={n} className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl">
                <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center text-white font-bold text-sm`}>{n}</div>
                <div><div className="text-sm font-semibold text-white">{t}</div><div className="text-xs text-gray-400">{s}</div></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── NAV ───────────────────────────────────────────────────────
const NAV = [
  {id:"crm",label:"CRM",icon:"🗂️",color:"bg-blue-600",children:[{id:"contacts",label:"Kontakte"},{id:"lists",label:"Listen"}]},
  {id:"sales",label:"Sales",icon:"💼",color:"bg-purple-600",children:[{id:"leads",label:"Leads"},{id:"pipeline",label:"Pipeline"},{id:"deals",label:"Deals"}]},
  {id:"marketing",label:"Marketing",icon:"📣",color:"bg-orange-600",children:[{id:"campaigns",label:"Kampagnen"},{id:"adaccounts",label:"Ad Accounts"},{id:"content",label:"Content Creator"}]},
  {id:"umsatz",label:"Umsatz",icon:"💰",color:"bg-emerald-600",children:[{id:"umsatz",label:"Dashboard"}]},
  {id:"settings",label:"Einstellungen",icon:"⚙️",color:"bg-gray-600",children:[{id:"settings",label:"Einstellungen"}]},
];

const PAGES = {contacts:<Contacts/>,lists:<Lists/>,leads:<Leads/>,pipeline:<Pipeline/>,deals:<Deals/>,campaigns:<CampaignsMgr/>,adaccounts:<AdAccounts/>,content:<ContentCreator/>,umsatz:<Umsatz/>,settings:<Einstellungen/>};

export default function App() {
  const [active,setActive] = useState("leads");
  const [open,setOpen] = useState(["crm","sales","marketing"]);
  const toggle = id => setOpen(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const activeSection = NAV.find(s=>s.children.find(c=>c.id===active));
  const activePage = NAV.flatMap(s=>s.children).find(c=>c.id===active);

  return (
    <div className="flex h-screen bg-gray-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 bg-gray-950 border-r border-gray-800 flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">G</div>
            <div><div className="font-bold text-white text-sm">GrowDesk</div><div className="text-xs text-gray-500">v3.0</div></div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(section=>(
            <div key={section.id}>
              <button onClick={()=>toggle(section.id)} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-800 transition group">
                <div className={`w-6 h-6 rounded-lg ${section.color} flex items-center justify-center text-xs`}>{section.icon}</div>
                <span className="flex-1 text-left text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-200">{section.label}</span>
                <span className="text-gray-600 text-xs">{open.includes(section.id)?"▾":"▸"}</span>
              </button>
              {open.includes(section.id) && (
                <div className="ml-3 pl-3 border-l border-gray-800 space-y-0.5 mt-1 mb-2">
                  {section.children.map(item=>(
                    <button key={item.id} onClick={()=>setActive(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition ${active===item.id?"bg-gray-800 text-white font-semibold":"text-gray-400 hover:text-gray-200 hover:bg-gray-800"}`}>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-indigo-700 flex items-center justify-center text-white font-bold text-xs">A</div>
            <div><div className="text-xs font-semibold text-gray-300">Admin</div><div className="text-xs text-gray-600">GrowDesk</div></div>
            <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400"/>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-gray-950 border-b border-gray-800 px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {activeSection && <><span className="text-gray-300 font-semibold">{activeSection.label}</span><span>/</span></>}
            <span className="text-gray-400">{activePage?.label}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{new Date().toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long"})}</span>
            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"/><span>Online</span></div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-gray-900">
          {PAGES[active]||<Leads/>}
        </div>
      </div>
    </div>
  );
}
