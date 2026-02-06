// app.js — client-side behavior for demo login + insights
(() => {
  const qs = s => document.querySelector(s);
  const loginCard = qs('#login-card');
  const dashboard = qs('#dashboard');
  const form = qs('#login-form');
  const note = qs('#login-note');
  const logoutBtn = qs('#logoutBtn');

  function showNote(msg, err = true){
    note.textContent = msg;
    note.style.color = err ? '#ffb4b4' : '#b8ffd9';
  }

  function validEmail(e){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  function simulateFetchData(){
    return new Promise(resolve => {
      setTimeout(() => {
        const users = Array.from({length:7}, (_,i) => Math.floor(800 + Math.random()*400 + i*20));
        const conv = users.map(u => Math.round(u * (0.02 + Math.random()*0.06)));
        resolve({users,conv});
      }, 900);
    });
  }

  let usersChart, convChart;

  async function renderDashboard(){
    loginCard.classList.add('hidden');
    dashboard.removeAttribute('aria-hidden');
    dashboard.classList.remove('hidden');

    showNote('', false);

    const data = await simulateFetchData();

    // populate stat values
    qs('#activeUsers').textContent = data.users[data.users.length-1].toLocaleString();
    const total = data.conv.reduce((a,b)=>a+b,0);
    qs('#conversion').textContent = `${(total / data.users.reduce((a,b)=>a+b,0) * 100).toFixed(1)}%`;
    qs('#avgSession').textContent = `${(2 + Math.random()*4).toFixed(1)}m`;

    // users chart
    const uctx = qs('#usersChart').getContext('2d');
    if(usersChart) usersChart.destroy();
    usersChart = new Chart(uctx, {
      type: 'line',
      data: {
        labels: ['6d','5d','4d','3d','2d','1d','Today'],
        datasets: [{
          label: 'Active',
          data: data.users,
          borderColor: '#7c5cff',
          backgroundColor: 'rgba(124,92,255,0.12)',
          fill: true,
          tension:0.3,
        }]
      },
      options: {plugins:{legend:{display:false}},responsive:true,maintainAspectRatio:false}
    });

    // conversions bar
    const cctx = qs('#convChart').getContext('2d');
    if(convChart) convChart.destroy();
    convChart = new Chart(cctx, {
      type: 'bar',
      data:{
        labels:['6d','5d','4d','3d','2d','1d','Today'],
        datasets:[{label:'Conversions',data:data.conv,backgroundColor:'#38d3f6'}]
      },
      options:{plugins:{legend:{display:false}},responsive:true,maintainAspectRatio:false}
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = qs('#email').value.trim();
    const pwd = qs('#password').value;
    if(!validEmail(email)) return showNote('Please enter a valid email address.');
    if(pwd.length < 4) return showNote('Password must be at least 4 characters.');

    showNote('Signing in…', false);
    // demo auth: accept any valid email/password
    setTimeout(() => {
      localStorage.setItem('webai_logged_in', '1');
      renderDashboard();
    }, 700);
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('webai_logged_in');
    dashboard.setAttribute('aria-hidden','true');
    dashboard.classList.add('hidden');
    loginCard.classList.remove('hidden');
  });

  // auto-login if demo session present
  if(localStorage.getItem('webai_logged_in')){
    renderDashboard();
  } else {
    dashboard.classList.add('hidden');
  }

})();
