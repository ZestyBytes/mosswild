(function(root){
'use strict';
function expand(w){
 const T=32,m=w.marsh;
 const add=(type,x,y,extra={})=>m.objects.push({id:'marsh-'+type+'-'+x+'-'+y,type,x:x*T+16,y:y*T+16,...extra});
 for(const[i,x,y]of [[0,15,8],[1,9,25],[2,20,33]])add('marshMarker',x,y,{marker:i});
 add('marshNest',14,18);
 add('sign',30,33,{text:'FERNWATER MARSH\nIris keeps a small camp near the old crossing.'});
 return w;
}
const api={expand};if(typeof module!=='undefined')module.exports=api;else{root.MarshWorld=api;const base=root.World.createWorld;root.World.createWorld=()=>expand(base());}
})(globalThis);
