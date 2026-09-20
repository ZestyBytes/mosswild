'use strict';
// Original procedural score: soft electric-piano chords, bass and a brushed beat.
// No downloads, copyrighted recordings or third-party requests.
const GameAudio=(()=>{
 let context=null,musicBus=null,sfxBus=null,master=null,timer=null,next=0,step=0;
 let prefs={music:false,effects:true,volume:.32};try{prefs={...prefs,...JSON.parse(localStorage.getItem('mosswild-audio')||'{}')};}catch{}
 prefs.volume=Math.max(0,Math.min(1,Number(prefs.volume)||0));let unlocked=false;
 function remember(){try{localStorage.setItem('mosswild-audio',JSON.stringify(prefs))}catch{}}
 async function unlock(){try{if(!context){const C=window.AudioContext||window.webkitAudioContext;if(!C)return false;context=new C();master=context.createGain();master.gain.value=.7;const limiter=context.createDynamicsCompressor();limiter.threshold.value=-12;limiter.ratio.value=6;master.connect(limiter);limiter.connect(context.destination);musicBus=context.createGain();sfxBus=context.createGain();musicBus.connect(master);sfxBus.connect(master);applyVolume();}await context.resume();unlocked=true;if(!timer){next=context.currentTime+.08;timer=setInterval(schedule,90);}return true;}catch{return false;}}
 function applyVolume(){if(musicBus)musicBus.gain.setTargetAtTime(prefs.music?prefs.volume:0,context.currentTime,.12);if(sfxBus)sfxBus.gain.setTargetAtTime(prefs.effects?.45:0,context.currentTime,.03);}
 function tone(freq,time,duration,volume,bus,type='sine'){if(!context)return;const o=context.createOscillator(),g=context.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(0,time);g.gain.linearRampToValueAtTime(volume,time+.012);g.gain.exponentialRampToValueAtTime(.0001,time+duration);o.connect(g);g.connect(bus);o.start(time);o.stop(time+duration+.02);o.onended=()=>{o.disconnect();g.disconnect()};}
 function noise(time,duration,volume,cutoff){const length=Math.ceil(context.sampleRate*duration),buffer=context.createBuffer(1,length,context.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*(1-i/length);const n=context.createBufferSource(),filter=context.createBiquadFilter(),g=context.createGain();n.buffer=buffer;filter.type='lowpass';filter.frequency.value=cutoff;g.gain.value=volume;n.connect(filter);filter.connect(g);g.connect(musicBus);n.start(time);n.onended=()=>{n.disconnect();filter.disconnect();g.disconnect()};}
 const chords=[[48,55,59,62],[45,52,55,59],[41,48,52,57],[43,50,53,57]],melody=[72,null,71,67,null,64,67,null,69,null,67,64,null,62,64,null,65,null,69,72,null,69,67,null,67,null,65,62,null,59,62,null];
 const hz=n=>440*Math.pow(2,(n-69)/12);
 function schedule(){if(!context||context.state!=='running'||document.hidden||!prefs.music){if(context)next=context.currentTime+.1;return;}if(next<context.currentTime)next=context.currentTime+.02;let scheduled=0;while(next<context.currentTime+.25&&scheduled++<4){const chord=chords[Math.floor(step/16)%4],pos=step%16;if(pos===0){chord.forEach((n,i)=>{tone(hz(n+12),next+i*.025,2.5,.055,musicBus);tone(hz(n+24),next+i*.025,.7,.009,musicBus)});}if(pos%4===0)tone(hz(chord[0]-12),next,.5,.11,musicBus);if(pos===0||pos===8){tone(65,next,.15,.12,musicBus);}if(pos===4||pos===12)noise(next,.1,.055,1600);if(pos%2===1)noise(next,.045,.016,4000);const note=melody[step%32];if(note&&pos%2===0)tone(hz(note),next,.95,.036,musicBus,'triangle');next+=60/72/4+(pos%2===0?.012:-.012);step++;}}
 function sfx(kind='tap'){if(!unlocked||!context||context.state!=='running'||!prefs.effects||document.hidden)return;const t=context.currentTime;
 const tunes={tap:[520],pick:[650,830],chop:[130,95],mine:[950,1300],fish:[390,590,780],door:[210,310],success:[523,659,784,1047],wrong:[280,220],bite:[850,1100]};(tunes[kind]||tunes.tap).forEach((f,i)=>tone(f,t+i*.07,kind==='chop'?.08:.22,kind==='success'?.065:.045,sfxBus,kind==='chop'?'triangle':'sine'));}
 async function setMusic(on){const ok=await unlock();if(!ok)return false;prefs.music=on;next=context.currentTime+.08;applyVolume();remember();return true;}
 function setEffects(on){prefs.effects=on;applyVolume();remember();}
 function setVolume(v){prefs.volume=Math.max(0,Math.min(1,Number(v)));applyVolume();remember();}
 document.addEventListener('visibilitychange',()=>{if(!context)return;if(document.hidden)context.suspend().catch(()=>{});else if(unlocked)context.resume().then(()=>{next=context.currentTime+.1}).catch(()=>{});});
 return {unlock,sfx,setMusic,setEffects,setVolume,get settings(){return {...prefs}},get status(){return {available:!!(window.AudioContext||window.webkitAudioContext),state:context?.state||'locked'}}};
})();

