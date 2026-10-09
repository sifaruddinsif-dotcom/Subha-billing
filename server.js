const express=require('express');
const path=require('path');
const Database=require('better-sqlite3');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const app=express();
const PORT=process.env.PORT||3000;
const JWT_SECRET=process.env.JWT_SECRET||'subha-billing-change-me';
const db=new Database(process.env.DB_PATH||path.join(__dirname,'subha-billing.db'));
db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL,role TEXT DEFAULT 'admin',created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT);
CREATE TABLE IF NOT EXISTS customers(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,phone TEXT,address TEXT,gstin TEXT,state TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS suppliers(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,phone TEXT,address TEXT,gstin TEXT,state TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,sku TEXT UNIQUE,barcode TEXT UNIQUE,category TEXT,unit TEXT DEFAULT 'PCS',hsn TEXT,purchase_price REAL DEFAULT 0,sale_price REAL DEFAULT 0,gst REAL DEFAULT 18,stock REAL DEFAULT 0,min_stock REAL DEFAULT 0,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS invoices(id INTEGER PRIMARY KEY AUTOINCREMENT,invoice_no TEXT UNIQUE NOT NULL,customer_id INTEGER,subtotal REAL DEFAULT 0,discount REAL DEFAULT 0,taxable REAL DEFAULT 0,cgst REAL DEFAULT 0,sgst REAL DEFAULT 0,igst REAL DEFAULT 0,roundoff REAL DEFAULT 0,total REAL DEFAULT 0,paid REAL DEFAULT 0,status TEXT DEFAULT 'Pending',payment_mode TEXT DEFAULT 'Cash',notes TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(customer_id) REFERENCES customers(id));
CREATE TABLE IF NOT EXISTS invoice_items(id INTEGER PRIMARY KEY AUTOINCREMENT,invoice_id INTEGER,product_id INTEGER,name TEXT,qty REAL,rate REAL,gst REAL,discount REAL DEFAULT 0,taxable REAL,tax REAL,total REAL,FOREIGN KEY(invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,FOREIGN KEY(product_id) REFERENCES products(id));
CREATE TABLE IF NOT EXISTS purchases(id INTEGER PRIMARY KEY AUTOINCREMENT,purchase_no TEXT UNIQUE NOT NULL,supplier_id INTEGER,total REAL DEFAULT 0,paid REAL DEFAULT 0,status TEXT DEFAULT 'Pending',notes TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(supplier_id) REFERENCES suppliers(id));
CREATE TABLE IF NOT EXISTS purchase_items(id INTEGER PRIMARY KEY AUTOINCREMENT,purchase_id INTEGER,product_id INTEGER,qty REAL,rate REAL,gst REAL,total REAL,FOREIGN KEY(purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,FOREIGN KEY(product_id) REFERENCES products(id));
CREATE TABLE IF NOT EXISTS payments(id INTEGER PRIMARY KEY AUTOINCREMENT,customer_id INTEGER,invoice_id INTEGER,amount REAL,mode TEXT,reference TEXT,note TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(customer_id) REFERENCES customers(id),FOREIGN KEY(invoice_id) REFERENCES invoices(id));
`);
try{db.exec("ALTER TABLE invoice_items ADD COLUMN gst_mode TEXT DEFAULT 'EXCLUDING'");}catch(e){}
const defaults={business_name:'P.M. ENTERPRISE',tagline:'GST Tax Invoice',gstin:'18BKXPA2291M1ZJ',address:'HAFLONG BAZAR MASJID ROAD. DIMA HASAO DISTRICT ASSAM 788819',phone:'',email:'',invoice_prefix:'PME',state:'Assam',bank_name:'Central Bank of India',bank_account:'5408691136',ifsc:'CBIN0284634',branch:'Haflong'};
const insSet=db.prepare('INSERT OR IGNORE INTO settings(key,value) VALUES(?,?)'); for(const [k,v] of Object.entries(defaults)) insSet.run(k,v);
const updSet=db.prepare('UPDATE settings SET value=? WHERE key=?'); for(const [k,v] of Object.entries(defaults)) updSet.run(v,k);
const adminEmail=process.env.ADMIN_EMAIL||'admin@subhabilling.com';
if(!db.prepare('SELECT id FROM users WHERE email=?').get(adminEmail)){db.prepare('INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)').run('Admin',adminEmail,bcrypt.hashSync(process.env.ADMIN_PASSWORD||'ChangeMe123!',10),'admin');}


app.use(express.json({limit:'2mb'}));app.use(express.urlencoded({extended:true}));
function auth(req,res,next){const h=req.headers.authorization||'';const t=h.startsWith('Bearer ')?h.slice(7):(req.query.token||'');if(!t)return res.status(401).json({error:'Login required'});try{req.user=jwt.verify(t,JWT_SECRET);next()}catch(e){res.status(401).json({error:'Session expired'})}}
function settings(){return Object.fromEntries(db.prepare('SELECT key,value FROM settings').all().map(x=>[x.key,x.value]));}
function nextNo(prefix){const row=db.prepare('SELECT invoice_no FROM invoices ORDER BY id DESC LIMIT 1').get();let n=1;if(row){const m=row.invoice_no.match(/(\d+)$/);if(m)n=Number(m[1])+1;}return `${prefix||'INV'}-${new Date().getFullYear()}-${String(n).padStart(6,'0')}`}
function recalcStatus(total,paid){return paid>=total-0.01?'Paid':paid>0?'Partial':'Pending'}
app.post('/api/login',(req,res)=>{const {email,password}=req.body;const u=db.prepare('SELECT * FROM users WHERE email=?').get(email);if(!u||!bcrypt.compareSync(password,u.password))return res.status(401).json({error:'Invalid email or password'});res.json({token:jwt.sign({id:u.id,name:u.name,email:u.email,role:u.role},JWT_SECRET,{expiresIn:'7d'}),user:{id:u.id,name:u.name,email:u.email,role:u.role}})});
app.get('/api/me',auth,(req,res)=>res.json({user:req.user,settings:settings()}));
app.get('/api/dashboard',auth,(req,res)=>{const sales=db.prepare("SELECT COALESCE(SUM(total),0) v FROM invoices WHERE date(created_at)=date('now','localtime')").get().v;const purchases=db.prepare("SELECT COALESCE(SUM(total),0) v FROM purchases WHERE date(created_at)=date('now','localtime')").get().v;const customers=db.prepare('SELECT COUNT(*) v FROM customers').get().v;const pending=db.prepare("SELECT COALESCE(SUM(total-paid),0) v FROM invoices WHERE total>paid").get().v;const low=db.prepare('SELECT COUNT(*) v FROM products WHERE stock<=min_stock').get().v;const recent=db.prepare('SELECT i.*,COALESCE(c.name,"Walk-in Customer") customer FROM invoices i LEFT JOIN customers c ON c.id=i.customer_id ORDER BY i.id DESC LIMIT 8').all();const lowItems=db.prepare('SELECT * FROM products WHERE stock<=min_stock ORDER BY stock ASC LIMIT 8').all();const top=db.prepare('SELECT p.name,SUM(ii.qty) qty,SUM(ii.total) amount FROM invoice_items ii JOIN products p ON p.id=ii.product_id GROUP BY ii.product_id ORDER BY amount DESC LIMIT 5').all();const chart=db.prepare("SELECT substr(created_at,1,10) day,ROUND(SUM(total),2) total FROM invoices WHERE created_at>=date('now','-6 day','localtime') GROUP BY day ORDER BY day").all();res.json({sales,purchases,customers,pending,low,recent,lowItems,top,chart});});
app.get('/api/settings',auth,(req,res)=>res.json(settings()));
app.put('/api/settings',auth,(req,res)=>{const data=req.body||{};const q=db.prepare('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value');const tx=db.transaction(()=>Object.entries(data).forEach(([k,v])=>q.run(k,String(v??''))));tx();res.json(settings())});
function crud(table,fields){app.get('/api/'+table,auth,(req,res)=>res.json(db.prepare(`SELECT * FROM ${table} ORDER BY id DESC`).all()));app.post('/api/'+table,auth,(req,res)=>{try{const vals=fields.map(f=>req.body[f]??'');const r=db.prepare(`INSERT INTO ${table}(${fields.join(',')}) VALUES(${fields.map(()=>'?').join(',')})`).run(...vals);res.json(db.prepare(`SELECT * FROM ${table} WHERE id=?`).get(r.lastInsertRowid))}catch(e){res.status(400).json({error:e.message})}});app.put('/api/'+table+'/:id',auth,(req,res)=>{try{const sets=fields.map(f=>`${f}=?`).join(',');db.prepare(`UPDATE ${table} SET ${sets} WHERE id=?`).run(...fields.map(f=>req.body[f]??''),req.params.id);res.json(db.prepare(`SELECT * FROM ${table} WHERE id=?`).get(req.params.id))}catch(e){res.status(400).json({error:e.message})}});app.delete('/api/'+table+'/:id',auth,(req,res)=>{try{db.prepare(`DELETE FROM ${table} WHERE id=?`).run(req.params.id);res.json({ok:true})}catch(e){res.status(400).json({error:e.message})}})}
crud('customers',['name','phone','address','gstin','state']);crud('suppliers',['name','phone','address','gstin','state']);crud('products',['name','sku','barcode','category','unit','hsn','purchase_price','sale_price','gst','stock','min_stock']);
app.get('/api/invoices',auth,(req,res)=>res.json(db.prepare('SELECT i.*,COALESCE(c.name,"Walk-in Customer") customer FROM invoices i LEFT JOIN customers c ON c.id=i.customer_id ORDER BY i.id DESC').all()));
app.get('/api/invoices/:id',auth,(req,res)=>{const invoice=db.prepare('SELECT i.*,COALESCE(c.name,"Walk-in Customer") customer,c.phone,c.address,c.gstin,c.state FROM invoices i LEFT JOIN customers c ON c.id=i.customer_id WHERE i.id=?').get(req.params.id);if(!invoice)return res.status(404).json({error:'Invoice not found'});invoice.items=db.prepare(`
SELECT
  ii.*,
  COALESCE(p.unit,'PCS') AS unit,
  COALESCE(p.hsn,'-') AS hsn,
  COALESCE(p.gst,ii.gst,0) AS gst,
  COALESCE(ii.gst_mode,'EXCLUDING') AS gst_mode
FROM invoice_items ii
LEFT JOIN products p
  ON p.id=ii.product_id
WHERE ii.invoice_id=?
`).all(req.params.id);res.json(invoice)});
app.post('/api/invoices',auth,(req,res)=>{try{const body=req.body,items=body.items||[];if(!items.length)throw Error('Add at least one item');const s=settings();const no=body.invoice_no||nextNo(s.invoice_prefix);let subtotal=0,baseTotal=0;const prepared=[];for(const x of items){const p=db.prepare('SELECT * FROM products WHERE id=?').get(x.product_id);if(!p)throw Error('Product not found');const qty=Number(x.qty)||0,rate=Number(x.rate??p.sale_price)||0,disc=Math.max(0,Number(x.discount)||0),gst=Math.max(0,Number(x.gst??p.gst??0)||0),gstMode=String(x.gst_mode||'EXCLUDING').toUpperCase()==='INCLUDING'?'INCLUDING':'EXCLUDING';if(qty<=0)throw Error('Quantity must be greater than 0');if(qty>(Number(p.stock)||0))throw Error('Insufficient stock for '+p.name+' (available: '+(Number(p.stock)||0)+')');const gross=qty*rate,netGross=Math.max(0,gross-disc),base=gstMode==='INCLUDING'?(gst>0?netGross/(1+gst/100):netGross):netGross;subtotal+=gross;baseTotal+=base;prepared.push({p,qty,rate,disc,gst,gstMode,base});}const extraDiscount=Math.min(Math.max(0,Number(body.discount)||0),baseTotal);const factor=baseTotal>0?(baseTotal-extraDiscount)/baseTotal:0;let taxable=0,cgst=0,sgst=0,igst=0;for(const x of prepared){x.finalBase=x.base*factor;x.tax=x.finalBase*x.gst/100;taxable+=x.finalBase;if(body.tax_type==='IGST')igst+=x.tax;else{cgst+=x.tax/2;sgst+=x.tax/2;}}const totalRaw=taxable+cgst+sgst+igst,total=Math.round(totalRaw),roundoff=total-totalRaw,paid=Math.max(0,Number(body.paid)||0),status=recalcStatus(total,paid);const tx=db.transaction(()=>{const r=db.prepare('INSERT INTO invoices(invoice_no,customer_id,subtotal,discount,taxable,cgst,sgst,igst,roundoff,total,paid,status,payment_mode,notes) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(no,body.customer_id||null,subtotal,extraDiscount,taxable,cgst,sgst,igst,roundoff,total,paid,status,body.payment_mode||'Cash',body.notes||'');const iid=r.lastInsertRowid;const ii=db.prepare('INSERT INTO invoice_items(invoice_id,product_id,name,qty,rate,gst,gst_mode,discount,taxable,tax,total) VALUES(?,?,?,?,?,?,?,?,?,?,?)');const up=db.prepare('UPDATE products SET stock=stock-? WHERE id=?');for(const x of prepared){ii.run(iid,x.p.id,x.p.name,x.qty,x.rate,x.gst,x.gstMode,x.disc,x.finalBase,x.tax,x.finalBase+x.tax);up.run(x.qty,x.p.id);}if(paid>0)db.prepare('INSERT INTO payments(customer_id,invoice_id,amount,mode,note) VALUES(?,?,?,?,?)').run(body.customer_id||null,iid,paid,body.payment_mode||'Cash','Invoice payment');return iid;});const iid=tx();res.json({id:iid,invoice_no:no,total,status})}catch(e){res.status(400).json({error:e.message})}});app.post('/api/invoices/:id/payment',auth,(req,res)=>{const inv=db.prepare('SELECT * FROM invoices WHERE id=?').get(req.params.id);if(!inv)return res.status(404).json({error:'Invoice not found'});const amount=Number(req.body.amount)||0;if(amount<=0)return res.status(400).json({error:'Invalid amount'});const paid=inv.paid+amount;db.prepare('UPDATE invoices SET paid=?,status=? WHERE id=?').run(paid,recalcStatus(inv.total,paid),inv.id);db.prepare('INSERT INTO payments(customer_id,invoice_id,amount,mode,reference,note) VALUES(?,?,?,?,?,?)').run(inv.customer_id,inv.id,amount,req.body.mode||'Cash',req.body.reference||'',req.body.note||'');res.json({paid,status:recalcStatus(inv.total,paid)})});
app.get('/api/payments',auth,(req,res)=>res.json(db.prepare('SELECT p.*,COALESCE(c.name,"Walk-in Customer") customer,i.invoice_no FROM payments p LEFT JOIN customers c ON c.id=p.customer_id LEFT JOIN invoices i ON i.id=p.invoice_id ORDER BY p.id DESC').all()));
app.get('/api/reports/sales',auth,(req,res)=>{const from=req.query.from||'2000-01-01',to=req.query.to||'2999-12-31';const rows=db.prepare("SELECT substr(i.created_at,1,10) date,COUNT(*) invoices,ROUND(SUM(i.subtotal),2) subtotal,ROUND(SUM(i.discount),2) discount,ROUND(SUM(i.cgst+i.sgst+i.igst),2) tax,ROUND(SUM(i.total),2) total,ROUND(SUM(i.paid),2) paid FROM invoices i WHERE date(i.created_at) BETWEEN ? AND ? GROUP BY date ORDER BY date DESC").all(from,to);res.json(rows)});
app.get('/api/reports/gst',auth,(req,res)=>res.json(db.prepare("SELECT substr(created_at,1,10) date,ROUND(SUM(taxable),2) taxable,ROUND(SUM(cgst),2) cgst,ROUND(SUM(sgst),2) sgst,ROUND(SUM(igst),2) igst,ROUND(SUM(total),2) total FROM invoices GROUP BY date ORDER BY date DESC").all()));
app.get('/api/export/invoices.csv',auth,(req,res)=>{const rows=db.prepare('SELECT invoice_no,created_at,customer_id,subtotal,discount,taxable,cgst,sgst,igst,roundoff,total,paid,status,payment_mode FROM invoices ORDER BY id DESC').all();const esc=v=>'"'+String(v??'').replaceAll('"','""')+'"';const csv=[Object.keys(rows[0]||{invoice_no:1}).join(','),...rows.map(r=>Object.values(r).map(esc).join(','))].join('\n');res.setHeader('Content-Type','text/csv');res.setHeader('Content-Disposition','attachment; filename="subha-billing-invoices.csv"');res.send(csv)});

// BMMU invoice PME-2026-600
try{
 const no='PME-2026-600';
 if(!db.prepare('SELECT id FROM invoices WHERE invoice_no=?').get(no)){
  const cn='BMMU Diyungbra Block,Diyungmukh-782448';
  let cu=db.prepare('SELECT * FROM customers WHERE name=?').get(cn);
  if(!cu){const x=db.prepare('INSERT INTO customers(name,address,state) VALUES(?,?,?)').run(cn,'Diyungmukh-782448','Assam');cu=db.prepare('SELECT * FROM customers WHERE id=?').get(x.lastInsertRowid);}
  const a=[['A4 Paper','4802',2,700,12],['Ball Pen','9608',20,10,18],['Marker Pen','9608',10,25,18],['Register','4820',5,150,18],['File Folder','4820',10,20,18],['Stapler','8305',2,75,18],['Notebook','4820',2,73,0]];
  const ps=[]; for(const x of a){let p=db.prepare('SELECT * FROM products WHERE name=?').get(x[0]);if(!p){const q=db.prepare('INSERT INTO products(name,sku,category,unit,hsn,purchase_price,sale_price,gst,stock,min_stock) VALUES(?,?,?,?,?,?,?,?,?,?)').run(x[0],'PME-'+x[1]+'-'+x[0].replace(/ /g,''),'Stationery','PCS',x[1],0,x[3],x[4],x[2],0);p=db.prepare('SELECT * FROM products WHERE id=?').get(q.lastInsertRowid);}const gross=x[2]*x[3],base=gross/(1+x[4]/100),tax=gross-base;ps.push({p,qty:x[2],rate:x[3],gst:x[4],base,tax,gross});}
  const sub=ps.reduce((s,x)=>s+x.gross,0), base=ps.reduce((s,x)=>s+x.base,0), tax=ps.reduce((s,x)=>s+x.tax,0);
  const iv=db.prepare('INSERT INTO invoices(invoice_no,customer_id,subtotal,discount,taxable,cgst,sgst,igst,roundoff,total,paid,status,payment_mode,notes,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(no,cu.id,sub,0,base,tax/2,tax/2,0,0,sub,0,'Pending','Credit','Stationery office','2026-07-13 00:00:00');
  const ii=db.prepare('INSERT INTO invoice_items(invoice_id,product_id,name,qty,rate,gst,gst_mode,discount,taxable,tax,total) VALUES(?,?,?,?,?,?,?,?,?,?,?)'); for(const x of ps)ii.run(iv.lastInsertRowid,x.p.id,x.p.name,x.qty,x.rate,x.gst,'INCLUDING',0,x.base,x.tax,x.gross);
 }
}catch(e){console.error('BMMU invoice seed:',e.message)}


// Sports Department Tax Invoice PME/2026/27/623
try{
 const no='PME/2026/27/623';
 if(!db.prepare('SELECT id FROM invoices WHERE invoice_no=?').get(no)){
  const cn='The District Sports Officer';
  let cu=db.prepare('SELECT * FROM customers WHERE name=?').get(cn);
  if(!cu){const x=db.prepare('INSERT INTO customers(name,address,state) VALUES(?,?,?)').run(cn,'Haflong, Dima Hasao, Assam','Assam');cu=db.prepare('SELECT * FROM customers WHERE id=?').get(x.lastInsertRowid);}
  const a=[['Winner Trophy (29 cm)','83062920','Piece',3,8785,12],['Winner Trophy (28 cm)','83062920','Piece',3,7700,12],['Best Player Trophy (28 cm)','83062920','Piece',3,7700,12],['Medals (4 in. printing & ribbon)','83062920','Piece',150,190,12],['Nivia Football','95066210','Piece',65,1730,5],['Corner Flag','95069990','Set',10,1190,5],['Substitution Board','95069990','Piece',10,990,5],['Lime Powder','28365000','Bag',30,840,18],['Referee Dress','6103/6109','Set',10,2580,5],['Whistle','92089000','Piece',12,170,18],['Football Net','95069990','Pair/Set',10,5150,5]];
  const ps=[];
  for(const x of a){let p=db.prepare('SELECT * FROM products WHERE name=?').get(x[0]);if(!p){const q=db.prepare('INSERT INTO products(name,sku,category,unit,hsn,purchase_price,sale_price,gst,stock,min_stock) VALUES(?,?,?,?,?,?,?,?,?,?)').run(x[0],'PME-TAX-'+x[1]+'-'+x[0].replace(/[^A-Za-z0-9]/g,''),'Sports Supply',x[2],x[1],0,x[4],x[5],x[3]+1000,0);p=db.prepare('SELECT * FROM products WHERE id=?').get(q.lastInsertRowid);}else db.prepare('UPDATE products SET unit=?,hsn=?,sale_price=?,gst=? WHERE id=?').run(x[2],x[1],x[4],x[5],p.id);const gross=x[3]*x[4],base=gross/(1+x[5]/100),tax=gross-base;ps.push({p,qty:x[3],rate:x[4],gst:x[5],base,tax,gross});}
  const sub=ps.reduce((s,x)=>s+x.gross,0),base=ps.reduce((s,x)=>s+x.base,0),tax=ps.reduce((s,x)=>s+x.tax,0);
  const iv=db.prepare('INSERT INTO invoices(invoice_no,customer_id,subtotal,discount,taxable,cgst,sgst,igst,roundoff,total,paid,status,payment_mode,notes,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(no,cu.id,sub,0,base,tax/2,tax/2,0,0,sub,0,'Pending','Credit','Sports Department Tax Invoice','2026-10-07 00:00:00');
  const ii=db.prepare('INSERT INTO invoice_items(invoice_id,product_id,name,qty,rate,gst,gst_mode,discount,taxable,tax,total) VALUES(?,?,?,?,?,?,?,?,?,?,?)');
  for(const x of ps)ii.run(iv.lastInsertRowid,x.p.id,x.p.name,x.qty,x.rate,x.gst,'INCLUDING',0,x.base,x.tax,x.gross);
 }
}catch(e){console.error('Sports tax invoice seed:',e.message)}

// Correct existing BMMU invoice notebook GST to 0% without changing invoice layout
try{
 const fixNo='PME-2026-600';
 const fixInv=db.prepare('SELECT id FROM invoices WHERE invoice_no=?').get(fixNo);
 if(fixInv){
  const nb=db.prepare("SELECT * FROM invoice_items WHERE invoice_id=? AND name='Notebook'").get(fixInv.id);
  if(nb){
   db.prepare('UPDATE invoice_items SET gst=0,taxable=total,tax=0 WHERE id=?').run(nb.id);
   if(nb.product_id) db.prepare('UPDATE products SET gst=0 WHERE id=?').run(nb.product_id);
   const a=db.prepare('SELECT COALESCE(SUM(total),0) total,COALESCE(SUM(taxable),0) taxable,COALESCE(SUM(tax),0) tax FROM invoice_items WHERE invoice_id=?').get(fixInv.id);
   db.prepare('UPDATE invoices SET subtotal=?,taxable=?,cgst=?,sgst=?,igst=0,roundoff=0,total=? WHERE id=?').run(a.total,a.taxable,a.tax/2,a.tax/2,a.total,fixInv.id);
  }
 }
}catch(e){console.error('BMMU GST correction:',e.message)}


// BMMU September 2026 stationery invoice
try{
 const no='PME-2026-601';
 if(!db.prepare('SELECT id FROM invoices WHERE invoice_no=?').get(no)){
  const cn='BMMU Diyungbra Block,Diyungmukh-782448';
  let cu=db.prepare('SELECT * FROM customers WHERE name=?').get(cn);
  if(!cu){
   const x=db.prepare('INSERT INTO customers(name,address,state) VALUES(?,?,?)').run(cn,'Diyungmukh-782448','Assam');
   cu=db.prepare('SELECT * FROM customers WHERE id=?').get(x.lastInsertRowid);
  }
  const items=[
   ['A4 Paper','4802',5,600],['Ball Pen','9608',50,10],['Marker Pen','9608',20,25],
   ['Register','4820',20,200],['File Folder','4820',20,25],['Stapler','8305',5,100],
   ['Paper Punch','8472',10,100],['Glue Stick','3506',25,50],['Paper Clip','8305',100,5],['Calculator','8470',5,250]
  ];
  const ps=[];
  for(const x of items){
   let p=db.prepare('SELECT * FROM products WHERE name=?').get(x[0]);
   if(!p){
    const q=db.prepare('INSERT INTO products(name,sku,category,unit,hsn,purchase_price,sale_price,gst,stock,min_stock) VALUES(?,?,?,?,?,?,?,?,?,?)').run(x[0],'PME-SEP-'+x[1]+'-'+x[0].replace(/ /g,''),'Stationery','PCS',x[1],0,x[3],18,x[2],0);
    p=db.prepare('SELECT * FROM products WHERE id=?').get(q.lastInsertRowid);
   }else db.prepare('UPDATE products SET gst=18,hsn=?,sale_price=? WHERE id=?').run(x[1],x[3],p.id);
   const gross=x[2]*x[3],base=gross/1.18,tax=gross-base;
   ps.push({p,qty:x[2],rate:x[3],base,tax,gross});
  }
  const sub=ps.reduce((s,x)=>s+x.gross,0),base=ps.reduce((s,x)=>s+x.base,0),tax=ps.reduce((s,x)=>s+x.tax,0);
  const iv=db.prepare('INSERT INTO invoices(invoice_no,customer_id,subtotal,discount,taxable,cgst,sgst,igst,roundoff,total,paid,status,payment_mode,notes,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(no,cu.id,sub,0,base,tax/2,tax/2,0,0,sub,0,'Pending','Credit','Stationery office - September 2026','2026-09-25 00:00:00');
  const ii=db.prepare('INSERT INTO invoice_items(invoice_id,product_id,name,qty,rate,gst,gst_mode,discount,taxable,tax,total) VALUES(?,?,?,?,?,?,?,?,?,?,?)');
  for(const x of ps)ii.run(iv.lastInsertRowid,x.p.id,x.p.name,x.qty,x.rate,18,'INCLUDING',0,x.base,x.tax,x.gross);
 }
}catch(e){console.error('BMMU September seed:',e.message)}


// Correct September BMMU invoice PME-2026-601: exactly 10 items, all at 18% GST
try{
 const fixNo='PME-2026-601';
 const fixInv=db.prepare('SELECT id FROM invoices WHERE invoice_no=?').get(fixNo);
 if(fixInv){
  const items=[
   ['A4 Paper','4802',5,600],
   ['Ball Pen','9608',50,10],
   ['Marker Pen','9608',20,25],
   ['Register','4820',20,200],
   ['File Folder','4820',20,25],
   ['Stapler','8305',5,100],
   ['Paper Punch','8472',10,100],
   ['Glue Stick','3506',25,50],
   ['Paper Clip','8305',100,5],
   ['Calculator','8470',5,250]
  ];
  db.prepare('DELETE FROM invoice_items WHERE invoice_id=?').run(fixInv.id);
  const ii=db.prepare('INSERT INTO invoice_items(invoice_id,product_id,name,qty,rate,gst,gst_mode,discount,taxable,tax,total) VALUES(?,?,?,?,?,?,?,?,?,?,?)');
  let subtotal=0,taxable=0,tax=0;
  for(const x of items){
   let p=db.prepare('SELECT * FROM products WHERE name=?').get(x[0]);
   if(!p){
    const z=db.prepare('INSERT INTO products(name,sku,category,unit,hsn,purchase_price,sale_price,gst,stock,min_stock) VALUES(?,?,?,?,?,?,?,?,?,?)').run(x[0],'PME-SEP-'+x[1]+'-'+x[0].replace(/ /g,''),'Stationery','PCS',x[1],0,x[3],18,x[2],0);
    p=db.prepare('SELECT * FROM products WHERE id=?').get(z.lastInsertRowid);
   }else{
    db.prepare('UPDATE products SET gst=18,hsn=?,sale_price=? WHERE id=?').run(x[1],x[3],p.id);
   }
   const gross=x[2]*x[3],base=gross/1.18,t=gross-base;
   ii.run(fixInv.id,p.id,x[0],x[2],x[3],18,'INCLUDING',0,base,t,gross);
   subtotal+=gross; taxable+=base; tax+=t;
  }
  db.prepare('UPDATE invoices SET subtotal=?,discount=0,taxable=?,cgst=?,sgst=?,igst=0,roundoff=0,total=? WHERE id=?').run(subtotal,tax/2,taxable,tax/2,subtotal,fixInv.id);
 }
}catch(e){console.error('BMMU September 18% correction:',e.message)}



// SUBHA SPORTS OFFICER INVOICE PME-2026-602
// Idempotent seed so the requested invoice appears in SUBHA BILLING after deployment.
try{
 const no='PME-2026-602';
 if(!db.prepare('SELECT id FROM invoices WHERE invoice_no=?').get(no)){
  const customerName='THE DISTRICT SPORTS OFFICER';
  let cu=db.prepare('SELECT * FROM customers WHERE name=?').get(customerName);
  if(!cu){
   const x=db.prepare('INSERT INTO customers(name,address,state) VALUES(?,?,?)').run(
    customerName,'Haflong, Dima Hasao, Assam 788819','Assam'
   );
   cu=db.prepare('SELECT * FROM customers WHERE id=?').get(x.lastInsertRowid);
  }else{
   db.prepare('UPDATE customers SET address=?,state=? WHERE id=?').run(
    'Haflong, Dima Hasao, Assam 788819','Assam',cu.id
   );
  }

  // Rates supplied by the user are GST-inclusive. 18% is used as the
  // current default for these lines; verify the applicable HSN/GST rate
  // before issuing this tax invoice.
  const items=[
   {name:'Plastic Chair',qty:150,rate:535,gst:18,unit:'PCS'},
   {name:'Plastic Table',qty:30,rate:1850,gst:18,unit:'PCS'},
   {name:'Labour Charge',qty:1,rate:1200,gst:18,unit:'JOB'},
   {name:'Transport',qty:1,rate:2800,gst:18,unit:'JOB'}
  ];
  const grossTotal=items.reduce((s,x)=>s+x.qty*x.rate,0);
  let taxable=0,tax=0;
  const prepared=items.map(x=>{
   const gross=x.qty*x.rate;
   const base=gross/(1+x.gst/100);
   const itemTax=gross-base;
   taxable+=base;tax+=itemTax;
   return {...x,gross,base,itemTax};
  });
  const inv=db.prepare(
   'INSERT INTO invoices(invoice_no,customer_id,subtotal,discount,taxable,cgst,sgst,igst,roundoff,total,paid,status,payment_mode,notes,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
  ).run(
   no,cu.id,grossTotal,0,taxable,tax/2,tax/2,0,grossTotal-(taxable+tax),grossTotal,0,'Pending','Credit',
   'GST-inclusive rates; verify GST rate and HSN before issuing.',
   new Date().toISOString().slice(0,19).replace('T',' ')
  );
  const ii=db.prepare(
   'INSERT INTO invoice_items(invoice_id,product_id,name,qty,rate,gst,gst_mode,discount,taxable,tax,total) VALUES(?,NULL,?,?,?,?,?,?,?,?,?)'
  );
  for(const x of prepared){
   ii.run(inv.lastInsertRowid,x.name,x.qty,x.rate,x.gst,'INCLUDING',0,x.base,x.itemTax,x.gross);
  }
 }
}catch(e){console.error('Sports Officer invoice seed:',e.message)}



// Ensure PME-2026-602 item HSN/SAC codes are present for invoice display.
try{
 const inv=db.prepare("SELECT id FROM invoices WHERE invoice_no='PME-2026-602'").get();
 if(inv){
  const mappings=[
   {name:'Plastic Chair',sku:'PME-SPORTS-94018000',hsn:'94018000',gst:18},
   {name:'Plastic Table',sku:'PME-SPORTS-94037000',hsn:'94037000',gst:18},
   {name:'Labour Charge',sku:'PME-SPORTS-LABOUR',hsn:'SAC: confirm',gst:18},
   {name:'Transport',sku:'PME-SPORTS-TRANSPORT',hsn:'SAC 9965*',gst:18}
  ];
  for(const m of mappings){
   let p=db.prepare('SELECT * FROM products WHERE name=?').get(m.name);
   if(!p){
    const sku=m.sku;
    const x=db.prepare('INSERT INTO products(name,sku,category,unit,hsn,purchase_price,sale_price,gst,stock,min_stock) VALUES(?,?,?,?,?,?,?,?,?,?)')
      .run(m.name,sku,'Sports Officer Invoice',m.name==='Labour Charge'||m.name==='Transport'?'JOB':'PCS',m.hsn,0,0,m.gst,0,0);
    p=db.prepare('SELECT * FROM products WHERE id=?').get(x.lastInsertRowid);
   }else{
    db.prepare('UPDATE products SET hsn=? WHERE id=?').run(m.hsn,p.id);
   }
   db.prepare('UPDATE invoice_items SET product_id=? WHERE invoice_id=? AND name=?').run(p.id,inv.id,m.name);
  }
 }
}catch(e){console.error('Sports Officer HSN display correction:',e.message)}


app.use(express.static(path.join(__dirname,'public')));app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
const HOST=process.env.HOST||'0.0.0.0';
app.listen(PORT,HOST,()=>console.log(`SUBHA BILLING running on http://localhost:${PORT}`));

require('./server-enhancements')(app,db,auth,settings,nextNo,bcrypt);
