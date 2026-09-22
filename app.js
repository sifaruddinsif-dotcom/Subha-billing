const COMPANY_SEAL_SIGNATURE_DATA = 'data:image/webp;base64,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';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

let token=localStorage.getItem('sb_token'),
state={
  page:'dashboard',
  settings:{},
  customers:[],
  products:[],
  suppliers:[],
  invoices:[]
};

const api=async(path,opt={})=>{
  opt.headers={
    'Content-Type':'application/json',
    ...(opt.headers||{})
  };

  if(token) opt.headers.Authorization='Bearer '+token;

  const r=await fetch('/api'+path,opt);
  const d=await r.json().catch(()=>({}));

  if(!r.ok) throw Error(d.error||'Request failed');

  return d;
};

function toast(m){
  const t=$('#toast');
  if(!t)return;

  t.textContent=m;
  t.classList.add('show');

  setTimeout(()=>{
    t.classList.remove('show');
  },2500);
}

function money(n){
  return '₹ '+Number(n||0).toLocaleString('en-IN',{
    minimumFractionDigits:2,
    maximumFractionDigits:2
  });
}

/* =========================
   LOGIN
========================= */

function login(){

  document.body.innerHTML=`
    <div class="login">
      <div class="loginbox">

        <div class="brand">
          <div class="brandmark">₹</div>

          <div>
            <h1>SUBHA BILLING</h1>
            <div class="muted">
              Smart Billing. Premium Business.
            </div>
          </div>
        </div>

        <h2>Sign in</h2>

        <div class="field">
          <label>Email</label>
          <input
            id="lemail"
            value="${localStorage.getItem('sb_email')||'admin@subhabilling.com'}"
          >
        </div>

        <div class="field">
          <label>Password</label>
          <input
            id="lpass"
            type="password"
            value="ChangeMe123!"
          >
        </div>

        <button
          class="btn primary"
          style="width:100%"
          onclick="doLogin()"
        >
          Login
        </button>

        <p class="muted" style="font-size:12px">
          Change the default password before production.
        </p>

      </div>
    </div>
  `;
}

async function doLogin(){

  try{

    const d=await api('/login',{
      method:'POST',
      body:JSON.stringify({
        email:$('#lemail').value,
        password:$('#lpass').value
      })
    });

    token=d.token;

    localStorage.setItem('sb_token',token);
    localStorage.setItem('sb_email',$('#lemail').value);

    boot();

  }catch(e){
    alert(e.message);
  }
}

/* =========================
   MAIN SHELL
========================= */

function shell(){

  document.body.innerHTML=`

    <div class="layout">

      <aside class="side">

        <div class="brand">

          <div class="brandmark">SB</div>

          <div>
            <h1>
              SUBHA<br>
              <span style="color:#ffd34e">BILLING</span>
            </h1>

            <div
              class="muted"
              style="font-size:11px"
            >
              Smart Billing. Premium Business.
            </div>
          </div>

        </div>

        <nav class="nav">

          ${[
            ['dashboard','⌂ Dashboard'],
            ['billing','▣ Sales / Billing'],
            ['customers','♟ Customers'],
            ['products','▦ Products / Stock'],
            ['purchase','▰ Purchase'],
            ['payments','₹ Payments'],
            ['reports','◔ Reports'],
            ['gst','◎ GST Reports'],
            ['suppliers','♟ Suppliers'],
            ['settings','⚙ Settings']
          ].map(x=>`

            <button
              data-page="${x[0]}"
              onclick="go('${x[0]}')"
            >
              ${x[1]}
            </button>

          `).join('')}

        </nav>

        <div class="sidefoot">

          <b>SUBHA BILLING</b>

          <div
            class="muted"
            style="font-size:11px;margin-top:4px"
          >
            Stationery Items & FMCG
          </div>

          <div
            id="sideinfo"
            class="muted"
            style="font-size:11px;margin-top:9px"
          ></div>

          <button
            class="btn"
            style="width:100%;margin-top:12px"
            onclick="logout()"
          >
            Logout
          </button>

        </div>

      </aside>

      <main class="main">
        <div id="content"></div>
      </main>

    </div>

    <div id="modal" class="modal">
      <div id="modalbox" class="modalbox"></div>
    </div>

    <div id="toast" class="toast"></div>
  `;
}

function logout(){

  localStorage.removeItem('sb_token');
  token=null;

  login();
}

/* =========================
   BOOT
========================= */

async function boot(){

  try{

    const d=await api('/me');

    state.settings=d.settings;

    shell();

    await go('dashboard');

  }catch(e){

    logout();

  }
}

/* =========================
   NAVIGATION
========================= */

async function go(p){

  state.page=p;

  $$('.nav button').forEach(b=>{
    b.classList.toggle(
      'active',
      b.dataset.page===p
    );
  });

  if(p==='dashboard')
    return dashboard();

  if(p==='billing')
    return billing();

  if(p==='customers')
    return entityPage(
      'customers',
      'Customers',
      ['name','phone','gstin','state']
    );

  if(p==='suppliers')
    return entityPage(
      'suppliers',
      'Suppliers',
      ['name','phone','gstin','state']
    );

  if(p==='products')
    return products();

  if(p==='payments')
    return payments();

  if(p==='reports')
    return reports();

  if(p==='gst')
    return gst();

  if(p==='settings')
    return settingsPage();
}

/* =========================
   HEADER
========================= */

