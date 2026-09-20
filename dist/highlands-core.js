(function(root){
'use strict';
const chapters=[
 ['A surveyor’s welcome','Find Rowan among the highland boulders.','talk'],
 ['Old survey markers','Find the three survey markers scattered across the highlands.','marker'],
 ['Fresh copper','Mine 12 fresh ore after finding the markers, then return to Rowan.','ore'],
 ['Mend the lift','Bring 40 timber and 12 ore to the old copper lift.','repair'],
 ['Something in the rocks','Follow the ridge trail to the quiet outcrop. Make friends with Talus.','friend'],
 ['The lift rises again','Return to Rowan to celebrate the lift’s repair.','finish']
];
function act(s,action,id){const q=s.highlands;if(!q)return false;
 if(action==='talk'&&q.stage===0){q.stage=1;return true;}
 if(action==='marker'&&q.stage===1&&Number.isInteger(id)&&id>=0&&id<3&&!q.markers.includes(id)){q.markers.push(id);if(q.markers.length===3){q.oreStart=s.frontier.gathered.ore;q.stage=2;}return true;}
 if(action==='ore'&&q.stage===2&&s.frontier.gathered.ore-q.oreStart>=12){q.stage=3;return true;}
 if(action==='repair'&&q.stage===3){if(!s.frontier.projects.lift){if(s.wood<40||s.ore<12)return false;s.wood-=40;s.ore-=12;}q.stage=4;return true;}
 if(action==='friend'&&q.stage===4&&s.team.includes('Talus')){q.stage=5;return true;}
 if(action==='finish'&&q.stage===5){q.stage=6;s.frontier.projects.lift=true;s.frontier.marks+=3;s.ore+=6;s.coins+=100;s.xp+=80;return true;}
 return false;
}
const api={chapters,act};if(typeof module!=='undefined')module.exports=api;else root.HighlandsCore=api;
})(globalThis);
