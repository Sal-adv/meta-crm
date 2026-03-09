import { useState, useCallback, useRef } from "react";

const STAGES_DEFAULT = ["Neu","Kontaktiert","Qualifiziert","Angebot","Gewonnen","Verloren"];
const LIST_COLORS = ["bg-orange-500","bg-blue-500","bg-purple-500","bg-green-500","bg-pink-500","bg-teal-500","bg-red-500","bg-indigo-500"];
const SOURCES = ["Meta Ad","Google Ad","Webseite","Empfehlung","LinkedIn","Messe","Sonstiges"];
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
      {id:"l5",name:"Julia Hoffmann",email:"julia@example.com",phone:"+49 163 7778899",city:"Köln",product:"Solar Anlage",listId:"list1",campaign:"Frühling Aktion",stage:"Gewonnen",deal:4200,score:95,assignedTo:"Anna K.",followUp:"",source:"Meta Ad",created:"2026-02-10",wonAt:"2026-03-09",comments:["Deal abgeschlossen! 🎉"]},
      {id:"l6",name:"Peter Schulz",email:"peter@example.com",phone:"+49 157 2221100",city:"Düsseldorf",product:"Beratung",listId:"list3",campaign:"Retargeting Q1",stage:"Neu",deal:0,score:45,assignedTo:"Max M.",followUp:"2026-03-12",source:"Webseite",created:"2026-02-05",comments:[]},
      {id:"l7",name:"Lisa Braun",email:"lisa@example.com",phone:"+49 176 6665544",city:"Stuttgart",product:"Solar Anlage",listId:"list1",campaign:"Sommer Kampagne",stage:"Gewonnen",deal:3100,score:90,assignedTo:"Sara L.",followUp:"",source:"Meta Ad",created:"2026-02-28",wonAt:"2026-03-09",comments:[]},
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
      {id:"p1",caption:"🌞 Sparen Sie bis zu 70% Ihrer Energiekosten mit unserer Solar Anlage!",platform:["Facebook","Instagram"],scheduledAt:"2026-03-10 10:00",status:"Geplant",mediaUrl:"",mediaType:""},
      {id:"p2",caption:"💡 Wärmepumpen-Technologie der Zukunft — heute schon verfügbar.",platform:["LinkedIn"],scheduledAt:"2026-03-12 09:00",status:"Geplant",mediaUrl:"",mediaType:""},
    ],
    config:{metaToken:"",metaAccount:"",metaPageId:"",googleAccount:""},
    team:[
      {id:"t1",name:"Anna K.",role:"Vertrieb",active:true},
      {id:"t2",name:"Max M.",role:"Vertrieb",active:true},
      {id:"t3",name:"Sara L.",role:"Vertrieb",active:true},
      {id:"t4",name:"David F.",role:"Vertrieb",active:true},
    ],
    targets:{weekly:{revenue:15000,leads:20,deals:5},monthly:{revenue:60000,leads:80,deals:20}},
    dailyKPIs:[],
  };
}

function useStore(key){
  const [val,setVal]=useState(()=>window._gd[key]);
  const save=useCallback(v=>{const next=typeof v==="function"?v(window._gd[key]):v;window._gd[key]=next;setVal(next);},[key]);
  return [val,save];
}

