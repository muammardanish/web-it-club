/* Club IT - fitur:
   - Admin (admin / admin123)
   - Register member dengan divisi
   - Login / logout
   - Aktivitas per divisi
   - MyDivision (khusus user)
   - Profile edit
   - Admin bisa tambah / edit / hapus aktivitas
   - Data disimpan di localStorage
*/

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

document.getElementById('year').textContent = new Date().getFullYear();

// --- Pages
const pages = {
  home: $('#home'),
  activities: $('#activities'),
  divisions: $('#divisions'),
  mydivision: $('#mydivision'),
  profile: $('#profile')
};

function showPage(name) {
  Object.values(pages).forEach(p => p.classList.add('hidden'));
  pages[name].classList.remove('hidden');
}

// --- NAV
$('#nav-home').onclick = () => showPage('home');
$('#nav-activities').onclick = () => showPage('activities');
$('#nav-divisions').onclick = () => showPage('divisions');
$('#nav-mydivision').onclick = () => { showPage('mydivision'); renderMyDivision(); };
$('#nav-profile').onclick = () => { showPage('profile'); renderProfile(); };
$('#cta-activities').onclick = () => showPage('activities');
$('#cta-join').onclick = () => openModal('register');

// --- MODAL
const modal = $('#modal');
const modalClose = $('#modal-close');
const modalLogin = $('#modal-login');
const modalRegister = $('#modal-register');

$('#btn-login').onclick = () => openModal('login');
$('#btn-register').onclick = () => openModal('register');

modalClose.onclick = () => modal.classList.add('hidden');
modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.add('hidden') });

function openModal(type){
  modal.classList.remove('hidden');
  modalLogin.classList.add('hidden');
  modalRegister.classList.add('hidden');
  if(type === 'login') modalLogin.classList.remove('hidden');
  else modalRegister.classList.remove('hidden');
}

// STORAGE helpers
function readJSON(k, f){ try { return JSON.parse(localStorage.getItem(k)) ?? f; } catch { return f; } }
function writeJSON(k, v){ localStorage.setItem(k, JSON.stringify(v)); }

// SEED DATA
if(!localStorage.getItem('club_users')){
  const seedUsers = [
    { username:'admin', name:'Admin Club IT', password:'admin123', role:'admin', division:'Coding' }
  ];
  writeJSON('club_users', seedUsers);
}

if(!localStorage.getItem('club_activities')){
  const seedActivities = [
    { id:1, title:'Workshop HTML & CSS', division:'Coding', date:'2025-11-20', creator:'admin' },
    { id:2, title:'Desain Poster Kegiatan', division:'Design', date:'2025-11-25', creator:'admin' },
    { id:3, title:'Editing Video Dokumenter', division:'Media', date:'2025-11-30', creator:'admin' },
    { id:4, title:'Pemeriksaan Lab Komputer', division:'Teknisi', date:'2025-12-03', creator:'admin' }
  ];
  writeJSON('club_activities', seedActivities);
}

// SESSION
let currentUser = sessionStorage.getItem('club_current')
  ? JSON.parse(sessionStorage.getItem('club_current'))
  : null;

function setCurrentUser(user){
  currentUser = user;
  sessionStorage.setItem('club_current', JSON.stringify(user));
  renderUserArea();
  renderActivitiesControls();
  renderActivities();
}

function logout(){
  currentUser = null;
  sessionStorage.removeItem('club_current');
  renderUserArea();
  renderActivitiesControls();
  renderActivities();
  alert('Kamu sudah logout.');
}

// USER AREA (TOP RIGHT)
function renderUserArea(){
  const area = $('#user-area');
  const authWrap = $('#auth-wrap');

  if(currentUser){
    area.innerHTML = `
      <div class="small">Hello, <strong>${currentUser.name}</strong> • 
      <button id="btn-logout" class="nav-btn outline">Logout</button></div>
    `;
    authWrap.style.display = 'none';
    $('#btn-logout').onclick = logout;
  } else {
    area.innerHTML = `<div class="small">Silakan login untuk akses penuh.</div>`;
    authWrap.style.display = 'flex';
  }
}
renderUserArea();

