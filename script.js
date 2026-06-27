// ============================================
// PROBANK - Complete JavaScript
// Interactions, Animations & Local Auth System
// ============================================

// ============================================
// AUTH SYSTEM - LocalStorage Based
// ============================================

const AUTH_KEY = 'probank_users';
const CURRENT_USER_KEY = 'probank_current_user';

// Initialize default admin user
function initAuth() {
    const users = getUsers();
    if (users.length === 0) {
        // Create default admin
        const adminUser = {
            id: 'USR-001',
            firstName: 'مدير',
            lastName: 'النظام',
            email: 'admin@probank.com',
            phone: '+966500000000',
            password: 'admin123',
            role: 'admin',
            status: 'active',
            avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=ef4444&color=fff',
            createdAt: new Date().toISOString(),
            balance: 50000,
            investments: []
        };
        saveUser(adminUser);

        // Create default investor
        const investorUser = {
            id: 'USR-002',
            firstName: 'أحمد',
            lastName: 'محمد',
            email: 'ahmed@probank.com',
            phone: '+966501234567',
            password: '123456',
            role: 'investor',
            status: 'active',
            avatar: 'https://ui-avatars.com/api/?name=Ahmed+Mohamed&background=0ea5e9&color=fff',
            createdAt: new Date().toISOString(),
            balance: 45250,
            investments: [
                { name: 'صندوق العقارات السكنية', amount: 15000, return: 14.5 },
                { name: 'صندوق الطاقة المتجددة', amount: 10000, return: 16.2 },
                { name: 'صندوق التكنولوجيا الناشئة', amount: 10000, return: 20 }
            ]
        };
        saveUser(investorUser);
    }
}

function getUsers() {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : [];
}

function saveUser(user) {
    const users = getUsers();
    const existingIndex = users.findIndex(u => u.email === user.email);
    if (existingIndex >= 0) {
        users[existingIndex] = user;
    } else {
        users.push(user);
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify(users));
}

function getUserByEmail(email) {
    const users = getUsers();
    return users.find(u => u.email === email);
}

function getCurrentUser() {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(CURRENT_USER_KEY);
    }
}

function logout() {
    setCurrentUser(null);
    window.location.href = 'login.html';
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function requireAdmin() {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        window.location.href = 'dashboard.html';
        return false;
    }
    return true;
}

function generateUserId() {
    const users = getUsers();
    const nextNum = users.length + 1;
    return 'USR-' + String(nextNum).padStart(3, '0');
}

// ============================================
// UI COMPONENTS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initAuth();
    initParticles();
    initSidebar();
    initThemeToggle();
    initSettingsTabs();
    initScrollReveal();
    init3DCard();
    initToastNotifications();
    initPasswordToggle();
    initMobileMenu();
    initUserDropdown();
    updateUserUI();
});

// Update UI with current user info
function updateUserUI() {
    const user = getCurrentUser();
    if (!user) return;

    // Update sidebar user info
    const sidebarUserName = document.querySelector('.sidebar-footer .user-name');
    const sidebarUserRole = document.querySelector('.sidebar-footer .user-role');
    const sidebarAvatar = document.querySelector('.sidebar-footer .user-avatar');
    const topBarAvatar = document.querySelector('.top-bar .user-avatar');

    if (sidebarUserName) sidebarUserName.textContent = user.firstName + ' ' + user.lastName;
    if (sidebarUserRole) sidebarUserRole.textContent = user.role === 'admin' ? 'مسؤول' : 'مستثمر';
    if (sidebarAvatar) sidebarAvatar.src = user.avatar;
    if (topBarAvatar) topBarAvatar.src = user.avatar;

    // Update balance displays
    const balanceElements = document.querySelectorAll('[data-balance]');
    balanceElements.forEach(el => {
        el.textContent = '$' + (user.balance || 0).toLocaleString();
    });
}

// User dropdown with logout
function initUserDropdown() {
    const dropdown = document.querySelector('.user-dropdown');
    if (!dropdown) return;

    dropdown.addEventListener('click', function(e) {
        e.stopPropagation();

        // Remove existing menu
        const existing = document.querySelector('.user-dropdown-menu');
        if (existing) {
            existing.remove();
            return;
        }

        const user = getCurrentUser();
        if (!user) return;

        const menu = document.createElement('div');
        menu.className = 'user-dropdown-menu';
        menu.style.cssText = `
            position: absolute;
            top: 60px;
            left: 20px;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--radius);
            padding: 8px;
            min-width: 200px;
            z-index: 1000;
            box-shadow: var(--shadow-lg);
        `;
        menu.innerHTML = `
            <div style="padding: 12px; border-bottom: 1px solid var(--border-color); margin-bottom: 8px;">
                <div style="font-weight: 700;">${user.firstName} ${user.lastName}</div>
                <div style="font-size: 12px; color: var(--text-muted);">${user.email}</div>
            </div>
            <a href="settings.html" style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--radius-sm); color: var(--text-secondary); transition: var(--transition);">
                <i class="fas fa-cog"></i> الإعدادات
            </a>
            <a href="profile.html" style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--radius-sm); color: var(--text-secondary); transition: var(--transition);">
                <i class="fas fa-user"></i> الملف الشخصي
            </a>
            <div style="border-top: 1px solid var(--border-color); margin-top: 8px; padding-top: 8px;">
                <button onclick="logout()" style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--radius-sm); color: var(--danger); background: none; border: none; width: 100%; cursor: pointer; font-family: inherit;">
                    <i class="fas fa-sign-out-alt"></i> تسجيل الخروج
                </button>
            </div>
        `;

        document.body.appendChild(menu);

        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 10);
    });
}

