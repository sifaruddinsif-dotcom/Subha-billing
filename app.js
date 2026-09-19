const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let token=localStorage.getItem('sb_token'), state={page:'dashboard',settings:{},customers:[],products:[],suppliers:[],invoices:[]};
const api=async(path,opt={})=>{opt.headers={'Content-Type':'application/json',...(opt.headers||{})};if(token)opt.headers.Authorization='Bearer '+token;const r=await fetch('/api'+path,opt);const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||'Request failed');return d};
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500)}
function money(n){return '₹ '+Number(n||0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}
function login(){document.body.innerHTML=`<div class="login"><div class="loginbox"><div class="brand"><div class="brandmark">₹</div><div><h1>SUBHA BILLING</h1><div class="muted">Smart Billing. Premium Business.</div></div></div><h2>Sign in</h2><div class="field"><label>Email</label><input id="lemail" value="${localStorage.getItem('sb_email')||'admin@subhabilling.com'}"></div><div class="field"><label>Password</label><input id="lpass" type="password" value="ChangeMe123!"></div><button class="btn primary" style="width:100%" onclick="doLogin()">Login</button><p class="muted" style="font-size:12px">Change the default password before production.</p></div></div>`}
async function doLogin(){try{const d=await api('/login',{method:'POST',body:JSON.stringify({email:$('#lemail').value,password:$('#lpass').value})});token=d.token;localStorage.setItem('sb_token',token);localStorage.setItem('sb_email',$('#lemail').value);boot()}catch(e){alert(e.message)}}
function shell(){document.body.innerHTML=`<div class="layout"><aside class="side"><div class="brand"><div class="brandmark">SB</div><div><h1>SUBHA<br><span style="color:#ffd34e">BILLING</span></h1><div class="muted" style="font-size:11px">Smart Billing. Premium Business.</div></div></div><nav class="nav">${[['dashboard','⌂ Dashboard'],['billing','▣ Sales / Billing'],['customers','♟ Customers'],['products','▦ Products / Stock'],['purchase','▰ Purchase'],['payments','₹ Payments'],['reports','◔ Reports'],['gst','◎ GST Reports'],['suppliers','♟ Suppliers'],['settings','⚙ Settings']].map(x=>`<button data-page="${x[0]}" onclick="go('${x[0]}')">${x[1]}</button>`).join('')}</nav><div class="sidefoot"><b>SUBHA BILLING</b><div class="muted" style="font-size:11px;margin-top:4px">Stationery Items & FMCG</div><div id="sideinfo" class="muted" style="font-size:11px;margin-top:9px"></div><button class="btn" style="width:100%;margin-top:12px" onclick="logout()">Logout</button></div></aside><main class="main"><div id="content"></div></main></div><div id="modal" class="modal"><div id="modalbox" class="modalbox"></div></div><div id="toast" class="toast"></div>`}
function logout(){localStorage.removeItem('sb_token');token=null;login()}
async function boot(){try{const d=await api('/me');state.settings=d.settings;shell();await go('dashboard')}catch(e){logout()}}
async function go(p){state.page=p;$$('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===p));if(p==='dashboard')return dashboard();if(p==='billing')return billing();if(p==='customers')return entityPage('customers','Customers',['name','phone','gstin','state']);if(p==='suppliers')return entityPage('suppliers','Suppliers',['name','phone','gstin','state']);if(p==='products')return products();if(p==='payments')return payments();if(p==='reports')return reports();if(p==='gst')return gst();if(p==='settings')return settingsPage()}
function header(title,button=''){return `<div class="top"><div><h2 style="margin:0">${title}</h2><div class="muted">${state.settings.tagline||'Smart Billing. Premium Business.'}</div></div><input class="search" placeholder="Search invoices, customers, products..." oninput="globalSearch(this.value)">${button}</div>`}
async function dashboard(){const d=await api('/dashboard');const max=Math.max(...(d.chart.map(x=>x.total)),1);$('#content').innerHTML=header('Dashboard',`<button class="btn primary" onclick="newInvoice()">＋ New Invoice</button>`)+`<div class="cards"><div class="card gold"><div class="label">TODAY'S SALES</div><div class="value">${money(d.sales)}</div></div><div class="card"><div class="label">TODAY'S PURCHASE</div><div class="value">${money(d.purchases)}</div></div><div class="card"><div class="label">TOTAL CUSTOMERS</div><div class="value">${d.customers}</div></div><div class="card"><div class="label">PENDING PAYMENTS</div><div class="value">${money(d.pending)}</div></div><div class="card"><div class="label">LOW STOCK ITEMS</div><div class="value">${d.low}</div></div></div><div class="grid2"><div class="panel"><h3>Sales Overview</h3><div class="chart">${d.chart.map(x=>`<div class="bar" style="height:${Math.max(3,x.total/max*100)}%"><span>${x.day.slice(5)}</span></div>`).join('')}</div></div><div class="panel"><h3>Quick Actions</h3><div class="quick"><button onclick="newInvoice()">▣<br>New Invoice</button><button onclick="go('products')">▦<br>Add Product</button><button onclick="go('customers')">♟<br>Add Customer</button><button onclick="go('payments')">₹<br>Receive Payment</button></div></div></div><div class="grid3"><div class="panel"><h3>Recent Invoices</h3>${d.recent.map(i=>`<div class="listrow"><div><b>${i.invoice_no}</b><div class="muted">${i.customer}</div></div><div style="text-align:right">${money(i.total)}<br><span class="status ${i.status.toLowerCase()}">${i.status}</span></div></div>`).join('')}</div><div class="panel"><h3>Low Stock Alert</h3>${d.lowItems.map(p=>`<div class="listrow"><div>${p.name}<div class="muted">Stock: ${p.stock} ${p.unit}</div></div><span class="low">LOW</span></div>`).join('')||'<div class="muted">No low stock items.</div>'}</div><div class="panel"><h3>Top Selling Products</h3>${d.top.map((p,i)=>`<div class="listrow"><span>${i+1}. ${p.name}</span><b>${money(p.amount)}</b></div>`).join('')||'<div class="muted">No sales yet.</div>'}</div></div>`}
async function entityPage(type,title,cols){const data=await api('/'+type);state[type]=data;$('#content').innerHTML=header(title,`<button class="btn primary" onclick="openEntity('${type}')">＋ Add ${title.slice(0,-1)}</button>`)+`<div class="panel"><div class="tablewrap"><table class="table"><thead><tr><th>#</th>${cols.map(c=>`<th>${c.replaceAll('_',' ').toUpperCase()}</th>`).join('')}<th>ACTIONS</th></tr></thead><tbody>${data.map((x,i)=>`<tr><td>${i+1}</td>${cols.map(c=>`<td>${x[c]||'-'}</td>`).join('')}<td class="actions"><button class="btn" onclick="openEntity('${type}',${x.id})">Edit</button><button class="btn danger" onclick="delEntity('${type}',${x.id})">Delete</button></td></tr>`).join('')}</tbody></table></div></div>`}
const meta={customers:{title:'Customer',fields:[['name','Name','text'],['phone','Mobile','text'],['gstin','GSTIN','text'],['state','State','text'],['address','Address','textarea']]},suppliers:{title:'Supplier',fields:[['name','Name','text'],['phone','Mobile','text'],['gstin','GSTIN','text'],['state','State','text'],['address','Address','textarea']]}};
function openEntity(type,id){const m=meta[type], old=id?state[type].find(x=>x.id==id):{};$('#modalbox').innerHTML=`<div class="toolbar"><h3>${id?'Edit':'Add'} ${m.title}</h3><button class="btn" onclick="closeModal()">×</button></div><div class="formgrid">${m.fields.map(f=>`<div class="field"><label>${f[1]}</label>${f[2]==='textarea'?`<textarea id="f_${f[0]}">${old[f[0]]||''}</textarea>`:`<input id="f_${f[0]}" value="${old[f[0]]||''}">`}</div>`).join('')}</div><button class="btn primary" onclick="saveEntity('${type}',${id||0})">Save</button>`;openModal()}
async function saveEntity(type,id){const o={};meta[type].fields.forEach(f=>o[f[0]]=$('#f_'+f[0]).value);try{await api('/'+type+(id?'/'+id:''),{method:id?'PUT':'POST',body:JSON.stringify(o)});closeModal();await go(type);toast('Saved successfully')}catch(e){alert(e.message)}}
async function delEntity(type,id){if(!confirm('Delete this record?'))return;try{await api('/'+type+'/'+id,{method:'DELETE'});go(type);toast('Deleted')}catch(e){alert(e.message)}}
async function products(){const data=await api('/products');state.products=data;$('#content').innerHTML=header('Products / Stock',`<button class="btn primary" onclick="openProduct()">＋ Add Product</button>`)+`<div class="panel"><div class="tablewrap"><table class="table"><thead><tr><th>Product</th><th>SKU</th><th>HSN</th><th>GST</th><th>Purchase</th><th>Sale</th><th>Stock</th><th>Min Stock</th><th>Actions</th></tr></thead><tbody>${data.map(p=>`<tr><td>${p.name}</td><td>${p.sku||'-'}</td><td>${p.hsn||'-'}</td><td>${p.gst}%</td><td>${money(p.purchase_price)}</td><td>${money(p.sale_price)}</td><td class="${p.stock<=p.min_stock?'low':''}">${p.stock} ${p.unit}</td><td>${p.min_stock}</td><td><button class="btn" onclick="openProduct(${p.id})">Edit</button> <button class="btn danger" onclick="delEntity('products',${p.id})">Delete</button></td></tr>`).join('')}</tbody></table></div></div>`}
function openProduct(id){const p=id?state.products.find(x=>x.id==id):{};const fs=[['name','Product Name'],['sku','SKU'],['barcode','Barcode'],['category','Category'],['unit','Unit'],['hsn','HSN/SAC'],['purchase_price','Purchase Price'],['sale_price','Sale Price'],['gst','GST %'],['stock','Opening Stock'],['min_stock','Minimum Stock']];$('#modalbox').innerHTML=`<div class="toolbar"><h3>${id?'Edit':'Add'} Product</h3><button class="btn" onclick="closeModal()">×</button></div><div class="formgrid">${fs.map(f=>`<div class="field"><label>${f[1]}</label><input id="p_${f[0]}" value="${p[f[0]]??''}"></div>`).join('')}</div><button class="btn primary" onclick="saveProduct(${id||0})">Save Product</button>`;openModal()}
async function saveProduct(id){const o={};['name','sku','barcode','category','unit','hsn','purchase_price','sale_price','gst','stock','min_stock'].forEach(k=>o[k]=$('#p_'+k).value);try{await api('/products'+(id?'/'+id:''),{method:id?'PUT':'POST',body:JSON.stringify(o)});closeModal();await products();toast('Product saved')}catch(e){alert(e.message)}}
async function billing(){const inv=await api('/invoices');state.invoices=inv;$('#content').innerHTML=header('Sales / Billing',`<button class="btn primary" onclick="newInvoice()">＋ New Invoice</button>`)+`<div class="panel"><div class="toolbar"><b>Invoices</b><button class="btn" onclick="downloadCSV()">Export CSV</button></div><div class="tablewrap"><table class="table"><thead><tr><th>Invoice</th><th>Date</th><th>Customer</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>Action</th></tr></thead><tbody>${inv.map(i=>`<tr><td>${i.invoice_no}</td><td>${i.created_at}</td><td>${i.customer}</td><td>${money(i.total)}</td><td>${money(i.paid)}</td><td>${money(i.total-i.paid)}</td><td><span class="status ${i.status.toLowerCase()}">${i.status}</span></td><td><button class="btn" onclick="viewInvoice(${i.id})">View / Print</button></td></tr>`).join('')}</tbody></table></div></div>`}
async function newInvoice(){const [customers,products]=await Promise.all([api('/customers'),api('/products')]);state.customers=customers;state.products=products;let rows=[];const row=()=>{rows.push({product_id:products[0]?.id||'',qty:1,rate:products[0]?.sale_price||0,discount:0});renderInvoiceModal(customers,products,rows)};row()}
function renderInvoiceModal(customers,products,rows){$('#modalbox').innerHTML=`<div class="toolbar"><div><h3>New GST Invoice</h3><div class="muted">${state.settings.business_name}</div></div><button class="btn" onclick="closeModal()">×</button></div><div class="formgrid"><div class="field"><label>Customer</label><select id="icust"><option value="">Walk-in Customer</option>${customers.map(c=>`<option value="${c.id}">${c.name} ${c.phone?'— '+c.phone:''}</option>`).join('')}</select></div><div class="field"><label>Tax Type</label><select id="itax"><option value="LOCAL">CGST + SGST</option><option value="IGST">IGST</option></select></div></div><table class="invoice-items"><thead><tr><th>Product</th><th>Qty</th><th>Rate</th><th>Discount</th><th></th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td><select onchange="rows[${i}].product_id=this.value;rows[${i}].rate=Number(this.selectedOptions[0].dataset.rate||0);renderInvoiceModal(state.customers,state.products,rows)">${products.map(p=>`<option data-rate="${p.sale_price}" value="${p.id}" ${p.id==r.product_id?'selected':''}>${p.name} — ${p.sale_price}</option>`).join('')}</select></td><td><input type="number" min="0.01" step="0.01" value="${r.qty}" onchange="rows[${i}].qty=Number(this.value)"></td><td><input type="number" step="0.01" value="${r.rate}" onchange="rows[${i}].rate=Number(this.value)"></td><td><input type="number" step="0.01" value="${r.discount}" onchange="rows[${i}].discount=Number(this.value)"></td><td><button class="btn danger" onclick="rows.splice(${i},1);renderInvoiceModal(state.customers,state.products,rows)">×</button></td></tr>`).join('')}</tbody></table><div style="margin-top:10px"><button class="btn" onclick="rows.push({product_id:products[0]?.id||'',qty:1,rate:products[0]?.sale_price||0,discount:0});renderInvoiceModal(state.customers,state.products,rows)">＋ Add Item</button></div><div class="formgrid" style="margin-top:10px"><div class="field"><label>Additional Discount</label><input id="idisc" type="number" value="0"></div><div class="field"><label>Paid Amount</label><input id="ipaid" type="number" value="0"></div><div class="field"><label>Payment Mode</label><select id="imode"><option>Cash</option><option>UPI</option><option>Bank</option><option>Card</option><option>Credit</option></select></div><div class="field"><label>Notes</label><input id="inote"></div></div><button class="btn primary" onclick='saveInvoice(${JSON.stringify(rows)})'>Create Invoice</button>`;openModal()}
async function saveInvoice(rows){try{const d=await api('/invoices',{method:'POST',body:JSON.stringify({customer_id:$('#icust').value||null,tax_type:$('#itax').value,discount:Number($('#idisc').value)||0,paid:Number($('#ipaid').value)||0,payment_mode:$('#imode').value,notes:$('#inote').value,items:rows})});closeModal();toast('Invoice '+d.invoice_no+' created');await billing();viewInvoice(d.id)}catch(e){alert(e.message)}}
 async function viewInvoice(id){
  const i=await api('/invoices/'+id);

  const items=(i.items||[]).map((x,n)=>`
    <tr>
      <td>${n+1}</td>
      <td><b>${x.name||'-'}</b></td>
      <td>${x.hsn||'-'}</td>
      <td>${x.qty||0}</td>
      <td>${x.unit||'PCS'}</td>
      <td>${money(x.rate)}</td>
      <td>${money(x.discount)}</td>
      <td>${money(x.taxable)}</td>
      <td>${money(x.cgst)}</td>
      <td>${money(x.sgst)}</td>
      <td>${money(x.igst)}</td>
      <td><b>${money(x.total)}</b></td>
    </tr>
  `).join('');

  $('#modalbox').innerHTML=`
    <div class="toolbar no-print">
      <h3>Invoice ${i.invoice_no}</h3>
      <button class="btn primary" onclick="window.print()">🖨 Print / Save PDF</button>
      <button class="btn" onclick="closeModal()">Close</button>
    </div>

    <div class="invoice-print tally-invoice">

      <div class="tally-header">
        <div>
          <h1>${state.settings.business_name||'SUBHA BILLING'}</h1>
          <div>${state.settings.address||''}</div>
          <div>Phone: ${state.settings.phone||'-'} | Email: ${state.settings.email||'-'}</div>
          <div><b>GSTIN: ${state.settings.gstin||'-'}</b></div>
          <div>State: ${state.settings.state||'-'}</div>
        </div>

        <div class="invoice-heading">
          <h2>TAX INVOICE</h2>
          <b>ORIGINAL FOR RECIPIENT</b>
        </div>
      </div>

      <div class="invoice-info">
        <div><b>Invoice No.</b><br>${i.invoice_no||'-'}</div>
        <div><b>Invoice Date</b><br>${i.created_at||'-'}</div>
        <div><b>Payment Mode</b><br>${i.payment_mode||'-'}</div>
        <div><b>Tax Type</b><br>${i.tax_type==='IGST'?'IGST':'CGST + SGST'}</div>
      </div>

      <div class="bill-section">
        <div>
          <h4>BILL TO</h4>
          <b>${i.customer||'Walk-in Customer'}</b><br>
          ${i.address||''}<br>
          Phone: ${i.phone||'-'}<br>
          GSTIN: ${i.gstin||'-'}
        </div>

        <div>
          <h4>PLACE OF SUPPLY</h4>
          State: ${i.state||state.settings.state||'-'}<br>
          GSTIN: ${i.gstin||'-'}<br>
          Invoice Ref: ${i.invoice_no||'-'}
        </div>
      </div>

      <table class="tally-table">
        <thead>
          <tr>
            <th>Sl.</th>
            <th>Description of Goods / Services</th>
            <th>HSN/SAC</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Rate</th>
            <th>Disc.</th>
            <th>Taxable Value</th>
            <th>CGST</th>
            <th>SGST</th>
            <th>IGST</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>${items}</tbody>
      </table>

      <div class="invoice-footer-grid">
        <div>
          <h4>AMOUNT IN WORDS</h4>
          <b>Rupees ${Number(i.total||0).toLocaleString('en-IN')} Only</b>

          <h4>BANK DETAILS</h4>
          Bank Name: __________________________<br>
          A/c No.: _____________________________<br>
          IFSC: ________________________________<br>
          UPI: __________________________________

          <h4>TERMS & CONDITIONS</h4>
          1. Goods once sold will not be returned unless agreed otherwise.<br>
          2. Payment is due as per agreed credit terms.<br>
          3. Subject to applicable GST rules and jurisdiction.
        </div>

        <div class="invoice-totals">
          <div><span>Subtotal</span><b>${money(i.subtotal)}</b></div>
          <div><span>Discount</span><b>${money(i.discount)}</b></div>
          <div><span>Taxable Value</span><b>${money(i.taxable)}</b></div>
          <div><span>CGST</span><b>${money(i.cgst)}</b></div>
          <div><span>SGST</span><b>${money(i.sgst)}</b></div>
          <div><span>IGST</span><b>${money(i.igst)}</b></div>
          <div><span>Round Off</span><b>${money(i.roundoff)}</b></div>

          <div class="grand-total">
            <span>GRAND TOTAL</span>
            <b>${money(i.total)}</b>
          </div>

          <div><span>Paid</span><b>${money(i.paid)}</b></div>
          <div><span>Balance Due</span><b>${money(i.total-i.paid)}</b></div>
        </div>
      </div>

      <div class="signature-section">
        <div>
          Customer Signature
          <div class="signature-line"></div>
        </div>

        <div>
          For <b>${state.settings.business_name||'SUBHA BILLING'}</b>
          <div class="signature-line"></div>
          <b>Authorised Signatory</b>
        </div>
      </div>

      <div class="computer-generated">
        This is a Computer Generated Invoice
      </div>

    </div>
  `;

  openModal();
}
async function payments(){const p=await api('/payments');$('#content').innerHTML=header('Payments',`<button class="btn primary" onclick="receivePayment()">＋ Receive Payment</button>`)+`<div class="panel"><div class="tablewrap"><table class="table"><thead><tr><th>Date</th><th>Customer</th><th>Invoice</th><th>Amount</th><th>Mode</th><th>Reference</th></tr></thead><tbody>${p.map(x=>`<tr><td>${x.created_at}</td><td>${x.customer}</td><td>${x.invoice_no||'-'}</td><td>${money(x.amount)}</td><td>${x.mode}</td><td>${x.reference||'-'}</td></tr>`).join('')}</tbody></table></div></div>`}
async function receivePayment(){const inv=await api('/invoices');$('#modalbox').innerHTML=`<div class="toolbar"><h3>Receive Payment</h3><button class="btn" onclick="closeModal()">×</button></div><div class="field"><label>Invoice</label><select id="payinv">${inv.filter(i=>i.total>i.paid).map(i=>`<option value="${i.id}">${i.invoice_no} — ${i.customer} — Balance ${money(i.total-i.paid)}</option>`).join('')}</select></div><div class="field"><label>Amount</label><input id="payamt" type="number"></div><div class="field"><label>Mode</label><select id="paymode"><option>Cash</option><option>UPI</option><option>Bank</option><option>Card</option></select></div><div class="field"><label>Reference</label><input id="payref"></div><button class="btn primary" onclick="savePayment()">Save Payment</button>`;openModal()}
async function savePayment(){try{await api('/invoices/'+$('#payinv').value+'/payment',{method:'POST',body:JSON.stringify({amount:Number($('#payamt').value),mode:$('#paymode').value,reference:$('#payref').value})});closeModal();payments();toast('Payment recorded')}catch(e){alert(e.message)}}
async function reports(){const rows=await api('/reports/sales');$('#content').innerHTML=header('Sales Reports',`<button class="btn" onclick="downloadCSV()">Export Invoices CSV</button>`)+`<div class="panel"><table class="table"><thead><tr><th>Date</th><th>Invoices</th><th>Subtotal</th><th>Discount</th><th>Tax</th><th>Total</th><th>Paid</th></tr></thead><tbody>${rows.map(x=>`<tr><td>${x.date}</td><td>${x.invoices}</td><td>${money(x.subtotal)}</td><td>${money(x.discount)}</td><td>${money(x.tax)}</td><td>${money(x.total)}</td><td>${money(x.paid)}</td></tr>`).join('')}</tbody></table></div>`}
async function gst(){const rows=await api('/reports/gst');$('#content').innerHTML=header('GST Reports')+`<div class="panel"><table class="table"><thead><tr><th>Date</th><th>Taxable</th><th>CGST</th><th>SGST</th><th>IGST</th><th>Total</th></tr></thead><tbody>${rows.map(x=>`<tr><td>${x.date}</td><td>${money(x.taxable)}</td><td>${money(x.cgst)}</td><td>${money(x.sgst)}</td><td>${money(x.igst)}</td><td>${money(x.total)}</td></tr>`).join('')}</tbody></table></div>`}
function settingsPage(){$('#content').innerHTML=header('Settings')+`<div class="panel"><div class="formgrid">${[['business_name','Business Name'],['tagline','Tagline'],['gstin','GSTIN'],['address','Business Address'],['phone','Phone'],['email','Email'],['invoice_prefix','Invoice Prefix'],['state','State']].map(f=>`<div class="field"><label>${f[1]}</label><input id="s_${f[0]}" value="${state.settings[f[0]]||''}"></div>`).join('')}</div><button class="btn primary" onclick="saveSettings()">Save Settings</button></div>`}
async function saveSettings(){const o={};['business_name','tagline','gstin','address','phone','email','invoice_prefix','state'].forEach(k=>o[k]=$('#s_'+k).value);state.settings=await api('/settings',{method:'PUT',body:JSON.stringify(o)});toast('Settings saved');go('dashboard')}
function openModal(){$('#modal').classList.add('open')}function closeModal(){$('#modal').classList.remove('open')}
function downloadCSV(){window.open('/api/export/invoices.csv?token='+token,'_blank')}function globalSearch(v){}
if(token)boot();else login();