// REGISTER
$('#form-register').addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = $('#reg-name').value.trim();
  const username = $('#reg-username').value.trim();
  const password = $('#reg-password').value;
  const division = $('#reg-division').value;

  const users = readJSON('club_users', []);

  if(users.find(u=>u.username === username)){
    alert('Username sudah dipakai.');
    return;
  }

  const newUser = { username, name, password, role:'member', division };
  users.push(newUser);
  writeJSON('club_users', users);

  alert('Registrasi berhasil. Silakan login.');
  modal.classList.add('hidden');
});

// LOGIN
$('#form-login').addEventListener('submit', (e)=>{
  e.preventDefault();
  const username = $('#login-username').value.trim();
  const password = $('#login-password').value;

  const users = readJSON('club_users', []);
  const user = users.find(u => u.username===username && u.password===password);

  if(!user){
    alert('Username / password salah');
    return;
  }

  setCurrentUser(user);
  modal.classList.add('hidden');
  alert('Login sukses!');
});

// ACTIVITIES LIST
function renderActivities(){
  const list = $('#activities-list');
  const activities = readJSON('club_activities', [])
    .slice()
    .sort((a,b)=> (a.date||'').localeCompare(b.date||''));

  if(activities.length === 0){
    list.innerHTML = '<li class="small">Belum ada aktivitas.</li>';
    return;
  }

  list.innerHTML = activities.map(a=>{
    const canEdit = currentUser && currentUser.role === 'admin';
    return `
      <li data-id="${a.id}">
        <div>
          <div class="bold">${a.title}</div>
          <div class="small">${a.division} • ${a.date || 'TBD'} • oleh ${a.creator}</div>
        </div>
        <div class="action-row">
          ${canEdit ? `
            <button class="btn small btn-edit" data-id="${a.id}">Edit</button>
            <button class="btn small btn-delete" data-id="${a.id}">Hapus</button>
          ` : ''}
          <div class="small">#${a.id}</div>
        </div>
      </li>
    `;
  }).join('');

  // DELETE
  $$('.btn-delete').forEach(btn=>{
    btn.onclick = (e)=>{
      const id = Number(e.target.dataset.id);
      if(!confirm('Hapus aktivitas ini?')) return;
      let activities = readJSON('club_activities', []);
      activities = activities.filter(x=>x.id !== id);
      writeJSON('club_activities', activities);
      renderActivities();
    };
  });

  // EDIT
  $$('.btn-edit').forEach(btn=>{
    btn.onclick = (e)=>{
      const id = Number(e.target.dataset.id);
      const activities = readJSON('club_activities', []);
      const item = activities.find(x=>x.id === id);

      const newTitle = prompt('Edit judul:', item.title);
      if(newTitle === null) return;

      const newDivision = prompt('Divisi (Coding/Design/Media/Teknisi):', item.division);
      const newDate = prompt('Tanggal (YYYY-MM-DD):', item.date);

      item.title = newTitle.trim() || item.title;
      item.division = newDivision.trim() || item.division;
      item.date = newDate.trim() || item.date;

      writeJSON('club_activities', activities);
      renderActivities();
      alert('Perubahan disimpan.');
    };
  });
}
renderActivities();

// ADMIN CONTROLS
function renderActivitiesControls(){
  const controls = $('#activity-controls');
  if(currentUser && currentUser.role === 'admin')
      controls.classList.remove('hidden');
  else
      controls.classList.add('hidden');
}
renderActivitiesControls();

// ADD ACTIVITY FORM
$('#add-activity-form').addEventListener('submit', (e)=>{
  e.preventDefault();
  if(!currentUser || currentUser.role !== 'admin'){
    alert('Hanya admin yang bisa menambah aktivitas.');
    return;
  }

  const title = $('#activity-title').value.trim();
  const division = $('#activity-division').value;
  const date = $('#activity-date').value;

  if(!title){ alert('Isi judul.'); return; }

  const activities = readJSON('club_activities', []);
  const id = (activities.reduce((m,a)=>Math.max(m,a.id||0),0) || 0) + 1;

  activities.push({ id, title, division, date, creator: currentUser.username });
  writeJSON('club_activities', activities);

  $('#activity-title').value = '';
  $('#activity-date').value = '';

  renderActivities();
  alert('Aktivitas ditambahkan!');
});

