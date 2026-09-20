// Identity is supplied by the authenticated Sites dispatcher, never by the save body.
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
function database(env){if(!env.DB)throw Error('Save database is unavailable');return env.DB;}
async function current(db,user){return db.prepare('SELECT snapshot, revision, updated_at FROM saves WHERE user_id = ?').bind(user).first();}
const view=(row,user)=>({account:user,save:row?JSON.parse(row.snapshot):null,revision:row?.revision||0,updatedAt:row?.updated_at||null});
export async function api(request,env,validate){
 const user=request.headers.get('oai-authenticated-user-id');if(!user)return json({error:'Sign in to back up your adventure.'},401);
 if(!['GET','PUT'].includes(request.method))return json({error:'Method not allowed'},405);
 if(request.method==='PUT'){
  const origin=request.headers.get('Origin');if(origin&&origin!==new URL(request.url).origin)return json({error:'Origin not allowed'},403);
  if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'Expected JSON'},415);
 }
 try{const db=database(env);if(request.method==='GET')return json(view(await current(db,user),user));
  // Stream with a hard byte cap; do not allocate an unbounded request body.
  const reader=request.body?.getReader();if(!reader)return json({error:'Missing save'},400);let size=0,chunks=[];while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>100000){await reader.cancel();return json({error:'Save too large'},413);}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  let body,snapshot;try{body=JSON.parse(new TextDecoder().decode(bytes));if(!Number.isInteger(body.revision)||body.revision<0)throw Error();snapshot=JSON.stringify(validate(body.state));}catch{return json({error:'Invalid save'},400);}
  if(body.account!==user)return json(view(await current(db,user),user),409);
  const now=Date.now();let result;
  if(body.revision===0)result=await db.prepare('INSERT INTO saves (user_id,snapshot,revision,updated_at) VALUES (?,?,1,?) ON CONFLICT(user_id) DO NOTHING').bind(user,snapshot,now).run();
  else result=await db.prepare('UPDATE saves SET previous=snapshot,snapshot=?,revision=revision+1,updated_at=? WHERE user_id=? AND revision=?').bind(snapshot,now,user,body.revision).run();
  if(!result.meta.changes)return json(view(await current(db,user)),409);
  return json({revision:body.revision+1,updatedAt:now});
 }catch(error){console.error('Save service failed',error?.message);return json({error:'Cloud saves are temporarily unavailable. Your device copy is safe.'},503);}
}
