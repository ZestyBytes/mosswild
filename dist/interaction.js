'use strict';
// Four directional, 30-pixel sprites. Foot position stays aligned with collision.
human=function(x,y,mara=false,dir=0,walk=0){
  const step=walk?Math.round(Math.sin(walk)*2):0,side=dir===1||dir===2,hair=mara?'#e3d4b3':'#6c4938',shirt=mara?'#a56d82':'#507b86';
  rr(x-7,y-2,15,4,'#20382c44');
  rr(x-5,y-7+step,4,7,'#39444b');rr(x+2,y-7-step,4,7,'#39444b');
  rr(x-6,y-17,13,12,shirt);rr(x-7,y-16-step,3,8,'#ddae7c');rr(x+6,y-16+step,3,8,'#ddae7c');
  rr(x-5,y-25,11,10,'#ecc28d');rr(x-6,y-28,13,5,hair);
  if(dir===3){
    rr(x-6,y-26,13,9,hair);rr(x-3,y-17,6,2,'#b98563');
    rr(x-4,y-15,9,10,'#ac8758');rr(x-3,y-14,7,3,'#ceb176');rr(x-1,y-8,3,2,'#e5ca84');
  }else if(side){
    const sx=dir===1?-1:1;rr(x-sx*4-1,y-24,3,8,hair);rr(x+sx*5-1,y-22,3,3,'#ecc28d');rr(x+sx*3-1,y-23,2,3,'#253c39');rr(x+sx*3-1,y-23,1,1,'#fff4d0');rr(x-sx*5-2,y-15,5,10,'#ac8758');
  }else{
    rr(x-4,y-23,2,3,'#253c39');rr(x+3,y-23,2,3,'#253c39');rr(x-4,y-23,1,1,'#fff4d0');rr(x+3,y-23,1,1,'#fff4d0');rr(x,y-19,2,1,'#aa7357');rr(x-4,y-16,9,2,'#d6a467');
  }
  if(!mara){rr(x-8,y-29,17,3,'#c6a25d');rr(x-5,y-33,11,5,'#e6c777');rr(x-5,y-29,11,2,'#98764b');}
};
const resourceInfo={berries:{verb:'Pick',name:'Berry bush',doing:'Picking ripe berries',time:.85,item:'berries',amount:3,color:'#e7919d'},log:{verb:'Chop',name:'Fallen timber',doing:'Chopping timber',time:1.8,item:'wood',amount:3,color:'#dbba81'},crystals:{verb:'Mine',name:'Moon crystal',doing:'Chipping moon crystal',time:2.2,item:'crystals',amount:2,color:'#c8b5ef'},fish:{verb:'Cast',name:'Fishing spot',doing:'Waiting for a bite…',time:2.4,item:'fish',amount:3,color:'#a1dce1'}};
let activity=null,bursts=[];
function faceTarget(o){const dx=o.x-player.x,dy=o.y-player.y;player.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?1:2):(dy<0?3:0);}
function cancelActivity(message){activity=null;if(message)toast(message);}
function completeActivity(){if(!activity)return;const a=activity,r=resourceInfo[a.o.type];activity=null;state[r.item]+=r.amount;state.xp+=5;state.cooldowns[a.o.id]=Date.now()+20000;bursts.push({x:a.o.x,y:a.o.y-10,t:1.5,label:`+${r.amount} ${r.item}`,color:r.color});toast(`${r.amount} ${r.item} added to your bag · +5 XP`);save();hud();}
function tickActivities(dt){
  bursts=bursts.filter(b=>(b.t-=dt)>0);
  if(!activity)return;const a=activity;
  if(dialog||transitioning||map.id!==a.area||Math.hypot(player.x-a.px,player.y-a.py)>8){cancelActivity('Stopped. Get into position and try again.');return;}
  a.elapsed+=dt;
  if(a.o.type==='fish'){if(a.elapsed>a.duration+2){cancelActivity('The fish slipped away. Cast again and reel when it bites!');}return;}
  if(a.elapsed>=a.duration)completeActivity();
}
function drawActivities(){
  ctx.save();ctx.translate(-Math.floor(camera.x),-Math.floor(camera.y));
  if(near&&!dialog){const o=near;rr(o.x-13,o.y+5,7,2,'#f6e5a4');rr(o.x+7,o.y+5,7,2,'#f6e5a4');rr(o.x-13,o.y+1,2,5,'#f6e5a4');rr(o.x+12,o.y+1,2,5,'#f6e5a4');}
  if(activity){const a=activity,r=resourceInfo[a.o.type],x=player.x,y=player.y-42,p=Math.min(a.elapsed/a.duration,1);rr(x-20,y,40,5,'#2b4739');rr(x-19,y+1,Math.round(38*p),3,p===1?'#f2d179':'#b7d780');
    if(a.o.type==='log'||a.o.type==='crystals'){const swing=Math.sin(a.elapsed*12)*5;rr(x+10,player.y-18+swing,3,16,'#b78b55');rr(x+8,player.y-20+swing,a.o.type==='log'?10:16,5,'#bec9c3');for(let i=0;i<3;i++)rr(a.o.x+Math.sin(a.elapsed*9+i)*15,a.o.y-6-Math.abs(Math.cos(a.elapsed*7+i))*15,2,2,r.color);}
    else if(a.o.type==='fish'){rr(x+9,player.y-28,2,22,'#c9a974');rr(a.o.x+15,a.o.y-27+Math.sin(clockTime*5)*2,3,4,'#e6b493');text(p===1?'BITE! REEL NOW':'…',a.o.x,a.o.y-39,p===1?'#ffdd79':'#fff0cd',10);}
    else for(let i=0;i<3;i++)rr(a.o.x+Math.sin(a.elapsed*8+i)*10,a.o.y-10-Math.abs(Math.sin(a.elapsed*4+i))*15,3,3,r.color);
  }
  for(const b of bursts)text(b.label,b.x,b.y-(1.5-b.t)*17,b.color,10);
  ctx.restore();
}
function interactionHUD(){
 const btn=document.getElementById('action'),label=document.getElementById('near');
 if(activity){const a=activity,bite=a.o.type==='fish'&&a.elapsed>=a.duration;btn.disabled=false;btn.innerHTML=(bite?'Reel!':a.o.type==='fish'?'Wait…':'Stop')+'<small>E / A</small>';btn.setAttribute?.('aria-label',bite?'Reel in fish':a.o.type==='fish'?'Wait for a bite':'Stop gathering');label.textContent=bite?'A bite! Reel in now':resourceInfo[a.o.type].doing;return;}
 if(!near)return;const r=resourceInfo[near.type],remaining=Math.ceil(((state.cooldowns[near.id]||0)-Date.now())/1000);let verb=r?.verb||({sign:'Read',chest:'Collect',workbench:'Build',journal:'Journal',bed:'Rest'}[near.type])||(near.kind==='human'?'Talk':'Approach');if(r&&remaining>0){verb='Wait';label.textContent=`${r.name} · ready in ${remaining}s`;btn.disabled=true;}else label.textContent=near.name||r?.name||label.textContent;btn.innerHTML=verb+'<small>E / A</small>';btn.setAttribute?.('aria-label',verb+' '+(near.name||r?.name||near.type));
}
const originalInteract=interact;
interact=function(){
 if(dialog||transitioning)return;
 if(activity){if(activity.o.type==='fish'){if(activity.elapsed>=activity.duration)completeActivity();else cancelActivity('Too soon! Wait for the “BITE!” prompt before reeling.');}else cancelActivity('Stopped gathering.');return;}
 const o=nearest();if(o)faceTarget(o);
 if(o&&resourceInfo[o.type]){if((state.cooldowns[o.id]||0)>Date.now()){toast('This spot needs a little time to recover.');return;}activity={o,elapsed:0,duration:resourceInfo[o.type].time,area:map.id,px:player.x,py:player.y};return;}
 if(o?.type==='chest'){accrue();let total=0;for(const k of Object.keys(rates)){const n=Math.floor(state.bank[k]||0);state[k]+=n;state.bank[k]-=n;total+=n;}bursts.push({x:o.x,y:o.y-18,t:1.5,label:total?`+${total} supplies`:'Still gathering',color:'#edce83'});toast(total?`Collected ${total} supplies left by your companions.`:'Your companions are still gathering. Check tasks in Bag / Camp.');save();return;}
 originalInteract();
};
const originalObject=object;object=function(o){if(o.type==='log'&&(state.cooldowns[o.id]||0)>Date.now()){rr(o.x-9,o.y-3,18,5,'#b29667');rr(o.x-5,o.y-5,8,2,'#e3ca8d');return;}originalObject(o);};
const creatureTemperaments={
 Emberkin:{trait:'Playful · easily bored',clues:['It drops a twig at your feet and bounces on its paws.','It circles you, tail wagging, waiting for another game.'],actions:[['toss','Toss a twig'],['still','Stand quietly'],['chase','Chase its tail']],best:['toss','toss'],good:'It bounds after the twig and brings it back!',bad:'It tilts its head. It seems to want a game, not a quiet greeting.'},
 Dewdrop:{trait:'Timid · responds to patience',clues:['It retreats to the water when you move. Give it some space.','It peeks over a lily pad. A quiet tune might reassure it.'],actions:[['still','Sit quietly'],['hum','Hum softly'],['splash','Splash the pond']],best:['still','hum'],good:'It drifts closer, leaving tiny ripples behind.',bad:'It flinches and backs away. Slow, quiet movements feel safer.'},
 Lunamoth:{trait:'Curious · drawn to light',clues:['Its antennae follow the glint from your lantern.','It traces a slow circle in the air. Try matching the movement.'],actions:[['light','Raise your lantern'],['circle','Trace a slow circle'],['clap','Clap your hands']],best:['light','circle'],good:'Its wings glow softly as it mirrors you.',bad:'Its wings fold. Watch the way it moves and try something gentler.'}
};
encounterDialog=function(){const e=encounter,t=creatureTemperaments[e.name];show(e.name,`<canvas id="portrait" width="48" height="48" class="portrait" aria-label="${e.name}"></canvas><p class="temperament">${t.trait}</p><p>${e.message||t.clues[Math.min(e.trust,1)]}</p>${e.trust<2&&e.message?`<p><i>${t.clues[e.trust]}</i></p>`:''}<p>${e.trust>=2?'It chooses to stay by your side. Offer a berry to seal the friendship.':`Trust ${e.trust} / 2 · Read its body language`}</p><div class="health"><div style="width:${e.trust*50}%"></div></div><div class="actions social">${e.trust<2?t.actions.map(([key,label])=>`<button data-social="${key}">${label}</button>`).join(''):`<button data-ui="befriend" ${state.berries<1?'disabled':''}>Offer a berry (${state.berries})</button>`}<button data-ui="close">Give it space</button></div>`,'Wild encounter');const c=document.getElementById('portrait').getContext('2d');c.fillStyle=colors[e.name];c.fillRect(10,15,28,25);c.fillRect(8,5,8,17);c.fillRect(31,5,8,17);c.fillStyle='#324d39';c.fillRect(15,24,3,4);c.fillRect(30,24,3,4);c.fillRect(23,32,3,2);};
function socialChoice(choice){if(!encounter||encounter.trust>=2)return;const t=creatureTemperaments[encounter.name];if(!t.actions.some(a=>a[0]===choice))return;if(choice===t.best[encounter.trust]){encounter.trust++;encounter.message=t.good;}else{encounter.trust=Math.max(0,encounter.trust-1);encounter.message=t.bad;}encounterDialog();}
app.addEventListener('click',e=>{const b=e.target.closest('[data-social]');if(b)socialChoice(b.dataset.social);});
const previousShow=show;show=function(title,body,kicker){cancelActivity();previousShow(title,body,kicker);};
const previousReset=resetInput;resetInput=function(){cancelActivity();previousReset();};