function header(title,button=''){

  return `

    <div class="top">

      <div>

        <h2 style="margin:0">
          ${title}
        </h2>

        <div class="muted">
          ${
            state.settings.tagline||
            'Smart Billing. Premium Business.'
          }
        </div>

      </div>

      <input
        class="search"
        placeholder="Search invoices, customers, products..."
        oninput="globalSearch(this.value)"
      >

      ${button}

    </div>

  `;
}

/* =========================
   DASHBOARD
========================= */

async function dashboard(){

  const d=await api('/dashboard');

  const max=Math.max(
    ...(d.chart.map(x=>x.total)),
    1
  );

  $('#content').innerHTML=

    header(
      'Dashboard',
      `
      <button
        class="btn primary"
        onclick="newInvoice()"
      >
        ＋ New Invoice
      </button>
      `
    )

    +

    `

    <div class="cards">

      <div class="card gold">
        <div class="label">TODAY'S SALES</div>
        <div class="value">${money(d.sales)}</div>
      </div>

      <div class="card">
        <div class="label">TODAY'S PURCHASE</div>
        <div class="value">${money(d.purchases)}</div>
      </div>

      <div class="card">
        <div class="label">TOTAL CUSTOMERS</div>
        <div class="value">${d.customers}</div>
      </div>

      <div class="card">
        <div class="label">PENDING PAYMENTS</div>
        <div class="value">${money(d.pending)}</div>
      </div>

      <div class="card">
        <div class="label">LOW STOCK ITEMS</div>
        <div class="value">${d.low}</div>
      </div>

    </div>

    <div class="grid2">

      <div class="panel">

        <h3>Sales Overview</h3>

        <div class="chart">

          ${d.chart.map(x=>`

            <div
              class="bar"
              style="height:${Math.max(
                3,
                x.total/max*100
              )}%"
            >
              <span>${x.day.slice(5)}</span>
            </div>

          `).join('')}

        </div>

      </div>

      <div class="panel">

        <h3>Quick Actions</h3>

        <div class="quick">

          <button onclick="newInvoice()">
            ▣<br>
            New Invoice
          </button>

          <button onclick="go('products')">
            ▦<br>
            Add Product
          </button>

          <button onclick="go('customers')">
            ♟<br>
            Add Customer
          </button>

          <button onclick="go('payments')">
            ₹<br>
            Receive Payment
          </button>

        </div>

      </div>

    </div>

    <div class="grid3">

      <div class="panel">

        <h3>Recent Invoices</h3>

        ${d.recent.map(i=>`

          <div class="listrow">

            <div>

              <b>${i.invoice_no}</b>

              <div class="muted">
                ${i.customer}
              </div>

            </div>

            <div style="text-align:right">

              ${money(i.total)}

              <br>

              <span class="status ${i.status.toLowerCase()}">
                ${i.status}
              </span>

            </div>

          </div>

        `).join('')}

      </div>

      <div class="panel">

        <h3>Low Stock Alert</h3>

        ${
          d.lowItems.map(p=>`

            <div class="listrow">

              <div>

                ${p.name}

                <div class="muted">
                  Stock: ${p.stock} ${p.unit}
                </div>

              </div>

              <span class="low">
                LOW
              </span>

            </div>

          `).join('')

          ||

          '<div class="muted">No low stock items.</div>'
        }

      </div>

      <div class="panel">

        <h3>Top Selling Products</h3>

        ${
          d.top.map((p,i)=>`

            <div class="listrow">

              <span>
                ${i+1}. ${p.name}
              </span>

              <b>
                ${money(p.amount)}
              </b>

            </div>

          `).join('')

          ||

          '<div class="muted">No sales yet.</div>'
        }

      </div>

    </div>
    `;
}

/* =========================
   CUSTOMERS / SUPPLIERS
========================= */

async function entityPage(type,title,cols){

  const data=await api('/'+type);

  state[type]=data;

  $('#content').innerHTML=

    header(
      title,
      `
      <button
        class="btn primary"
        onclick="openEntity('${type}')"
      >
        ＋ Add ${title.slice(0,-1)}
      </button>
      `
    )

    +

    `

    <div class="panel">

      <div class="tablewrap">

        <table class="table">

          <thead>

            <tr>

              <th>#</th>

              ${cols.map(c=>`

                <th>
                  ${c.replaceAll('_',' ').toUpperCase()}
                </th>

              `).join('')}

              <th>ACTIONS</th>

            </tr>

          </thead>

          <tbody>

            ${data.map((x,i)=>`

              <tr>

                <td>${i+1}</td>

                ${cols.map(c=>`

                  <td>
                    ${x[c]||'-'}
                  </td>

                `).join('')}

                <td class="actions">

                  <button
                    class="btn"
                    onclick="openEntity('${type}',${x.id})"
                  >
                    Edit
                  </button>

                  <button
                    class="btn danger"
                    onclick="delEntity('${type}',${x.id})"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            `).join('')}

          </tbody>

        </table>

      </div>

    </div>
    `;
}

const meta={

  customers:{
    title:'Customer',
    fields:[
      ['name','Name','text'],
      ['phone','Mobile','text'],
      ['gstin','GSTIN','text'],
      ['state','State','text'],
      ['address','Address','textarea']
    ]
  },

  suppliers:{
    title:'Supplier',
    fields:[
      ['name','Name','text'],
      ['phone','Mobile','text'],
      ['gstin','GSTIN','text'],
      ['state','State','text'],
      ['address','Address','textarea']
    ]
  }

};

