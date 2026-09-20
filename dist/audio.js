'use strict';
// Original procedural score: soft electric-piano chords, bass and a brushed beat.
// No downloads, copyrighted recordings or third-party requests.
const GameAudio=(()=>{
 let context=null,musicBus=null,ambientBus=null,sfxBus=null,master=null,timer=null,next=0,step=0;
 let prefs={music:false,effects:true,volume:.26,theme:'auto',ambient:true,ambientVolume:.2};try{prefs={...prefs,...JSON.parse(localStorage.getItem('mosswild-audio')||'{}')};}catch{}
 prefs.volume=Math.max(0,Math.min(1,Number(prefs.volume)||0));let unlocked=false;
 function remember(){try{localStorage.setItem('mosswild-audio',JSON.stringify(prefs))}catch{}}
 async function unlock(){try{if(!context){const C=window.AudioContext||window.webkitAudioContext;if(!C)return false;context=new C();master=context.createGain();master.gain.value=.7;const limiter=context.createDynamicsCompressor();limiter.threshold.value=-12;limiter.ratio.value=6;master.connect(limiter);limiter.connect(context.destination);musicBus=context.createGain();ambientBus=context.createGain();ambientBus.connect(master);sfxBus=context.createGain();musicBus.connect(master);sfxBus.connect(master);applyVolume();}await context.resume();unlocked=true;if(!timer){next=context.currentTime+.08;timer=setInterval(schedule,90);}return true;}catch{return false;}}
 function applyVolume(){if(ambientBus)ambientBus.gain.setTargetAtTime(prefs.ambient?Math.max(0,Math.min(1,Number(prefs.ambientVolume)||0)):0,context.currentTime,.2);if(musicBus)musicBus.gain.setTargetAtTime(prefs.music?prefs.volume:0,context.currentTime,.12);if(sfxBus)sfxBus.gain.setTargetAtTime(prefs.effects?.45:0,context.currentTime,.03);}
 function tone(freq,time,duration,volume,bus,type='sine'){if(!context)return;const o=context.createOscillator(),g=context.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(0,time);g.gain.linearRampToValueAtTime(volume,time+.012);g.gain.exponentialRampToValueAtTime(.0001,time+duration);o.connect(g);g.connect(bus);o.start(time);o.stop(time+duration+.02);o.onended=()=>{o.disconnect();g.disconnect()};}
 function noise(time,duration,volume,cutoff,bus=musicBus){const length=Math.ceil(context.sampleRate*duration),buffer=context.createBuffer(1,length,context.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*(1-i/length);const n=context.createBufferSource(),filter=context.createBiquadFilter(),g=context.createGain();n.buffer=buffer;filter.type='lowpass';filter.frequency.value=cutoff;g.gain.value=volume;n.connect(filter);filter.connect(g);g.connect(bus);n.start(time);n.onended=()=>{n.disconnect();filter.disconnect();g.disconnect()};}
 const scores=[
 {id:'village',name:'Willowmere mornings',bpm:72,chords:[[48,55,59,62],[45,52,55,59],[53,57,60,64],[43,50,57,59],[48,52,55,62],[50,53,57,60],[41,48,55,57],[43,50,53,59]]},
 {id:'forest',name:'Letters from the grove',bpm:66,chords:[[45,52,55,60],[41,48,52,57],[48,55,59,64],[43,50,55,59],[45,48,52,59],[50,53,57,62],[41,48,52,60],[40,47,52,56]]},
 {id:'water',name:'A slow river',bpm:78,chords:[[50,57,60,64],[43,50,53,59],[48,55,59,62],[45,52,55,60],[53,60,64,67],[52,59,62,67],[50,57,60,65],[43,50,55,59]]},
 {id:'night',name:'Lanterns after dusk',bpm:60,chords:[[45,52,59,60],[48,55,59,64],[41,48,55,57],[40,47,55,59],[45,48,52,59],[43,50,57,62],[41,48,52,59],[40,47,52,56]]}];
 const hz=n=>440*Math.pow(2,(n-69)/12);let scene='village',isNight=false,ambientArea='valley';
 function score(){const base=isNight?'night':scene;return prefs.theme==='auto'?scores[(scores.findIndex(s=>s.id===base)+Math.floor(step/512))%scores.length]:scores.find(s=>s.id===prefs.theme)||scores[0];}
 function setScene(area,night){ambientArea=area;const nextScene=['riverbank','coast'].includes(area)?'water':['grove','marsh','orchard'].includes(area)?'forest':['cavern','observatory','highlands'].includes(area)?'night':'village';if(nextScene===scene&&night===isNight)return;scene=nextScene;isNight=night;if(context&&prefs.music){musicBus.gain.setTargetAtTime(prefs.volume*.6,context.currentTime,.3);setTimeout(applyVolume,900);}}
 function setTheme(theme){if(theme!=='auto'&&!scores.some(s=>s.id===theme))return;prefs.theme=theme;step=0;if(context)next=context.currentTime+.2;remember();}
 function schedule(){if(!context||context.state!=='running'||document.hidden||(!prefs.music&&!prefs.ambient)){if(context)next=context.currentTime+.1;return;}if(next<context.currentTime)next=context.currentTime+.02;let scheduled=0;while(next<context.currentTime+.25&&scheduled++<4){const song=score(),bar=Math.floor(step/16),section=Math.floor(bar/8)%4,chord=song.chords[bar%8],pos=step%16,rest=bar%8===7;
 if(prefs.ambient&&pos===0&&!['home','cottage','tessa','cavern'].includes(ambientArea)){noise(next,2.8,.05,scene==='water'?1000:450,ambientBus);if(!isNight&&bar%4===1){tone(1460,next+.7,.18,.045,ambientBus);tone(1800,next+.93,.14,.028,ambientBus);}}
 if(prefs.music&&!rest){if(pos===0){chord.forEach((n,i)=>tone(hz(n+12),next+i*.04,3.2,.038,musicBus));}if(pos===0||pos===8)tone(hz(chord[0]-12),next,.8,.07,musicBus,'triangle');if(song.id!=='night'&&section!==3){if(pos===0)tone(58,next,.18,.07,musicBus);if(pos===4||pos===12)noise(next,.12,.022,1250);if(pos===7||pos===15)noise(next,.06,.009,3200);}
 const patterns=[[0,6,10],[2,8],[0,4,11,14],[3,10]],pattern=patterns[(bar+section)%4];if(pattern.includes(pos)&&section!==3){const note=chord[(Math.floor(pos/3)+bar)%4]+24+(bar%4===2?12:0);tone(hz(note),next,1.4,.025,musicBus,song.id==='water'?'sine':'triangle');}if(section===3&&pos===0)tone(hz(chord[2]+24),next,3,.022,musicBus);}
 next+=60/song.bpm/4+(pos%2===0?.009:-.009);step++;}}
 function sfx(kind='tap'){if(!unlocked||!context||context.state!=='running'||!prefs.effects||document.hidden)return;const t=context.currentTime;
 const tunes={tap:[520],pick:[650,830],chop:[130,95],mine:[950,1300],fish:[390,590,780],door:[210,310],success:[523,659,784,1047],wrong:[280,220],bite:[850,1100]};(tunes[kind]||tunes.tap).forEach((f,i)=>tone(f,t+i*.07,kind==='chop'?.08:.22,kind==='success'?.065:.045,sfxBus,kind==='chop'?'triangle':'sine'));}
 async function setMusic(on){const ok=await unlock();if(!ok)return false;prefs.music=on;next=context.currentTime+.08;applyVolume();remember();return true;}
 function setAmbient(on){prefs.ambient=on;applyVolume();remember();}
 function setAmbientVolume(v){prefs.ambientVolume=Math.max(0,Math.min(1,Number(v)||0));applyVolume();remember();}
 function setEffects(on){prefs.effects=on;applyVolume();remember();}
 function setVolume(v){prefs.volume=Math.max(0,Math.min(1,Number(v)));applyVolume();remember();}
 document.addEventListener('visibilitychange',()=>{if(!context)return;if(document.hidden)context.suspend().catch(()=>{});else if(unlocked)context.resume().then(()=>{next=context.currentTime+.1}).catch(()=>{});});
 return {unlock,sfx,setMusic,setEffects,setVolume,setScene,setTheme,setAmbient,setAmbientVolume,get track(){return score().name;},get themes(){return scores.map(s=>({id:s.id,name:s.name}));},get settings(){return {...prefs}},get status(){return {available:!!(window.AudioContext||window.webkitAudioContext),state:context?.state||'locked'}}};
})();

