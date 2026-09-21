(function(root){
'use strict';
// The supplied settlement scene is 70 x 40 source cells.  Its collision data
// drives this world directly, so the visible paths and the walkable paths stay
// in lockstep.
function makeSettlement(){
 const T=32,cols=70,rows=40,data=typeof collisions!=='undefined'?collisions:[];
 const tiles=Array.from({length:rows},(_,y)=>Array.from({length:cols},(_,x)=>data[y*cols+x]===1025?'tree':'grass'));
 const m={id:'valley',name:'Willowmere Settlement',w:cols,h:rows,inside:false,tiles,objects:[],portals:[],npcs:[],settlement:true};
 // These positions sit on open map cells and become the social layer for the
 // settlement. They are not used as invisible collision props.
 m.npcs.push({name:'Mara',kind:'human',x:23*T+16,y:17*T+16},{name:'Nell',kind:'human',x:29*T+16,y:22*T+16});
 return m;
}
const previous=root.World.createWorld;
root.World.createWorld=()=>{const worlds=previous();worlds.valley=makeSettlement();return worlds;};
root.SettlementWorld={makeSettlement};
})(globalThis);
