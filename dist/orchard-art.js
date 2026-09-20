'use strict';
const OrchardArt=(()=>{
 const frames=[];let ready=false;const image=new Image();
 image.onload=()=>{const c=document.createElement('canvas');c.width=image.naturalWidth;c.height=image.naturalHeight;const g=c.getContext('2d');g.drawImage(image,0,0);const cw=c.width/4,ch=c.height/2;for(let row=0;row<2;row++)for(let col=0;col<4;col++){const x=Math.floor(col*cw),y=Math.floor(row*ch),w=Math.floor(cw),h=Math.floor(ch),data=g.getImageData(x,y,w,h).data;let l=w,r=0,t=h,b=0;for(let py=0;py<h;py++)for(let px=0;px<w;px++)if(data[(py*w+px)*4+3]>96){l=Math.min(l,px);r=Math.max(r,px);t=Math.min(t,py);b=Math.max(b,py);}frames.push({x:x+l,y:y+t,w:r-l+1,h:b-t+1});}ready=true;if(typeof orchardPortraits==='function')orchardPortraits();};
 image.src='assets/orchard-atlas.png';
 function draw(g,index,x,y,height,width){if(!ready)return false;const f=frames[index];width=width||Math.round(height*f.w/f.h);g.save();g.imageSmoothingEnabled=false;g.drawImage(image,f.x,f.y,f.w,f.h,Math.round(x-width/2),Math.round(y-height),width,height);g.restore();return true;}
 return {draw,get ready(){return ready;}};
})();
function orchardPortraits(){for(const c of document.querySelectorAll('[data-orchard-portrait]')){const g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);OrchardArt.draw(g,c.dataset.orchardPortrait==='tessa'?0:1,c.width/2,c.height-4,c.height-8);}}
const orchardHuman=human;human=function(x,y,npc=false,dir=0,walk=0){if(npc&&map.id==='tessa'&&OrchardArt.draw(ctx,0,x,y,38))return;orchardHuman(x,y,npc,dir,walk);};
const orchardCreature=creature;creature=function(x,y,name,walk=0){const n=name==='Pip'?state.life.active:name;if(n==='Bramble'&&OrchardArt.draw(ctx,1,x,y+(walk?Math.sin(walk):0),23))return;orchardCreature(x,y,name,walk);};
const orchardFriendPortraits=portraits;portraits=function(){orchardFriendPortraits();for(const c of document.querySelectorAll('[data-friend-art="Bramble"]')){const g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);OrchardArt.draw(g,1,c.width/2,c.height-10,60);}};
const orchardEncounter=encounterDialog;encounterDialog=function(){orchardEncounter();if(encounter?.name==='Bramble'){const c=document.getElementById('portrait'),g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);OrchardArt.draw(g,1,24,46,43);}};
const orchardObject=object;object=function(o){
 if(map.id==='orchard'){
  if(o.apple&&OrchardArt.draw(ctx,2,o.x,o.y+6,92))return;
  if(o.orchardCottage&&OrchardArt.draw(ctx,3,o.x+(o.w*T)/2-16,o.y+o.h*T-16,170,o.w*T))return;
  if(o.type==='landmark'){const stage=state.orchard.stage,index=state.frontier.projects.nursery||stage===7?6:stage>=4?5:4;if(OrchardArt.draw(ctx,index,o.x,o.y,105,120))return;}
  if(o.type==='orchardWell'&&OrchardArt.draw(ctx,7,o.x,o.y,45))return;
  if(o.type==='orchardJournal'){rr(o.x-8,o.y-13,16,16,'#725438');rr(o.x-6,o.y-12,12,13,'#efddac');rr(o.x-4,o.y-9,8,2,'#869568');rr(o.x-4,o.y-5,6,1,'#a88c62');return;}
  if(o.type==='orchardBed'){const planted=state.orchard.stage>=4,wet=state.orchard.beds.includes(o.bed),bloom=state.orchard.stage===7;rr(o.x-14,o.y-8,28,18,wet?'#664b3d':'#9c7654');for(const dx of [-8,0,8]){rr(o.x+dx-2,o.y-6,2,14,'#4a382d');if(planted){rr(o.x+dx,o.y-12,2,15,'#557e43');rr(o.x+dx-3,o.y-10,8,4,wet?'#99b958':'#6e9150');if(bloom){rr(o.x+dx-3,o.y-16,7,6,'#efd280');rr(o.x+dx-1,o.y-14,3,2,'#b97845');}}}return;}
  if(o.type==='orchardNest'){rr(o.x-12,o.y-5,24,9,'#8d7951');rr(o.x-8,o.y-7,16,7,'#c4b078');if(state.orchard.stage>=5&&!state.team.includes('Bramble')){if(!OrchardArt.draw(ctx,1,o.x,o.y,23))text('?',o.x,o.y-12,'#fff0b8',12);}else{for(const dx of [-6,4])rr(o.x+dx,o.y-3,3,2,'#5f754a');}return;}
 }
 orchardObject(o);
};
