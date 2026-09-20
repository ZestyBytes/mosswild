(function(root){
'use strict';
const chapters=[
 ['A harbour keeper’s welcome','Find Kai along the tideline.','talk'],
 ['Driftwood tide markers','Find the three driftwood markers along the shore.','marker'],
 ['Fresh shells','Collect 12 fresh tide shells after finding the markers, then return to Kai.','shell'],
 ['Mend the harbour','Bring 40 timber and 12 shells to the old harbour wall.','repair'],
 ['Something in the tide pools','Follow the shoreline south to the quiet tide pools. Make friends with Pearl.','friend'],
 ['The harbour reopens','Return to Kai to celebrate the harbour’s repair.','finish']
];
function act(s,action,id){const q=s.coast;if(!q)return false;
 if(action==='talk'&&q.stage===0){q.stage=1;return true;}
 if(action==='marker'&&q.stage===1&&Number.isInteger(id)&&id>=0&&id<3&&!q.markers.includes(id)){q.markers.push(id);if(q.markers.length===3){q.shellStart=s.frontier.gathered.shells;q.stage=2;}return true;}
 if(action==='shell'&&q.stage===2&&s.frontier.gathered.shells-q.shellStart>=12){q.stage=3;return true;}
 if(action==='repair'&&q.stage===3){if(!s.frontier.projects.harbour){if(s.wood<40||s.shells<12)return false;s.wood-=40;s.shells-=12;}q.stage=4;return true;}
 if(action==='friend'&&q.stage===4&&s.team.includes('Pearl')){q.stage=5;return true;}
 if(action==='finish'&&q.stage===5){q.stage=6;s.frontier.projects.harbour=true;s.frontier.marks+=3;s.shells+=6;s.coins+=100;s.xp+=80;return true;}
 return false;
}
const api={chapters,act};if(typeof module!=='undefined')module.exports=api;else root.CoastCore=api;
})(globalThis);
