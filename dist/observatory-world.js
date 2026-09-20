(function(root){
'use strict';
function expand(w){
 const T=32,m=w.observatory;
 const add=(type,x,y,extra={})=>m.objects.push({id:'observatory-'+type+'-'+x+'-'+y,type,x:x*T+16,y:y*T+16,...extra});
 for(const[i,x,y]of [[0,15,8],[1,9,25],[2,20,33]])add('observatoryMarker',x,y,{marker:i});
 add('observatoryNest',14,18);
 add('sign',30,33,{text:'STARLIGHT PLATEAU\nSage keeps a small camp near the old dome.'});
 return w;
}
const api={expand};if(typeof module!=='undefined')module.exports=api;else{root.ObservatoryWorld=api;const base=root.World.createWorld;root.World.createWorld=()=>expand(base());}
})(globalThis);
