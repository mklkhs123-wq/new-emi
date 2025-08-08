// Smart Finance App - all client-side

// --- Navigation ---
const buttons = document.querySelectorAll('.sidebar nav button[data-target]');
const panels = document.querySelectorAll('.panel');
buttons.forEach(b=>b.addEventListener('click', ()=>{
  buttons.forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  const t = b.dataset.target;
  panels.forEach(p=> p.id===t ? p.classList.remove('hidden') : p.classList.add('hidden'));
  document.getElementById('content').scrollTop = 0;
}));

// --- EMI ---
const emiForm = document.getElementById('emiForm');
emiForm.addEventListener('submit', e=>{e.preventDefault();
  const P = parseFloat(document.getElementById('emi-principal').value)||0;
  const annualR = parseFloat(document.getElementById('emi-rate').value)||0;
  const n = parseInt(document.getElementById('emi-tenure').value)||0;
  const r = annualR/12/100;
  let emi=0; if(r>0) emi = (P*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1); else emi = P/n;
  const total = emi*n; const interest = total - P;
  document.getElementById('emiResult').innerHTML = `<strong>Monthly EMI:</strong> ₹${emi.toFixed(2)}<br><strong>Total Payment:</strong> ₹${total.toFixed(2)}<br><strong>Total Interest:</strong> ₹${interest.toFixed(2)}`;
});
document.getElementById('emiReset').addEventListener('click', ()=>{emiForm.reset(); document.getElementById('emiResult').innerHTML='';});

// --- FD ---
const fdForm = document.getElementById('fdForm');
fdForm.addEventListener('submit', e=>{e.preventDefault();
  const P = parseFloat(document.getElementById('fd-principal').value)||0;
  const r = parseFloat(document.getElementById('fd-rate').value)/100 || 0;
  const years = parseFloat(document.getElementById('fd-years').value)||0;
  const m = parseInt(document.getElementById('fd-comp').value)||1;
  const A = P * Math.pow(1 + r/m, m*years);
  const interest = A - P;
  document.getElementById('fdResult').innerHTML = `<strong>Maturity Amount:</strong> ₹${A.toFixed(2)}<br><strong>Total Interest:</strong> ₹${interest.toFixed(2)}`;
});
document.getElementById('fdReset').addEventListener('click', ()=>{fdForm.reset(); document.getElementById('fdResult').innerHTML='';});

// --- SIP ---
const sipForm = document.getElementById('sipForm');
sipForm.addEventListener('submit', e=>{e.preventDefault();
  const P = parseFloat(document.getElementById('sip-amt').value)||0;
  const r = parseFloat(document.getElementById('sip-rate').value)/100 || 0;
  const years = parseFloat(document.getElementById('sip-years').value)||0;
  const n = years*12; const i = r/12;
  let fv = 0;
  if(i>0){
    fv = P * ( (Math.pow(1+i,n)-1) / i ) * (1+i);
  } else {
    fv = P * n;
  }
  const invested = P*n; const gain = fv - invested;
  document.getElementById('sipResult').innerHTML = `<strong>Maturity Value:</strong> ₹${fv.toFixed(2)}<br><strong>Invested:</strong> ₹${invested.toFixed(2)}<br><strong>Gain:</strong> ₹${gain.toFixed(2)}`;
});
document.getElementById('sipReset').addEventListener('click', ()=>{sipForm.reset(); document.getElementById('sipResult').innerHTML='';});

// --- RD ---
const rdForm = document.getElementById('rdForm');
rdForm.addEventListener('submit', e=>{e.preventDefault();
  const P = parseFloat(document.getElementById('rd-amt').value)||0;
  const r = parseFloat(document.getElementById('rd-rate').value)/100 || 0;
  const months = parseInt(document.getElementById('rd-months').value)||0;
  const monthlyR = r/12;
  let maturity = 0;
  for(let k=1;k<=months;k++){ maturity += P * Math.pow(1+monthlyR, months-k+1); }
  const invested = P*months; const gain = maturity - invested;
  document.getElementById('rdResult').innerHTML = `<strong>Maturity Amount:</strong> ₹${maturity.toFixed(2)}<br><strong>Invested:</strong> ₹${invested.toFixed(2)}<br><strong>Interest:</strong> ₹${gain.toFixed(2)}`;
});
document.getElementById('rdReset').addEventListener('click', ()=>{rdForm.reset(); document.getElementById('rdResult').innerHTML='';});

