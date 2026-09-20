(function(root){
'use strict';
function expand(w){
 const T=32,m=w.highlands;
 const add=(type,x,y,extra={})=>m.objects.push({id:'highlands-'+type+'-'+x+'-'+y,type,x:x*T+16,y:y*T+16,...extra});
 for(const[i,x,y]of [[0,15,8],[1,40,10],[2,15,30]])add('highlandsMarker',x,y,{marker:i});
 add('highlandsNest',35,33);
 add('sign',44,33,{text:'COPPER HIGHLANDS\nRowan keeps a small camp near the old lift.'});
 return w;
}
const api={expand};if(typeof module!=='undefined')module.exports=api;else{root.HighlandsWorld=api;const base=root.World.createWorld;root.World.createWorld=()=>expand(base());}
})(globalThis);
