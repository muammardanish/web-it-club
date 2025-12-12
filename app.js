// App.js - Club IT SMP Muhammadiyah Cipanas

// Global State
const state = {
    isLoggedIn: false,
    currentUser: {
        name: '',
        email: '',
        division: '',
        class: '',
        avatar: null
    },
    members: [
        { id: '001', name: 'Ahmad Rizki', email: 'ahmad@example.com', division: 'Coding', status: 'Aktif' },
        { id: '002', name: 'Siti Nurhaliza', email: 'siti@example.com', division: 'Design', status: 'Aktif' },
        { id: '003', name: 'Budi Santoso', email: 'budi@example.com', division: 'Media', status: 'Aktif' },
        { id: '004', name: 'Dewi Lestari', email: 'dewi@example.com', division: 'Teknis', status: 'Aktif' }
    ],
    tasks: [
        { id: '001', name: 'Desain Logo Club IT', division: 'Design', deadline: '25 Mei 2025', status: 'Dalam Proses' },
        { id: '002', name: 'Pengembangan Website Club', division: 'Coding', deadline: '30 Mei 2025', status: 'Dalam Proses' },
        { id: '003', name: 'Dokumentasi Kegiatan Workshop', division: 'Media', deadline: '20 Mei 2025', status: 'Selesai' },
        { id: '004', name: 'Setup Jaringan Lab Komputer', division: 'Teknis', deadline: '15 Juni 2025', status: 'Menunggu' }
    ],
    projects: [
        { id: '001', name: 'Website Club IT', division: 'Coding', startDate: '1 Mei 2025', status: 'Dalam Proses' },
        { id: '002', name: 'Branding Club IT', division: 'Design', startDate: '5 April 2025', status: 'Selesai' },
        { id: '003', name: 'Dokumentasi Kegiatan', division: 'Media', startDate: '10 April 2025', status: 'Dalam Proses' }
    ],
    announcements: [
        { id: '001', title: 'Rapat Bulanan Club IT', author: 'Admin', date: '15 Mei 2025', status: 'Aktif' },
        { id: '002', title: 'Pendaftaran Anggota Baru Dibuka', author: 'Admin', date: '10 Mei 2025', status: 'Aktif' },
        { id: '003', title: 'Workshop UI/UX Design', author: 'Divisi Design', date: '5 Mei 2025', status: 'Aktif' }
    ]
};