const listColor=(l)=>LIST_COLORS[l?.colorIdx||0]||"bg-indigo-500";
const Card=({children,className=""})=><div className={`bg-gray-800 border border-gray-700 rounded-2xl ${className}`}>{children}</div>;
const Modal=({onClose,children,title,wide=false})=>(
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
    <div className={`bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl ${wide?"w-full max-w-2xl":"w-full max-w-lg"} max-h-screen overflow-y-auto`}>
      {title&&<div className="flex items-center justify-between px-6 py-4 border-b border-gray-700"><h3 className="text-base font-bold text-white">{title}</h3><button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition">✕</button></div>}
      {children}
    </div>
  </div>
);
const Inp=({label,value,onChange,type="text",placeholder="",readOnly=false,className=""})=>(
  <div className={className}>
    {label&&<label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">{label}</label>}
    <input type={type} value={value||""} onChange={onChange} readOnly={readOnly} placeholder={placeholder} className={`w-full bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${readOnly?"opacity-50":""}`}/>
  </div>
);
const Sel=({label,value,onChange,options,className=""})=>(
  <div className={className}>
    {label&&<label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">{label}</label>}
    <select value={value||""} onChange={onChange} className="w-full bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
      {options.map(o=>typeof o==="string"?<option key={o} className="bg-gray-900">{o}</option>:<option key={o.value} value={o.value} className="bg-gray-900">{o.label}</option>)}
    </select>
  </div>
);
const Btn=({onClick,children,variant="primary",size="md",disabled=false,className=""})=>{
  const sz={sm:"px-3 py-1.5 text-xs",md:"px-4 py-2 text-sm",lg:"px-6 py-3 text-base"};
  const vr={primary:"bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg",secondary:"bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600",ghost:"hover:bg-gray-700 text-gray-400 hover:text-white",danger:"bg-red-900 hover:bg-red-800 text-red-300 border border-red-700",success:"bg-emerald-900 hover:bg-emerald-800 text-emerald-300 border border-emerald-700"};
  return <button onClick={onClick} disabled={disabled} className={`font-semibold rounded-xl transition flex items-center gap-1.5 ${sz[size]} ${vr[variant]||vr.primary} ${disabled?"opacity-40 cursor-not-allowed":""} ${className}`}>{children}</button>;
};
const Badge=({color="gray",children})=>{
  const m={gray:"bg-gray-700 text-gray-300",indigo:"bg-indigo-900 text-indigo-300",green:"bg-emerald-900 text-emerald-400",red:"bg-red-900 text-red-400",orange:"bg-orange-900 text-orange-400",yellow:"bg-yellow-900 text-yellow-400",blue:"bg-blue-900 text-blue-400",purple:"bg-purple-900 text-purple-400"};
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${m[color]||m.gray}`}>{children}</span>;
};
const ColorDot=({list})=><span className={`inline-block w-2.5 h-2.5 rounded-full ${listColor(list)}`}/>;
const ListBadge=({list})=><span className={`px-2.5 py-0.5 rounded-full text-xs font-bold text-white ${listColor(list)}`}>{list?.name}</span>;
const ScoreBadge=({score})=><Badge color={score>=80?"green":score>=60?"yellow":"red"}>{score}%</Badge>;
const StatCard=({icon,label,value,sub,color="indigo"})=>{
  const bg={indigo:"bg-indigo-600",green:"bg-emerald-600",blue:"bg-blue-600",orange:"bg-orange-600",purple:"bg-purple-600",pink:"bg-pink-600"};
  return(<Card className="p-5"><div className={`w-10 h-10 rounded-xl ${bg[color]||bg.indigo} flex items-center justify-center text-white text-lg mb-3`}>{icon}</div><div className="text-2xl font-bold text-white">{value}</div><div className="text-sm text-gray-400 mt-0.5">{label}</div>{sub&&<div className="text-xs text-gray-500 mt-1">{sub}</div>}</Card>);
};
const ProgressBar=({value,target,color="bg-indigo-500",showEuro=false})=>{
  const pct=target>0?Math.min((value/target)*100,100):0;
  const over=target>0&&value>=target;
  return(<div className="mt-1.5"><div className="flex justify-between text-xs text-gray-400 mb-1"><span className={over?"text-emerald-400 font-bold":""}>{Math.round(pct)}% {over?"🎉":""}</span><span>Ziel: {showEuro?fmt(target):target}</span></div><div className="h-2 bg-gray-700 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-500 ${over?"bg-emerald-500":color}`} style={{width:`${pct}%`}}/></div></div>);
};

function Contacts(){
  const [contacts,setContacts]=useStore("contacts");
  const [lists]=useStore("lists");
  const [search,setSearch]=useState("");
  const [editing,setEditing]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const [assignModal,setAssignModal]=useState(null);
  const blank={name:"",company:"",title:"",email:"",phone:"",city:"",source:SOURCES[0],tags:[],notes:"",listIds:[]};
  const [form,setForm]=useState(blank);
  const visible=contacts.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.company?.toLowerCase().includes(search.toLowerCase()));
  const save=()=>{if(editing)setContacts(p=>p.map(c=>c.id===editing.id?editing:c));else setContacts(p=>[...p,{...form,id:"c"+Date.now(),created:today()}]);setEditing(null);setShowAdd(false);setForm(blank);};
  const toggleList=(contact,listId)=>{const has=(contact.listIds||[]).includes(listId);setContacts(p=>p.map(c=>c.id===contact.id?{...c,listIds:has?(c.listIds||[]).filter(x=>x!==listId):[...(c.listIds||[]),listId]}:c));};
  return(<div>
    <div className="flex items-center justify-between mb-6"><div><h1 className="text-2xl font-bold text-white">Kontakte</h1><p className="text-sm text-gray-400 mt-0.5">{contacts.length} Kontakte</p></div><Btn onClick={()=>setShowAdd(true)}>+ Neuer Kontakt</Btn></div>
    {(showAdd||editing)&&(<Modal title={editing?"Kontakt bearbeiten":"Neuer Kontakt"} onClose={()=>{setShowAdd(false);setEditing(null);}}>
      <div className="p-6 grid grid-cols-2 gap-4">
        {[["Name *","name"],["Unternehmen","company"],["Position","title"],["E-Mail","email"],["Telefon","phone"],["Stadt","city"]].map(([l,k])=>(<Inp key={k} label={l} value={editing?editing[k]:form[k]} onChange={e=>editing?setEditing(p=>({...p,[k]:e.target.value})):setForm(p=>({...p,[k]:e.target.value}))}/>))}
        <Sel label="Quelle" value={editing?editing.source:form.source} onChange={e=>editing?setEditing(p=>({...p,source:e.target.value})):setForm(p=>({...p,source:e.target.value}))} options={SOURCES}/>
        <div className="col-span-2"><label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Notizen</label><textarea className="w-full bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20 resize-none" value={editing?editing.notes:form.notes} onChange={e=>editing?setEditing(p=>({...p,notes:e.target.value})):setForm(p=>({...p,notes:e.target.value}))}/></div>
      </div>
      <div className="px-6 pb-6 flex gap-3"><Btn onClick={save} disabled={!(editing?editing.name:form.name)}>Speichern</Btn><Btn variant="secondary" onClick={()=>{setShowAdd(false);setEditing(null);}}>Abbrechen</Btn></div>
    </Modal>)}
    {assignModal&&(<Modal title={`Listen: ${assignModal.name}`} onClose={()=>setAssignModal(null)}>
      <div className="p-6 space-y-2">{lists.map(l=>{const active=(assignModal.listIds||[]).includes(l.id);return(<div key={l.id} onClick={()=>{toggleList(assignModal,l.id);setAssignModal(p=>({...p,listIds:active?(p.listIds||[]).filter(x=>x!==l.id):[...(p.listIds||[]),l.id]}));}} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${active?"border-indigo-500 bg-indigo-900 bg-opacity-30":"border-gray-700 hover:border-gray-500"}`}><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-lg ${listColor(l)} flex items-center justify-center text-white text-xs font-bold`}>{l.name.slice(0,2)}</div><div><div className="text-sm font-semibold text-white">{l.name}</div><div className="text-xs text-gray-400">{l.campaign||"Keine Kampagne"}</div></div></div><div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active?"border-indigo-500 bg-indigo-500":"border-gray-500"}`}>{active&&<span className="text-white text-xs">✓</span>}</div></div>);})}</div>
      <div className="px-6 pb-6"><Btn onClick={()=>setAssignModal(null)}>Fertig</Btn></div>
    </Modal>)}
    <input className="w-64 bg-gray-900 border border-gray-600 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4" placeholder="🔍 Suchen..." value={search} onChange={e=>setSearch(e.target.value)}/>
    <Card className="overflow-hidden"><table className="w-full text-sm"><thead className="border-b border-gray-700"><tr>{["Kontakt","Unternehmen","E-Mail","Stadt","Quelle","Listen",""].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>)}</tr></thead><tbody className="divide-y divide-gray-700">{visible.map(c=>(<tr key={c.id} className="hover:bg-gray-750 transition" style={{backgroundColor:"transparent"}}><td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-indigo-800 flex items-center justify-center text-indigo-300 font-bold text-xs">{c.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div><div><div className="font-semibold text-white">{c.name}</div><div className="text-xs text-gray-400">{c.title}</div></div></div></td><td className="px-4 py-3 text-gray-300">{c.company||"–"}</td><td className="px-4 py-3 text-gray-400 text-xs">{c.email}</td><td className="px-4 py-3 text-gray-300">{c.city||"–"}</td><td className="px-4 py-3"><Badge>{c.source}</Badge></td><td className="px-4 py-3"><div className="flex flex-wrap gap-1">{(c.listIds||[]).map(lid=>{const l=lists.find(x=>x.id===lid);return l?<ListBadge key={lid} list={l}/>:null;})}<button onClick={()=>setAssignModal({...c})} className="px-2 py-0.5 rounded-full text-xs border border-dashed border-gray-600 text-gray-500 hover:border-indigo-500 hover:text-indigo-400 transition">+ Liste</button></div></td><td className="px-4 py-3"><div className="flex gap-1"><Btn size="sm" variant="ghost" onClick={()=>setEditing({...c})}>✏️</Btn><Btn size="sm" variant="ghost" onClick={()=>setContacts(p=>p.filter(x=>x.id!==c.id))}>🗑️</Btn></div></td></tr>))}</tbody></table>{visible.length===0&&<div className="text-center py-16 text-gray-500 text-sm">Keine Kontakte</div>}</Card>
  </div>);
}

function Lists(){
  const [lists,setLists]=useStore("lists");
  const [contacts,setContacts]=useStore("contacts");
  const [leads]=useStore("leads");
  const [campaigns]=useStore("campaigns");
  const [editing,setEditing]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const [activeList,setActiveList]=useState(null);
  const [showImport,setShowImport]=useState(false);
  const [importText,setImportText]=useState("");
  const [newContact,setNewContact]=useState({name:"",email:"",phone:"",city:"",source:SOURCES[0]});
  const fileRef=useRef();
  const ListForm=({list,onSave,onClose})=>{
    const [name,setName]=useState(list.name||"");
    const [colorIdx,setColorIdx]=useState(list.colorIdx||0);
    const [campaign,setCampaign]=useState(list.campaign||"");
    const [stages,setStages]=useState(list.stages||[...STAGES_DEFAULT]);
    const [ns,setNs]=useState("");
    const addS=()=>{if(ns.trim()){setStages(s=>[...s,ns.trim()]);setNs("");}};
    const remS=i=>setStages(s=>s.filter((_,j)=>j!==i));
    const movS=(i,d)=>{const a=[...stages];const j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];setStages(a);};
    return(<Modal title={!list.id?"Neue Liste":"Liste bearbeiten"} wide onClose={onClose}><div className="p-6 space-y-5"><div className="grid grid-cols-2 gap-4"><Inp label="Name" value={name} onChange={e=>setName(e.target.value)} placeholder="z.B. Solar Anlage"/><Sel label="Kampagne" value={campaign} onChange={e=>setCampaign(e.target.value)} options={[{value:"",label:"– Keine –"},...campaigns.map(c=>({value:c.name,label:c.name}))]}/></div><div><label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Farbe</label><div className="flex gap-2 flex-wrap">{LIST_COLORS.map((c,i)=><button key={i} onClick={()=>setColorIdx(i)} className={`w-8 h-8 rounded-full ${c} ${colorIdx===i?"ring-2 ring-offset-2 ring-offset-gray-800 ring-white":""} transition`}/>)}</div></div><div><label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Pipeline-Stufen</label><div className="space-y-2 mb-3">{stages.map((s,i)=>(<div key={i} className="flex items-center gap-2 bg-gray-900 rounded-xl px-3 py-2"><span className="flex-1 text-sm text-gray-200">{s}</span><button onClick={()=>movS(i,-1)} disabled={i===0} className="text-gray-500 hover:text-gray-300 disabled:opacity-20 text-xs">▲</button><button onClick={()=>movS(i,1)} disabled={i===stages.length-1} className="text-gray-500 hover:text-gray-300 disabled:opacity-20 text-xs">▼</button><button onClick={()=>remS(i)} className="text-red-500 hover:text-red-300 text-xs">✕</button></div>))}</div><div className="flex gap-2"><input className="flex-1 bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Neue Stufe..." value={ns} onChange={e=>setNs(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addS()}/><Btn onClick={addS} size="sm">+ Add</Btn></div></div></div><div className="px-6 pb-6 flex gap-3"><Btn onClick={()=>onSave({...list,id:list.id||"list"+Date.now(),name,colorIdx,campaign,stages})} disabled={!name.trim()}>Speichern</Btn><Btn variant="secondary" onClick={onClose}>Abbrechen</Btn></div></Modal>);
  };
  const saveList=l=>{if(lists.find(x=>x.id===l.id))setLists(p=>p.map(x=>x.id===l.id?l:x));else setLists(p=>[...p,l]);setEditing(null);setShowAdd(false);};
  const addContactToList=()=>{if(!newContact.name||!activeList)return;setContacts(p=>[...p,{...newContact,id:"c"+Date.now(),created:today(),listIds:[activeList],tags:[]}]);setNewContact({name:"",email:"",phone:"",city:"",source:SOURCES[0]});};
  const handleCSV=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{const lines=ev.target.result.split("\n").filter(Boolean);const headers=lines[0].split(",").map(h=>h.trim().toLowerCase().replace(/["\r]/g,""));const newC=lines.slice(1).map((line,i)=>{const vals=line.split(",").map(v=>v.trim().replace(/["\r]/g,""));const obj={};headers.forEach((h,j)=>{obj[h]=vals[j]||"";});return{id:"c"+Date.now()+i,name:obj.name||"",email:obj.email||"",phone:obj.phone||obj.telefon||"",city:obj.city||obj.stadt||"",company:obj.company||"",source:"CSV Import",tags:[],listIds:activeList?[activeList]:[],created:today()};}).filter(c=>c.name.trim());setContacts(p=>[...p,...newC]);setShowImport(false);e.target.value="";};reader.readAsText(file);};
  const viewList=lists.find(l=>l.id===activeList);
  const listContacts=contacts.filter(c=>(c.listIds||[]).includes(activeList));
  return(<div>
    {editing&&<ListForm list={editing} onSave={saveList} onClose={()=>setEditing(null)}/>}
    {showAdd&&<ListForm list={{name:"",colorIdx:lists.length%LIST_COLORS.length,stages:[...STAGES_DEFAULT],campaign:""}} onSave={saveList} onClose={()=>setShowAdd(false)}/>}
    {showImport&&(<Modal title="CSV Importieren" wide onClose={()=>setShowImport(false)}><div className="p-6 space-y-4"><div className="bg-gray-900 rounded-xl p-4 text-sm text-gray-400">Erwartet: <span className="text-indigo-400 font-mono">name, email, phone, city, company</span><div className="mt-2"><input ref={fileRef} type="file" accept=".csv" onChange={handleCSV} className="hidden"/><Btn onClick={()=>fileRef.current.click()} variant="secondary">📂 CSV Datei wählen</Btn></div></div><div><label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Oder Text einfügen</label><textarea className="w-full bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white font-mono h-28 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder={"name,email,phone\nAnna Müller,anna@example.com,+49151..."} value={importText} onChange={e=>setImportText(e.target.value)}/></div>{importText&&<Btn onClick={()=>{const lines=importText.split("\n").filter(Boolean);const headers=lines[0].split(",").map(h=>h.trim().toLowerCase());const newC=lines.slice(1).map((line,i)=>{const vals=line.split(",").map(v=>v.trim());const obj={};headers.forEach((h,j)=>{obj[h]=vals[j]||"";});return{id:"c"+Date.now()+i,name:obj.name||"",email:obj.email||"",phone:obj.phone||"",city:obj.city||"",company:obj.company||"",source:"CSV Import",tags:[],listIds:activeList?[activeList]:[],created:today()};}).filter(c=>c.name);setContacts(p=>[...p,...newC]);setImportText("");setShowImport(false);}}>✅ {importText.split("\n").filter(Boolean).length-1} Kontakte importieren</Btn>}</div></Modal>)}
    <div className="flex items-center justify-between mb-6"><div><h1 className="text-2xl font-bold text-white">Listen</h1><p className="text-sm text-gray-400 mt-0.5">{lists.length} Listen</p></div><Btn onClick={()=>setShowAdd(true)}>+ Neue Liste</Btn></div>
    {!activeList?(<div className="grid grid-cols-3 gap-4">{lists.map(l=>{const lc=contacts.filter(c=>(c.listIds||[]).includes(l.id));const ll=leads.filter(x=>x.listId===l.id);const won=ll.filter(x=>x.stage==="Gewonnen");return(<div key={l.id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:border-gray-500 transition cursor-pointer" onClick={()=>setActiveList(l.id)}><div className={`h-2 ${listColor(l)}`}/><div className="p-5"><div className="flex items-start justify-between mb-4"><div><div className="font-bold text-white text-lg">{l.name}</div><div className="text-xs text-gray-400 mt-0.5">{l.campaign||"Keine Kampagne"}</div></div><div className="flex gap-1" onClick={e=>e.stopPropagation()}><Btn size="sm" variant="ghost" onClick={()=>setEditing(l)}>⚙️</Btn><Btn size="sm" variant="ghost" onClick={()=>{if(lists.length>1)setLists(p=>p.filter(x=>x.id!==l.id));}}>🗑️</Btn></div></div><div className="grid grid-cols-3 gap-2 mb-3">{[["Kontakte",lc.length,"text-indigo-400"],["Leads",ll.length,"text-purple-400"],["Won",won.length,"text-emerald-400"]].map(([label,val,cls])=>(<div key={label} className="bg-gray-900 rounded-xl p-2.5 text-center"><div className={`text-xl font-bold ${cls}`}>{val}</div><div className="text-xs text-gray-500">{label}</div></div>))}</div><div className="flex flex-wrap gap-1">{l.stages.slice(0,3).map(s=><span key={s} className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">{s}</span>)}{l.stages.length>3&&<span className="text-xs text-gray-500">+{l.stages.length-3}</span>}</div></div></div>);})}</div>
    ):(<div><div className="flex items-center gap-3 mb-6"><button onClick={()=>setActiveList(null)} className="text-gray-400 hover:text-white transition text-sm">← Zurück</button><div className={`w-5 h-5 rounded ${listColor(viewList)}`}/><h2 className="text-xl font-bold text-white">{viewList?.name}</h2><Badge color="indigo">{listContacts.length} Kontakte</Badge><div className="ml-auto"><Btn size="sm" variant="secondary" onClick={()=>setShowImport(true)}>📥 CSV Import</Btn></div></div><div className="grid grid-cols-3 gap-4 mb-6"><Card className="p-4 col-span-2"><label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">Neuen Kontakt hinzufügen</label><div className="grid grid-cols-2 gap-3 mb-3">{[["Name *","name"],["E-Mail","email"],["Telefon","phone"],["Stadt","city"]].map(([l,k])=>(<Inp key={k} label={l} value={newContact[k]} onChange={e=>setNewContact(p=>({...p,[k]:e.target.value}))}/>))}</div><Btn onClick={addContactToList} disabled={!newContact.name}>+ Hinzufügen</Btn></Card><Card className="p-4"><label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">Bestehende Kontakte</label><div className="space-y-1 max-h-40 overflow-y-auto">{contacts.filter(c=>!(c.listIds||[]).includes(activeList)).map(c=>(<div key={c.id} onClick={()=>setContacts(p=>p.map(x=>x.id===c.id?{...x,listIds:[...(x.listIds||[]),activeList]}:x))} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 cursor-pointer transition"><div className="w-6 h-6 rounded-full bg-indigo-800 flex items-center justify-center text-indigo-300 text-xs font-bold">{c.name[0]}</div><span className="text-sm text-gray-300">{c.name}</span><span className="ml-auto text-gray-600 text-xs">+</span></div>))}</div></Card></div><Card className="overflow-hidden"><table className="w-full text-sm"><thead className="border-b border-gray-700"><tr>{["Kontakt","E-Mail","Telefon","Stadt","Quelle",""].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">{h}</th>)}</tr></thead><tbody className="divide-y divide-gray-700">{listContacts.map(c=>(<tr key={c.id} className="hover:bg-gray-750 transition"><td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-7 h-7 rounded-full bg-indigo-800 flex items-center justify-center text-indigo-300 text-xs font-bold">{c.name[0]}</div><span className="font-medium text-white">{c.name}</span></div></td><td className="px-4 py-3 text-gray-400 text-xs">{c.email||"–"}</td><td className="px-4 py-3 text-gray-400 text-xs">{c.phone||"–"}</td><td className="px-4 py-3 text-gray-300">{c.city||"–"}</td><td className="px-4 py-3"><Badge>{c.source}</Badge></td><td className="px-4 py-3"><Btn size="sm" variant="danger" onClick={()=>setContacts(p=>p.map(x=>x.id===c.id?{...x,listIds:(x.listIds||[]).filter(y=>y!==activeList)}:x))}>Entfernen</Btn></td></tr>))}</tbody></table>{listContacts.length===0&&<div className="text-center py-16 text-gray-500 text-sm">Noch keine Kontakte in dieser Liste</div>}</Card></div>)}
  </div>);
}

function Leads(){
  const [leads,setLeads]=useStore("leads");
  const [lists]=useStore("lists");
  const [team]=useStore("team");
  const [search,setSearch]=useState("");
  const [filterList,setFilterList]=useState("Alle");
  const [filterStage,setFilterStage]=useState("Alle");
  const [editing,setEditing]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const activeTeam=team.filter(t=>t.active).map(t=>t.name);
  const [form,setForm]=useState({name:"",email:"",phone:"",city:"",product:"",stage:"Neu",deal:0,score:50,assignedTo:activeTeam[0]||"",followUp:"",source:SOURCES[0],listId:lists[0]?.id||"",comments:[]});
  const currentList=lists.find(l=>l.id===filterList);
  const stages=currentList?.stages||STAGES_DEFAULT;
  const visible=leads.filter(l=>(filterList==="Alle"||l.listId===filterList)&&(filterStage==="Alle"||l.stage===filterStage)&&(l.name?.toLowerCase().includes(search.toLowerCase())||l.email?.toLowerCase().includes(search.toLowerCase())));
  const LeadForm=({lead,onSave,onClose})=>{
    const [l,setL]=useState({...lead});
    const [comment,setComment]=useState("");
    const lstages=lists.find(x=>x.id===l.listId)?.stages||STAGES_DEFAULT;
    const addC=()=>{if(!comment.trim())return;setL(p=>({...p,comments:[...p.comments,`[${today()}] ${comment}`]}));setComment("");};
    return(<Modal title="Lead bearbeiten" wide onClose={onClose}><div className="p-6 grid grid-cols-2 gap-4">{[["Name","name"],["E-Mail","email"],["Telefon","phone"],["Stadt","city"],["Produkt","product"]].map(([lb,k])=>(<Inp key={k} label={lb} value={l[k]} onChange={e=>setL(p=>({...p,[k]:e.target.value}))}/>))}<Inp label="Deal (€)" type="number" value={l.deal} onChange={e=>setL(p=>({...p,deal:parseFloat(e.target.value)||0}))}/><Inp label="Score %" type="number" value={l.score} onChange={e=>setL(p=>({...p,score:parseInt(e.target.value)||0}))}/><Inp label="Follow-up" type="date" value={l.followUp} onChange={e=>setL(p=>({...p,followUp:e.target.value}))}/><Sel label="Zugewiesen" value={l.assignedTo} onChange={e=>setL(p=>({...p,assignedTo:e.target.value}))} options={activeTeam}/><Sel label="Liste" value={l.listId} onChange={e=>setL(p=>({...p,listId:e.target.value,stage:lists.find(x=>x.id===e.target.value)?.stages[0]||"Neu"}))} options={lists.map(x=>({value:x.id,label:x.name}))}/><Sel label="Stage" value={l.stage} onChange={e=>{const ns=e.target.value;setL(p=>({...p,stage:ns,wonAt:ns==="Gewonnen"&&!p.wonAt?today():p.wonAt}));}} options={lstages}/><div className="col-span-2"><label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Kommentare</label><div className="space-y-1.5 mb-2 max-h-24 overflow-y-auto">{l.comments.map((c,i)=><div key={i} className="text-xs bg-gray-900 rounded-lg px-3 py-1.5 text-gray-300">{c}</div>)}</div><div className="flex gap-2"><input className="flex-1 bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Kommentar..." value={comment} onChange={e=>setComment(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addC()}/><Btn size="sm" onClick={addC}>+</Btn></div></div></div><div className="px-6 pb-6 flex gap-3"><Btn onClick={()=>onSave(l)}>Speichern</Btn><Btn variant="secondary" onClick={onClose}>Abbrechen</Btn></div></Modal>);
  };
  return(<div>
    <div className="flex items-center justify-between mb-6"><div><h1 className="text-2xl font-bold text-white">Leads</h1><p className="text-sm text-gray-400 mt-0.5">{leads.length} Leads</p></div><Btn onClick={()=>setShowAdd(true)}>+ Neuer Lead</Btn></div>
    {editing&&<LeadForm lead={editing} onSave={l=>{setLeads(p=>p.map(x=>x.id===l.id?l:x));setEditing(null);}} onClose={()=>setEditing(null)}/>}
    {showAdd&&(<Modal title="Neuer Lead" wide onClose={()=>setShowAdd(false)}><div className="p-6 grid grid-cols-2 gap-4">{[["Name *","name"],["E-Mail","email"],["Telefon","phone"],["Stadt","city"],["Produkt","product"]].map(([l,k])=>(<Inp key={k} label={l} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}/>))}<Inp label="Deal (€)" type="number" value={form.deal} onChange={e=>setForm(p=>({...p,deal:parseFloat(e.target.value)||0}))}/><Sel label="Liste" value={form.listId} onChange={e=>setForm(p=>({...p,listId:e.target.value,stage:lists.find(x=>x.id===e.target.value)?.stages[0]||"Neu"}))} options={lists.map(x=>({value:x.id,label:x.name}))}/><Sel label="Zugewiesen" value={form.assignedTo} onChange={e=>setForm(p=>({...p,assignedTo:e.target.value}))} options={activeTeam}/></div><div className="px-6 pb-6 flex gap-3"><Btn onClick={()=>{const list=lists.find(l=>l.id===form.listId)||lists[0];setLeads(p=>[...p,{...form,id:"l"+Date.now(),listId:list?.id,campaign:list?.campaign||"",created:today()}]);setShowAdd(false);}} disabled={!form.name}>Hinzufügen</Btn><Btn variant="secondary" onClick={()=>setShowAdd(false)}>Abbrechen</Btn></div></Modal>)}
    <div className="flex gap-3 mb-5 flex-wrap items-center"><input className="w-64 bg-gray-900 border border-gray-600 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="🔍 Suchen..." value={search} onChange={e=>setSearch(e.target.value)}/><select className="bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:outline-none" value={filterList} onChange={e=>setFilterList(e.target.value)}><option value="Alle">Alle Listen</option>{lists.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select><select className="bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:outline-none" value={filterStage} onChange={e=>setFilterStage(e.target.value)}><option>Alle</option>{stages.map(s=><option key={s}>{s}</option>)}</select><span className="text-sm text-gray-400">{visible.length} Leads</span></div>
    <Card className="overflow-hidden"><table className="w-full text-sm"><thead className="border-b border-gray-700"><tr>{["Name","Liste","Stage","Score","Deal","Zugewiesen","Follow-up",""].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">{h}</th>)}</tr></thead><tbody className="divide-y divide-gray-700">{visible.map(lead=>{const li=lists.find(l=>l.id===lead.listId);return(<tr key={lead.id} className="hover:bg-gray-750 transition"><td className="px-4 py-3"><div className="font-semibold text-white">{lead.name}</div><div className="text-xs text-gray-400">{lead.email}</div></td><td className="px-4 py-3">{li&&<ListBadge list={li}/>}</td><td className="px-4 py-3"><Badge color={lead.stage==="Gewonnen"?"green":lead.stage==="Verloren"?"red":lead.stage==="Neu"?"indigo":"gray"}>{lead.stage}</Badge></td><td className="px-4 py-3"><ScoreBadge score={lead.score}/></td><td className="px-4 py-3 font-semibold text-white">{lead.deal>0?fmt(lead.deal):"–"}</td><td className="px-4 py-3 text-gray-400 text-xs">{lead.assignedTo}</td><td className="px-4 py-3 text-gray-400 text-xs">{lead.followUp||"–"}</td><td className="px-4 py-3"><div className="flex gap-1"><Btn size="sm" variant="ghost" onClick={()=>setEditing({...lead})}>✏️</Btn><Btn size="sm" variant="ghost" onClick={()=>setLeads(p=>p.filter(l=>l.id!==lead.id))}>🗑️</Btn></div></td></tr>);})}</tbody></table>{visible.length===0&&<div className="text-center py-16 text-gray-500 text-sm">Keine Leads</div>}</Card>
  </div>);
}

function Pipeline(){
  const [leads,setLeads]=useStore("leads");
  const [lists]=useStore("lists");
  const [activeList,setActiveList]=useState(lists[0]?.id||"");
  const [dragging,setDragging]=useState(null);
  const [over,setOver]=useState(null);
  const list=lists.find(l=>l.id===activeList)||lists[0];
  const stages=list?.stages||STAGES_DEFAULT;
  const filtered=leads.filter(l=>l.listId===activeList);
  const drop=stage=>{if(!dragging)return;setLeads(p=>p.map(l=>l.id===dragging?{...l,stage,wonAt:stage==="Gewonnen"&&!l.wonAt?today():l.wonAt}:l));setDragging(null);setOver(null);};
  return(<div><div className="flex items-center gap-4 mb-6 flex-wrap"><div><h1 className="text-2xl font-bold text-white">Pipeline</h1><p className="text-sm text-gray-400 mt-0.5">Drag & Drop</p></div><div className="flex gap-2 flex-wrap">{lists.map(l=>(<button key={l.id} onClick={()=>setActiveList(l.id)} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${activeList===l.id?`${listColor(l)} text-white shadow-lg`:"bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>{l.name} <span className="opacity-70 ml-1">{leads.filter(x=>x.listId===l.id).length}</span></button>))}</div></div><div className="flex gap-3 overflow-x-auto pb-4" style={{minHeight:"480px"}}>{stages.map(stage=>{const sl=filtered.filter(l=>l.stage===stage);const isWon=stage==="Gewonnen";const isLost=stage==="Verloren";return(<div key={stage} className={`flex-shrink-0 w-52 rounded-2xl border-2 transition-all ${over===stage?"shadow-2xl scale-105 border-indigo-500":"border-gray-700"} ${isWon?"bg-emerald-950":isLost?"bg-red-950":"bg-gray-800"}`} onDragOver={e=>{e.preventDefault();setOver(stage);}} onDragLeave={()=>setOver(null)} onDrop={()=>drop(stage)}><div className="px-4 py-3 border-b border-gray-700"><div className="flex items-center justify-between"><span className="font-bold text-sm text-gray-200">{stage}</span><span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">{sl.length}</span></div><div className="text-xs text-gray-400 mt-0.5 font-semibold">{fmt(sl.reduce((s,l)=>s+(l.deal||0),0))}</div></div><div className="p-2 space-y-2 min-h-16">{sl.map(lead=>(<div key={lead.id} draggable onDragStart={()=>setDragging(lead.id)} className="bg-gray-900 border border-gray-700 rounded-xl p-3 cursor-grab hover:border-indigo-500 transition shadow-md"><div className="flex items-center justify-between mb-1"><span className="font-semibold text-sm text-white">{lead.name}</span><ScoreBadge score={lead.score}/></div><div className="text-xs text-gray-400">{lead.city}</div>{lead.deal>0&&<div className="text-xs font-bold text-indigo-400 mt-1">{fmt(lead.deal)}</div>}<div className="text-xs text-gray-500 mt-1">{lead.assignedTo}</div></div>))}</div></div>);})}</div></div>);
}

function Deals(){
  const [deals,setDeals]=useStore("deals");
  const [team]=useStore("team");
  const [showAdd,setShowAdd]=useState(false);
  const activeTeam=team.filter(t=>t.active).map(t=>t.name);
  const [form,setForm]=useState({name:"",contact:"",value:0,stage:"Qualifiziert",probability:50,closeDate:"",assignedTo:activeTeam[0]||""});
  const totalOpen=deals.filter(d=>d.stage!=="Gewonnen"&&d.stage!=="Verloren").reduce((s,d)=>s+(d.value||0),0);
  const totalWon=deals.filter(d=>d.stage==="Gewonnen").reduce((s,d)=>s+(d.value||0),0);
  return(<div><div className="flex items-center justify-between mb-6"><div><h1 className="text-2xl font-bold text-white">Deals</h1><p className="text-sm text-gray-400 mt-0.5">{deals.length} Deals</p></div><Btn onClick={()=>setShowAdd(true)}>+ Neuer Deal</Btn></div>{showAdd&&(<Modal title="Neuer Deal" onClose={()=>setShowAdd(false)}><div className="p-6 grid grid-cols-2 gap-4"><Inp label="Name *" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/><Inp label="Kontakt" value={form.contact} onChange={e=>setForm(p=>({...p,contact:e.target.value}))}/><Inp label="Wert (€)" type="number" value={form.value} onChange={e=>setForm(p=>({...p,value:parseFloat(e.target.value)||0}))}/><Inp label="Abschluss" type="date" value={form.closeDate} onChange={e=>setForm(p=>({...p,closeDate:e.target.value}))}/><Sel label="Stage" value={form.stage} onChange={e=>setForm(p=>({...p,stage:e.target.value}))} options={STAGES_DEFAULT}/><Sel label="Zugewiesen" value={form.assignedTo} onChange={e=>setForm(p=>({...p,assignedTo:e.target.value}))} options={activeTeam}/></div><div className="px-6 pb-6 flex gap-3"><Btn onClick={()=>{setDeals(p=>[...p,{...form,id:"d"+Date.now()}]);setShowAdd(false);}} disabled={!form.name}>Hinzufügen</Btn><Btn variant="secondary" onClick={()=>setShowAdd(false)}>Abbrechen</Btn></div></Modal>)}<div className="grid grid-cols-3 gap-4 mb-6"><StatCard icon="💼" label="Offene Deals" value={fmt(totalOpen)} color="indigo"/><StatCard icon="🏆" label="Gewonnen" value={fmt(totalWon)} color="green"/><StatCard icon="📊" label="Gesamt" value={deals.length} color="blue"/></div><Card className="overflow-hidden"><table className="w-full text-sm"><thead className="border-b border-gray-700"><tr>{["Deal","Kontakt","Wert","Stage","Chance","Abschluss","Zugewiesen",""].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">{h}</th>)}</tr></thead><tbody className="divide-y divide-gray-700">{deals.map(d=>(<tr key={d.id} className="hover:bg-gray-750 transition"><td className="px-4 py-3 font-semibold text-white">{d.name}</td><td className="px-4 py-3 text-gray-300">{d.contact}</td><td className="px-4 py-3 font-bold text-indigo-400">{fmt(d.value)}</td><td className="px-4 py-3"><Badge color={d.stage==="Gewonnen"?"green":d.stage==="Verloren"?"red":"indigo"}>{d.stage}</Badge></td><td className="px-4 py-3"><div className="flex items-center gap-2"><div className="flex-1 h-1.5 bg-gray-700 rounded-full"><div className="h-full bg-indigo-500 rounded-full" style={{width:`${d.probability}%`}}/></div><span className="text-xs text-gray-400">{d.probability}%</span></div></td><td className="px-4 py-3 text-gray-400 text-xs">{d.closeDate||"–"}</td><td className="px-4 py-3 text-gray-400 text-xs">{d.assignedTo}</td><td className="px-4 py-3"><Btn size="sm" variant="ghost" onClick={()=>setDeals(p=>p.filter(x=>x.id!==d.id))}>🗑️</Btn></td></tr>))}</tbody></table></Card></div>);
}

function CampaignsMgr(){
  const [campaigns,setCampaigns]=useStore("campaigns");
  const [showAdd,setShowAdd]=useState(false);
  const [form,setForm]=useState({name:"",platform:"Meta",status:"ACTIVE",spend:0,impressions:0,clicks:0,leads:0,budget:0,cpl:0});
  const totSpend=campaigns.reduce((s,c)=>s+c.spend,0);
  const totLeads=campaigns.reduce((s,c)=>s+c.leads,0);
  const totImpr=campaigns.reduce((s,c)=>s+c.impressions,0);
  return(<div><div className="flex items-center justify-between mb-6"><div><h1 className="text-2xl font-bold text-white">Kampagnen</h1><p className="text-sm text-gray-400 mt-0.5">{campaigns.length} Kampagnen</p></div><Btn onClick={()=>setShowAdd(true)}>+ Neue Kampagne</Btn></div>{showAdd&&(<Modal title="Neue Kampagne" onClose={()=>setShowAdd(false)}><div className="p-6 grid grid-cols-2 gap-4"><Inp label="Name *" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/><Sel label="Plattform" value={form.platform} onChange={e=>setForm(p=>({...p,platform:e.target.value}))} options={["Meta","Google","LinkedIn"]}/><Inp label="Budget (€)" type="number" value={form.budget} onChange={e=>setForm(p=>({...p,budget:parseFloat(e.target.value)||0}))}/><Sel label="Status" value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))} options={["ACTIVE","PAUSED","DRAFT"]}/></div><div className="px-6 pb-6 flex gap-3"><Btn onClick={()=>{setCampaigns(p=>[...p,{...form,id:"camp"+Date.now()}]);setShowAdd(false);}} disabled={!form.name}>Erstellen</Btn><Btn variant="secondary" onClick={()=>setShowAdd(false)}>Abbrechen</Btn></div></Modal>)}<div className="grid grid-cols-4 gap-4 mb-6"><StatCard icon="💶" label="Ausgaben" value={fmt(totSpend)} color="indigo"/><StatCard icon="👥" label="Leads" value={fmtN(totLeads)} color="green"/><StatCard icon="👁️" label="Impressionen" value={fmtN(totImpr)} color="blue"/><StatCard icon="🎯" label="Ø CPL" value={fmt(totLeads>0?totSpend/totLeads:0)} color="orange"/></div><Card className="overflow-hidden"><table className="w-full text-sm"><thead className="border-b border-gray-700"><tr>{["Kampagne","Plattform","Status","Budget","Ausgaben","Impr.","Klicks","CTR","Leads","CPL",""].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">{h}</th>)}</tr></thead><tbody className="divide-y divide-gray-700">{campaigns.map(c=>(<tr key={c.id} className="hover:bg-gray-750 transition"><td className="px-4 py-3 font-semibold text-white">{c.name}</td><td className="px-4 py-3"><Badge color={c.platform==="Meta"?"blue":c.platform==="Google"?"orange":"indigo"}>{c.platform}</Badge></td><td className="px-4 py-3"><Badge color={c.status==="ACTIVE"?"green":"gray"}>{c.status==="ACTIVE"?"Aktiv":"Pausiert"}</Badge></td><td className="px-4 py-3 text-gray-300">{fmt(c.budget)}</td><td className="px-4 py-3 font-semibold text-white">{fmt(c.spend)}</td><td className="px-4 py-3 text-gray-300">{fmtN(c.impressions)}</td><td className="px-4 py-3 text-gray-300">{fmtN(c.clicks)}</td><td className="px-4 py-3 text-gray-300">{c.impressions?((c.clicks/c.impressions)*100).toFixed(2)+"%":"–"}</td><td className="px-4 py-3 font-bold text-indigo-400">{c.leads}</td><td className="px-4 py-3 text-gray-300">{fmt(c.cpl)}</td><td className="px-4 py-3"><Btn size="sm" variant="ghost" onClick={()=>setCampaigns(p=>p.filter(x=>x.id!==c.id))}>🗑️</Btn></td></tr>))}</tbody></table></Card></div>);
}

function AdAccounts(){
  const [config,setConfig]=useStore("config");
  const [saved,setSaved]=useState(false);
  return(<div><div className="mb-6"><h1 className="text-2xl font-bold text-white">Ad Accounts</h1><p className="text-sm text-gray-400 mt-0.5">Werbekonten verbinden</p></div><div className="grid grid-cols-2 gap-6"><Card className="p-6"><div className="flex items-center gap-3 mb-5"><div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">f</div><div className="flex-1"><div className="font-bold text-white">Meta</div><div className="text-xs text-gray-400">Facebook & Instagram</div></div><Badge color={config.metaToken?"green":"gray"}>{config.metaToken?"✓ Verbunden":"Nicht verbunden"}</Badge></div><div className="space-y-3"><Inp label="Access Token" value={config.metaToken} onChange={e=>setConfig(p=>({...p,metaToken:e.target.value}))} placeholder="EAAxxxxx..."/><Inp label="Ad Account ID" value={config.metaAccount} onChange={e=>setConfig(p=>({...p,metaAccount:e.target.value}))} placeholder="act_123456789"/><Inp label="Page ID (für Posts)" value={config.metaPageId} onChange={e=>setConfig(p=>({...p,metaPageId:e.target.value}))} placeholder="123456789"/></div><div className="mt-4 p-3 bg-gray-900 rounded-xl text-xs text-gray-400"><strong className="text-gray-300">Benötigt:</strong> ads_read · leads_retrieval · pages_manage_posts</div></Card><Card className="p-6"><div className="flex items-center gap-3 mb-5"><div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold text-lg">G</div><div className="flex-1"><div className="font-bold text-white">Google Ads</div><div className="text-xs text-gray-400">Google Ads API</div></div><Badge color={config.googleAccount?"green":"gray"}>{config.googleAccount?"✓ Verbunden":"Nicht verbunden"}</Badge></div><Inp label="Customer ID" value={config.googleAccount} onChange={e=>setConfig(p=>({...p,googleAccount:e.target.value}))} placeholder="123-456-7890"/><div className="mt-4 p-3 bg-gray-900 rounded-xl text-xs text-gray-400"><strong className="text-gray-300">Benötigt:</strong> Google Ads API · Developer Token</div></Card><Card className="p-6 col-span-2"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white">🔗</div><div><div className="font-bold text-white">Make.com Webhook</div><div className="text-xs text-gray-400">Auto Lead Import</div></div></div><div className="bg-gray-900 rounded-xl px-4 py-3 font-mono text-sm text-indigo-400 border border-indigo-900">https://your-crm.vercel.app/api/webhook</div></Card></div><div className="mt-6"><Btn onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000);}}>{saved?"✅ Gespeichert!":"Einstellungen speichern"}</Btn></div></div>);
}

function ContentCreator(){
  const [posts,setPosts]=useStore("posts");
  const [config]=useStore("config");
  const [showAdd,setShowAdd]=useState(false);
  const [gen,setGen]=useState(false);
  const [publishing,setPublishing]=useState(null);
  const [form,setForm]=useState({caption:"",platform:[],scheduledAt:"",status:"Geplant",topic:"",mediaUrl:"",mediaType:""});
  const mediaRef=useRef();
  const platforms=["Facebook","Instagram","LinkedIn"];
  const platIcon=p=>p==="Facebook"?"📘":p==="Instagram"?"📸":"💼";
  const toggleP=p=>setForm(prev=>({...prev,platform:prev.platform.includes(p)?prev.platform.filter(x=>x!==p):[...prev.platform,p]}));
  const handleMedia=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{setForm(p=>({...p,mediaUrl:ev.target.result,mediaType:file.type.startsWith("video")?"video":"image"}));};reader.readAsDataURL(file);};
  const genCaption=async()=>{if(!form.topic)return;setGen(true);try{const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`Schreibe einen professionellen Social Media Post auf Deutsch für: "${form.topic}". Mit Emojis und Call-to-Action. Nur den Post-Text.`}]})});const data=await res.json();setForm(p=>({...p,caption:data.content?.[0]?.text||""}));}catch(e){setForm(p=>({...p,caption:"KI nicht verfügbar. Bitte manuell eingeben."}));}setGen(false);};
  const publishToMeta=async(post)=>{
    if(!config.metaToken||!config.metaPageId){alert("Bitte zuerst Meta Token und Page ID in Ad Accounts eintragen!");return;}
    setPublishing(post.id);
    try{
      if(post.mediaUrl&&post.mediaType==="image"){
        const photoRes=await fetch(`https://graph.facebook.com/v19.0/${config.metaPageId}/photos`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:post.mediaUrl,caption:post.caption,access_token:config.metaToken,published:true})});
        const photoData=await photoRes.json();
        if(photoData.error)throw new Error(photoData.error.message);
      }else{
        const res=await fetch(`https://graph.facebook.com/v19.0/${config.metaPageId}/feed`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:post.caption,access_token:config.metaToken})});
        const data=await res.json();
        if(data.error)throw new Error(data.error.message);
      }
      if(post.platform.includes("Instagram")&&config.metaAccount){
        const igRes=await fetch(`https://graph.facebook.com/v19.0/${config.metaAccount}/media`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({caption:post.caption,access_token:config.metaToken,...(post.mediaUrl?{image_url:post.mediaUrl}:{})})});
        const igData=await igRes.json();
        if(igData.id){await fetch(`https://graph.facebook.com/v19.0/${config.metaAccount}/media_publish`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({creation_id:igData.id,access_token:config.metaToken})});}
      }
      setPosts(p=>p.map(x=>x.id===post.id?{...x,status:"Veröffentlicht"}:x));
      alert("✅ Erfolgreich veröffentlicht!");
    }catch(e){alert("❌ Fehler: "+e.message);}
    setPublishing(null);
  };
  return(<div>
    <div className="flex items-center justify-between mb-6"><div><h1 className="text-2xl font-bold text-white">Content Creator</h1><p className="text-sm text-gray-400 mt-0.5">Posts erstellen & veröffentlichen</p></div><Btn onClick={()=>setShowAdd(true)}>+ Neuer Post</Btn></div>
    {showAdd&&(<Modal title="Neuer Post" wide onClose={()=>setShowAdd(false)}><div className="p-6 space-y-4"><div><label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Plattformen</label><div className="flex gap-2">{platforms.map(p=><button key={p} onClick={()=>toggleP(p)} className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition ${form.platform.includes(p)?"border-indigo-500 bg-indigo-900 text-indigo-300":"border-gray-600 text-gray-400 hover:border-gray-400"}`}>{platIcon(p)} {p}</button>)}</div></div><div><label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">🤖 KI Caption Generator</label><div className="flex gap-2"><input className="flex-1 bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Thema eingeben..." value={form.topic} onChange={e=>setForm(p=>({...p,topic:e.target.value}))}/><Btn onClick={genCaption} disabled={gen||!form.topic} variant="secondary">{gen?"⏳":"✨"} Generieren</Btn></div></div><div><label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Caption</label><textarea className="w-full bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none" value={form.caption} onChange={e=>setForm(p=>({...p,caption:e.target.value}))} placeholder="Post Text hier..."/></div><div><label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">📎 Foto / Video</label><input ref={mediaRef} type="file" accept="image/*,video/*" onChange={handleMedia} className="hidden"/><div className="flex items-center gap-3"><Btn variant="secondary" onClick={()=>mediaRef.current.click()}>📁 Datei wählen</Btn>{form.mediaUrl&&(<div className="flex items-center gap-2">{form.mediaType==="image"?<img src={form.mediaUrl} className="w-16 h-16 rounded-xl object-cover border border-gray-600" alt="preview"/>:<div className="w-16 h-16 rounded-xl bg-gray-700 flex items-center justify-center text-2xl">🎬</div>}<button onClick={()=>setForm(p=>({...p,mediaUrl:"",mediaType:""}))} className="text-red-400 hover:text-red-300 text-xs">✕ Entfernen</button></div>)}</div></div><Inp label="📅 Geplant für" type="datetime-local" value={form.scheduledAt} onChange={e=>setForm(p=>({...p,scheduledAt:e.target.value}))}/></div><div className="px-6 pb-6 flex gap-3"><Btn onClick={()=>{setPosts(p=>[...p,{...form,id:"p"+Date.now()}]);setShowAdd(false);setForm({caption:"",platform:[],scheduledAt:"",status:"Geplant",topic:"",mediaUrl:"",mediaType:""});}} disabled={!form.caption||form.platform.length===0}>Speichern</Btn><Btn variant="secondary" onClick={()=>setShowAdd(false)}>Abbrechen</Btn></div></Modal>)}
    <div className="grid grid-cols-3 gap-4 mb-6"><StatCard icon="📝" label="Geplant" value={posts.filter(p=>p.status==="Geplant").length} color="indigo"/><StatCard icon="✅" label="Veröffentlicht" value={posts.filter(p=>p.status==="Veröffentlicht").length} color="green"/><StatCard icon="📱" label="Plattformen" value="3" sub="Facebook · Instagram · LinkedIn" color="purple"/></div>
    {!config.metaToken&&(<div className="mb-4 p-4 bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-xl text-sm text-yellow-300">⚠️ Meta Token nicht verbunden — gehe zu <strong>Ad Accounts</strong> um Facebook/Instagram Posting zu aktivieren</div>)}
    <div className="grid grid-cols-2 gap-4">{posts.map(post=>(<Card key={post.id} className="p-5 hover:border-gray-600 transition"><div className="flex items-start justify-between mb-3"><div className="flex gap-1.5">{post.platform.map(p=><span key={p} className="text-xl">{platIcon(p)}</span>)}</div><Badge color={post.status==="Veröffentlicht"?"green":"indigo"}>{post.status}</Badge></div>{post.mediaUrl&&(<div className="mb-3">{post.mediaType==="image"?<img src={post.mediaUrl} className="w-full h-32 rounded-xl object-cover border border-gray-700" alt="media"/>:<div className="w-full h-32 rounded-xl bg-gray-700 flex items-center justify-center text-4xl border border-gray-700">🎬</div>}</div>)}<p className="text-sm text-gray-300 mb-3 line-clamp-3">{post.caption}</p>{post.platform.includes("LinkedIn")&&post.status==="Geplant"&&(<div className="mb-3 p-2 bg-blue-900 bg-opacity-30 border border-blue-800 rounded-lg text-xs text-blue-300">💼 LinkedIn: Caption kopieren und manuell posten<button onClick={()=>navigator.clipboard.writeText(post.caption)} className="ml-2 underline hover:text-blue-200">Kopieren</button></div>)}<div className="flex items-center justify-between"><span className="text-xs text-gray-500">📅 {post.scheduledAt||"Kein Datum"}</span><div className="flex gap-1">{post.status==="Geplant"&&(post.platform.includes("Facebook")||post.platform.includes("Instagram"))&&(<Btn size="sm" variant="success" onClick={()=>publishToMeta(post)} disabled={publishing===post.id}>{publishing===post.id?"⏳":"🚀"} Posten</Btn>)}{post.status==="Geplant"&&!post.platform.includes("Facebook")&&!post.platform.includes("Instagram")&&(<Btn size="sm" variant="success" onClick={()=>setPosts(p=>p.map(x=>x.id===post.id?{...x,status:"Veröffentlicht"}:x))}>✅</Btn>)}<Btn size="sm" variant="ghost" onClick={()=>setPosts(p=>p.filter(x=>x.id!==post.id))}>🗑️</Btn></div></div></Card>))}</div>
  </div>);
}

// ── PERIOD PICKER ─────────────────────────────────────────────
function usePeriod(){
  const now=new Date();
  const yr=now.getFullYear();
  const mo=now.getMonth();
  const pad=n=>String(n).padStart(2,"0");
  const ymd=(y,m,d)=>`${y}-${pad(m+1)}-${pad(d)}`;
  const startOfWeek=new Date(now);const dow=now.getDay();startOfWeek.setDate(now.getDate()+(dow===0?-6:1-dow));startOfWeek.setHours(0,0,0,0);
  const lastWeekStart=new Date(startOfWeek);lastWeekStart.setDate(lastWeekStart.getDate()-7);
  const lastWeekEnd=new Date(startOfWeek);lastWeekEnd.setDate(lastWeekEnd.getDate()-1);
  const lastMo=mo===0?11:mo-1; const lastMoYr=mo===0?yr-1:yr;
  const thisQStart=Math.floor(mo/3)*3;
  const lastQStart=thisQStart===0?9:thisQStart-3; const lastQYr=thisQStart===0?yr-1:yr;
  const lastQEnd=new Date(lastQYr,lastQStart+3,0);
  const presets=[
    {id:"thisWeek",label:"Diese Woche",start:startOfWeek.toISOString().slice(0,10),end:today()},
    {id:"lastWeek",label:"Letzte Woche",start:lastWeekStart.toISOString().slice(0,10),end:lastWeekEnd.toISOString().slice(0,10)},
    {id:"thisMonth",label:"Dieser Monat",start:ymd(yr,mo,1),end:today()},
    {id:"lastMonth",label:"Letzter Monat",start:ymd(lastMoYr,lastMo,1),end:ymd(yr,mo,0)},
    {id:"thisQ",label:"Dieses Quartal",start:ymd(yr,thisQStart,1),end:today()},
    {id:"lastQ",label:"Letztes Quartal",start:ymd(lastQYr,lastQStart,1),end:lastQEnd.toISOString().slice(0,10)},
    {id:"thisYear",label:`Jahr ${yr}`,start:`${yr}-01-01`,end:today()},
    {id:"lastYear",label:`Jahr ${yr-1}`,start:`${yr-1}-01-01`,end:`${yr-1}-12-31`},
    {id:"custom",label:"Eigener",start:"",end:""},
  ];
  const [preset,setPreset]=useState("thisMonth");
  const [customStart,setCustomStart]=useState("");
  const [customEnd,setCustomEnd]=useState(today());
  const active=presets.find(x=>x.id===preset)||presets[2];
  const from=preset==="custom"?customStart:active.start;
  const to=preset==="custom"?customEnd:active.end;
  const inPeriod=(d)=>!!d&&!!from&&!!to&&d>=from&&d<=to;
  const periodDays=from&&to?Math.max(1,Math.round((new Date(to)-new Date(from))/(86400000))):30;
  const prevEnd=from?new Date(new Date(from).getTime()-86400000).toISOString().slice(0,10):"";
  const prevStart=from?new Date(new Date(from).getTime()-periodDays*86400000).toISOString().slice(0,10):"";
  const inPrev=(d)=>!!d&&!!prevStart&&!!prevEnd&&d>=prevStart&&d<=prevEnd;
  const label=preset==="custom"?(from&&to?`${from} → ${to}`:"Benutzerdefiniert"):active.label;
  return{preset,setPreset,customStart,setCustomStart,customEnd,setCustomEnd,from,to,inPeriod,inPrev,periodDays,label,presets};
}

const PeriodPicker=({p})=>(
  <div className="mb-5">
    <div className="flex flex-wrap gap-1 bg-gray-800 border border-gray-700 rounded-2xl p-1.5">
      {p.presets.filter(x=>x.id!=="custom").map(x=>(
        <button key={x.id} onClick={()=>p.setPreset(x.id)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${p.preset===x.id?"bg-indigo-600 text-white shadow":"text-gray-400 hover:text-white hover:bg-gray-700"}`}>
          {x.label}
        </button>
      ))}
      <button onClick={()=>p.setPreset("custom")} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${p.preset==="custom"?"bg-indigo-600 text-white shadow":"text-gray-400 hover:text-white hover:bg-gray-700"}`}>
        ✏️ Eigener
      </button>
    </div>
    {p.preset==="custom"&&(
      <div className="flex items-center gap-3 mt-2">
        <span className="text-xs text-gray-400">Von:</span>
        <input type="date" value={p.customStart} onChange={e=>p.setCustomStart(e.target.value)} className="bg-gray-900 border border-gray-600 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
        <span className="text-gray-500 text-xs">→</span>
        <span className="text-xs text-gray-400">Bis:</span>
        <input type="date" value={p.customEnd} onChange={e=>p.setCustomEnd(e.target.value)} className="bg-gray-900 border border-gray-600 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
        {p.customStart&&p.customEnd&&<span className="text-xs text-indigo-400 font-semibold">{p.periodDays} Tage</span>}
      </div>
    )}
  </div>
);

function Umsatz(){
  const [leads]=useStore("leads");
  const [lists]=useStore("lists");
  const [targets,setTargets]=useStore("targets");
  const [dailyKPIs,setDailyKPIs]=useStore("dailyKPIs");
  const [editTargets,setEditTargets]=useState(false);
  const [tForm,setTForm]=useState({...targets});
  const [kpiForm,setKpiForm]=useState({date:today(),calls:"",meetings:"",proposals:"",notes:""});
  const [showKpi,setShowKpi]=useState(false);
  const p=usePeriod();
  const allWon=leads.filter(l=>l.stage==="Gewonnen");
  const totalRevAll=allWon.reduce((s,l)=>s+(l.deal||0),0);
  const pipeline=leads.filter(l=>l.stage!=="Gewonnen"&&l.stage!=="Verloren").reduce((s,l)=>s+(l.deal||0),0);
  const conv=leads.length>0?((allWon.length/leads.length)*100).toFixed(1):0;
  const periodLeads=leads.filter(l=>p.inPeriod(l.created));
  const periodWon=allWon.filter(l=>p.inPeriod(l.wonAt||l.created));
  const periodRev=periodWon.reduce((s,l)=>s+(l.deal||0),0);
  const prevWon=allWon.filter(l=>p.inPrev(l.wonAt||l.created));
  const prevRev=prevWon.reduce((s,l)=>s+(l.deal||0),0);
  const revDiff=periodRev-prevRev;
  const revDiffPct=prevRev>0?((revDiff/prevRev)*100).toFixed(1):null;
  const tRevTarget=p.periodDays<=7?targets.weekly.revenue:targets.monthly.revenue;
  const tLeadsTarget=p.periodDays<=7?targets.weekly.leads:targets.monthly.leads;
  const tDealsTarget=p.periodDays<=7?targets.weekly.deals:targets.monthly.deals;
  const periodKpis=dailyKPIs.filter(k=>p.inPeriod(k.date));
  const totalCalls=periodKpis.reduce((s,k)=>s+(parseInt(k.calls)||0),0);
  const totalMeetings=periodKpis.reduce((s,k)=>s+(parseInt(k.meetings)||0),0);
  const totalProposals=periodKpis.reduce((s,k)=>s+(parseInt(k.proposals)||0),0);
  const byList=lists.map(l=>({list:l,total:leads.filter(x=>x.listId===l.id&&p.inPeriod(x.created)).length,won:periodWon.filter(x=>x.listId===l.id).length,rev:periodWon.filter(x=>x.listId===l.id).reduce((s,x)=>s+(x.deal||0),0)}));
  const totalRevForBar=Math.max(byList.reduce((s,x)=>s+x.rev,0),1);
  const saveTargets=()=>{setTargets({weekly:{revenue:parseFloat(tForm.weekly?.revenue)||0,leads:parseInt(tForm.weekly?.leads)||0,deals:parseInt(tForm.weekly?.deals)||0},monthly:{revenue:parseFloat(tForm.monthly?.revenue)||0,leads:parseInt(tForm.monthly?.leads)||0,deals:parseInt(tForm.monthly?.deals)||0}});setEditTargets(false);};
  const saveKpi=()=>{if(!kpiForm.date)return;const existing=dailyKPIs.find(k=>k.date===kpiForm.date);if(existing){setDailyKPIs(pr=>pr.map(k=>k.date===kpiForm.date?{...k,...kpiForm}:k));}else{setDailyKPIs(pr=>[...pr,{...kpiForm,id:"kpi"+Date.now()}]);}setShowKpi(false);setKpiForm({date:today(),calls:"",meetings:"",proposals:"",notes:""});};
  return(<div>
    <div className="flex items-center justify-between mb-4"><div><h1 className="text-2xl font-bold text-white">Umsatz Dashboard</h1><p className="text-sm text-gray-400 mt-0.5">{p.label}</p></div><div className="flex gap-2"><Btn variant="secondary" onClick={()=>{setTForm(JSON.parse(JSON.stringify(targets)));setEditTargets(true);}}>🎯 Ziele</Btn><Btn onClick={()=>setShowKpi(true)}>📊 KPI eintragen</Btn></div></div>
    <PeriodPicker p={p}/>
    {editTargets&&(<Modal title="🎯 Ziele bearbeiten" wide onClose={()=>setEditTargets(false)}><div className="p-6 space-y-6"><div><h4 className="text-sm font-bold text-indigo-400 mb-3 uppercase">📅 Wochenziele</h4><div className="grid grid-cols-3 gap-4"><Inp label="Umsatz (€)" type="number" value={tForm.weekly?.revenue} onChange={e=>setTForm(pr=>({...pr,weekly:{...pr.weekly,revenue:e.target.value}}))}/><Inp label="Leads" type="number" value={tForm.weekly?.leads} onChange={e=>setTForm(pr=>({...pr,weekly:{...pr.weekly,leads:e.target.value}}))}/><Inp label="Deals Won" type="number" value={tForm.weekly?.deals} onChange={e=>setTForm(pr=>({...pr,weekly:{...pr.weekly,deals:e.target.value}}))}/></div></div><div><h4 className="text-sm font-bold text-purple-400 mb-3 uppercase">📆 Monatsziele</h4><div className="grid grid-cols-3 gap-4"><Inp label="Umsatz (€)" type="number" value={tForm.monthly?.revenue} onChange={e=>setTForm(pr=>({...pr,monthly:{...pr.monthly,revenue:e.target.value}}))}/><Inp label="Leads" type="number" value={tForm.monthly?.leads} onChange={e=>setTForm(pr=>({...pr,monthly:{...pr.monthly,leads:e.target.value}}))}/><Inp label="Deals Won" type="number" value={tForm.monthly?.deals} onChange={e=>setTForm(pr=>({...pr,monthly:{...pr.monthly,deals:e.target.value}}))}/></div></div><p className="text-xs text-gray-500">Wochenziele für ≤7 Tage, sonst Monatsziele.</p></div><div className="px-6 pb-6 flex gap-3"><Btn onClick={saveTargets}>💾 Speichern</Btn><Btn variant="secondary" onClick={()=>setEditTargets(false)}>Abbrechen</Btn></div></Modal>)}
    {showKpi&&(<Modal title="📊 KPI eintragen" onClose={()=>setShowKpi(false)}><div className="p-6 space-y-4"><Inp label="Datum" type="date" value={kpiForm.date} onChange={e=>setKpiForm(pr=>({...pr,date:e.target.value}))}/><div className="grid grid-cols-3 gap-4"><Inp label="📞 Anrufe" type="number" value={kpiForm.calls} onChange={e=>setKpiForm(pr=>({...pr,calls:e.target.value}))} placeholder="0"/><Inp label="🤝 Meetings" type="number" value={kpiForm.meetings} onChange={e=>setKpiForm(pr=>({...pr,meetings:e.target.value}))} placeholder="0"/><Inp label="📋 Angebote" type="number" value={kpiForm.proposals} onChange={e=>setKpiForm(pr=>({...pr,proposals:e.target.value}))} placeholder="0"/></div><div><label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Notizen</label><textarea className="w-full bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20 resize-none" value={kpiForm.notes} onChange={e=>setKpiForm(pr=>({...pr,notes:e.target.value}))} placeholder="Was lief gut?"/></div></div><div className="px-6 pb-6 flex gap-3"><Btn onClick={saveKpi}>💾 Speichern</Btn><Btn variant="secondary" onClick={()=>setShowKpi(false)}>Abbrechen</Btn></div></Modal>)}
    <div className="grid grid-cols-4 gap-4 mb-5"><StatCard icon="💶" label={`Umsatz — ${p.label}`} value={fmt(periodRev)} sub={revDiffPct?`${revDiff>=0?"▲":"▼"} ${Math.abs(revDiffPct)}% vs. Vorperiode`:""} color="green"/><StatCard icon="👥" label="Leads im Zeitraum" value={periodLeads.length} sub={`${periodWon.length} Won`} color="indigo"/><StatCard icon="🔄" label="Pipeline gesamt" value={fmt(pipeline)} sub={`Conv. ${conv}%`} color="blue"/><StatCard icon="📊" label="Ø Deal-Wert" value={fmt(allWon.length>0?totalRevAll/allWon.length:0)} color="purple"/></div>
    <Card className="p-5 mb-5"><div className="flex items-center justify-between mb-4"><h3 className="font-bold text-white">🎯 Ziel-Fortschritt — {p.label}</h3><Badge color={p.periodDays<=7?"indigo":"purple"}>{p.periodDays<=7?"Wochenziele":"Monatsziele"}</Badge></div><div className="grid grid-cols-3 gap-6"><div><div className="flex justify-between text-sm mb-1"><span className="text-gray-300">💶 Umsatz</span><span className="font-bold text-white">{fmt(periodRev)}</span></div><ProgressBar value={periodRev} target={tRevTarget} color="bg-indigo-500" showEuro/></div><div><div className="flex justify-between text-sm mb-1"><span className="text-gray-300">👥 Leads</span><span className="font-bold text-white">{periodLeads.length}</span></div><ProgressBar value={periodLeads.length} target={tLeadsTarget} color="bg-blue-500"/></div><div><div className="flex justify-between text-sm mb-1"><span className="text-gray-300">🏆 Deals Won</span><span className="font-bold text-white">{periodWon.length}</span></div><ProgressBar value={periodWon.length} target={tDealsTarget} color="bg-emerald-500"/></div></div></Card>
    <Card className="p-5 mb-5"><div className="flex items-center justify-between mb-4"><h3 className="font-bold text-white">📞 Aktivitäten — {p.label}</h3><div className="flex gap-4 text-sm text-gray-400"><span>📞 <strong className="text-white">{totalCalls}</strong></span><span>🤝 <strong className="text-white">{totalMeetings}</strong></span><span>📋 <strong className="text-white">{totalProposals}</strong></span></div></div>{periodKpis.length===0?(<div className="text-center py-6 text-gray-500 text-sm">Keine KPIs im gewählten Zeitraum.</div>):(<div className="space-y-2">{periodKpis.sort((a,b)=>b.date.localeCompare(a.date)).map(k=>(<div key={k.id||k.date} className="flex items-center gap-4 p-3 bg-gray-900 rounded-xl"><div className="text-xs font-semibold text-gray-400 w-24">{k.date}</div><div className="flex gap-4 flex-1"><span className="text-sm text-gray-300">📞 <strong className="text-white">{k.calls||0}</strong></span><span className="text-sm text-gray-300">🤝 <strong className="text-white">{k.meetings||0}</strong></span><span className="text-sm text-gray-300">📋 <strong className="text-white">{k.proposals||0}</strong></span></div>{k.notes&&<div className="text-xs text-gray-500 flex-1 truncate">{k.notes}</div>}<Btn size="sm" variant="ghost" onClick={()=>{setKpiForm({...k});setShowKpi(true);}}>✏️</Btn></div>))}</div>)}</Card>
    <div className="grid grid-cols-2 gap-5"><Card className="p-5"><h3 className="font-bold text-white mb-4">🎯 Umsatz nach Produkt</h3><div className="space-y-4">{byList.map(({list,total,won:w,rev})=>(<div key={list.id}><div className="flex items-center justify-between mb-1.5"><div className="flex items-center gap-2"><ColorDot list={list}/><span className="text-sm text-gray-300">{list.name}</span></div><span className="text-sm font-bold text-white">{fmt(rev)}</span></div><div className="h-2 bg-gray-700 rounded-full overflow-hidden"><div className={`h-full ${listColor(list)} rounded-full`} style={{width:`${(rev/totalRevForBar)*100}%`}}/></div><div className="flex justify-between text-xs text-gray-500 mt-1"><span>{total} Leads</span><span>{w} Won</span></div></div>))}</div></Card><Card className="p-5"><h3 className="font-bold text-white mb-4">📊 Zeitraum vs. Vorperiode</h3>{[{label:p.label,val:periodRev,color:"bg-indigo-500"},{label:"Vorperiode",val:prevRev,color:"bg-gray-600"}].map(item=>{const max=Math.max(periodRev,prevRev,1);return(<div key={item.label} className="mb-4"><div className="flex justify-between text-sm mb-1.5"><span className="text-gray-300">{item.label}</span><span className="font-bold text-white">{fmt(item.val)}</span></div><div className="h-3 bg-gray-700 rounded-full overflow-hidden"><div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{width:`${(item.val/max)*100}%`}}/></div></div>);})} {revDiffPct&&<div className={`text-center text-sm font-bold mt-2 ${revDiff>=0?"text-emerald-400":"text-red-400"}`}>{revDiff>=0?"▲":"▼"} {Math.abs(revDiffPct)}% vs. Vorperiode</div>}</Card></div>
  </div>);
}


function TeamKPI(){
  const [leads,setLeads]=useStore("leads");
  const [team]=useStore("team");
  const [dailyKPIs,setDailyKPIs]=useStore("dailyKPIs");
  const [targets,setTargets]=useStore("targets");
  const [kpiForm,setKpiForm]=useState({date:today(),member:"",calls:"",meetings:"",proposals:"",notes:""});
  const [showKpi,setShowKpi]=useState(false);
  const [editTargets,setEditTargets]=useState(false);
  const [tForm,setTForm]=useState({...targets});
  const [dealModal,setDealModal]=useState(null);
  const p=usePeriod();

  const activeTeam=team.filter(t=>t.active);
  const colors=["bg-indigo-500","bg-purple-500","bg-blue-500","bg-pink-500","bg-orange-500","bg-teal-500"];
  const textColors=["text-indigo-400","text-purple-400","text-blue-400","text-pink-400","text-orange-400","text-teal-400"];

  const saveKpi=()=>{
    if(!kpiForm.date||!kpiForm.member)return;
    const existing=dailyKPIs.find(k=>k.date===kpiForm.date&&k.member===kpiForm.member);
    if(existing){setDailyKPIs(pr=>pr.map(k=>(k.date===kpiForm.date&&k.member===kpiForm.member)?{...k,...kpiForm}:k));}
    else{setDailyKPIs(pr=>[...pr,{...kpiForm,id:"kpi"+Date.now()}]);}
    setShowKpi(false);setKpiForm({date:today(),member:"",calls:"",meetings:"",proposals:"",notes:""});
  };
  const saveTargets=()=>{
    setTargets({weekly:{revenue:parseFloat(tForm.weekly?.revenue)||0,leads:parseInt(tForm.weekly?.leads)||0,deals:parseInt(tForm.weekly?.deals)||0},monthly:{revenue:parseFloat(tForm.monthly?.revenue)||0,leads:parseInt(tForm.monthly?.leads)||0,deals:parseInt(tForm.monthly?.deals)||0}});
    setEditTargets(false);
  };

  const periodKpis=dailyKPIs.filter(k=>p.inPeriod(k.date));

  // Per-member stats — all from real leads data filtered by chosen period
  const memberStats=activeTeam.map((t,i)=>{
    const myLeads=leads.filter(l=>l.assignedTo===t.name);
    const myWon=myLeads.filter(l=>l.stage==="Gewonnen");
    const myOpen=myLeads.filter(l=>l.stage!=="Gewonnen"&&l.stage!=="Verloren");
    const myRev=myWon.reduce((s,l)=>s+(l.deal||0),0);
    const myPipeline=myOpen.reduce((s,l)=>s+(l.deal||0),0);
    // Period: leads created in period, won deals by wonAt in period
    const myPeriodLeads=myLeads.filter(l=>p.inPeriod(l.created));
    const myPeriodWon=myWon.filter(l=>p.inPeriod(l.wonAt||l.created));
    const myPeriodRev=myPeriodWon.reduce((s,l)=>s+(l.deal||0),0);
    // Activity KPIs
    const myKpisPeriod=periodKpis.filter(k=>k.member===t.name);
    const calls=myKpisPeriod.reduce((s,k)=>s+(parseInt(k.calls)||0),0);
    const meetings=myKpisPeriod.reduce((s,k)=>s+(parseInt(k.meetings)||0),0);
    const proposals=myKpisPeriod.reduce((s,k)=>s+(parseInt(k.proposals)||0),0);
    const conv=myLeads.length>0?((myWon.length/myLeads.length)*100).toFixed(0):0;
    const tDeals=p.periodDays<=7?targets.weekly.deals:targets.monthly.deals;
    const tLeadsTgt=p.periodDays<=7?targets.weekly.leads:targets.monthly.leads;
    const tRev=p.periodDays<=7?targets.weekly.revenue:targets.monthly.revenue;
    const color=colors[i%colors.length];
    const textColor=textColors[i%textColors.length];
    return{...t,i,myLeads:myLeads.length,myWon:myWon.length,myRev,myPipeline,myOpen:myOpen.length,
      periodLeads:myPeriodLeads.length,periodWon:myPeriodWon.length,periodRev:myPeriodRev,
      calls,meetings,proposals,conv,tDeals,tLeads:tLeadsTgt,tRev,color,textColor};
  }).sort((a,b)=>b.periodRev-a.periodRev);

  const maxPeriodRev=Math.max(...memberStats.map(m=>m.periodRev),1);
  const teamPeriodRev=memberStats.reduce((s,m)=>s+m.periodRev,0);
  const teamPeriodWon=memberStats.reduce((s,m)=>s+m.periodWon,0);
  const teamPeriodCalls=memberStats.reduce((s,m)=>s+m.calls,0);
  const recentWon=leads.filter(l=>l.stage==="Gewonnen"&&p.inPeriod(l.wonAt||l.created)).sort((a,b)=>(b.wonAt||b.created||"").localeCompare(a.wonAt||a.created||"")).slice(0,5);
  const rankIcon=(rank)=>rank===0?"🥇":rank===1?"🥈":rank===2?"🥉":"";

  return(<div>
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <div><h1 className="text-2xl font-bold text-white">Team KPI</h1><p className="text-sm text-gray-400 mt-0.5">{p.label}</p></div>
      <div className="flex items-center gap-2">
        <Btn variant="secondary" onClick={()=>{setTForm(JSON.parse(JSON.stringify(targets)));setEditTargets(true);}}>🎯 Ziele</Btn>
        <Btn onClick={()=>{setKpiForm({date:today(),member:activeTeam[0]?.name||"",calls:"",meetings:"",proposals:"",notes:""});setShowKpi(true);}}>📊 KPI eintragen</Btn>
      </div>
    </div>

    <PeriodPicker p={p}/>

    {/* Modals */}
    {editTargets&&(<Modal title="🎯 Ziele bearbeiten" wide onClose={()=>setEditTargets(false)}>
      <div className="p-6 space-y-6">
        <div><h4 className="text-sm font-bold text-indigo-400 mb-3 uppercase">📅 Wochenziele (pro Person)</h4><div className="grid grid-cols-3 gap-4"><Inp label="Umsatz (€)" type="number" value={tForm.weekly?.revenue} onChange={e=>setTForm(pr=>({...pr,weekly:{...pr.weekly,revenue:e.target.value}}))}/><Inp label="Leads" type="number" value={tForm.weekly?.leads} onChange={e=>setTForm(pr=>({...pr,weekly:{...pr.weekly,leads:e.target.value}}))}/><Inp label="Deals Won" type="number" value={tForm.weekly?.deals} onChange={e=>setTForm(pr=>({...pr,weekly:{...pr.weekly,deals:e.target.value}}))}/></div></div>
        <div><h4 className="text-sm font-bold text-purple-400 mb-3 uppercase">📆 Monatsziele (pro Person)</h4><div className="grid grid-cols-3 gap-4"><Inp label="Umsatz (€)" type="number" value={tForm.monthly?.revenue} onChange={e=>setTForm(pr=>({...pr,monthly:{...pr.monthly,revenue:e.target.value}}))}/><Inp label="Leads" type="number" value={tForm.monthly?.leads} onChange={e=>setTForm(pr=>({...pr,monthly:{...pr.monthly,leads:e.target.value}}))}/><Inp label="Deals Won" type="number" value={tForm.monthly?.deals} onChange={e=>setTForm(pr=>({...pr,monthly:{...pr.monthly,deals:e.target.value}}))}/></div></div>
        <p className="text-xs text-gray-500">Wochenziele für Zeiträume ≤7 Tage, sonst Monatsziele.</p>
      </div>
      <div className="px-6 pb-6 flex gap-3"><Btn onClick={saveTargets}>💾 Speichern</Btn><Btn variant="secondary" onClick={()=>setEditTargets(false)}>Abbrechen</Btn></div>
    </Modal>)}

    {showKpi&&(<Modal title="📊 KPI eintragen" onClose={()=>setShowKpi(false)}>
      <div className="p-6 space-y-4">
        <div className="p-3 bg-indigo-900 bg-opacity-30 border border-indigo-800 rounded-xl text-xs text-indigo-300">💡 Anrufe, Meetings & Angebote manuell eintragen. Leads & Deals Won kommen automatisch aus den Daten.</div>
        <Inp label="Datum" type="date" value={kpiForm.date} onChange={e=>setKpiForm(pr=>({...pr,date:e.target.value}))}/>
        <Sel label="Mitarbeiter" value={kpiForm.member} onChange={e=>setKpiForm(pr=>({...pr,member:e.target.value}))} options={activeTeam.map(t=>t.name)}/>
        <div className="grid grid-cols-3 gap-4">
          <Inp label="📞 Anrufe" type="number" value={kpiForm.calls} onChange={e=>setKpiForm(pr=>({...pr,calls:e.target.value}))} placeholder="0"/>
          <Inp label="🤝 Meetings" type="number" value={kpiForm.meetings} onChange={e=>setKpiForm(pr=>({...pr,meetings:e.target.value}))} placeholder="0"/>
          <Inp label="📋 Angebote" type="number" value={kpiForm.proposals} onChange={e=>setKpiForm(pr=>({...pr,proposals:e.target.value}))} placeholder="0"/>
        </div>
        <div><label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Notizen</label><textarea className="w-full bg-gray-900 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20 resize-none" value={kpiForm.notes} onChange={e=>setKpiForm(pr=>({...pr,notes:e.target.value}))} placeholder="z.B. Großer Kunde angerufen..."/></div>
      </div>
      <div className="px-6 pb-6 flex gap-3"><Btn onClick={saveKpi} disabled={!kpiForm.member}>💾 Speichern</Btn><Btn variant="secondary" onClick={()=>setShowKpi(false)}>Abbrechen</Btn></div>
    </Modal>)}

    {dealModal&&(<Modal title={`Stage ändern — ${dealModal.name}`} onClose={()=>setDealModal(null)}>
      <div className="p-6 space-y-3">
        <p className="text-sm text-gray-300">Stage für <strong className="text-white">{dealModal.name}</strong>:</p>
        <div className="grid grid-cols-2 gap-2">
          {(window._gd.lists.find(l=>l.id===dealModal.listId)?.stages||["Neu","Kontaktiert","Qualifiziert","Angebot","Gewonnen","Verloren"]).map(s=>(
            <button key={s} onClick={()=>{setLeads(pr=>pr.map(l=>l.id===dealModal.id?{...l,stage:s,wonAt:s==="Gewonnen"&&!l.wonAt?today():l.wonAt}:l));setDealModal(null);}}
              className={`p-3 rounded-xl border text-sm font-semibold transition ${dealModal.stage===s?"border-indigo-500 bg-indigo-900 text-indigo-300":s==="Gewonnen"?"border-emerald-700 bg-emerald-950 text-emerald-400 hover:border-emerald-500":s==="Verloren"?"border-red-900 bg-red-950 text-red-400 hover:border-red-700":"border-gray-700 text-gray-300 hover:border-gray-500"}`}>
              {s==="Gewonnen"?"🏆 "+s:s==="Verloren"?"❌ "+s:s}
            </button>
          ))}
        </div>
        {dealModal.deal>0&&<div className="p-3 bg-emerald-900 bg-opacity-20 border border-emerald-800 rounded-xl text-sm text-emerald-400 text-center font-bold">Deal-Wert: {fmt(dealModal.deal)} 💶</div>}
      </div>
    </Modal>)}

    {/* Team stat cards */}
    <div className="grid grid-cols-4 gap-4 mb-5">
      <StatCard icon="👥" label="Aktive Mitarbeiter" value={activeTeam.length} color="indigo"/>
      <StatCard icon="💶" label={`Team Umsatz — ${p.label}`} value={fmt(teamPeriodRev)} sub={`${teamPeriodWon} Deals Won`} color="green"/>
      <StatCard icon="📞" label={`Anrufe — ${p.label}`} value={teamPeriodCalls} color="blue"/>
      <StatCard icon="🔥" label="Beste Conversion" value={`${memberStats.length?Math.max(...memberStats.map(m=>parseInt(m.conv)||0)):0}%`} sub={memberStats.length?memberStats.reduce((best,m)=>(parseInt(m.conv)||0)>(parseInt(best.conv)||0)?m:best,memberStats[0])?.name:""} color="orange"/>
    </div>

    {/* Recent wins banner */}
    {recentWon.length>0&&(
      <div className="mb-5 p-3 bg-emerald-950 border border-emerald-800 rounded-2xl">
        <div className="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wide">🎉 Deals Won — {p.label}</div>
        <div className="flex gap-2 flex-wrap">
          {recentWon.map(l=>{
            const ti=activeTeam.findIndex(t=>t.name===l.assignedTo);
            return(<div key={l.id} className="flex items-center gap-2 bg-emerald-900 bg-opacity-50 border border-emerald-700 rounded-xl px-3 py-1.5">
              <div className={`w-5 h-5 rounded-full ${colors[ti%colors.length]||"bg-gray-600"} flex items-center justify-center text-white text-xs font-bold`}>{l.assignedTo?.[0]}</div>
              <span className="text-xs text-white font-semibold">{l.assignedTo}</span>
              <span className="text-xs text-gray-400">–</span>
              <span className="text-xs text-emerald-300 font-bold">{fmt(l.deal)}</span>
              <span className="text-xs text-gray-500">{l.name}</span>
            </div>);
          })}
        </div>
      </div>
    )}

    {/* Per-member cards */}
    <div className="grid grid-cols-2 gap-4 mb-5">
      {memberStats.map((m,rank)=>{
        const hitRev=m.tRev>0&&m.periodRev>=m.tRev;
        const hitDeal=m.tDeals>0&&m.periodWon>=m.tDeals;
        const hitLead=m.tLeads>0&&m.periodLeads>=m.tLeads;
        const allHit=hitRev&&hitDeal&&hitLead;
        return(
          <Card key={m.id} className={`p-5 transition ${allHit?"border-emerald-600 shadow-emerald-900 shadow-lg":""}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-11 h-11 rounded-full ${m.color} flex items-center justify-center text-white font-bold text-sm`}>{m.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                  {rank<3&&m.periodRev>0&&<div className="absolute -top-1 -right-1 text-sm">{rankIcon(rank)}</div>}
                </div>
                <div>
                  <div className="flex items-center gap-1.5"><span className="font-bold text-white">{m.name}</span>{allHit&&<span className="text-xs bg-emerald-900 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold">🎯 Ziel!</span>}</div>
                  <div className="text-xs text-gray-400">{m.role} · Conv. {m.conv}%</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${m.textColor}`}>{fmt(m.periodRev)}</div>
                <div className="text-xs text-gray-500">{m.periodWon} Won · {m.myOpen} offen</div>
              </div>
            </div>

            {/* Revenue bar vs team */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Anteil am Team-Umsatz</span>
                <span className="font-semibold">{teamPeriodRev>0?Math.round((m.periodRev/teamPeriodRev)*100):0}%</span>
              </div>
              <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full ${m.color} rounded-full transition-all duration-700`} style={{width:`${(m.periodRev/maxPeriodRev)*100}%`}}/>
              </div>
            </div>

            {/* Target progress */}
            <div className="space-y-2.5 mb-4">
              <div>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-gray-400">💶 Umsatz</span>
                  <span className={`font-semibold ${hitRev?"text-emerald-400":"text-gray-300"}`}>{fmt(m.periodRev)} / {fmt(m.tRev)} {hitRev?"🎉":""}</span>
                </div>
                <ProgressBar value={m.periodRev} target={m.tRev} color={m.color} showEuro/>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-gray-400">🏆 Deals Won</span>
                  <span className={`font-semibold ${hitDeal?"text-emerald-400":"text-gray-300"}`}>{m.periodWon} / {m.tDeals} {hitDeal?"🎉":""}</span>
                </div>
                <ProgressBar value={m.periodWon} target={m.tDeals} color={m.color}/>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-gray-400">👥 Leads</span>
                  <span className={`font-semibold ${hitLead?"text-emerald-400":"text-gray-300"}`}>{m.periodLeads} / {m.tLeads} {hitLead?"🎉":""}</span>
                </div>
                <ProgressBar value={m.periodLeads} target={m.tLeads} color={m.color}/>
              </div>
            </div>

            {/* Activity */}
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {[["📞",m.calls,"Anrufe"],["🤝",m.meetings,"Meetings"],["📋",m.proposals,"Angebote"]].map(([icon,val,label])=>(
                <div key={label} className="bg-gray-900 rounded-xl p-2 text-center">
                  <div className="text-sm font-bold text-white">{icon} {val}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">Pipeline: <span className="text-indigo-400 font-semibold">{fmt(m.myPipeline)}</span></div>
              <Btn size="sm" variant="secondary" onClick={()=>{setKpiForm({date:today(),member:m.name,calls:"",meetings:"",proposals:"",notes:""});setShowKpi(true);}}>📊 KPI</Btn>
            </div>

            {/* Open leads quick-stage */}
            {leads.filter(l=>l.assignedTo===m.name&&l.stage!=="Gewonnen"&&l.stage!=="Verloren").length>0&&(
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Offene Leads — Stage ändern:</div>
                <div className="space-y-1 max-h-28 overflow-y-auto">
                  {leads.filter(l=>l.assignedTo===m.name&&l.stage!=="Gewonnen"&&l.stage!=="Verloren").map(l=>(
                    <div key={l.id} onClick={()=>setDealModal(l)} className="flex items-center justify-between p-2 bg-gray-900 hover:bg-gray-700 rounded-lg cursor-pointer transition group">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-300 font-medium">{l.name}</span>
                        <Badge color={l.stage==="Angebot"?"orange":l.stage==="Qualifiziert"?"yellow":"gray"}>{l.stage}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {l.deal>0&&<span className="text-xs font-bold text-indigo-400">{fmt(l.deal)}</span>}
                        <span className="text-xs text-gray-600 group-hover:text-indigo-400 transition">→</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>

    {/* KPI log */}
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white">📋 Aktivitäts-Log — {p.label}</h3>
        <span className="text-xs text-gray-500">{periodKpis.length} Einträge</span>
      </div>
      {periodKpis.length===0?(
        <div className="text-center py-8 text-gray-500 text-sm">Keine KPI-Einträge im gewählten Zeitraum.</div>
      ):(
        <table className="w-full text-sm">
          <thead className="border-b border-gray-700"><tr>{["Datum","Mitarbeiter","📞","🤝","📋","Notizen",""].map(h=><th key={h} className="text-left px-3 py-2 text-xs font-semibold text-gray-400 uppercase">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-700">
            {periodKpis.sort((a,b)=>b.date.localeCompare(a.date)).map(k=>{
              const mi=activeTeam.findIndex(t=>t.name===k.member);
              return(<tr key={k.id||k.date+k.member} className="hover:bg-gray-750 transition">
                <td className="px-3 py-2 text-xs text-gray-400">{k.date}</td>
                <td className="px-3 py-2"><div className="flex items-center gap-2"><div className={`w-6 h-6 rounded-full ${colors[mi%colors.length]||"bg-gray-600"} flex items-center justify-center text-white text-xs font-bold`}>{k.member?.[0]}</div><span className="text-sm text-white">{k.member}</span></div></td>
                <td className="px-3 py-2 font-bold text-white">{k.calls||0}</td>
                <td className="px-3 py-2 font-bold text-white">{k.meetings||0}</td>
                <td className="px-3 py-2 font-bold text-white">{k.proposals||0}</td>
                <td className="px-3 py-2 text-xs text-gray-400 max-w-xs truncate">{k.notes||"–"}</td>
                <td className="px-3 py-2"><Btn size="sm" variant="ghost" onClick={()=>{setKpiForm({...k});setShowKpi(true);}}>✏️</Btn></td>
              </tr>);
            })}
          </tbody>
        </table>
      )}
    </Card>
  </div>);
}

function Einstellungen(){
  const [team,setTeam]=useStore("team");
  const [showAdd,setShowAdd]=useState(false);
  const [newMember,setNewMember]=useState({name:"",role:"Vertrieb"});
  const addMember=()=>{if(!newMember.name.trim())return;setTeam(p=>[...p,{id:"t"+Date.now(),name:newMember.name.trim(),role:newMember.role,active:true}]);setNewMember({name:"",role:"Vertrieb"});setShowAdd(false);};
  const toggleActive=id=>setTeam(p=>p.map(t=>t.id===id?{...t,active:!t.active}:t));
  const removeMember=id=>setTeam(p=>p.filter(t=>t.id!==id));
  const updateRole=(id,role)=>setTeam(p=>p.map(t=>t.id===id?{...t,role}:t));
  const updateName=(id,name)=>setTeam(p=>p.map(t=>t.id===id?{...t,name}:t));
  return(<div>
    <div className="mb-6"><h1 className="text-2xl font-bold text-white">Einstellungen</h1></div>
    <div className="grid grid-cols-2 gap-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-white">👥 Team verwalten</h3><Btn size="sm" onClick={()=>setShowAdd(true)}>+ Hinzufügen</Btn></div>
        {showAdd&&(<div className="mb-4 p-4 bg-gray-900 rounded-xl border border-gray-700 space-y-3"><Inp label="Name *" value={newMember.name} onChange={e=>setNewMember(p=>({...p,name:e.target.value}))} placeholder="z.B. Lisa M."/><Sel label="Rolle" value={newMember.role} onChange={e=>setNewMember(p=>({...p,role:e.target.value}))} options={["Vertrieb","Marketing","Manager","Admin"]}/><div className="flex gap-2"><Btn size="sm" onClick={addMember} disabled={!newMember.name.trim()}>✅ Hinzufügen</Btn><Btn size="sm" variant="secondary" onClick={()=>setShowAdd(false)}>Abbrechen</Btn></div></div>)}
        <div className="space-y-2">{team.map(t=>(<div key={t.id} className={`flex items-center gap-3 p-3 rounded-xl border transition ${t.active?"bg-gray-900 border-gray-700":"bg-gray-900 border-gray-800 opacity-50"}`}><div className="w-8 h-8 rounded-full bg-indigo-800 flex items-center justify-center text-indigo-300 font-bold text-xs flex-shrink-0">{t.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div><div className="flex-1 min-w-0"><input className="bg-transparent text-sm font-medium text-white w-full focus:outline-none focus:bg-gray-800 rounded px-1" value={t.name} onChange={e=>updateName(t.id,e.target.value)}/><select className="bg-transparent text-xs text-gray-400 focus:outline-none focus:bg-gray-800 rounded" value={t.role} onChange={e=>updateRole(t.id,e.target.value)}>{["Vertrieb","Marketing","Manager","Admin"].map(r=><option key={r} className="bg-gray-900">{r}</option>)}</select></div><Badge color={t.active?"green":"gray"}>{t.active?"Aktiv":"Inaktiv"}</Badge><button onClick={()=>toggleActive(t.id)} className="text-xs text-gray-500 hover:text-yellow-400 transition" title={t.active?"Deaktivieren":"Aktivieren"}>{t.active?"⏸":"▶"}</button><button onClick={()=>removeMember(t.id)} className="text-xs text-gray-500 hover:text-red-400 transition" title="Entfernen">🗑️</button></div>))}</div>
        <p className="text-xs text-gray-500 mt-3">Namen direkt anklicken zum Bearbeiten. Inaktive Mitglieder erscheinen nicht in Dropdown-Listen.</p>
      </Card>
      <Card className="p-6"><h3 className="font-bold text-white mb-4">🚀 Deploy Guide</h3><div className="space-y-3">{[["1","GitHub","github.com → Sign up → New repo","bg-blue-600"],["2","Code Upload","8 Dateien via Create new file","bg-purple-600"],["3","Vercel","Import repo → Vite → Deploy","bg-orange-600"],["4","Make.com","Facebook Lead Ads → Webhook","bg-green-600"]].map(([n,t,s,bg])=>(<div key={n} className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl"><div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center text-white font-bold text-sm`}>{n}</div><div><div className="text-sm font-semibold text-white">{t}</div><div className="text-xs text-gray-400">{s}</div></div></div>))}</div></Card>
    </div>
  </div>);
}

