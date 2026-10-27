import {randomUUID} from 'node:crypto';
import {validDate,positiveQuantity} from './validation.js';
export const species=['Bovino','Porcino','Ovino','Caprino','Equino','Ave','Otro'];
export function animalRoutes(app,db){
 db.exec(`CREATE TABLE IF NOT EXISTS animals(id TEXT PRIMARY KEY,user_id TEXT NOT NULL,tag TEXT NOT NULL,data TEXT NOT NULL,UNIQUE(user_id,tag)); CREATE TABLE IF NOT EXISTS animal_events(id TEXT PRIMARY KEY,animal_id TEXT NOT NULL,user_id TEXT NOT NULL,data TEXT NOT NULL);`);
 const fail=(res,error,status=400)=>res.status(status).json({error});
 const text=(v,max=100)=>typeof v==='string'&&v.trim().length>0&&v.trim().length<=max;
 const own=(id,user)=>db.prepare('SELECT * FROM animals WHERE id=? AND user_id=?').get(id,user);
 const view=a=>({id:a.id,tag:a.tag,...JSON.parse(a.data)});
 const events=(id,user)=>db.prepare('SELECT * FROM animal_events WHERE animal_id=? AND user_id=? ORDER BY rowid').all(id,user).map(e=>({id:e.id,...JSON.parse(e.data)})).sort((a,b)=>a.date.localeCompare(b.date));
 app.get('/api/animals',(req,res)=>res.json(db.prepare('SELECT * FROM animals WHERE user_id=? ORDER BY rowid DESC').all(req.user.id).map(view)));
 const save=(req,res)=>{
  let id=req.params.id;const previous=id&&own(id,req.user.id);if(id&&!previous)return fail(res,'Animal no encontrado.',404);
  if(!JSON.parse(req.user.profile).farm)return fail(res,'Registra primero tu finca en Mi perfil.');
  const{name,tag,species:kind,breed='',sex,date,birthDate='',status,weight='',notes=''}=req.body;
  if(!text(name)||!text(tag,40)||!species.includes(kind)||!['Hembra','Macho','Sin determinar'].includes(sex)||!validDate(date)||!['Activo','Vendido','Fallecido'].includes(status)||typeof breed!=='string'||breed.length>100||typeof notes!=='string'||notes.length>1000)return fail(res,'Revisa la identificación, especie, sexo, estado y fecha de ingreso.');
  if(birthDate&&(!validDate(birthDate)||birthDate>date))return fail(res,'La fecha de nacimiento debe ser válida y no posterior al ingreso.');
  if(weight!==''&&weight!=null&&(!positiveQuantity(weight)||Number(weight)>100000))return fail(res,'El peso debe ser mayor que cero y no superar 100000 kg.');
  if(id&&events(id,req.user.id).some(e=>e.date<date))return fail(res,'El ingreso no puede ser posterior a los eventos registrados.');
  const normalized=tag.trim().toUpperCase();const duplicate=db.prepare('SELECT id FROM animals WHERE user_id=? AND tag=?').get(req.user.id,normalized);if(duplicate&&duplicate.id!==id)return fail(res,'Ya tienes un animal con esa identificación.',409);
  const data={name:name.trim(),species:kind,breed:breed.trim(),sex,date,birthDate,status,weight:weight===''||weight==null?null:Number(weight),notes:notes.trim()};
  if(id)db.prepare('UPDATE animals SET tag=?,data=? WHERE id=? AND user_id=?').run(normalized,JSON.stringify(data),id,req.user.id);
  else{id='AN-'+randomUUID();db.prepare('INSERT INTO animals VALUES(?,?,?,?)').run(id,req.user.id,normalized,JSON.stringify(data));}
  res.status(previous?200:201).json({id,tag:normalized,...data});
 };
 app.post('/api/animals',save);app.put('/api/animals/:id',save);
 app.get('/api/animals/:id/events',(req,res)=>{if(!own(req.params.id,req.user.id))return fail(res,'Animal no encontrado.',404);res.json(events(req.params.id,req.user.id));});
 app.post('/api/animals/:id/events',(req,res)=>{
  const animal=own(req.params.id,req.user.id);if(!animal)return fail(res,'Animal no encontrado.',404);
  const{type,date,description,weight=''}=req.body;
  if(!['Vacunación','Desparasitación','Revisión veterinaria','Alimentación','Reproducción','Traslado','Otro'].includes(type)||!validDate(date)||date<JSON.parse(animal.data).date||!text(description,1000))return fail(res,'Completa tipo, descripción y una fecha entre el ingreso y hoy.');
  if(weight!==''&&weight!=null&&(!positiveQuantity(weight)||Number(weight)>100000))return fail(res,'El peso debe ser positivo y no superar 100000 kg.');
  const id=randomUUID(),data={type,date,description:description.trim(),weight:weight===''||weight==null?null:Number(weight)};
  db.prepare('INSERT INTO animal_events VALUES(?,?,?,?)').run(id,animal.id,req.user.id,JSON.stringify(data));res.status(201).json({id,...data});
 });
 app.get('/api/animals/:id/report',(req,res)=>{const animal=own(req.params.id,req.user.id);if(!animal)return fail(res,'Animal no encontrado.',404);res.json({animal:view(animal),producer:{name:req.user.name,profile:JSON.parse(req.user.profile)},events:events(animal.id,req.user.id),generatedAt:new Date().toISOString()});});
}