// Particles Background
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = Math.random() * 10 + 10 + 's';

        const colors = ['#0ea5e9', '#10b981', '#8b5cf6', '#f59e0b'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        container.appendChild(particle);
    }
}

// Sidebar Toggle
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebarToggle');

    if (!sidebar || !toggle) return;

    toggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });

    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        sidebar.classList.add('collapsed');
    }
}

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-theme');
        const icon = themeToggle.querySelector('i');

        if (document.body.classList.contains('light-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    });

    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
}

// Settings Tabs
function initSettingsTabs() {
    const navItems = document.querySelectorAll('.settings-nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            navItems.forEach(nav => nav.classList.remove('active'));
            document.querySelectorAll('.settings-tab').forEach(tab => tab.classList.remove('active'));

            this.classList.add('active');
            const targetTab = document.getElementById(tabId + '-tab');
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });
}

// Scroll Reveal Animation
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.stat-card, .content-card, .feature-card, .investment-card, .course-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// 3D Credit Card
function init3DCard() {
    const card = document.querySelector('.credit-card-3d');
    if (!card) return;

    card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        const inner = card.querySelector('.credit-card-inner');
        if (inner) {
            inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
    });

    card.addEventListener('mouseleave', function() {
        const inner = card.querySelector('.credit-card-inner');
        if (inner) {
            inner.style.transform = 'rotateX(0) rotateY(0)';
        }
    });
}

// Toast Notifications
function initToastNotifications() {
    if (!document.querySelector('.toast-container')) {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
}

function showToast(message, type = 'success', duration = 3000) {
    const container = document.querySelector('.toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.success}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-100%)';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Password Toggle
function initPasswordToggle() {
    const toggles = document.querySelectorAll('.toggle-password');

    toggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Mobile Menu
function initMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 999;
        display: none;
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlay.style.display = 'none';
    });

    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-menu-btn';
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    mobileToggle.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1001;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        display: none;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    `;
    document.body.appendChild(mobileToggle);

    mobileToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        overlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
    });

    const mediaQuery = window.matchMedia('(max-width: 1024px)');
    function handleMediaChange(e) {
        mobileToggle.style.display = e.matches ? 'flex' : 'none';
    }
    mediaQuery.addListener(handleMediaChange);
    handleMediaChange(mediaQuery);
}

// Modal Functions
function showAddUserModal() {
    const modal = document.getElementById('addUserModal');
    if (modal) modal.classList.add('active');
}

function closeAddUserModal() {
    const modal = document.getElementById('addUserModal');
    if (modal) modal.classList.remove('active');
}

function showAddInvestmentModal() {
    const modal = document.getElementById('addInvestmentModal');
    if (modal) modal.classList.add('active');
}

function closeAddInvestmentModal() {
    const modal = document.getElementById('addInvestmentModal');
    if (modal) modal.classList.remove('active');
}

// Close modal on outside click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Chart.js Defaults for Dark Theme
if (typeof Chart !== 'undefined') {
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.05)';
    Chart.defaults.font.family = "'Cairo', sans-serif";
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Loading State
function showLoading(button) {
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = '<span class="loading"></span>';
    button.disabled = true;
}

function hideLoading(button) {
    button.innerHTML = button.dataset.originalText;
    button.disabled = false;
}

// Copy to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('تم النسخ إلى الحافظة!', 'success');
    }).catch(() => {
        showToast('فشل النسخ!', 'error');
    });
}

// Number Formatting
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

function formatCurrency(num) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(num);
}

// Date Formatting
function formatDate(date) {
    return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// Search Filter
function filterTable(input, tableSelector) {
    const filter = input.value.toLowerCase();
    const table = document.querySelector(tableSelector);
    if (!table) return;

    const rows = table.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? '' : 'none';
    });
}

// Export Table to CSV
function exportTableToCSV(tableSelector, filename) {
    const table = document.querySelector(tableSelector);
    if (!table) return;

    let csv = [];
    const rows = table.querySelectorAll('tr');

    rows.forEach(row => {
        const cols = row.querySelectorAll('td, th');
        const rowData = [];

        cols.forEach(col => {
            rowData.push('"' + col.innerText.replace(/"/g, '""') + '"');
        });

        csv.push(rowData.join(','));
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + csv.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    });
}

// Online/Offline Detection
window.addEventListener('online', () => {
    showToast('أنت متصل بالإنترنت', 'success');
});

window.addEventListener('offline', () => {
    showToast('أنت غير متصل بالإنترنت', 'warning');
});
