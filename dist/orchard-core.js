(function(root){
'use strict';
const chapters=[
 ['A botanist’s welcome','Find Tessa inside her cottage on the northeastern bend.','talk'],
 ['The forgotten notebook','Find the notebook beside the cottage steps.','journal'],
 ['A fresh start','Pick 8 fresh herbs after finding the notebook, then return to Tessa.','herbs'],
 ['Mend the nursery','Bring 40 timber and 8 herbs to the old nursery across the stream.','repair'],
 ['Water makes a home','Fill the watering can at the well south of the nursery. Water all three nursery beds.','water'],
 ['A rustle in the leaves','Follow the southern trail east to the quiet clearing. Make friends with Bramble.','friend'],
 ['The orchard awakens','Return to Tessa to celebrate the orchard’s new beginning.','finish']
];
function act(s,action,id){const q=s.orchard;if(!q)return false;
 if(action==='talk'&&q.stage===0){q.stage=1;return true;}
 if(action==='journal'&&q.stage===1){q.herbStart=s.frontier.gathered.herbs;q.stage=2;return true;}
 if(action==='herbs'&&q.stage===2&&s.frontier.gathered.herbs-q.herbStart>=8){q.stage=3;return true;}
 if(action==='repair'&&q.stage===3){if(!s.frontier.projects.nursery){if(s.wood<40||s.herbs<8)return false;s.wood-=40;s.herbs-=8;}q.stage=4;return true;}
 if(action==='fill'&&q.stage===4){q.water=3;return true;}
 if(action==='water'&&q.stage===4&&Number.isInteger(id)&&id>=0&&id<3&&!q.beds.includes(id)&&q.water>0){q.beds.push(id);q.water--;if(q.beds.length===3)q.stage=5;return true;}
 if(action==='friend'&&q.stage===5&&s.team.includes('Bramble')){q.stage=6;return true;}
 if(action==='finish'&&q.stage===6){q.stage=7;s.frontier.projects.nursery=true;s.frontier.marks+=3;s.life.seeds+=6;s.coins+=100;s.xp+=80;return true;}
 return false;
}
const api={chapters,act};if(typeof module!=='undefined')module.exports=api;else root.OrchardCore=api;
})(globalThis);