// --- PPF ---
const ppfForm = document.getElementById('ppfForm');
ppfForm.addEventListener('submit', e=>{e.preventDefault();
  const annual = parseFloat(document.getElementById('ppf-amt').value)||0;
  const r = parseFloat(document.getElementById('ppf-rate').value)/100 || 0;
  const years = parseInt(document.getElementById('ppf-years').value)||0;
  let balance = 0;
  for(let y=1;y<=years;y++){
    balance = (balance + annual) * (1 + r);
  }
  const invested = annual*years; const gain = balance - invested;
  document.getElementById('ppfResult').innerHTML = `<strong>Maturity Amount:</strong> ₹${balance.toFixed(2)}<br><strong>Invested:</strong> ₹${invested.toFixed(2)}<br><strong>Interest:</strong> ₹${gain.toFixed(2)}`;
});
document.getElementById('ppfReset').addEventListener('click', ()=>{ppfForm.reset(); document.getElementById('ppfResult').innerHTML='';});

// --- Currency Converter (exchangerate.host) ---
const curFrom = document.getElementById('curFrom');
const curTo = document.getElementById('curTo');
const curAmount = document.getElementById('curAmount');
const curResult = document.getElementById('curResult');
async function loadSymbols(){
  try{
    const res = await fetch('https://api.exchangerate.host/symbols');
    const data = await res.json();
    const symbols = Object.keys(data.symbols);
    const preferred = ['INR','USD','EUR','GBP','JPY','AED','AUD'];
    const all = [...new Set([...preferred, ...symbols])];
    all.forEach(s=>{
      const o1 = document.createElement('option'); o1.value=s; o1.textContent=s; curFrom.appendChild(o1);
      const o2 = document.createElement('option'); o2.value=s; o2.textContent=s; curTo.appendChild(o2);
    });
    curFrom.value='INR'; curTo.value='USD';
  }catch(err){ curResult.textContent = 'Failed to load currency symbols — check your connection.'}
}
loadSymbols();

