(function(root){
'use strict';
const members=['Pip','Emberkin','Dewdrop','Lunamoth','Bramble'],items=['berries','wood','fish','crystals'];
const crops={turnip:{name:'Sun turnip',seconds:90,yield:3},moonbean:{name:'Moon bean',seconds:180,yield:2}};
const recipes={treat:{name:'Friendship treat',cost:{turnips:2,berries:2},item:'treats',amount:1},seeds:{name:'Turnip seeds × 3',cost:{berries:2},item:'seeds',amount:3},moonseeds:{name:'Moon-bean seeds × 2',cost:{crystals:1},item:'moonSeeds',amount:2},tool:{name:'Copper tool set',cost:{wood:15,crystals:4,coins:60},item:'tools',amount:1},lantern:{name:'Firefly lantern',cost:{wood:8,moonbeans:3},item:'lantern',amount:1}};
function number(v,d=0,max=100000000){return typeof v==='number'&&Number.isFinite(v)?Math.max(0,Math.min(max,v)):d;}
function clean(raw,now=Date.now()){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('This is not a Mosswild save.');
 if(!Array.isArray(raw.team)||!raw.team.includes('Pip')||!Number.isFinite(raw.last))throw Error('Save is missing essential progress.');
 const s={};for(const k of ['coins',...items,'herbs','ore','shells','xp','quest'])s[k]=Math.floor(number(raw[k]));
 s.quest=Math.min(3,s.quest);s.upgrade=Math.max(1,Math.floor(number(raw.upgrade,1,100)));s.last=number(raw.last,now,now);
 s.team=members.filter(n=>raw.team.includes(n));s.jobs={};s.bank={};for(const n of s.team)s.jobs[n]=items.includes(raw.jobs?.[n])?raw.jobs[n]:'berries';for(const k of items)s.bank[k]=number(raw.bank?.[k]);
 s.met=raw.met===true;s.caught=s.team.length>1;s.cooldowns={};for(const [k,v]of Object.entries(raw.cooldowns||{}).slice(0,150))if(/^[a-z0-9-]{1,80}$/.test(k))s.cooldowns[k]=number(v,0,now+20000);
 s.exploration={};for(const k of ['bridge','seal','beacon','nell','cache'])s.exploration[k]=raw.exploration?.[k]===true;
 s.position=raw.position&&['valley','meadow','grove','home','cottage','riverbank','cavern','orchard','highlands','marsh','coast','observatory','tessa'].includes(raw.position.area)?{area:raw.position.area,x:number(raw.position.x,208,2000),y:number(raw.position.y,368,2000)}:null;
 const r=raw.life||{};s.life={started:number(r.started,now,now),elapsed:number(r.elapsed),seeds:Math.floor(number(r.seeds,6)),moonSeeds:Math.floor(number(r.moonSeeds,2)),turnips:Math.floor(number(r.turnips)),moonbeans:Math.floor(number(r.moonbeans)),treats:Math.floor(number(r.treats)),tools:Math.min(1,number(r.tools)),lantern:Math.min(1,number(r.lantern)),harvested:Math.floor(number(r.harvested)),crafted:Math.floor(number(r.crafted)),treatsMade:Math.floor(number(r.treatsMade)),active:s.team.includes(r.active)?r.active:'Pip',bond:{},plots:{},claimed:[],visits:[]};
 for(const n of members)s.life.bond[n]=Math.floor(number(r.bond?.[n],0,900));
 for(const [k,p]of Object.entries(r.plots||{}))if(/^[0-5]$/.test(k)&&crops[p?.crop])s.life.plots[k]={crop:p.crop,planted:number(p.planted,now,now),watered:p.watered===true};
 s.life.claimed=[...new Set((Array.isArray(r.claimed)?r.claimed:[]).filter(n=>Number.isInteger(n)&&n>=0&&n<8))];
 s.life.visits=[...new Set((Array.isArray(r.visits)?r.visits:[]).filter(n=>['valley','meadow','grove','home','cottage','riverbank','cavern','orchard','highlands','marsh','coast','observatory','tessa'].includes(n))) ];
 const f=raw.frontier||{};s.frontier={marks:Math.floor(number(f.marks)),completed:Math.floor(number(f.completed)),research:Math.floor(number(f.research)),projects:{},gathered:{},orders:{},trips:{},story:[],avatar:{style:f.avatar?.style==='classic'?'classic':'rounded',hair:Math.floor(number(f.avatar?.hair,0,3)),coat:Math.floor(number(f.avatar?.coat,0,3)),hat:f.avatar?.hat===true}};
 for(const k of ['nursery','lift','harbour','boardwalk','observatory'])s.frontier.projects[k]=f.projects?.[k]===true;
 for(const k of ['berries','wood','fish','crystals','herbs','ore','shells'])s.frontier.gathered[k]=Math.floor(number(f.gathered?.[k]));
 for(const id of ['orchard','highlands','marsh','coast','observatory']){const o=f.orders?.[id];if(o&&Number.isInteger(o.tier)&&o.tier>=0&&o.tier<=10000){const start={};for(const k of ['berries','wood','fish','crystals','herbs','ore','shells'])start[k]=Math.floor(number(o.start?.[k]));s.frontier.orders[id]={tier:o.tier,start};}}
 for(const n of s.team){const trip=f.trips?.[n];if(trip&&[300,1200,3600].includes(trip.duration))s.frontier.trips[n]={start:number(trip.start,now,now),duration:trip.duration};}
 s.frontier.story=[...new Set((Array.isArray(f.story)?f.story:[]).filter(n=>Number.isInteger(n)&&n>=0&&n<6))];
 const oq=raw.orchard||{};s.orchard={stage:Math.floor(number(oq.stage,0,7)),herbStart:Math.floor(number(oq.herbStart)),water:Math.floor(number(oq.water,0,3)),beds:[...new Set((Array.isArray(oq.beds)?oq.beds:[]).filter(n=>Number.isInteger(n)&&n>=0&&n<3))]};
 return s;
}
function unpack(value){const v=typeof value==='string'?JSON.parse(value):value;if(v?.schema>2)throw Error('This save needs a newer version of Mosswild.');return clean(v?.schema===2?v.state:v);}
function level(s,n){return Math.min(10,1+Math.floor((s.life.bond[n]||0)/100));}
function grow(p,now=Date.now()){return p?Math.max(0,Math.min(1,(now-p.planted)/(crops[p.crop].seconds*1000*(p.watered?.65:1)))):0;}
function plant(s,id,crop,now=Date.now()){const key=crop==='turnip'?'seeds':'moonSeeds';if(!/^[0-5]$/.test(String(id))||!crops[crop]||s.life.plots[id]||s.life[key]<1)return false;s.life[key]--;s.life.plots[id]={crop,planted:now,watered:false};return true;}
function harvest(s,id,now=Date.now()){const p=s.life.plots[id];if(!p||grow(p,now)<1)return false;const key=p.crop==='turnip'?'turnips':'moonbeans';s.life[key]+=crops[p.crop].yield;s.life.harvested++;delete s.life.plots[id];return true;}
function craft(s,id){const r=recipes[id];if(!r||(['tools','lantern'].includes(r.item)&&s.life[r.item])||!Object.entries(r.cost).every(([k,v])=>(k in s.life?s.life[k]:s[k])>=v))return false;for(const[k,v]of Object.entries(r.cost)){if(k in s.life)s.life[k]-=v;else s[k]-=v;}s.life[r.item]+=r.amount;s.life.crafted++;if(id==='treat')s.life.treatsMade++;return true;}
const chapters=[
 ['A door left open','Visit Mara in the northwest cottage. She will introduce you to the valley.',s=>s.met,20],
 ['Your first wild friend','Find Emberkin in the meadow to the east. Read its body language, then offer a berry.',s=>s.team.includes('Emberkin'),25],
 ['Something you grew','Plant and water a seed in the six garden beds south of your homestead, then harvest it.',s=>s.life.harvested>0,25],
 ['Made with care','Use the workbench inside your homestead to cook a friendship treat.',s=>s.life.treatsMade>0,30],
 ['A growing bond','Feed a treat to a companion or gather together until any friend reaches level 2.',s=>s.team.some(n=>level(s,n)>=2),30],
 ['Across the water','Bring Emberkin and 12 wood to the broken bridge at the east edge of the meadow.',s=>s.exploration.bridge,40],
 ['A light in the dark','Befriend Lunamoth in the northern grove. Open the riverbank cavern and rekindle its beacon.',s=>s.exploration.beacon,60],
 ['Everyone has a home','Befriend all four companions, trade fish with Nell and improve your camp to level 2.',s=>['Pip','Emberkin','Dewdrop','Lunamoth'].every(n=>s.team.includes(n))&&s.exploration.nell&&s.upgrade>=2,100]
];
function claim(s,i){if(!Number.isInteger(i)||!chapters[i]||s.life.claimed.includes(i)||!chapters[i][2](s)||chapters.slice(0,i).some((_,n)=>!s.life.claimed.includes(n)))return false;s.coins+=chapters[i][3];s.life.claimed.push(i);return true;}
const api={members,items,crops,recipes,clean,unpack,level,grow,plant,harvest,craft,chapters,claim};if(typeof module!=='undefined')module.exports=api;else root.MossSystems=api;
})(globalThis);
