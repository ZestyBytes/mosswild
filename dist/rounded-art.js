'use strict';
// Original rounded-pixel atlas, rendered independently of collision and save positions.
const RoundedArt=(()=>{
 const frames=[];let ready=false;
 const image=new Image();
 image.onload=()=>{
  const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
  const g=canvas.getContext('2d');g.drawImage(image,0,0);
  const cw=canvas.width/4,ch=canvas.height/4;
  for(let row=0;row<4;row++)for(let col=0;col<4;col++){
   const x=Math.floor(col*cw),y=Math.floor(row*ch),w=Math.floor(cw),h=Math.floor(ch),pixels=g.getImageData(x,y,w,h).data;
   let left=w,top=h,right=0,bottom=0;
   for(let py=0;py<h;py++)for(let px=0;px<w;px++)if(pixels[(py*w+px)*4+3]>96){left=Math.min(left,px);right=Math.max(right,px);top=Math.min(top,py);bottom=Math.max(bottom,py);}
   frames.push({x:x+left,y:y+top,w:right-left+1,h:bottom-top+1});
  }
  ready=true;
  if(document.querySelector('#rounded-preview'))appearance();
 };
 image.src='assets/rounded-characters.png';
 function draw(g,x,y,dir=0,walk=0,companion=false,height=companion?22:38){
  if(!ready)return false;
  const row=companion?3:walk?(Math.sin(walk)>0?1:2):0,f=frames[row*4+Math.max(0,Math.min(3,dir))],width=Math.round(height*f.w/f.h);
  g.save();g.imageSmoothingEnabled=false;g.drawImage(image,f.x,f.y,f.w,f.h,Math.round(x-width/2),Math.round(y-height),width,height);g.restore();return true;
 }
 return {draw,get ready(){return ready;}};
})();
const classicHuman=human;human=function(x,y,npc=false,dir=0,walk=0){if(!npc&&state.frontier.avatar.style!=='classic'&&RoundedArt.draw(ctx,x,y,dir,walk))return;classicHuman(x,y,npc,dir,walk);};
const classicCreature=creature;creature=function(x,y,name,walk=0){const actual=name==='Pip'?state.life.active:name;if(actual==='Pip'&&RoundedArt.draw(ctx,x,y,player.dir,walk,true))return;classicCreature(x,y,name,walk);};
const classicPortraits=portraits;portraits=function(){classicPortraits();for(const c of document.querySelectorAll('[data-friend-art="Pip"]')){if(!RoundedArt.ready)continue;const g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);RoundedArt.draw(g,c.width/2,c.height-10,0,0,true,58);}};
const classicAppearance=appearance;appearance=function(){
 if(state.frontier.avatar.style==='classic'){classicAppearance();const b=document.createElement('button');b.dataset.spriteStyle='rounded';b.textContent='Use rounded-pixel traveller';document.querySelector('.dialog').append(b);return;}
 panel('Your traveller','<canvas class="avatar-preview" id="rounded-preview" width="160" height="160" aria-label="Rounded-pixel traveller preview"></canvas><p class="panel-note">Rounded pixel · Terracotta jacket, mint scarf and a trail-ready backpack.</p><div class="actions"><button data-ui="close">Ready to explore</button><button data-sprite-style="classic">Classic wardrobe</button></div>','Rounded pixel · Style C','appearance');
 const g=document.getElementById('rounded-preview').getContext('2d');RoundedArt.draw(g,80,145,0,0,false,126);
};
app.addEventListener('click',e=>{const b=e.target.closest('[data-sprite-style]');if(!b)return;if(SaveStore.status().blocked){saveMenu();return;}state.frontier.avatar.style=b.dataset.spriteStyle==='classic'?'classic':'rounded';save();appearance();});
