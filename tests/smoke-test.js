const {spawn}=require('node:child_process');
const {mkdtempSync,rmSync}=require('node:fs');
const {tmpdir}=require('node:os');
const path=require('node:path');
const assert=require('node:assert/strict');

(async()=>{
 const dir=mkdtempSync(path.join(tmpdir(),'subha-billing-test-'));
 const port=31870+Math.floor(Math.random()*500);
 const dbPath=path.join(dir,'test.db');
 const child=spawn(process.execPath,['server.js'],{cwd:process.cwd(),env:{...process.env,PORT:String(port),DB_PATH:dbPath,JWT_SECRET:'test-only-secret',ADMIN_EMAIL:'test-admin@example.com',ADMIN_PASSWORD:'TestPass123!'},stdio:['ignore','pipe','pipe']});
 let logs='';
 child.stdout.on('data',d=>logs+=d.toString());
 child.stderr.on('data',d=>logs+=d.toString());
 const base='http://127.0.0.1:'+port;
 async function request(route,opts={}) {
   const res=await fetch(base+route,{...opts,headers:{'content-type':'application/json',...(opts.headers||{})}});
   const raw=await res.text(); let data; try{data=JSON.parse(raw)}catch{data=raw}
   return {status:res.status,data};
 }
 try {
   let ready=false;
   for(let i=0;i<60;i++){if(child.exitCode!==null)throw Error('Server exited early: '+logs);try{const x=await fetch(base+'/');if(x.status<500){ready=true;break}}catch{} await new Promise(r=>setTimeout(r,250))}
   assert.equal(ready,true,'server should start');
   const bad=await request('/api/login',{method:'POST',body:JSON.stringify({email:'test-admin@example.com',password:'wrong'})});
   assert.equal(bad.status,401,'invalid login must be rejected');
   const login=await request('/api/login',{method:'POST',body:JSON.stringify({email:'test-admin@example.com',password:'TestPass123!'})});
   assert.equal(login.status,200,'admin login should work');
   const token=login.data.token; assert.ok(token,'login returns token');
   const auth={authorization:'Bearer '+token};
   const settings=await request('/api/settings',{headers:auth});
   assert.equal(settings.status,200); assert.ok(settings.data.business_name,'company settings should be seeded');
   const product=await request('/api/products',{method:'POST',headers:auth,body:JSON.stringify({name:'Automated test item',sku:'TEST-'+Date.now(),unit:'PCS',hsn:'1234',purchase_price:5,sale_price:10,gst:18,stock:10,min_stock:1})});
   assert.equal(product.status,200,'product creation should work');
   const p=product.data;
   const invoice=await request('/api/invoices',{method:'POST',headers:auth,body:JSON.stringify({items:[{product_id:p.id,qty:2,rate:10,gst:18,gst_mode:'EXCLUDING'}],paid:0})});
   assert.equal(invoice.status,200,'invoice creation should work: '+JSON.stringify(invoice.data));
   assert.equal(invoice.data.total,24,'₹20 taxable + ₹3.60 GST rounds to ₹24');
   const products=await request('/api/products',{headers:auth});
   const saved=products.data.find(x=>x.id===p.id);
   assert.equal(Number(saved.stock),8,'invoice should deduct stock');
   const invoiceDetails=await request('/api/invoices/'+invoice.data.id,{headers:auth});
   assert.equal(invoiceDetails.status,200);
   assert.equal(invoiceDetails.data.items.length,1);
   const reports=await request('/api/reports/gst',{headers:auth});
   assert.equal(reports.status,200,'GST report endpoint should work');
   console.log('PASS: startup, invalid login, admin login, settings, product creation, GST invoice total, stock deduction, invoice details, GST report');
 } finally {
   child.kill('SIGTERM');
   await new Promise(r=>setTimeout(r,300));
   rmSync(dir,{recursive:true,force:true});
 }
})().catch(e=>{console.error(e);process.exit(1)});
