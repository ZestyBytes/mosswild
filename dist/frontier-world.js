(function(root){
const regions={orchard:['Bramble Orchard',48,38],highlands:['Copper Highlands',50,40],marsh:['Fernwater Marsh',46,42],coast:['Tideglass Coast',52,40],observatory:['Starlight Plateau',44,38]};
function expand(w){const T=32,rect=(m,x,y,a,b,t)=>{for(let j=y;j<y+b;j++)for(let i=x;i<x+a;i++)m.tiles[j][i]=t;},add=(m,type,x,y,extra={})=>m.objects.push({id:m.id+'-'+type+'-'+x+'-'+y,type,x:x*T+16,y:y*T+16,...extra});
function exit(m,x,y,a,b,to,tx,ty){rect(m,x,y,a,b,'path');m.portals.push({x:x*T,y:y*T,w:a*T,h:b*T,to,tx:tx*T+16,ty:ty*T+16});}
for(const[id,[name,width,height]]of Object.entries(regions)){const m={id,name,w:width,h:height,tiles:Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x===0||y===0||x===width-1||y===height-1?'tree':'grass')),objects:[],npcs:[],portals:[]};w[id]=m;rect(m,1,18,width-2,3,'path');rect(m,22,1,3,height-2,'path');rect(m,18,14,11,12,'path');
for(let y=4;y<height-3;y+=7)for(let x=4;x<width-3;x+=7){if(x>=18&&x<=29||y>=15&&y<=24)continue;add(m,(id==='highlands'||id==='observatory')?'boulder':'tree',x,y,{solid:true});add(m,'wildflowers',x+2,y+2);}
for(const[x,y]of [[12,16],[33,22],[18,29],[29,10]])add(m,'berries',x,y);for(const[x,y]of [[9,22],[34,16]])add(m,'log',x,y);
const specialty={orchard:'herb',highlands:'ore',marsh:'herb',coast:'shell',observatory:'crystals'}[id];for(const[x,y]of [[16,12],[30,14],[15,27],[31,29],[36,10]])add(m,specialty,x,y);
add(m,'trailboard',20,17);add(m,'campfire',26,23);add(m,'landmark',24,11,{region:id});
const names={orchard:'Tessa',highlands:'Rowan',marsh:'Iris',coast:'Kai',observatory:'Sage'};m.npcs.push({name:names[id],kind:'human',x:24*T+16,y:17*T+16});
if(['marsh','coast'].includes(id)){rect(m,width-8,3,6,height-6,'water');for(const y of [10,25,33]){add(m,'fish',width-9,y);add(m,'reeds',width-9,y-2);}rect(m,width-9,18,1,3,'sand');if(id==='marsh')rect(m,width-9,18,9,3,'bridgefloor');}
if(id==='orchard'){for(const[x,y]of [[8,8],[13,8],[8,29],[36,29],[36,6]]){add(m,'tree',x,y,{solid:true});add(m,'berries',x+1,y+1);}}
}
exit(w.valley,0,15,1,3,'orchard',45,19);exit(w.orchard,47,18,1,3,'valley',2,16);
exit(w.grove,14,0,3,1,'highlands',23,37);exit(w.highlands,22,39,3,1,'grove',15,2);
exit(w.orchard,0,18,1,3,'marsh',43,19);exit(w.marsh,45,18,1,3,'orchard',2,19);
exit(w.riverbank,19,31,3,1,'coast',23,2);exit(w.coast,22,0,3,1,'riverbank',20,29);
exit(w.highlands,22,0,3,1,'observatory',23,35);exit(w.observatory,22,37,3,1,'highlands',23,2);
add(w.orchard,'trailgate',1,19,{gate:'marsh'});add(w.riverbank,'trailgate',20,30,{gate:'coast'});add(w.highlands,'trailgate',23,1,{gate:'observatory'});
add(w.valley,'sign',2,14,{text:'← BRAMBLE ORCHARD\nTessa is restoring the old frontier trails.'});add(w.grove,'sign',18,3,{text:'↑ COPPER HIGHLANDS\nRowan has opened a new surveying camp.'});
return w;
}
function apply(w,progress={}){for(const [area,gate,x,y,a,b]of [['orchard','marsh',0,18,1,3],['riverbank','coast',19,31,3,1],['highlands','observatory',22,0,3,1]])for(let j=y;j<y+b;j++)for(let i=x;i<x+a;i++)w[area].tiles[j][i]=progress[{marsh:'nursery',coast:'harbour',observatory:'lift'}[gate]]?'path':'building';}
const api={regions,expand,apply};if(typeof module!=='undefined')module.exports=api;else{root.FrontierWorld=api;const base=root.World.createWorld;root.World.createWorld=()=>expand(base());}
})(globalThis);
