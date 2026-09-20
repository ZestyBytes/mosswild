(function(root){
'use strict';
function expand(w){
 const T=32,m=w.orchard;
 const rect=(x,y,a,b,t)=>{for(let j=y;j<y+b;j++)for(let i=x;i<x+a;i++)m.tiles[j][i]=t;};
 const add=(type,x,y,extra={})=>m.objects.push({id:'orchard-'+type+'-'+x+'-'+y,type,x:x*T+16,y:y*T+16,...extra});
 m.objects=[];m.npcs=[];
 m.tiles=Array.from({length:m.h},(_,y)=>Array.from({length:m.w},(_,x)=>!x||!y||x===m.w-1||y===m.h-1?'tree':'grass'));
 // A stream divides the planted western nursery from the old eastern orchard.
 rect(18,3,3,32,'water');rect(17,6,1,26,'sand');rect(21,6,1,26,'sand');
 for(const[x,y,a,b]of [[1,18,16,3],[14,18,3,8],[14,24,12,3],[23,18,3,9],[23,18,24,3],[32,12,3,8],[9,13,3,8],[25,27,3,7],[25,31,16,3],[38,25,3,8],[32,24,9,3]])rect(x,y,a,b,'path');
 rect(47,18,1,3,'path');rect(0,18,1,3,'path');rect(17,18,6,3,'bridgefloor');rect(17,28,6,2,'bridgefloor');rect(12,28,5,2,'path');rect(22,28,5,2,'path');
 rect(30,7,7,5,'building');add('house',30,7,{w:7,h:5,label:'Tessa’s cottage',orchardCottage:true});
 m.portals.push({x:33*T,y:12*T,w:T,h:T,to:'tessa',tx:8*T+16,ty:11*T+16});
 const room={id:'tessa',name:'Tessa’s Cottage',w:17,h:15,inside:true,tiles:Array.from({length:15},(_,y)=>Array.from({length:17},(_,x)=>!x||!y||x===16||y===14?'wall':'floor')),objects:[],npcs:[{name:'Tessa',kind:'human',x:8*T+16,y:6*T+16}],portals:[{x:8*T,y:14*T,w:T,h:T,to:'orchard',tx:33*T+16,ty:13*T+16}]};
 room.tiles[14][8]='floor';for(let y=7;y<11;y++)for(let x=5;x<12;x++)room.tiles[y][x]='rug';
 for(const[type,x,y]of [['shelf',3,2],['shelf',4,2],['bed',13,3],['table',5,5],['plant',3,10],['plant',13,10]])room.objects.push({id:'tessa-'+type+x,type,x:x*T+16,y:y*T+16,solid:true});w.tessa=room;
 for(const[x,y]of [[27,5],[32,4],[40,5],[43,9],[39,14],[43,23],[29,29],[33,28],[34,34],[7,6],[4,11],[5,29],[10,32]])add('tree',x,y,{solid:true,apple:true});
 for(const[x,y]of [[5,15],[8,26],[28,14],[40,18],[36,29]])add('berries',x,y);
 for(const[x,y]of [[7,22],[26,16],[35,25],[39,30],[13,30]])add('herb',x,y);
 for(const[x,y]of [[6,20],[29,23]])add('log',x,y);
 add('landmark',11,12,{region:'orchard'});add('trailboard',28,19);add('trailgate',1,19,{gate:'marsh'});add('campfire',25,22);
 add('sign',44,17,{text:'BRAMBLE ORCHARD\nTessa’s cottage: follow the northern bend. Nursery: across the stream.'});
 add('sign',28,30,{text:'THE QUIET CLEARING\nTiny pawprints disappear beneath the berry bushes.'});
 add('orchardJournal',34,14);add('orchardWell',12,23);
 for(let i=0;i<3;i++)add('orchardBed',8+i*3,15,{bed:i});
 add('orchardNest',39,33);
 return w;
}
const api={expand};if(typeof module!=='undefined')module.exports=api;else{root.OrchardWorld=api;const base=root.World.createWorld;root.World.createWorld=()=>expand(base());}
})(globalThis);
