'use strict';
// 4x2 player atlas: front, left side, right three-quarter, back; idle/walk rows.
const RoundedArt={get ready(){return PlayerPixels.ready;},draw(g,x,y,dir=0,walk=0,companion=false,height=companion?22:38){if(companion)return drawCompanionPixels(g,'Pip',x,y,height,dir,walk);const row=walk&&Math.sin(walk)>0?1:0;return PlayerPixels.draw(g,row*4+Math.max(0,Math.min(3,dir)),x,y,height);}};
const classicHuman=human;human=function(x,y,npc=false,dir=0,walk=0){if(!npc&&state.frontier.avatar.style!=='classic'&&RoundedArt.draw(ctx,x,y,dir,walk))return;classicHuman(x,y,npc,dir,walk);};
const classicCreature=creature;creature=function(x,y,name,walk=0){const actual=name==='Pip'?state.life.active:name;if(actual==='Pip'&&RoundedArt.draw(ctx,x,y,player.dir,walk,true))return;classicCreature(x,y,name,walk);};
const classicPortraits=portraits;portraits=function(){classicPortraits();for(const c of document.querySelectorAll('[data-friend-art="Pip"]')){if(!RoundedArt.ready)continue;const g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);RoundedArt.draw(g,c.width/2,c.height-10,0,0,true,58);}};
const classicAppearance=appearance;appearance=function(){
 if(state.frontier.avatar.style==='classic'){classicAppearance();const b=document.createElement('button');b.dataset.spriteStyle='rounded';b.textContent='Use rounded-pixel traveller';document.querySelector('.dialog').append(b);return;}
 panel('Your traveller','<canvas class="avatar-preview" id="rounded-preview" width="160" height="160" aria-label="Rounded-pixel traveller preview"></canvas><p class="panel-note">Rounded pixel · Brown jacket, green scarf and a trail-ready backpack.</p><div class="actions"><button data-ui="close">Ready to explore</button><button data-sprite-style="classic">Classic wardrobe</button></div>','Rounded pixel · Style C','appearance');
 const g=document.getElementById('rounded-preview').getContext('2d');RoundedArt.draw(g,80,145,0,0,false,126);
};
app.addEventListener('click',e=>{const b=e.target.closest('[data-sprite-style]');if(!b)return;if(SaveStore.status().blocked){saveMenu();return;}state.frontier.avatar.style=b.dataset.spriteStyle==='classic'?'classic':'rounded';save();appearance();});
