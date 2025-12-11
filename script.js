// ====== SCRIPT LOGIN & REGISTER (SETELAH app.js) ======

// cek apakah user sudah login
if (localStorage.getItem("loggedUser")) {
    console.log("User sudah login:", localStorage.getItem("loggedUser"));
}

// handle register
function registerUser(e) {
    e.preventDefault();

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const pass = document.getElementById("regPass").value.trim();
    const divisi = document.getElementById("regDivisi").value;

    if (!name || !email || !pass || !divisi) {
        alert("Semua field harus diisi!");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // cek email sudah dipakai atau belum
    const exists = users.some(u => u.email === email);
    if (exists) {
        alert("Email sudah terdaftar!");
        return;
    }

    // simpan user
    users.push({
        name,
        email,
        pass,
        divisi
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Akun berhasil dibuat!");
    window.location.href = "login.html";
}



// handle login
function loginUser(e) {
    e.preventDefault();

    const email = document.getElementById("logEmail").value.trim();
    const pass = document.getElementById("logPass").value.trim();

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const match = users.find(u => u.email === email && u.pass === pass);

    if (!match) {
        alert("Email atau password salah!");
        return;
    }

    // simpan akun yang login
    localStorage.setItem("loggedUser", JSON.stringify(match));

    alert("Login berhasil!");

    // langsung redirect ke halaman utama
    window.location.href = "index.html";
}



// logout function (kalau dibutuhin nanti)
function logoutUser() {
    localStorage.removeItem("loggedUser");
    window.location.href = "login.html";
}



// tampilkan nama user di dashboard/admin (opsional)
function loadUserData() {
    const data = JSON.parse(localStorage.getItem("loggedUser"));
    if (!data) return;

    const usr = document.getElementById("usernameDisplay");
    if (usr) {
        usr.innerText = data.name;
    }
}