function openEntity(type,id){

  const m=meta[type];

  const old=id
    ?state[type].find(x=>x.id==id)
    :{};

  $('#modalbox').innerHTML=`

    <div class="toolbar">

      <h3>
        ${id?'Edit':'Add'} ${m.title}
      </h3>

      <button
        class="btn"
        onclick="closeModal()"
      >
        ×
      </button>

    </div>

    <div class="formgrid">

      ${m.fields.map(f=>`

        <div class="field">

          <label>${f[1]}</label>

          ${
            f[2]==='textarea'

            ?

            `
            <textarea id="f_${f[0]}">
              ${old[f[0]]||''}
            </textarea>
            `

            :

            `
            <input
              id="f_${f[0]}"
              value="${old[f[0]]||''}"
            >
            `
          }

        </div>

      `).join('')}

    </div>

    <button
      class="btn primary"
      onclick="saveEntity('${type}',${id||0})"
    >
      Save
    </button>
  `;

  openModal();
}

async function saveEntity(type,id){

  const o={};

  meta[type].fields.forEach(f=>{
    o[f[0]]=$('#f_'+f[0]).value;
  });

  try{

    await api(
      '/'+type+(id?'/'+id:''),
      {
        method:id?'PUT':'POST',
        body:JSON.stringify(o)
      }
    );

    closeModal();

    await go(type);

    toast('Saved successfully');

  }catch(e){

    alert(e.message);

  }
}

async function delEntity(type,id){

  if(!confirm('Delete this record?'))
    return;

  try{

    await api(
      '/'+type+'/'+id,
      {method:'DELETE'}
    );

    go(type);

    toast('Deleted');

  }catch(e){

    alert(e.message);

  }
}

/* =========================
   PRODUCTS
========================= */

async function products(){

  const data=await api('/products');

  state.products=data;

  $('#content').innerHTML=

    header(
      'Products / Stock',
      `
      <button
        class="btn primary"
        onclick="openProduct()"
      >
        ＋ Add Product
      </button>
      `
    )

    +

    `

    <div class="panel">

      <div class="tablewrap">

        <table class="table">

          <thead>

            <tr>

              <th>Product</th>
              <th>SKU</th>
              <th>HSN</th>
              <th>GST</th>
              <th>Purchase</th>
              <th>Sale</th>
              <th>Stock</th>
              <th>Min Stock</th>
              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            ${data.map(p=>`

              <tr>

                <td>${p.name}</td>
                <td>${p.sku||'-'}</td>
                <td>${p.hsn||'-'}</td>
                <td>${p.gst}%</td>
                <td>${money(p.purchase_price)}</td>
                <td>${money(p.sale_price)}</td>

                <td class="${p.stock<=p.min_stock?'low':''}">
                  ${p.stock} ${p.unit}
                </td>

                <td>${p.min_stock}</td>

                <td>

                  <button
                    class="btn"
                    onclick="openProduct(${p.id})"
                  >
                    Edit
                  </button>

                  <button
                    class="btn danger"
                    onclick="delEntity('products',${p.id})"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            `).join('')}

          </tbody>

        </table>

      </div>

    </div>
    `;
}

function openProduct(id){

  const p=id
    ?state.products.find(x=>x.id==id)
    :{};

  const fs=[
    ['name','Product Name'],
    ['sku','SKU'],
    ['barcode','Barcode'],
    ['category','Category'],
    ['unit','Unit'],
    ['hsn','HSN/SAC'],
    ['purchase_price','Purchase Price'],
    ['sale_price','Sale Price'],
    ['gst','GST %'],
    ['stock','Opening Stock'],
    ['min_stock','Minimum Stock']
  ];

  $('#modalbox').innerHTML=`

    <div class="toolbar">

      <h3>
        ${id?'Edit':'Add'} Product
      </h3>

      <button
        class="btn"
        onclick="closeModal()"
      >
        ×
      </button>

    </div>

    <div class="formgrid">

      ${fs.map(f=>`

        <div class="field">

          <label>${f[1]}</label>

          <input
            id="p_${f[0]}"
            value="${p[f[0]]??''}"
          >

        </div>

      `).join('')}

    </div>

    <button
      class="btn primary"
      onclick="saveProduct(${id||0})"
    >
      Save Product
    </button>

  `;

  openModal();
}

async function saveProduct(id){

  const o={};

  [
    'name',
    'sku',
    'barcode',
    'category',
    'unit',
    'hsn',
    'purchase_price',
    'sale_price',
    'gst',
    'stock',
    'min_stock'
  ].forEach(k=>{
    o[k]=$('#p_'+k).value;
  });

  try{

    await api(
      '/products'+(id?'/'+id:''),
      {
        method:id?'PUT':'POST',
        body:JSON.stringify(o)
      }
    );

    closeModal();

    await products();

    toast('Product saved');

  }catch(e){

    alert(e.message);

  }
}

/* =========================
   BILLING
========================= */

async function billing(){

  const inv=await api('/invoices');

  state.invoices=inv;

  $('#content').innerHTML=

    header(
      'Sales / Billing',
      `
      <button
        class="btn primary"
        onclick="newInvoice()"
      >
        ＋ New Invoice
      </button>
      `
    )

    +

    `

    <div class="panel">

      <div class="toolbar">

        <b>Invoices</b>

        <button
          class="btn"
          onclick="downloadCSV()"
        >
          Export CSV
        </button>

      </div>

      <div class="tablewrap">

        <table class="table">

          <thead>

            <tr>
              <th>Invoice</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            ${inv.map(i=>`

              <tr>

                <td>${i.invoice_no}</td>
                <td>${i.created_at}</td>
                <td>${i.customer}</td>
                <td>${money(i.total)}</td>
                <td>${money(i.paid)}</td>
                <td>${money(i.total-i.paid)}</td>

                <td>
                  <span class="status ${i.status.toLowerCase()}">
                    ${i.status}
                  </span>
                </td>

                <td>

                  <button
                    class="btn"
                    onclick="viewInvoice(${i.id})"
                  >
                    View / Print
                  </button>

                </td>

              </tr>

            `).join('')}

          </tbody>

        </table>

      </div>

    </div>
    `;
}