const NAV=[
  {id:"crm",label:"CRM",icon:"🗂️",color:"bg-blue-600",children:[{id:"contacts",label:"Kontakte"},{id:"lists",label:"Listen"}]},
  {id:"sales",label:"Sales",icon:"💼",color:"bg-purple-600",children:[{id:"leads",label:"Leads"},{id:"pipeline",label:"Pipeline"},{id:"deals",label:"Deals"}]},
  {id:"marketing",label:"Marketing",icon:"📣",color:"bg-orange-600",children:[{id:"campaigns",label:"Kampagnen"},{id:"adaccounts",label:"Ad Accounts"},{id:"content",label:"Content Creator"}]},
  {id:"umsatz",label:"Umsatz",icon:"💰",color:"bg-emerald-600",children:[{id:"umsatz",label:"Dashboard"},{id:"teamkpi",label:"Team KPI"}]},
  {id:"settings",label:"Einstellungen",icon:"⚙️",color:"bg-gray-600",children:[{id:"settings",label:"Einstellungen"}]},
];
const PAGES={contacts:<Contacts/>,lists:<Lists/>,leads:<Leads/>,pipeline:<Pipeline/>,deals:<Deals/>,campaigns:<CampaignsMgr/>,adaccounts:<AdAccounts/>,content:<ContentCreator/>,umsatz:<Umsatz/>,teamkpi:<TeamKPI/>,settings:<Einstellungen/>};