// DOM Elements Cache
const elements = {
    // Sections
    homeSection: document.getElementById('homeSection'),
    dashboardSection: document.getElementById('dashboardSection'),
    profileSection: document.getElementById('profileSection'),
    announcementsSection: document.getElementById('announcementsSection'),
    gallerySection: document.getElementById('gallerySection'),
    adminPanelSection: document.getElementById('adminPanelSection'),
    
    // Navigation
    navLinks: document.getElementById('navLinks'),
    homeLink: document.getElementById('homeLink'),
    dashboardLink: document.getElementById('dashboardLink'),
    profileLink: document.getElementById('profileLink'),
    announcementsLink: document.getElementById('announcementsLink'),
    galleryLink: document.getElementById('galleryLink'),
    adminLink: document.getElementById('adminLink'),
    mobileMenu: document.getElementById('mobileMenu'),
    
    // Auth
    loginBtn: document.getElementById('loginBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    joinBtn: document.getElementById('joinBtn'),
    authModal: document.getElementById('authModal'),
    closeModal: document.getElementById('closeModal'),
    loginTab: document.getElementById('loginTab'),
    registerTab: document.getElementById('registerTab'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    
    // User Info
    userName: document.getElementById('userName'),
    userDivision: document.getElementById('userDivision'),
    profileAvatar: document.getElementById('profileAvatar'),
    profileName: document.getElementById('profileName'),
    profileDivision: document.getElementById('profileDivision'),
    fullNameValue: document.getElementById('fullNameValue'),
    emailValue: document.getElementById('emailValue'),
    divisionValue: document.getElementById('divisionValue'),
    changeAvatarBtn: document.getElementById('changeAvatarBtn'),
    
    // Quick Nav
    quickProfile: document.getElementById('quickProfile'),
    quickGallery: document.getElementById('quickGallery'),
    quickAnnouncements: document.getElementById('quickAnnouncements'),
    quickAdmin: document.getElementById('quickAdmin'),
    
    // Admin Panel
    adminNavItems: document.querySelectorAll('.admin-nav-item'),
    
    // Footer
    footerHome: document.getElementById('footerHome'),
    footerAbout: document.getElementById('footerAbout'),
    footerActivities: document.getElementById('footerActivities'),
    footerGallery: document.getElementById('footerGallery'),
    footerCoding: document.getElementById('footerCoding'),
    footerMedia: document.getElementById('footerMedia'),
    footerDesign: document.getElementById('footerDesign'),
    footerTeknis: document.getElementById('footerTeknis'),
    facebookLink: document.getElementById('facebookLink'),
    twitterLink: document.getElementById('twitterLink'),
    instagramLink: document.getElementById('instagramLink'),
    youtubeLink: document.getElementById('youtubeLink'),
    
    // File Upload
    registerAvatar: document.getElementById('registerAvatar'),
    fileUploadLabel: document.querySelector('.file-upload-label'),
    
    // Toast
    toast: document.getElementById('toast'),
    
    // News & Gallery
    readMoreLinks: document.querySelectorAll('.read-more'),
    galleryItems: document.querySelectorAll('.gallery-item'),
    divisionCards: document.querySelectorAll('.division-card'),
    actionButtons: document.querySelectorAll('.edit-btn, .delete-btn'),
    announcementActions: document.querySelectorAll('.action-btn')
};

// Utility Functions
function showToast(message, duration = 3000) {
    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, duration);
}

function showSection(sectionName) {
    // Hide all sections
    Object.keys(elements).forEach(key => {
        if (key.includes('Section') && elements[key]) {
            elements[key].style.display = 'none';
        }
    });
    
    // Show selected section
    const sectionMap = {
        'home': 'homeSection',
        'dashboard': 'dashboardSection',
        'profile': 'profileSection',
        'announcements': 'announcementsSection',
        'gallery': 'gallerySection',
        'admin': 'adminPanelSection'
    };
    
    const sectionElement = elements[sectionMap[sectionName]];
    if (sectionElement) {
        sectionElement.style.display = 'block';
    }
    
    // Close mobile menu if open
    elements.navLinks.classList.remove('active');
}

function updateUI() {
    if (state.isLoggedIn) {
        // Show member-only navigation
        elements.dashboardLink.style.display = 'block';
        elements.profileLink.style.display = 'block';
        elements.announcementsLink.style.display = 'block';
        elements.adminLink.style.display = 'block';
        elements.loginBtn.style.display = 'none';
        elements.logoutBtn.style.display = 'block';
        
        // Update user info
        elements.userName.textContent = state.currentUser.name;
        elements.userDivision.textContent = state.currentUser.division;
        elements.profileName.textContent = state.currentUser.name;
        elements.profileDivision.textContent = state.currentUser.division;
        elements.fullNameValue.textContent = state.currentUser.name;
        elements.emailValue.textContent = state.currentUser.email;
        elements.divisionValue.textContent = state.currentUser.division;
        
        // Update avatar
        if (state.currentUser.avatar) {
            elements.profileAvatar.innerHTML = `<img src="${state.currentUser.avatar}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
        } else {
            elements.profileAvatar.innerHTML = '<i class="fas fa-user"></i>';
        }
        
        // Show dashboard by default
        showSection('dashboard');
    } else {
        // Hide member-only navigation
        elements.dashboardLink.style.display = 'none';
        elements.profileLink.style.display = 'none';
        elements.announcementsLink.style.display = 'none';
        elements.adminLink.style.display = 'none';
        elements.loginBtn.style.display = 'block';
        elements.logoutBtn.style.display = 'none';
        
        // Show home by default
        showSection('home');
    }
}

function handleLogin(email, password) {
    // Simulate login validation
    if (email && password) {
        state.isLoggedIn = true;
        state.currentUser = {
            name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
            email: email,
            division: 'Coding',
            class: 'VIII',
            avatar: null
        };
        updateUI();
        elements.authModal.style.display = 'none';
        showToast('Login berhasil! Selamat datang kembali.');
        return true;
    }
    return false;
}

function handleRegister(name, email, password, classValue, division, avatarFile) {
    // Simulate registration
    if (name && email && password && classValue && division) {
        state.isLoggedIn = true;
        state.currentUser = {
            name: name,
            email: email,
            division: division,
            class: classValue,
            avatar: null
        };
        
        // Handle avatar if uploaded
        if (avatarFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                state.currentUser.avatar = e.target.result;
                updateUI();
            };
            reader.readAsDataURL(avatarFile);
        } else {
            updateUI();
        }
        
        elements.authModal.style.display = 'none';
        showToast(`Registrasi berhasil! Selamat bergabung di divisi ${division}, ${name}!`);
        return true;
    }
    return false;
}

function handleAvatarChange(file) {
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            state.currentUser.avatar = e.target.result;
            elements.profileAvatar.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
            showToast('Foto profil berhasil diperbarui!');
        };
        reader.readAsDataURL(file);
    }
}

function handleLogout() {
    const userName = state.currentUser.name;
    state.isLoggedIn = false;
    state.currentUser = {
        name: '',
        email: '',
        division: '',
        class: '',
        avatar: null
    };
    updateUI();
    showToast(`Sampai jumpa, ${userName}! Anda telah berhasil logout.`);
}

function handleDivisionClick(division) {
    showToast(`Divisi ${division}: ${getDivisionInfo(division).members} anggota aktif`);
}

function getDivisionInfo(division) {
    const divisionData = {
        'Coding': { members: 15, description: 'Pengembangan web dan aplikasi' },
        'Media': { members: 12, description: 'Konten digital dan dokumentasi' },
        'Design': { members: 17, description: 'Desain grafis dan UI/UX' },
        'Teknis': { members: 8, description: 'Jaringan dan infrastruktur IT' }
    };
    return divisionData[division] || { members: 0, description: '' };
}

function handleAdminAction(action, type, id) {
    const actionMessages = {
        'edit': `Mengedit ${type} dengan ID: ${id}`,
        'delete': `Menghapus ${type} dengan ID: ${id}`,
        'view': `Melihat detail ${type} dengan ID: ${id}`
    };
    
    showToast(actionMessages[action] || `Aksi ${action} pada ${type} ${id}`);
}

function handleSocialMedia(platform) {
    const socialLinks = {
        'facebook': 'https://facebook.com/clubitcipanas',
        'twitter': 'https://twitter.com/clubitcipanas',
        'instagram': 'https://instagram.com/clubitcipanas',
        'youtube': 'https://youtube.com/@clubitcipanas'
    };
    
    showToast(`Membuka ${platform}: @clubitcipanas`);
    // In real app, would open: window.open(socialLinks[platform], '_blank');
}

function handleNewsReadMore(title) {
    showToast(`Membaca artikel: ${title}`);
}

function handleGalleryItemClick(title) {
    showToast(`Melihat foto: ${title}`);
}

function handleAnnouncementAction(action, title) {
    const messages = {
        'like': `Menyukai pengumuman: ${title}`,
        'comment': `Mengomentari pengumuman: ${title}`,
        'share': `Membagikan pengumuman: ${title}`
    };
    showToast(messages[action] || `Aksi ${action} pada: ${title}`);
}

// Event Listeners
function initializeEventListeners() {
    // Mobile Menu
    elements.mobileMenu.addEventListener('click', () => {
        elements.navLinks.classList.toggle('active');
    });
    
    // Auth Modal
    elements.loginBtn.addEventListener('click', () => {
        elements.authModal.style.display = 'flex';
        elements.loginTab.classList.add('active');
        elements.registerTab.classList.remove('active');
        elements.loginForm.style.display = 'block';
        elements.registerForm.style.display = 'none';
    });
    
    elements.joinBtn.addEventListener('click', (e) => {
        e.preventDefault();
        elements.authModal.style.display = 'flex';
        elements.registerTab.classList.add('active');
        elements.loginTab.classList.remove('active');
        elements.registerForm.style.display = 'block';
        elements.loginForm.style.display = 'none';
    });
    
    elements.logoutBtn.addEventListener('click', handleLogout);
    
    elements.closeModal.addEventListener('click', () => {
        elements.authModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === elements.authModal) {
            elements.authModal.style.display = 'none';
        }
    });
    
    // Tab Switching
    elements.loginTab.addEventListener('click', () => {
        elements.loginTab.classList.add('active');
        elements.registerTab.classList.remove('active');
        elements.loginForm.style.display = 'block';
        elements.registerForm.style.display = 'none';
    });
    
    elements.registerTab.addEventListener('click', () => {
        elements.registerTab.classList.add('active');
        elements.loginTab.classList.remove('active');
        elements.registerForm.style.display = 'block';
        elements.loginForm.style.display = 'none';
    });
    
    // Form Submissions
    elements.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (handleLogin(email, password)) {
            elements.loginForm.reset();
        }
    });
    
    elements.registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const classValue = document.getElementById('registerClass').value;
        const division = document.getElementById('registerDivision').value;
        const avatarFile = elements.registerAvatar.files[0];
        
        if (handleRegister(name, email, password, classValue, division, avatarFile)) {
            elements.registerForm.reset();
            elements.fileUploadLabel.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Pilih File';
        }
    });
    
    // File Upload
    elements.registerAvatar.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            elements.fileUploadLabel.innerHTML = `<i class="fas fa-check"></i> ${file.name}`;
        }
    });
    
    // Change Avatar
    elements.changeAvatarBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                handleAvatarChange(file);
            }
        };
        input.click();
    });
    
    // Navigation Links
    elements.homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('home');
    });
    
    elements.dashboardLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('dashboard');
    });
    
    elements.profileLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('profile');
    });
    
    elements.announcementsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('announcements');
    });
    
    elements.galleryLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('gallery');
    });
    
    elements.adminLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('admin');
    });
    
    // Quick Navigation
    elements.quickProfile.addEventListener('click', () => {
        showSection('profile');
    });
    
    elements.quickGallery.addEventListener('click', () => {
        showSection('gallery');
    });
    
    elements.quickAnnouncements.addEventListener('click', () => {
        showSection('announcements');
    });
    
    elements.quickAdmin.addEventListener('click', () => {
        showSection('admin');
    });
    
    // Footer Links
    elements.footerHome.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('home');
    });
    
    elements.footerAbout.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Halaman Tentang Kami akan segera tersedia');
    });
    
    elements.footerActivities.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Halaman Kegiatan akan segera tersedia');
    });
    
    elements.footerGallery.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('gallery');
    });
    
    elements.footerCoding.addEventListener('click', (e) => {
        e.preventDefault();
        handleDivisionClick('Coding');
    });
    
    elements.footerMedia.addEventListener('click', (e) => {
        e.preventDefault();
        handleDivisionClick('Media');
    });
    
    elements.footerDesign.addEventListener('click', (e) => {
        e.preventDefault();
        handleDivisionClick('Design');
    });
    
    elements.footerTeknis.addEventListener('click', (e) => {
        e.preventDefault();
        handleDivisionClick('Teknis');
    });
    
    // Social Media Links
    elements.facebookLink.addEventListener('click', (e) => {
        e.preventDefault();
        handleSocialMedia('Facebook');
    });
    
    elements.twitterLink.addEventListener('click', (e) => {
        e.preventDefault();
        handleSocialMedia('Twitter');
    });
    
    elements.instagramLink.addEventListener('click', (e) => {
        e.preventDefault();
        handleSocialMedia('Instagram');
    });
    
    elements.youtubeLink.addEventListener('click', (e) => {
        e.preventDefault();
        handleSocialMedia('YouTube');
    });
    
    // Division Cards
    elements.divisionCards.forEach(card => {
        card.addEventListener('click', () => {
            const division = card.getAttribute('data-division');
            handleDivisionClick(division);
        });
    });
    
    // News Read More
    elements.readMoreLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const title = e.target.closest('.news-card').querySelector('.news-title').textContent;
            handleNewsReadMore(title);
        });
    });
    
    // Gallery Items
    elements.galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const title = item.querySelector('h4').textContent;
            handleGalleryItemClick(title);
        });
    });
    
    // Admin Panel Tabs
    elements.adminNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabName = item.getAttribute('data-tab');
            
            // Update active tab
            elements.adminNavItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            item.classList.add('active');
            
            // Show corresponding content
            document.querySelectorAll('.admin-tab-content').forEach(content => {
                content.style.display = 'none';
            });
            document.getElementById(`${tabName}Tab`).style.display = 'block';
        });
    });
    
    // Admin Action Buttons
    elements.actionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const action = button.classList.contains('edit-btn') ? 'edit' : 'delete';
            const row = e.target.closest('tr');
            const id = row.cells[0].textContent;
            const type = getCurrentAdminTab();
            handleAdminAction(action, type, id);
        });
    });
    
    // Announcement Actions
    elements.announcementActions.forEach(container => {
        container.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;
            
            let action = '';
            if (button.innerHTML.includes('thumbs-up')) action = 'like';
            else if (button.innerHTML.includes('comment')) action = 'comment';
            else if (button.innerHTML.includes('share')) action = 'share';
            
            const title = button.closest('.announcement-card').querySelector('.announcement-title').textContent;
            handleAnnouncementAction(action, title);
        });
    });
}

// Helper Functions
function getCurrentAdminTab() {
    const activeTab = document.querySelector('.admin-nav-item.active');
    return activeTab ? activeTab.getAttribute('data-tab') : 'members';
}

// Initialize App
function initializeApp() {
    initializeEventListeners();
    updateUI();
    
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
    
    console.log('Club IT App initialized successfully!');
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        state,
        showToast,
        showSection,
        updateUI
    };
}