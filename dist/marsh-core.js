(function(root){
'use strict';
const chapters=[
 ['A wetland keeper’s welcome','Find Iris among the reeds.','talk'],
 ['Sunken boardwalk posts','Find the three sunken posts marking the old boardwalk route.','marker'],
 ['Fresh herbs','Pick 12 fresh wild herbs after finding the posts, then return to Iris.','herb'],
 ['Mend the boardwalk','Bring 40 timber and 12 herbs to the old boardwalk crossing.','repair'],
 ['Something in the shallows','Follow the reed trail to the quiet shallows. Make friends with Fennel.','friend'],
 ['The marsh opens up','Return to Iris to celebrate the boardwalk’s repair.','finish']
];
function act(s,action,id){const q=s.marsh;if(!q)return false;
 if(action==='talk'&&q.stage===0){q.stage=1;return true;}
 if(action==='marker'&&q.stage===1&&Number.isInteger(id)&&id>=0&&id<3&&!q.markers.includes(id)){q.markers.push(id);if(q.markers.length===3){q.herbStart=s.frontier.gathered.herbs;q.stage=2;}return true;}
 if(action==='herb'&&q.stage===2&&s.frontier.gathered.herbs-q.herbStart>=12){q.stage=3;return true;}
 if(action==='repair'&&q.stage===3){if(!s.frontier.projects.boardwalk){if(s.wood<40||s.herbs<12)return false;s.wood-=40;s.herbs-=12;}q.stage=4;return true;}
 if(action==='friend'&&q.stage===4&&s.team.includes('Fennel')){q.stage=5;return true;}
 if(action==='finish'&&q.stage===5){q.stage=6;s.frontier.projects.boardwalk=true;s.frontier.marks+=3;s.herbs+=6;s.coins+=100;s.xp+=80;return true;}
 return false;
}
const api={chapters,act};if(typeof module!=='undefined')module.exports=api;else root.MarshCore=api;
})(globalThis);