document.getElementById('convertBtn').addEventListener('click', async ()=>{
  const from = curFrom.value; const to = curTo.value; const amt = parseFloat(curAmount.value)||0;
  curResult.textContent = 'Converting...';
  try{
    const r = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amt}`);
    const data = await r.json();
    if(data && data.result!=null){
      curResult.innerHTML = `${amt} ${from} = ${data.result.toFixed(4)} ${to} <br>Rate: 1 ${from} = ${data.info.rate.toFixed(6)} ${to}`;
    } else curResult.textContent = 'Conversion failed.';
  }catch(e){ curResult.textContent = 'Conversion error — check network or API access.'}
});

// --- Finance News (via AllOrigins proxy) ---
const newsList = document.getElementById('newsList');
async function loadNews(){
  newsList.innerHTML = 'Loading news...';
  try{
    const proxy = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://news.google.com/rss/search?q=finance+india');
    const r = await fetch(proxy);
    const txt = await r.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(txt, 'application/xml');
    const items = Array.from(xml.querySelectorAll('item')).slice(0,12);
    newsList.innerHTML = '';
    items.forEach(it=>{
      const title = it.querySelector('title')?.textContent||'';
      const link = it.querySelector('link')?.textContent||'';
      const pub = it.querySelector('pubDate')?.textContent||'';
      const li = document.createElement('div'); li.className='news-item';
      li.innerHTML = `<a href="${link}" target="_blank" rel="noopener">${title}</a><div class="muted">${pub}</div>`;
      newsList.appendChild(li);
    });
    if(items.length===0) newsList.textContent = 'No news items found.';
  }catch(err){
    newsList.textContent = 'Could not load news (API/proxy may be blocked).';
  }
}
loadNews();

// --- Indian Finance Companies list (populated) ---
const companies = [
  {name:'State Bank of India (SBI)', url:'https://www.sbi.co.in'},
  {name:'HDFC Bank', url:'https://www.hdfcbank.com'},
  {name:'ICICI Bank', url:'https://www.icicibank.com'},
  {name:'Axis Bank', url:'https://www.axisbank.com'},
  {name:'Kotak Mahindra Bank', url:'https://www.kotak.com'},
  {name:'Punjab National Bank', url:'https://www.pnbindia.in'},
  {name:'Bank of Baroda', url:'https://www.bankofbaroda.in'},
  {name:'Yes Bank', url:'https://www.yesbank.in'},
  {name:'Bajaj Finance', url:'https://www.bajajfinserv.in'},
  {name:'Bajaj Finserv', url:'https://www.bajajfinserv.in'},
  {name:'LIC', url:'https://www.licindia.in'},
  {name:'HDFC Ltd', url:'https://www.hdfc.com'},
  {name:'IDFC First Bank', url:'https://www.idfcfirstbank.com'},
  {name:'IndusInd Bank', url:'https://www.indusind.com'},
  {name:'Muthoot Finance', url:'https://www.muthootfinance.com'},
  {name:'Shriram Finance', url:'https://www.shriramfinance.in'},
  {name:'Federal Bank', url:'https://www.federalbank.co.in'},
  {name:'Canara Bank', url:'https://www.canarabank.com'},
  {name:'Union Bank of India', url:'https://www.unionbankofindia.co.in'},
  {name:'Bandhan Bank', url:'https://www.bandhanbank.com'},
  {name:'Tata Capital', url:'https://www.tatacapital.com'},
  {name:'Aditya Birla Finance', url:'https://www.adityabirlacapital.com'},
  {name:'SBI Life Insurance', url:'https://www.sbilife.co.in'},
  {name:'AU Small Finance Bank', url:'https://www.aubank.in'},
  {name:'Standard Chartered', url:'https://www.sc.com/in/'},
  {name:'IDBI Bank', url:'https://www.idbibank.in'},
  {name:'Dhanlaxmi Bank', url:'https://www.dhanbank.com'},
  {name:'RBL Bank', url:'https://www.rblbank.com'},
  {name:'Kotak Mahindra Prime', url:'https://www.kotak.com/en/personal-banking.html'}
];
const companiesList = document.getElementById('companiesList');
const filterInput = document.getElementById('companyFilter');
function renderCompanies(q=''){
  companiesList.innerHTML='';
  companies.filter(c=>c.name.toLowerCase().includes(q.toLowerCase())).forEach(c=>{
    const li = document.createElement('li');
    li.innerHTML = `<a href="${c.url}" target="_blank" rel="noopener">${c.name}</a>`;
    companiesList.appendChild(li);
  });
}
renderCompanies();
filterInput.addEventListener('input', ()=>renderCompanies(filterInput.value));

// --- Loan Check logic (simple affordability check) ---
const loanForm = document.getElementById('loanForm');
loanForm.addEventListener('submit', e=>{e.preventDefault();
  const income = parseFloat(document.getElementById('loan-income').value)||0;
  const existing = parseFloat(document.getElementById('loan-existing').value)||0;
  const amount = parseFloat(document.getElementById('loan-amount').value)||0;
  const tenure = parseInt(document.getElementById('loan-tenure').value)||0;
  // simple rule: max EMI affordability = 50% of income - existing EMI
  const maxAffordable = Math.max(0, income*0.5 - existing);
  // approximate EMI for requested loan at 12% annual
  const monthlyRate = 0.12/12; const n = tenure;
  let emiRequested = 0;
  if(monthlyRate>0){
    emiRequested = (amount * monthlyRate * Math.pow(1+monthlyRate,n)) / (Math.pow(1+monthlyRate,n)-1);
  } else emiRequested = amount / n;
  const eligible = emiRequested <= maxAffordable;
  const bankLink = eligible ? 'https://www.bankbazaar.com/personal-loan.html' : 'https://www.bankbazaar.com/personal-loan.html';
  document.getElementById('loanResult').innerHTML = `<strong>Requested EMI:</strong> ₹${emiRequested.toFixed(2)}<br><strong>Max affordable EMI:</strong> ₹${maxAffordable.toFixed(2)}<br><strong>Eligibility:</strong> ${eligible ? '<span style="color:green">Likely Eligible</span>' : '<span style="color:red">Not Eligible</span>'}<br><a href="${bankLink}" target="_blank" rel="noopener">Apply / Check offers</a>`;
});
document.getElementById('loanReset').addEventListener('click', ()=>{loanForm.reset(); document.getElementById('loanResult').innerHTML='';});

// --- Payment UPI QR generation (simple SVG with UPI text) ---
const qrDiv = document.getElementById('qr');
const upiId = 'example@upi';
const qrSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><rect width="100%" height="100%" fill="#fff"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="#000">UPI</text><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="#000">${upiId}</text></svg>`;
qrDiv.innerHTML = qrSvg;
const upiLink = document.getElementById('upiLink');
upiLink.href = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('Smart Finance')}&am=1&tn=${encodeURIComponent('Test Payment')}`;

// --- Privacy modal ---
const privacyBtn = document.getElementById('privacyBtn');
const privacyModal = document.getElementById('privacyModal');
document.getElementById('closePrivacy').addEventListener('click', ()=>privacyModal.classList.add('hidden'));
privacyBtn.addEventListener('click', ()=>privacyModal.classList.remove('hidden'));
window.addEventListener('keydown', e=>{ if(e.key==='Escape') privacyModal.classList.add('hidden'); });


// --- Privacy Policy Modal ---
document.addEventListener('DOMContentLoaded', function() {
  const privacyModal = document.getElementById('privacyPolicyModal');
  const privacyBtn = document.querySelector('button[data-target="privacyPolicy"]');
  const privacyCloseBtn = document.getElementById('privacyCloseBtn');
  
  if (privacyModal && privacyBtn && privacyCloseBtn) {
    // Hide by default
    privacyModal.style.display = "none";
    
    // Open when privacy policy menu clicked
    privacyBtn.addEventListener('click', function() {
      privacyModal.style.display = "block";
    });
    
    // Close when close button clicked
    privacyCloseBtn.addEventListener('click', function() {
      privacyModal.style.display = "none";
    });
  }
});
