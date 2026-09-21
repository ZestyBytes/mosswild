'use strict';
const NpcPixels=new PixelAtlas('assets/npc-portraits.png',4,2,64,96,true,null,npcSourceRects);
const TilePixels=new PixelAtlas('assets/overworld-tiles.png',8,4,32,32,false);
// Source art has uneven row spacing; explicit guides prevent neighbouring structures bleeding into a frame.
const LandmarkPixels=new PixelAtlas('assets/landmarks.png',3,5,120,105,true,[0,286,585,806,1042,1420]);
const npcArtNames=['Mara','Nell','Tessa','Rowan','Iris','Kai','Sage'];
function drawNpcPortraits(){for(const c of document.querySelectorAll('[data-pixel-npc], [data-orchard-portrait="tessa"]')){const name=c.dataset.pixelNpc||'Tessa',g=c.getContext('2d');if(!NpcPixels.ready)continue;g.clearRect(0,0,c.width,c.height);NpcPixels.draw(g,npcArtNames.indexOf(name),c.width/2,c.height-3,c.height-6);}}
const pixelsHuman=human;human=function(x,y,npc=false,dir=0,walk=0){if(npc){const n=map.npcs.find(n=>n.kind==='human'&&Math.abs(n.x-x)<1&&Math.abs(n.y-y)<1),index=npcArtNames.indexOf(n?.name);if(index>=0&&NpcPixels.draw(ctx,index,x,y,38))return;}pixelsHuman(x,y,npc,dir,walk);};
const pixelsShow=show;show=function(title,body,kicker){const name=npcArtNames.find(n=>title===n||title.startsWith(n+','));if(name&&!body.includes('data-orchard-portrait'))body=`<canvas class="portrait pixel-npc" data-pixel-npc="${name}" width="96" height="96" aria-label="${name}"></canvas>`+body;pixelsShow(title,body,kicker);drawNpcPortraits();};
const pixelsOrchardPortraits=orchardPortraits;orchardPortraits=function(){pixelsOrchardPortraits();drawNpcPortraits();};
document.addEventListener('mosswild-art-ready',drawNpcPortraits);
function landmarkFrame(region){const project={orchard:'nursery',highlands:'lift',marsh:'boardwalk',coast:'harbour',observatory:'observatory'}[region],row=['orchard','highlands','marsh','coast','observatory'].indexOf(region);if(row<0)return -1;const stage=state.frontier.projects[project]?2:(state[region]?.stage||0)>=4?1:0;return row*3+stage;}
const pixelsGround=ground;ground=function(x,y,t){if(!TilePixels.ready){pixelsGround(x,y,t);return;}let index={grass:0,tree:0,tall:1,path:2,sand:3,water:4,floor:26,rug:27,wall:28,building:0,bridgefloor:22}[t];if(index===undefined){pixelsGround(x,y,t);return;}if(t==='rug'){let left=x,right=x,top=y,bottom=y;while(map.tiles[y]?.[left-1]==='rug')left--;while(map.tiles[y]?.[right+1]==='rug')right++;while(map.tiles[top-1]?.[x]==='rug')top--;while(map.tiles[bottom+1]?.[x]==='rug')bottom++;const f=TilePixels.frames[27];ctx.drawImage(f,(x-left)*32/(right-left+1),(y-top)*32/(bottom-top+1),32/(right-left+1),32/(bottom-top+1),x*T,y*T,T,T);return;}if(t==='water'){const land=(dx,dy)=>{const n=map.tiles[y+dy]?.[x+dx];return n&&n!=='water'&&n!=='bridgefloor';};index=land(0,-1)?5:land(1,0)?6:land(0,1)?7:land(-1,0)?8:4;}if(t==='bridgefloor'){TilePixels.tile(ctx,4,x*T,y*T);const vertical=map.tiles[y-1]?.[x]==='bridgefloor'&&map.tiles[y+1]?.[x]==='bridgefloor'&&map.tiles[y]?.[x-1]!=='bridgefloor';index=vertical?23:22;}TilePixels.tile(ctx,index,x*T,y*T);};
const pixelsTree=tree;tree=function(x,y,grove=false){if(TilePixels.ready){TilePixels.draw(ctx,9,x,y+5,76,64);return;}pixelsTree(x,y,grove);};
const pixelsHouse=house;house=function(o){
 if(!TilePixels.ready){pixelsHouse(o);return;}
 const x=o.x-16,y=o.y-16,w=o.w*T,door=map.portals.find(p=>p.y===y+o.h*T&&p.x>=x&&p.x<x+w),doorCol=door?Math.floor((door.x-x)/T):Math.floor(o.w/2),roofHeight=(o.h-2)*T;
 // Keep one continuous roof silhouette on the world tile grid.
 ctx.save();ctx.beginPath();ctx.moveTo(x+16,y);ctx.lineTo(x+w-16,y);ctx.lineTo(x+w,y+roofHeight);ctx.lineTo(x,y+roofHeight);ctx.closePath();ctx.clip();
 for(let row=0;row<o.h-2;row++)for(let col=0;col<o.w;col++)TilePixels.tile(ctx,20,x+col*T,y+row*T);
 ctx.restore();
 for(let col=0;col<o.w;col++)TilePixels.tile(ctx,col===doorCol?18:col===1||col===o.w-2?17:16,x+col*T,y+roofHeight,T,2*T);
 rr(x-2,y+roofHeight-3,w+4,5,'#59422e');
 text(o.label,x+w/2,y+o.h*T+13,'#fff1b7',9);
};
const pixelsObject=object;object=function(o){if(o.type==='landmark'&&LandmarkPixels.draw(ctx,landmarkFrame(o.region),o.x,o.y,105,120))return;if(o.type==='house'&&TilePixels.ready){house(o);return;}if(o.type==='tree'&&TilePixels.ready){tree(o.x,o.y,map.id==='grove');if(o.apple)for(const[dx,dy]of [[-12,-43],[9,-48],[2,-30]]){rr(o.x+dx,o.y+dy,4,4,'#b95735');rr(o.x+dx,o.y+dy,2,1,'#edb75e');}return;}const index={boulder:11,wildflowers:12,reeds:13,fence:14,orchardWell:24,sign:25,crate:31}[o.type];if(index!==undefined&&TilePixels.draw(ctx,index,o.x,o.y+4,o.type==='orchardWell'?40:32))return;const nests={highlandsNest:['Talus','highlands'],marshNest:['Fennel','marsh'],coastNest:['Pearl','coast'],observatoryNest:['Nova','observatory']}[o.type];if(nests&&(state[nests[1]]?.stage||0)>=4&&!state.team.includes(nests[0])&&drawCompanionPixels(ctx,nests[0],o.x,o.y,22))return;pixelsObject(o);};
