// ======================================================
//  APP.JS — Script global seluruh website Club IT
// ======================================================

// ====== NAVBAR ACTIVE STATE ======
document.addEventListener("DOMContentLoaded", () => {
    const current = window.location.pathname.split("/").pop();
    const links = document.querySelectorAll("nav a");

    links.forEach(link => {
        const file = link.getAttribute("href");
        if (file === current) {
            link.classList.add("active");
        }
    });
});



// ====== SMOOTH SCROLL (jika ada anchor) ======
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
        }
    });
});



// ====== TOGGLE MENU MOBILE ======
const menuBtn = document.getElementById("menuBtn");
const nav = document.querySelector("nav");

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        nav.classList.toggle("open");
    });
}



// ====== CEK LOGIN DI HALAMAN TERLARANG ======
const protectedPages = ["dashboard.html", "admin.html"];

document.addEventListener("DOMContentLoaded", () => {
    const page = window.location.pathname.split("/").pop();

    if (protectedPages.includes(page)) {
        const user = localStorage.getItem("loggedUser");

        if (!user) {
            alert("Anda harus login terlebih dahulu!");
            window.location.href = "login.html";
        }
    }
});



// ====== LOGOUT GLOBAL ======
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedUser");
        window.location.href = "login.html";
    });
}



// ====== TAMPILKAN NAMA USER DI DASHBOARD ======
function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    if (!user) return;

    const nameField = document.getElementById("usernameDisplay");
    const divisiField = document.getElementById("divisiDisplay");

    if (nameField) nameField.innerText = user.name;
    if (divisiField) divisiField.innerText = user.divisi;
}

document.addEventListener("DOMContentLoaded", loadUserInfo);
// CEK STATUS LOGIN DI SEMUA HALAMAN
document.addEventListener("DOMContentLoaded", () => {
    const loggedIn = localStorage.getItem("loggedIn");

    // ***** REDIRECT SAAT SUDAH LOGIN *****
    const onLoginPages = location.pathname.includes("login.html") || location.pathname.includes("register.html");
    if (loggedIn === "true" && onLoginPages) {
        window.location.href = "dashboard.html";
    }

    // ***** SEMBUNYIKAN TOMBOL LOGIN/DAFTAR DI HALAMAN UTAMA *****
    const loginBtn = document.querySelector(".btn-login");
    const joinBtn = document.querySelector(".btn-join");

    if (loggedIn === "true") {
        if (loginBtn) loginBtn.style.display = "none";
        if (joinBtn) joinBtn.style.display = "none";
    }
});

// ***** LOGIN *****
function loginUser(e) {
    e.preventDefault();

    const email = document.querySelector("#email").value;
    const pass = document.querySelector("#password").value;

    if (email && pass) {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "dashboard.html";
    } else {
        alert("Email dan password harus diisi!");
    }
}

// ***** REGISTER *****
function registerUser(e) {
    e.preventDefault();

    const nama = document.querySelector("#nama").value;
    const email = document.querySelector("#email").value;
    const pass = document.querySelector("#password").value;
    const divisi = document.querySelector("#divisi").value;

    if (nama && email && pass && divisi) {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "dashboard.html";
    } else {
        alert("Semua data harus diisi!");
    }
}

// ***** LOGOUT *****
function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
}