/* =========================
   NEW INVOICE
========================= */

async function newInvoice(){

  const [customers,products]=await Promise.all([
    api('/customers'),
    api('/products')
  ]);

  state.customers=customers;
  state.products=products;

  let rows=[];

  const row=()=>{

    rows.push({
      product_id:products[0]?.id||'',
      qty:1,
      rate:products[0]?.sale_price||0,
      gst:Number(products[0]?.gst)||18,
      gst_mode:'EXCLUDING',
      discount:0
    });

    renderInvoiceModal(
      customers,
      products,
      rows
    );
  };

  row();
}

function updateInvoiceTotals(rows){
  const taxType=$('#itax')?.value||'LOCAL';
  let subtotal=0, taxable=0, tax=0;
  rows.forEach(r=>{
    const qty=Math.max(0,Number(r.qty)||0);
    const rate=Math.max(0,Number(r.rate)||0);
    const disc=Math.max(0,Number(r.discount)||0);
    const gst=Math.max(0,Number(r.gst??0)||0);
    const gross=qty*rate;
    const netGross=Math.max(0,gross-disc);
    const including=String(r.gst_mode||'EXCLUDING').toUpperCase()==='INCLUDING';
    const base=including ? (gst>0 ? netGross/(1+gst/100) : netGross) : netGross;
    subtotal+=gross;
    taxable+=base;
    tax+=including ? (netGross-base) : (base*gst/100);
  });
  const extra=Math.max(0,Number($('#idisc')?.value)||0);
  taxable=Math.max(0,taxable-extra);
  tax=taxable*(rows.length?tax/Math.max(1,taxable+extra):0);
  const total=taxable+tax;
  const el=$('#invoice-live-total');
  if(el) el.textContent=money(total);
  const sub=$('#invoice-live-subtotal');
  if(sub) sub.textContent=money(subtotal);
  const tx=$('#invoice-live-taxable');
  if(tx) tx.textContent=money(taxable);
  const tg=$('#invoice-live-tax');
  if(tg) tg.textContent=money(tax);
}