// DIVISION VIEW
$$('.view-division').forEach(btn=>{
  btn.onclick = (e)=>{
    const divName = e.target.closest('.division').dataset.name;
    showDivision(divName);
    showPage('divisions');
  };
});

function showDivision(name){
  $('#division-activities').classList.remove('hidden');
  $('#division-title').textContent = `Aktivitas: ${name}`;

  const list = $('#division-list');
  const activities = readJSON('club_activities', []).filter(a=>a.division === name);

  if(activities.length === 0){
    list.innerHTML = '<li class="small">Belum ada aktivitas.</li>';
    return;
  }

  list.innerHTML = activities
    .map(a=>`<li><strong>${a.title}</strong><div class="small">${a.date} • oleh ${a.creator}</div></li>`)
    .join('');
}

// MY DIVISION
function renderMyDivision(){
  const area = $('#mydivision-area');
  const list = $('#mydivision-list');

  if(!currentUser){
    area.textContent = 'Silakan login terlebih dahulu.';
    list.innerHTML = '';
    return;
  }

  area.textContent = `Divisi Anda: ${currentUser.division}`;

  const activities = readJSON('club_activities', [])
    .filter(a=>a.division === currentUser.division);

  if(activities.length === 0){
    list.innerHTML = '<li class="small">Belum ada aktivitas untuk divisi Anda.</li>';
    return;
  }

  list.innerHTML = activities
    .map(a=>`<li><strong>${a.title}</strong><div class="small">${a.date} • oleh ${a.creator}</div></li>`)
    .join('');
}

// PROFILE
function renderProfile(){
  const card = $('#profile-card');

  if(!currentUser){
    card.innerHTML = `<div class="small">Silakan login untuk melihat profil.</div>`;
    return;
  }

  card.innerHTML = `
    <div class="profile-meta">
      <div class="avatar">${currentUser.name.split(' ').map(p=>p[0]).join('').toUpperCase()}</div>

      <div>
        <div class="bold">${currentUser.name}</div>
        <div class="small">Username: ${currentUser.username}</div>
        <div class="small">Divisi: ${currentUser.division}</div>
        <div class="small">Role: ${currentUser.role}</div>
      </div>
    </div>

    <button id="btn-edit-profile" class="btn outline">Edit Profil</button>
    <button id="btn-change-pass" class="btn outline">Ganti Password</button>
  `;

  // Edit Profil
  $('#btn-edit-profile').onclick = ()=>{
    const newName = prompt('Nama baru:', currentUser.name);
    const newDiv = prompt('Divisi (Coding/Design/Media/Teknisi):', currentUser.division);

    if(newName === null) return;

    const users = readJSON('club_users', []);
    const u = users.find(x=>x.username === currentUser.username);

    u.name = newName.trim() || u.name;
    u.division = newDiv.trim() || u.division;

    writeJSON('club_users', users);
    setCurrentUser(u);

    alert('Profil diperbarui.');
    renderProfile();
  };

  // Ganti Password
  $('#btn-change-pass').onclick = ()=>{
    const old = prompt('Password lama:');
    if(old !== currentUser.password){
      alert('Password lama salah.');
      return;
    }

    const np = prompt('Password baru (min 4 karakter)');
    if(!np || np.length < 4){
      alert('Password terlalu pendek.');
      return;
    }

    const users = readJSON('club_users', []);
    const u = users.find(x=>x.username === currentUser.username);

    u.password = np;
    writeJSON('club_users', users);
    setCurrentUser(u);

    alert('Password diperbarui.');
  };
}

// INITIAL
showPage('home');
renderActivities();
renderActivitiesControls();