export default function App(){
  const [active,setActive]=useState("leads");
  const [open,setOpen]=useState(["crm","sales","marketing","umsatz"]);
  const toggle=id=>setOpen(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const activeSection=NAV.find(s=>s.children.find(c=>c.id===active));
  const activePage=NAV.flatMap(s=>s.children).find(c=>c.id===active);
  return(<div className="flex h-screen bg-gray-900 font-sans overflow-hidden">
    <div className="w-56 bg-gray-950 border-r border-gray-800 flex flex-col flex-shrink-0">
      <div className="px-5 py-5 border-b border-gray-800"><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">G</div><div><div className="font-bold text-white text-sm">GrowDesk</div><div className="text-xs text-gray-500">v4.4</div></div></div></div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">{NAV.map(section=>(<div key={section.id}><button onClick={()=>toggle(section.id)} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-800 transition group"><div className={`w-6 h-6 rounded-lg ${section.color} flex items-center justify-center text-xs`}>{section.icon}</div><span className="flex-1 text-left text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-200">{section.label}</span><span className="text-gray-600 text-xs">{open.includes(section.id)?"▾":"▸"}</span></button>{open.includes(section.id)&&(<div className="ml-3 pl-3 border-l border-gray-800 space-y-0.5 mt-1 mb-2">{section.children.map(item=>(<button key={item.id} onClick={()=>setActive(item.id)} className={`w-full text-left px-3 py-2 rounded-xl text-sm transition ${active===item.id?"bg-gray-800 text-white font-semibold":"text-gray-400 hover:text-gray-200 hover:bg-gray-800"}`}>{item.label}</button>))}</div>)}</div>))}</nav>
      <div className="px-4 py-4 border-t border-gray-800"><div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-full bg-indigo-700 flex items-center justify-center text-white font-bold text-xs">A</div><div><div className="text-xs font-semibold text-gray-300">Admin</div><div className="text-xs text-gray-600">GrowDesk</div></div><div className="ml-auto w-2 h-2 rounded-full bg-emerald-400"/></div></div>
    </div>
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-gray-950 border-b border-gray-800 px-8 py-3.5 flex items-center justify-between"><div className="flex items-center gap-2 text-xs text-gray-500">{activeSection&&<><span className="text-gray-300 font-semibold">{activeSection.label}</span><span>/</span></>}<span className="text-gray-400">{activePage?.label}</span></div><div className="flex items-center gap-4 text-xs text-gray-500"><span>{new Date().toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long"})}</span><div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"/><span>Online</span></div></div></div>
      <div className="flex-1 overflow-y-auto px-8 py-6 bg-gray-900">{PAGES[active]||<Leads/>}</div>
    </div>
  </div>);
}
