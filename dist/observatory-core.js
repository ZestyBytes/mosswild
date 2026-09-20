(function(root){
'use strict';
const chapters=[
 ['An astronomer’s welcome','Find Sage among the old telescopes.','talk'],
 ['Star-chart markers','Find the three star-chart markers scattered across the plateau.','marker'],
 ['Fresh crystals','Gather 12 fresh moon crystals after finding the markers, then return to Sage.','crystal'],
 ['Mend the observatory','Bring 40 timber and 12 crystals to the old observatory dome.','repair'],
 ['Something among the stars','Follow the ridge trail to the quiet skywatch. Make friends with Nova.','friend'],
 ['The observatory rekindles','Return to Sage to celebrate the observatory’s repair.','finish']
];
function act(s,action,id){const q=s.observatory;if(!q)return false;
 if(action==='talk'&&q.stage===0){q.stage=1;return true;}
 if(action==='marker'&&q.stage===1&&Number.isInteger(id)&&id>=0&&id<3&&!q.markers.includes(id)){q.markers.push(id);if(q.markers.length===3){q.crystalStart=s.frontier.gathered.crystals;q.stage=2;}return true;}
 if(action==='crystal'&&q.stage===2&&s.frontier.gathered.crystals-q.crystalStart>=12){q.stage=3;return true;}
 if(action==='repair'&&q.stage===3){if(!s.frontier.projects.observatory){if(s.wood<40||s.crystals<12)return false;s.wood-=40;s.crystals-=12;}q.stage=4;return true;}
 if(action==='friend'&&q.stage===4&&s.team.includes('Nova')){q.stage=5;return true;}
 if(action==='finish'&&q.stage===5){q.stage=6;s.frontier.projects.observatory=true;s.frontier.marks+=3;s.crystals+=6;s.coins+=100;s.xp+=80;return true;}
 return false;
}
const api={chapters,act};if(typeof module!=='undefined')module.exports=api;else root.ObservatoryCore=api;
})(globalThis);