function renderInvoiceModal(
  customers,
  products,
  rows
){
  window._invoiceRows=rows;

  $('#modalbox').innerHTML=`

    <div class="toolbar">

      <div>

        <h3>
          New GST Invoice
        </h3>

        <div class="muted">
          ${state.settings.business_name}
        </div>

      </div>

      <button
        class="btn"
        onclick="closeModal()"
      >
        ×
      </button>

    </div>

    <div class="formgrid">

      <div class="field">

        <label>Customer</label>

        <select id="icust">

          <option value="">
            Walk-in Customer
          </option>

          ${customers.map(c=>`

            <option value="${c.id}">
              ${c.name}
              ${c.phone?'— '+c.phone:''}
            </option>

          `).join('')}

        </select>

      </div>

      <div class="field">

        <label>Tax Type</label>

        <select id="itax">

          <option value="LOCAL">
            CGST + SGST
          </option>

          <option value="IGST">
            IGST
          </option>

        </select>

      </div>

    </div>

    <table class="invoice-items">

      <thead>

        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Discount</th>
          <th>GST %</th>
          <th>GST Type</th>
          <th></th>
        </tr>

      </thead>

      <tbody>

        ${rows.map((r,i)=>`

          <tr>

            <td>

              <select
                onchange="
                  window._invoiceRows[${i}].product_id=this.value;
                  window._invoiceRows[${i}].rate=Number(
                    this.selectedOptions[0].dataset.rate||0
                  );
                  window._invoiceRows[${i}].gst=Number(
                    this.selectedOptions[0].dataset.gst||18
                  );
                  renderInvoiceModal(
                    state.customers,
                    state.products,
                    window._invoiceRows
                  )
                "
              >

                ${products.map(p=>`

                  <option
                    data-rate="${p.sale_price}"
                    data-gst="${p.gst}"
                    value="${p.id}"
                    ${p.id==r.product_id?'selected':''}
                  >
                    ${p.name} — ${p.sale_price}
                  </option>

                `).join('')}

              </select>

            </td>

            <td>

              <input
                type="number"
                min="0.01"
                step="0.01"
                value="${r.qty}"
                oninput="
                  window._invoiceRows[${i}].qty=Math.max(0,Number(this.value)||0);
                  updateInvoiceTotals(window._invoiceRows);
                "
              >

            </td>

            <td>

              <input
                type="number"
                step="0.01"
                value="${r.rate}"
                oninput="
                  window._invoiceRows[${i}].rate=Math.max(0,Number(this.value)||0);
                  updateInvoiceTotals(window._invoiceRows);
                "
              >

            </td>

            <td>

              <input
                type="number"
                step="0.01"
                value="${r.discount}"
                oninput="
                  window._invoiceRows[${i}].discount=Math.max(0,Number(this.value)||0);
                  updateInvoiceTotals(window._invoiceRows);
                "
              >

            </td>

            <td>
              <select
                onchange="
                  window._invoiceRows[${i}].gst=Number(this.value);
                  updateInvoiceTotals(window._invoiceRows)
                "
              >
                ${[0,5,12,18,28,40].map(g=>`
                  <option value="${g}" ${Number(r.gst??products.find(p=>p.id==r.product_id)?.gst??18)===g?'selected':''}>${g}%</option>
                `).join('')}
              </select>
            </td>
            <td>
              <select onchange="window._invoiceRows[${i}].gst_mode=this.value; updateInvoiceTotals(window._invoiceRows)">
                <option value="EXCLUDING" ${String(r.gst_mode||'EXCLUDING')==='EXCLUDING'?'selected':''}>Excluding GST</option>
                <option value="INCLUDING" ${String(r.gst_mode||'EXCLUDING')==='INCLUDING'?'selected':''}>Including GST</option>
              </select>
            </td>

            <td>

              <button
                class="btn danger"
                onclick="
                  window._invoiceRows.splice(${i},1);
                  renderInvoiceModal(
                    state.customers,
                    state.products,
                    window._invoiceRows
                  )
                "
              >
                ×
              </button>

            </td>

          </tr>

        `).join('')}

      </tbody>

    </table>

    <div style="margin-top:10px">

      <button
        class="btn"
        onclick="
          window._invoiceRows.push({
            product_id:state.products[0]?.id||'',
            qty:1,
            rate:state.products[0]?.sale_price||0,
            gst:Number(state.products[0]?.gst)||18,
            gst_mode:'EXCLUDING',
            discount:0
          });

          renderInvoiceModal(
            state.customers,
            state.products,
            window._invoiceRows
          )
        "
      >
        ＋ Add Item
      </button>

    </div>

    <div
      class="formgrid"
      style="margin-top:10px"
    >

      <div class="field">

        <label>
          Additional Discount
        </label>

        <input
          id="idisc"
          type="number"
          value="0"
          oninput="updateInvoiceTotals(window._invoiceRows)"
        >

      </div>

      <div class="field">

        <label>
          Paid Amount
        </label>

        <input
          id="ipaid"
          type="number"
          value="0"
        >

      </div>

      <div class="field">

        <label>
          Payment Mode
        </label>

        <select id="imode">

          <option>Cash</option>
          <option>UPI</option>
          <option>Bank</option>
          <option>Card</option>
          <option>Credit</option>

        </select>

      </div>

      <div class="field">

        <label>
          Notes
        </label>

        <input id="inote">

      </div>

    </div>

    <div class="invoice-live-summary" style="margin:14px 0;padding:12px;border:1px solid #ddd;border-radius:8px">
      <div><span>Subtotal: </span><b id="invoice-live-subtotal">₹ 0.00</b></div>
      <div><span>Taxable Value: </span><b id="invoice-live-taxable">₹ 0.00</b></div>
      <div><span>GST: </span><b id="invoice-live-tax">₹ 0.00</b></div>
      <div style="font-size:18px;margin-top:6px"><span>Grand Total: </span><b id="invoice-live-total">₹ 0.00</b></div>
    </div>

    <button
      class="btn primary"
      onclick='saveInvoice(window._invoiceRows)'
    >
      Create Invoice
    </button>

  `;

  openModal();
  updateInvoiceTotals(window._invoiceRows);
}

/* =========================
   SAVE INVOICE
========================= */

async function saveInvoice(rows){

  try{

    const d=await api('/invoices',{
      method:'POST',

      body:JSON.stringify({

        customer_id:
          $('#icust').value||null,

        tax_type:
          $('#itax').value,

        discount:
          Number($('#idisc').value)||0,

        paid:
          Number($('#ipaid').value)||0,

        payment_mode:
          $('#imode').value,

        notes:
          $('#inote').value,

        items:rows

      })
    });

    closeModal();

    toast(
      'Invoice '+d.invoice_no+' created'
    );

    await billing();

    viewInvoice(d.id);

  }catch(e){

    alert(e.message);

  }
}

/* =========================
   FINAL TALLY ERP 9 A4 INVOICE
========================= */

