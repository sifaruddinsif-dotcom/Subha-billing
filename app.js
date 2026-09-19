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

function renderInvoiceModal(
  customers,
  products,
  rows
){

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
          <th></th>
        </tr>

      </thead>

      <tbody>

        ${rows.map((r,i)=>`

          <tr>

            <td>

              <select
                onchange="
                  rows[${i}].product_id=this.value;
                  rows[${i}].rate=Number(
                    this.selectedOptions[0].dataset.rate||0
                  );
                  renderInvoiceModal(
                    state.customers,
                    state.products,
                    rows
                  )
                "
              >

                ${products.map(p=>`

                  <option
                    data-rate="${p.sale_price}"
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
                onchange="
                  rows[${i}].qty=Number(this.value)
                "
              >

            </td>

            <td>

              <input
                type="number"
                step="0.01"
                value="${r.rate}"
                onchange="
                  rows[${i}].rate=Number(this.value)
                "
              >

            </td>

            <td>

              <input
                type="number"
                step="0.01"
                value="${r.discount}"
                onchange="
                  rows[${i}].discount=Number(this.value)
                "
              >

            </td>

            <td>

              <button
                class="btn danger"
                onclick="
                  rows.splice(${i},1);
                  renderInvoiceModal(
                    state.customers,
                    state.products,
                    rows
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
          rows.push({
            product_id:products[0]?.id||'',
            qty:1,
            rate:products[0]?.sale_price||0,
            discount:0
          });

          renderInvoiceModal(
            state.customers,
            state.products,
            rows
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

    <button
      class="btn primary"
      onclick='saveInvoice(${JSON.stringify(rows)})'
    >
      Create Invoice
    </button>

  `;

  openModal();
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
   TALLY ERP 9 STYLE INVOICE
========================= */

function amountInWordsINR(value){

  let n = Math.round(Number(value) || 0);

  if(n === 0) return 'Zero Rupees Only';

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six',
    'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
    'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];

  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty',
    'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  function two(x){

    if(x < 20) return ones[x];

    return tens[Math.floor(x / 10)] +
      (x % 10 ? ' ' + ones[x % 10] : '');
  }

  function three(x){

    if(x < 100) return two(x);

    return ones[Math.floor(x / 100)] +
      ' Hundred' +
      (x % 100 ? ' ' + two(x % 100) : '');
  }

  const parts = [];

  if(n >= 10000000){

    parts.push(
      three(Math.floor(n / 10000000)) + ' Crore'
    );

    n %= 10000000;
  }

  if(n >= 100000){

    parts.push(
      three(Math.floor(n / 100000)) + ' Lakh'
    );

    n %= 100000;
  }

  if(n >= 1000){

    parts.push(
      three(Math.floor(n / 1000)) + ' Thousand'
    );

    n %= 1000;
  }

  if(n > 0){
    parts.push(three(n));
  }

  return parts.join(' ') + ' Rupees Only';
}


async function viewInvoice(id){

  const i = await api('/invoices/' + id);

  const business = state.settings || {};

  const isIGST = Number(i.igst || 0) > 0;

  const customerName =
    i.customer || 'Walk-in Customer';

  const customerAddress =
    i.address || '';

  const customerPhone =
    i.phone || '-';

  const customerGstin =
    i.gstin || '-';

  const supplyState =
    i.state || business.state || '-';


  const items = (i.items || []).map((x,n) => {

    const base =
      Number(x.taxable) || 0;

    const tax =
      Number(x.tax) || 0;

    const rate =
      Number(x.rate) || 0;

    const qty =
      Number(x.qty) || 0;

    const discount =
      Number(x.discount) || 0;

    const gross =
      qty * rate;

    const discPct =
      gross > 0
        ? (discount / gross * 100)
        : 0;

    const gstRate =
      Number(x.gst) || 0;

    const cgst =
      isIGST ? 0 : tax / 2;

    const sgst =
      isIGST ? 0 : tax / 2;

    const total =
      Number(x.total) || 0;


    return `

      <tr>

        <td class="center">
          ${n + 1}
        </td>

        <td>
          <b>${x.name || '-'}</b>
        </td>

        <td class="center">
          ${x.hsn || '-'}
        </td>

        <td class="right">
          ${qty}
        </td>

        <td class="center">
          ${x.unit || 'PCS'}
        </td>

        <td class="right">
          ${money(rate)}
        </td>

        <td class="right">
          ${discPct.toFixed(2)}
        </td>

        <td class="right">
          ${money(base)}
        </td>

        <td class="center">
          ${
            isIGST
              ? '-'
              : (gstRate / 2).toFixed(2) + '%'
          }
        </td>

        <td class="right">
          ${
            isIGST
              ? '-'
              : money(cgst)
          }
        </td>

        <td class="center">
          ${
            isIGST
              ? '-'
              : (gstRate / 2).toFixed(2) + '%'
          }
        </td>

        <td class="right">
          ${
            isIGST
              ? '-'
              : money(sgst)
          }
        </td>

        <td class="right">
          <b>
            ${money(total)}
          </b>
        </td>

      </tr>

    `;

  }).join('');


  $('#modalbox').innerHTML = `

    <div class="toolbar no-print">

      <h3>
        Invoice ${i.invoice_no || ''}
      </h3>

      <div class="actions">

        <button
          class="btn primary"
          onclick="window.print()"
        >
          🖨 Print / Save PDF
        </button>

        <button
          class="btn"
          onclick="closeModal()"
        >
          Close
        </button>

      </div>

    </div>


    <div class="invoice-print tally-invoice">


      <!-- HEADER -->

      <div class="tally-top">


        <div class="tally-company">

          <div class="company-logo">

            <div class="logo-mark">
              S3
            </div>

            <div class="logo-name">
              SUBHA
            </div>

            <div class="logo-billing">
              BILLING
            </div>

          </div>


          <div class="company-details">

            <div class="company-name">
              ${
                business.business_name ||
                'SUBHA BILLING'
              }
            </div>

            <div>
              ${business.address || ''}
            </div>

            <div>
              Phone : ${business.phone || '-'}
            </div>

            <div>
              E-mail : ${business.email || '-'}
            </div>

            <div>
              Website : ${business.website || '-'}
            </div>

            <div>
              <b>
                GSTIN : ${business.gstin || '-'}
              </b>
            </div>

          </div>

        </div>


        <div class="tax-title">

          <h1>
            TAX INVOICE
          </h1>

          <em>
            (ORIGINAL FOR RECIPIENT)
          </em>

        </div>


        <!-- INVOICE DETAILS -->

        <div class="invoice-meta">

          <div>
            <span>Invoice No.</span>
            <b>${i.invoice_no || '-'}</b>
          </div>

          <div>
            <span>Dated</span>
            <b>${i.created_at || '-'}</b>
          </div>

          <div>
            <span>Delivery Note</span>
            <b>${i.delivery_note || '—'}</b>
          </div>

          <div>
            <span>Mode/Terms of Payment</span>
            <b>${i.payment_mode || '—'}</b>
          </div>

          <div>
            <span>Reference No. & Date</span>
            <b>${i.reference_no || '—'}</b>
          </div>

          <div>
            <span>Other References</span>
            <b>${i.other_references || '—'}</b>
          </div>

          <div>
            <span>Buyer's Order No.</span>
            <b>${i.buyer_order_no || '—'}</b>
          </div>

          <div>
            <span>Dated</span>
            <b>${i.buyer_order_date || '—'}</b>
          </div>

          <div>
            <span>Dispatch Doc No.</span>
            <b>${i.dispatch_doc_no || '—'}</b>
          </div>

          <div>
            <span>Delivery Note Date</span>
            <b>${i.delivery_note_date || '—'}</b>
          </div>

          <div>
            <span>Dispatched through</span>
            <b>${i.dispatched_through || '—'}</b>
          </div>

          <div>
            <span>Destination</span>
            <b>${i.destination || '—'}</b>
          </div>

          <div class="meta-wide">
            <span>Terms of Delivery</span>
            <b>${i.terms_of_delivery || '—'}</b>
          </div>

        </div>

      </div>


      <!-- BILL TO -->

      <div class="bill-to-box">

        <div>

          <div class="section-label">
            Bill To
          </div>

          <strong>
            ${customerName}
          </strong>

          <div>
            ${customerAddress}
          </div>

          <div>
            GSTIN : ${customerGstin}
          </div>

          <div>
            State : ${supplyState}
          </div>

          <div>
            Phone : ${customerPhone}
          </div>

          <div>
            Place of Supply : ${supplyState}
          </div>

        </div>

      </div>


      <!-- ITEM TABLE -->

      <table class="tally-table tally-items">

        <thead>

          <tr>

            <th rowspan="2">
              Sl<br>No.
            </th>

            <th rowspan="2">
              Description of Goods / Services
            </th>

            <th rowspan="2">
              HSN/SAC
            </th>

            <th rowspan="2">
              Qty.
            </th>

            <th rowspan="2">
              Unit
            </th>

            <th rowspan="2">
              Rate
            </th>

            <th rowspan="2">
              Disc. %
            </th>

            <th rowspan="2">
              Taxable<br>Value
            </th>

            <th colspan="4">
              Tax Amount
            </th>

            <th rowspan="2">
              Total Amount<br>(₹)
            </th>

          </tr>


          <tr>

            <th>
              CGST<br>Rate
            </th>

            <th>
              Amount
            </th>

            <th>
              SGST<br>Rate
            </th>

            <th>
              Amount
            </th>

          </tr>

        </thead>


        <tbody>

          ${items}

        </tbody>

      </table>


      <!-- TOTAL -->

      <div class="amount-total-row">


        <div class="amount-words">

          <div class="section-label">
            Amount Chargeable (in words)
          </div>

          <strong>
            ${amountInWordsINR(i.total)}
          </strong>

        </div>


        <div class="summary-total">

          <div>
            <span>
              Total Taxable Value
            </span>

            <b>
              ${money(i.taxable)}
            </b>
          </div>


          <div>
            <span>
              Total CGST
            </span>

            <b>
              ${money(i.cgst)}
            </b>
          </div>


          <div>
            <span>
              Total SGST
            </span>

            <b>
              ${money(i.sgst)}
            </b>
          </div>


          <div>
            <span>
              Total IGST
            </span>

            <b>
              ${money(i.igst)}
            </b>
          </div>


          <div>
            <span>
              Round Off
            </span>

            <b>
              ${money(i.roundoff)}
            </b>
          </div>


          <div class="grand-total-row">

            <span>
              Grand Total
            </span>

            <b>
              ₹ ${money(i.total)}
            </b>

          </div>


          <div class="eoe">
            (E & O.E)
          </div>

        </div>

      </div>


      <!-- BANK / TERMS / SIGNATURE -->

      <div class="bottom-three">


        <div class="bank-box">

          <div class="section-label">
            Company's Bank Details
          </div>

          <div>
            Bank Name :
            ${business.bank_name || '—'}
          </div>

          <div>
            A/c No. :
            ${business.bank_account || '—'}
          </div>

          <div>
            IFSC Code :
            ${business.ifsc || '—'}
          </div>

          <div>
            Branch :
            ${business.branch || '—'}
          </div>

        </div>


        <div class="terms-box">

          <div class="section-label">
            Terms & Conditions
          </div>

          <div>
            1. Goods once sold will not be taken back.
          </div>

          <div>
            2. Payment is due as per agreed credit terms.
          </div>

          <div>
            3. All disputes are subject to
            ${supplyState} Jurisdiction.
          </div>

          <div>
            4. Payment to be made within 15 days.
          </div>

        </div>


        <div class="authorised-box">

          <div>
            For
            <strong>
              ${
                business.business_name ||
                'SUBHA BILLING'
              }
            </strong>
          </div>

          <div class="seal">
            S3
          </div>

          <div class="sign-line"></div>

          <strong>
            Authorised Signatory
          </strong>

        </div>

      </div>


      <!-- DECLARATION -->

      <div class="declaration-row">

        <div>

          <b>₹</b>

          We declare that this invoice shows the actual
          price of the goods described and that all
          particulars are true and correct.

        </div>


        <div>

          <b>
            Receiver's Signature
          </b>

          <div class="dotted-sign"></div>

        </div>

      </div>


      <div class="computer-generated">

        This is a Computer Generated Invoice

      </div>


    </div>

  `;

  openModal();

}
