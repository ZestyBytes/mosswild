(function(root){
  function expand(world){const T=32;
    const rect=(m,x,y,w,h,t)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)m.tiles[j][i]=t;};
    const make=(id,name,w,h,cave=false)=>({id,name,w,h,inside:cave,tiles:Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>x===0||y===0||x===w-1||y===h-1?(cave?'wall':'tree'):(cave?'cavefloor':'grass'))),objects:[],portals:[],npcs:[]});
    const add=(m,type,x,y,extra={})=>m.objects.push({id:m.id+'-'+type+'-'+x+'-'+y,type,x:x*T+16,y:y*T+16,...extra});
    const door=(m,x,y,w,h,to,tx,ty,label)=>{rect(m,x,y,w,h,'path');m.portals.push({x:x*T,y:y*T,w:w*T,h:h*T,to,tx:tx*T+16,ty:ty*T+16,label});};
    const meadow=world.meadow;rect(meadow,30,1,3,25,'water');rect(meadow,28,12,2,3,'path');door(meadow,33,12,1,3,'riverbank',2,16,'Whispering Riverbank →');add(meadow,'bridge',29,13);add(meadow,'sign',27,15,{text:'WHISPERING RIVERBANK →\nThe old bridge needs 12 wood and Emberkin’s help.'});
    const river=make('riverbank','Whispering Riverbank',42,32);rect(river,1,15,40,3,'path');rect(river,19,4,3,25,'path');rect(river,31,1,10,29,'water');rect(river,28,1,3,29,'sand');door(river,0,15,1,3,'meadow',28,13,'← Sunlit Meadow');
    for(const [x,y]of [[4,4],[7,6],[11,3],[15,8],[6,24],[10,26],[14,23],[24,24],[25,7],[4,10]])add(river,'tree',x,y,{solid:true});
    for(const [x,y]of [[9,11],[13,20],[23,19]])add(river,'berries',x,y);for(const [x,y]of [[9,22],[15,12],[23,27]])add(river,'log',x,y);add(river,'fish',29,12);add(river,'fish',29,23);add(river,'cache',6,27);add(river,'campfire',18,19);add(river,'sign',6,14,{text:'THE RIVER REMEMBERS\nNell fishes east of here. A hidden supply chest rests southwest.\nThe sealed cavern is north.'});
    rect(river,17,2,7,3,'building');add(river,'caveEntrance',20,3);add(river,'seal',20,5);door(river,20,4,1,1,'cavern',12,18,'Lantern Cavern');
    for(const [x,y]of [[16,13],[23,13],[17,22],[23,22],[10,18],[7,12],[25,10],[24,29]])add(river,'wildflowers',x,y);
    for(const [x,y]of [[30,6],[30,9],[30,18],[30,26]])add(river,'reeds',x,y);
    for(const [x,y]of [[16,8],[24,9],[12,24]])add(river,'boulder',x,y,{solid:true});
    river.npcs.push({name:'Nell',kind:'human',x:27*T+16,y:18*T+16});
    const cave=make('cavern','Lantern Cavern',26,24,true);door(cave,11,23,3,1,'riverbank',20,6,'Whispering Riverbank');rect(cave,11,4,3,19,'cavepath');rect(cave,4,10,18,3,'cavepath');rect(cave,3,4,5,4,'water');rect(cave,18,16,5,4,'water');
    for(const [x,y]of [[3,12],[5,15],[8,5],[18,5],[21,9],[6,20],[17,20]])add(cave,'crystals',x,y);for(const [x,y]of [[8,9],[18,14],[6,17],[22,4]])add(cave,'boulder',x,y,{solid:true});add(cave,'beacon',12,6);add(cave,'sign',15,19,{text:'THE LANTERN CHAMBER\nOffer 5 moon crystals to awaken the beacon.\nIts blessing improves every gathering action.'});
    world.riverbank=river;world.cavern=cave;return world;
  }
  function apply(world,progress={}){for(let y=12;y<15;y++)for(let x=30;x<33;x++)world.meadow.tiles[y][x]=progress.bridge?'bridgefloor':'water';world.riverbank.tiles[4][20]=progress.seal?'path':'building';}
  const api={expand,apply};if(typeof module!=='undefined')module.exports=api;else{root.ExpansionWorld=api;const base=root.World.createWorld;root.World.createWorld=()=>expand(base());}
})(globalThis);