function amountInWordsINR(value){
  let n=Math.round(Number(value)||0);
  if(n===0) return 'Zero Rupees Only';
  const ones=['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens=['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  const two=x=>x<20?ones[x]:tens[Math.floor(x/10)]+(x%10?' '+ones[x%10]:'');
  const three=x=>x<100?two(x):ones[Math.floor(x/100)]+' Hundred'+(x%100?' '+two(x%100):'');
  const p=[];
  if(n>=10000000){p.push(three(Math.floor(n/10000000))+' Crore');n%=10000000;}
  if(n>=100000){p.push(three(Math.floor(n/100000))+' Lakh');n%=100000;}
  if(n>=1000){p.push(three(Math.floor(n/1000))+' Thousand');n%=1000;}
  if(n>0)p.push(three(n));
  return p.join(' ')+' Rupees Only';
}

function invoiceDate(value){
  const s=String(value||'').trim();
  const m=s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? m[3]+'-'+m[2]+'-'+m[1] : (s||'—');
}

async function viewInvoice(id){
  try{
    const i=await api('/invoices/'+id);
    const b=state.settings||{};
    const igst=Number(i.igst||0)>0;
    const customer=i.customer||'Walk-in Customer';
    const addr=i.address||'';
    const phone=i.phone||'-';
    const gstin=i.gstin||'-';
    const supply=i.state||b.state||'-';
    const taxGroups={};
    let taxAnalysisTaxable=0, taxAnalysisCGST=0, taxAnalysisSGST=0, taxAnalysisIGST=0;
    (i.items||[]).forEach(x=>{
      const hsn=String(x.hsn||'-');
      const base=Number(x.taxable)||0;
      const tax=Number(x.tax)||0;
      const gr=Number(x.gst)||0;
      taxAnalysisTaxable+=base;
      if(igst) taxAnalysisIGST+=tax;
      else {
        taxAnalysisCGST+=tax/2;
        taxAnalysisSGST+=tax/2;
      }
      if(!taxGroups[hsn]) taxGroups[hsn]={hsn,taxable:0,cgst:0,sgst:0,igst:0,gst:gr};
      taxGroups[hsn].taxable+=base;
      if(igst) taxGroups[hsn].igst+=tax;
      else {
        taxGroups[hsn].cgst+=tax/2;
        taxGroups[hsn].sgst+=tax/2;
      }
      if(!taxGroups[hsn].gst && gr) taxGroups[hsn].gst=gr;
    });
    const taxAnalysisRows=Object.values(taxGroups).map(g=>{
      const rate=igst?0:Number(g.gst||0)/2;
      const totalTax=igst?g.igst:g.cgst+g.sgst;
      return '<tr><td>'+g.hsn+'</td><td class="r">'+money(g.taxable)+'</td><td class="c">'+(igst?'-':rate.toFixed(0)+'%')+'</td><td class="r">'+(igst?'-':money(g.cgst))+'</td><td class="c">'+(igst?'-':rate.toFixed(0)+'%')+'</td><td class="r">'+(igst?'-':money(g.sgst))+'</td><td class="r">'+money(totalTax)+'</td></tr>';
    }).join('');
    const taxAnalysisTotalTax=taxAnalysisCGST+taxAnalysisSGST+taxAnalysisIGST;
    const taxAnalysis='<div class="tax-analysis"><div class="tax-analysis-title">Tax Analysis</div><table class="tax-analysis-table"><thead><tr><th rowspan="2">HSN/SAC</th><th rowspan="2">Taxable<br>Value</th><th colspan="2">CGST</th><th colspan="2">SGST/UTGST</th><th rowspan="2">Total<br>Tax Amount</th></tr><tr><th>Rate</th><th>Amount</th><th>Rate</th><th>Amount</th></tr></thead><tbody>'+taxAnalysisRows+'</tbody><tfoot><tr><th>Total</th><th class="r">'+money(taxAnalysisTaxable)+'</th><th></th><th class="r">'+money(taxAnalysisCGST)+'</th><th></th><th class="r">'+money(taxAnalysisSGST)+'</th><th class="r">'+money(taxAnalysisTotalTax)+'</th></tr></tfoot></table></div>';

    const rows=(i.items||[]).map((x,n)=>{
      const qty=Number(x.qty)||0, rate=Number(x.rate)||0, base=Number(x.taxable)||0, tax=Number(x.tax)||0;
      const disc=Number(x.discount)||0, gross=qty*rate;
      const discPct=gross?disc/gross*100:0, gr=Number(x.gst)||0;
      const displayName=String(x.name||'-').trim().toLowerCase()==='register no 10' ? 'Register No. 10' : (x.name||'-');
      const cg=igst?0:tax/2, sg=igst?0:tax/2, total=Number(x.total)||0;
      return '<tr>'+'<td class="c">'+(n+1)+'</td>'+'<td><b>'+displayName+'</b></td>'+'<td class="c">'+(x.hsn||'-')+'</td>'+'<td class="r">'+qty.toFixed(2)+'</td>'+'<td class="c">'+(x.unit||'Nos')+'</td>'+'<td class="r">'+money(rate)+'</td>'+'<td class="r">'+discPct.toFixed(2)+'</td>'+'<td class="r">'+money(base)+'</td>'+'<td class="c">'+(igst?'-':(gr/2).toFixed(0)+'%')+'</td>'+'<td class="r">'+(igst?'-':money(cg))+'</td>'+'<td class="c">'+(igst?'-':(gr/2).toFixed(0)+'%')+'</td>'+'<td class="r">'+(igst?'-':money(sg))+'</td>'+'<td class="r"><b>'+money(total)+'</b></td>'+'</tr>';
    }).join('');
    $('#modalbox').innerHTML='<div class="toolbar no-print"><h3>Invoice '+(i.invoice_no||'')+'</h3><div class="actions"><button class="btn primary" onclick="window.print()">🖨 Print / Save PDF</button><button class="btn" onclick="closeModal()">Close</button></div></div>'+'<div class="invoice-print tally-invoice">'+
      '<div class="tally-top"><div class="tally-left"><div class="company-tax-row"><div class="brand-box"><div class="s3-logo">S3</div><div class="subha-word">SUBHA</div><div class="billing-word">BILLING</div></div><div class="company-details"><div class="company-name">'+(b.business_name||'SUBHA BILLING')+'</div><div>'+(b.address||'')+'</div><div>Phone&nbsp; : '+(b.phone||'-')+'</div><div>E-mail&nbsp; : '+(b.email||'-')+'</div><div>Website : '+(b.website||'-')+'</div><div>GSTIN&nbsp; : '+(b.gstin||'-')+'</div></div><div class="tax-title"><h1>TAX INVOICE</h1><em>(ORIGINAL FOR RECIPIENT)</em></div></div><div class="bill-to-box"><div class="bill-title">Bill To</div><b>M/s. '+customer+'</b><div>'+addr+'</div><div>GSTIN&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: '+gstin+'</div><div>State&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: '+supply+'</div><div>Phone&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: '+phone+'</div><div>Place of Supply : '+supply+'</div></div></div>'+
      '<div class="invoice-meta"><div><span>Invoice No.</span><b>'+(i.invoice_no||'-')+'</b></div><div><span>Dated</span><b>'+invoiceDate(i.created_at)+'</b></div><div><span>Delivery Note</span><b>'+(i.delivery_note||'—')+'</b></div><div><span>Mode/Terms of Payment</span><b>'+(i.payment_mode||'—')+'</b></div><div><span>Reference No. &amp; Date.</span><b>'+(i.reference_no||'—')+'</b></div><div><span>Other References</span><b>'+(i.other_references||'—')+'</b></div><div><span>Buyer’s Order No.</span><b>'+(i.buyer_order_no||'—')+'</b></div><div><span>Dated</span><b>'+(i.buyer_order_date||'—')+'</b></div><div><span>Dispatch Doc No.</span><b>'+(i.dispatch_doc_no||'—')+'</b></div><div><span>Delivery Note Date</span><b>'+(i.delivery_note_date||'—')+'</b></div><div><span>Dispatched through</span><b>'+(i.dispatched_through||'—')+'</b></div><div><span>Destination</span><b>'+(i.destination||'—')+'</b></div><div class="meta-wide"><span>Terms of Delivery</span><b>'+(i.terms_of_delivery||'—')+'</b></div></div></div>'+
      '<table class="tally-table tally-items"><colgroup><col><col><col><col><col><col><col><col><col><col><col><col><col></colgroup><thead><tr><th rowspan="2">Sl<br>No.</th><th rowspan="2">Description of Goods / Services</th><th rowspan="2">HSN/SAC</th><th rowspan="2">Qty.</th><th rowspan="2">Unit</th><th rowspan="2">Rate</th><th rowspan="2">Disc. %</th><th rowspan="2">Taxable<br>Value</th><th colspan="4">Tax Amount</th><th rowspan="2">Total Amount<br>(₹)</th></tr><tr><th>CGST<br>Rate</th><th>Amount</th><th>SGST<br>Rate</th><th>Amount</th></tr></thead><tbody>'+rows+'</tbody></table>'+
      '<div class="amount-total-row"><div class="amount-words"><div class="label">Amount Chargeable (in words)</div><b>INR '+amountInWordsINR(i.total)+'</b></div><div class="summary-total"><div><span>Total Taxable Value</span><b>'+money(i.taxable)+'</b></div><div><span>Total CGST</span><b>'+money(i.cgst)+'</b></div><div><span>Total SGST</span><b>'+money(i.sgst)+'</b></div><div><span>Total IGST</span><b>'+money(i.igst)+'</b></div><div><span>Round Off</span><b>'+money(i.roundoff)+'</b></div><div class="grand-total-row"><span>Grand Total</span><b>'+money(i.total)+'</b></div><div class="eoe">(E &amp; O.E)</div></div></div>'+
      taxAnalysis+      '<div class="bottom-three"><div><div class="label">Company\'s Bank Details</div><div>Bank Name&nbsp;&nbsp;&nbsp;: '+(b.bank_name||'—')+'</div><div>A/c No.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: '+(b.bank_account||'—')+'</div><div>IFSC Code&nbsp;&nbsp;&nbsp;&nbsp;: '+(b.ifsc||'—')+'</div><div>Branch&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: '+(b.branch||'—')+'</div></div><div><div class="label">Terms &amp; Conditions</div><div>1. Goods once sold will not be taken back.</div><div>2. Interest @ 18% p.a. will be charged on overdue payments.</div><div>3. All disputes are subject to '+supply+' Jurisdiction.</div><div>4. Payment is to be made within 15 days.</div></div><div class="authorised-box"><div>For <b>'+(b.business_name||'SUBHA BILLING')+'</b></div><img class="company-seal-signature" src="'+COMPANY_SEAL_SIGNATURE_DATA+'" alt="Company Seal and Signature"><b>Authorised Signatory</b></div></div>'+
      '<div class="declaration-row"><div><span class="rupee-circle">₹</span>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</div><div><b>Receiver\'s Signature</b><div class="dotted-sign"></div></div></div><div class="computer-generated">This is a Computer Generated Invoice</div></div>';
    openModal();
  }catch(e){alert(e.message||'Unable to open invoice');}
}
/* =========================
   PAYMENTS
========================= */

async function payments(){

  const p=await api('/payments');

  $('#content').innerHTML=

    header(
      'Payments',
      `
      <button
        class="btn primary"
        onclick="receivePayment()"
      >
        ＋ Receive Payment
      </button>
      `
    )

    +

    `

    <div class="panel">

      <div class="tablewrap">

        <table class="table">

          <thead>

            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Invoice</th>
              <th>Amount</th>
              <th>Mode</th>
              <th>Reference</th>
            </tr>

          </thead>

          <tbody>

            ${p.map(x=>`

              <tr>

                <td>${x.created_at}</td>
                <td>${x.customer}</td>
                <td>${x.invoice_no||'-'}</td>
                <td>${money(x.amount)}</td>
                <td>${x.mode}</td>
                <td>${x.reference||'-'}</td>

              </tr>

            `).join('')}

          </tbody>

        </table>

      </div>

    </div>
    `;
}

async function receivePayment(){

  const inv=await api('/invoices');

  $('#modalbox').innerHTML=`

    <div class="toolbar">

      <h3>
        Receive Payment
      </h3>

      <button
        class="btn"
        onclick="closeModal()"
      >
        ×
      </button>

    </div>

    <div class="field">

      <label>
        Invoice
      </label>

      <select id="payinv">

        ${inv
          .filter(i=>i.total>i.paid)
          .map(i=>`

            <option value="${i.id}">
              ${i.invoice_no}
              —
              ${i.customer}
              —
              Balance
              ${money(i.total-i.paid)}
            </option>

          `).join('')}

      </select>

    </div>

    <div class="field">

      <label>
        Amount
      </label>

      <input
        id="payamt"
        type="number"
      >

    </div>

    <div class="field">

      <label>
        Mode
      </label>

      <select id="paymode">

        <option>Cash</option>
        <option>UPI</option>
        <option>Bank</option>
        <option>Card</option>

      </select>

    </div>

    <div class="field">

      <label>
        Reference
      </label>

      <input id="payref">

    </div>

    <button
      class="btn primary"
      onclick="savePayment()"
    >
      Save Payment
    </button>

  `;

  openModal();
}

async function savePayment(){

  try{

    await api(
      '/invoices/'+$('#payinv').value+'/payment',
      {
        method:'POST',

        body:JSON.stringify({
          amount:Number($('#payamt').value),
          mode:$('#paymode').value,
          reference:$('#payref').value
        })
      }
    );

    closeModal();

    payments();

    toast('Payment recorded');

  }catch(e){

    alert(e.message);

  }
}

/* =========================
   REPORTS
========================= */

async function reports(){

  const rows=await api('/reports/sales');

  $('#content').innerHTML=

    header(
      'Sales Reports',
      `
      <button
        class="btn"
        onclick="downloadCSV()"
      >
        Export Invoices CSV
      </button>
      `
    )

    +

    `

    <div class="panel">

      <table class="table">

        <thead>

          <tr>

            <th>Date</th>
            <th>Invoices</th>
            <th>Subtotal</th>
            <th>Discount</th>
            <th>Tax</th>
            <th>Total</th>
            <th>Paid</th>

          </tr>

        </thead>

        <tbody>

          ${rows.map(x=>`

            <tr>

              <td>${x.date}</td>
              <td>${x.invoices}</td>
              <td>${money(x.subtotal)}</td>
              <td>${money(x.discount)}</td>
              <td>${money(x.tax)}</td>
              <td>${money(x.total)}</td>
              <td>${money(x.paid)}</td>

            </tr>

          `).join('')}

        </tbody>

      </table>

    </div>
    `;
}

/* =========================
   GST REPORT
========================= */

async function gst(){

  const rows=await api('/reports/gst');

  $('#content').innerHTML=

    header('GST Reports')

    +

    `

    <div class="panel">

      <table class="table">

        <thead>

          <tr>

            <th>Date</th>
            <th>Taxable</th>
            <th>CGST</th>
            <th>SGST</th>
            <th>IGST</th>
            <th>Total</th>

          </tr>

        </thead>

        <tbody>

          ${rows.map(x=>`

            <tr>

              <td>${x.date}</td>
              <td>${money(x.taxable)}</td>
              <td>${money(x.cgst)}</td>
              <td>${money(x.sgst)}</td>
              <td>${money(x.igst)}</td>
              <td>${money(x.total)}</td>

            </tr>

          `).join('')}

        </tbody>

      </table>

    </div>
    `;
}

/* =========================
   SETTINGS
========================= */

function settingsPage(){

  $('#content').innerHTML=

    header('Settings')

    +

    `

    <div class="panel">

      <div class="formgrid">

        ${[
          ['business_name','Business Name'],
          ['tagline','Tagline'],
          ['gstin','GSTIN'],
          ['address','Business Address'],
          ['phone','Phone'],
          ['email','Email'],
          ['website','Website'],
          ['invoice_prefix','Invoice Prefix'],
          ['state','State'],
          ['bank_name','Bank Name'],
          ['bank_account','A/c Number'],
          ['ifsc','IFSC Code'],
          ['branch','Bank Branch']
        ].map(f=>`

          <div class="field">

            <label>
              ${f[1]}
            </label>

            <input
              id="s_${f[0]}"
              value="${state.settings[f[0]]||''}"
            >

          </div>

        `).join('')}

      </div>

      <button
        class="btn primary"
        onclick="saveSettings()"
      >
        Save Settings
      </button>

    </div>
    `;
}

async function saveSettings(){

  const o={};

  [
    'business_name',
    'tagline',
    'gstin',
    'address',
    'phone',
    'email',
    'website',
    'invoice_prefix',
    'state',
    'bank_name',
    'bank_account',
    'ifsc',
    'branch'
  ].forEach(k=>{
    o[k]=$('#s_'+k).value;
  });

  state.settings=await api(
    '/settings',
    {
      method:'PUT',
      body:JSON.stringify(o)
    }
  );

  toast('Settings saved');

  go('dashboard');
}

/* =========================
   MODAL
========================= */

function openModal(){

  $('#modal').classList.add('open');

}

function closeModal(){

  $('#modal').classList.remove('open');

}

/* =========================
   CSV
========================= */

function downloadCSV(){

  window.open(
    '/api/export/invoices.csv?token='+token,
    '_blank'
  );

}

/* =========================
   SEARCH
========================= */

function globalSearch(v){

  /*
    Global search hook.
    Existing API/pages remain unchanged.
  */

}

/* =========================
   START APPLICATION
========================= */

if(token)
  boot();
else
  login();
