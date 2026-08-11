const API_URL = window.API_BASE_URL ? window.API_BASE_URL + '/api' : (window.location.origin + '/api');
let cachedUsers = [];
let isLoading = true;
let isOrgProfileComplete = true;
let orgCompletionPct = 100;

const rolePermissions = {
    Admin: [
        "overviewTab",
        "usersTab",
        "tasksTab",
        "newsTab",
        "eventsTab",
        "galleryTab",
        "blogsTab",
        "enquiriesTab",
        "heroTab",
        "profileTab",
        "settingsTab"
    ],
    Agency: [
        "overviewTab",
        "usersTab",
        "newsTab",
        "eventsTab",
        "galleryTab",
        "blogsTab",
        "profileTab"
    ],
    NGO: [
        "overviewTab",
        "usersTab",
        "newsTab",
        "eventsTab",
        "galleryTab",
        "blogsTab",
        "profileTab"
    ],
    Agent: [
        "usersTab",
        "newsTab",
        "eventsTab",
        "galleryTab",
        "blogsTab",
        "enquiriesTab",
        "profileTab"
    ],
    User: [
        "usersTab",
        "overviewTab",
        "galleryTab",
        "blogsTab",
        "profileTab"
    ],
    Member: [
        "overviewTab",
        "newsTab",
        "eventsTab",
        "galleryTab",
        "blogsTab",
        "profileTab"
    ]
};




function applyTheme(theme) {
    const body = document.body;
    const isDark = theme === 'dark';

    if (isDark) {
        body.classList.add('dark-theme', 'dark-mode');
        body.classList.remove('light-theme', 'light-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.add('light-theme', 'light-mode');
        body.classList.remove('dark-theme', 'dark-mode');
        localStorage.setItem('theme', 'light');
    }

    const themeThumb = document.getElementById('themeThumb');
    if (themeThumb) {
        if (isDark) {
            themeThumb.style.transform = 'translateX(18px)';
            themeThumb.textContent = '🌙';
        } else {
            themeThumb.style.transform = 'translateX(0px)';
            themeThumb.textContent = '☀️';
        }
    }

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        if (isDark) {
            themeToggle.classList.add('dark');
            themeToggle.classList.remove('light');
        } else {
            themeToggle.classList.add('light');
            themeToggle.classList.remove('dark');
        }
    }

    const themeSelect = document.getElementById('settingTheme');
    if (themeSelect) {
        themeSelect.value = isDark ? 'dark' : 'light';
    }
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || (document.body.classList.contains('dark-theme') || document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
}

window.applyTheme = applyTheme;
window.toggleTheme = toggleTheme;   
// ==============================
// LOADING MANAGEMENT
// ==============================
function showLoading(message = 'Loading...') {
    let overlay = document.getElementById('loadingOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(15, 23, 42, 0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 99999;
            flex-direction: column;
            gap: 1.5rem;
            transition: opacity 0.3s ease;
        `;
        overlay.innerHTML = `
            <div style="
                width: 60px;
                height: 60px;
                border: 4px solid rgba(255,255,255,0.1);
                border-top: 4px solid #3b82f6;
                border-radius: 50%;
                animation: spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
            "></div>
            <p id="loadingMessage" style="color: white; font-size: 1.1rem; font-weight: 500; margin: 0;">${message}</p>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            </style>
        `;
        document.body.appendChild(overlay);
    } else {
        document.getElementById('loadingMessage').textContent = message;
        overlay.style.display = 'flex';
    }
    isLoading = true;
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
            overlay.style.opacity = '1';
        }, 300);
    }
    isLoading = false;
}

function updateLoadingMessage(message) {
    const msgEl = document.getElementById('loadingMessage');
    if (msgEl) {
        msgEl.textContent = message;
    }
}

// ==============================
// ROLE-BASED DASHBOARD ROUTING
// ==============================
function getDashboardUrl(role) {
    const map = {
        'Admin':  'dashboard.html',
        'Agency': 'dashboard.html',
        'NGO':    'dashboard.html',
        'Member': 'dashboard.html',
        'User':   'dashboard.html'
    };
    return map[role] || 'dashboard.html';
}

// ==============================
// AUTHENTICATION
// ==============================
function checkAuth() {
    showLoading('Checking authentication...');
    
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    const isDashboardPage = window.location.pathname.endsWith('dashboard.html');

    const isAddPage = !isLoginPage && !isDashboardPage;

    setTimeout(() => {
        try {
            if (!token && isDashboardPage) {
                updateLoadingMessage('Redirecting to login...');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 500);
                return;
            } else if (!token && isAddPage) {
                updateLoadingMessage('Please login first...');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 500);
                return;
            } else if (token && isLoginPage) {
                try {
                    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
                    const dest = getDashboardUrl(savedUser.role);
                    updateLoadingMessage('Redirecting to dashboard...');
                    setTimeout(() => {
                        window.location.href = dest;
                    }, 500);
                } catch (e) {
                    window.location.href = 'dashboard.html';
                }
                return;
            }

            if (userStr && isDashboardPage) {
                try {
                    const user = JSON.parse(userStr);
                    if (!user || !user.role) {
                        throw new Error('Invalid user data');
                    }
                    updateLoadingMessage('Setting up dashboard...');
                    setTimeout(() => {
                        setupDashboard(user);
                        hideLoading();
                    }, 300);
                } catch (e) {
                    console.error('Error parsing user data:', e);
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    updateLoadingMessage('Session expired. Redirecting...');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 500);
                }
            } else if (isDashboardPage) {
                updateLoadingMessage('No session found. Redirecting...');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 500);
            } else {
                // Standalone add page with valid token — setup form listeners
                setupFormListeners();
                applyTheme(localStorage.getItem('theme') || 'light');
                hideLoading();
            }
        } catch (error) {
            console.error('Auth check error:', error);
            hideLoading();
        }
    }, 200);
}

function logout() {
    showLoading('Logging out...');
    setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }, 300);
}

// ==============================
// PERMISSIONS
// ==============================
function applyRolePermissions(role) {
    console.log("Logged in Role:", role);
    const allowedTabs = rolePermissions[role] || [];
    console.log("Allowed Tabs:", allowedTabs);

    document.querySelectorAll(".sidebar-item").forEach(item => {
        const tab = item.dataset.tab;
        if (allowedTabs.includes(tab)) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
}

// ==============================
// DASHBOARD SETUP
// ==============================
function setupDashboard(user) {
    if (!user || !user.role) {
        console.error('Invalid user data in setupDashboard');
        window.location.href = 'index.html';
        return;
    }

    // Update user info
    const userNameEl = document.getElementById('userName');
    const userRoleEl = document.getElementById('userRole');
    const headerUserEl = document.getElementById('headerUser');
    
    if (userNameEl) userNameEl.textContent = user.name || 'User';
    if (userRoleEl) userRoleEl.textContent = user.role || 'User';
    if (headerUserEl) headerUserEl.textContent = `👋 ${user.name || 'User'}  ·  ${user.role || 'User'}`;

    // Setup role select
    const targetRoleSelect = document.getElementById('targetRole');
    if (targetRoleSelect) {
        if (user.role === 'Admin') {
            targetRoleSelect.innerHTML = `
                <option value="Agency">Agency</option>
                <option value="NGO">NGO</option>
                <option value="Member">Member</option>
                <option value="User">User</option>
            `;
        } else if (user.role === 'Agency' || user.role === 'NGO' || user.role === 'Agent') {
            targetRoleSelect.innerHTML = `
                <option value="Member">Member</option>
                <option value="User">User</option>
            `;
        } else {
            targetRoleSelect.innerHTML = `
                <option value="Member">Member</option>
            `;
        }
    }

    // Apply role permissions
    applyRolePermissions(user.role);

    // Setup form listeners
    setupFormListeners();

    // Check organization profile completion for Agency and NGO
    checkOrgProfileCompletion(user);

    // Load initial data
    loadOverviewStats();

    // Open first tab
    openDefaultTab(user);
}

async function checkOrgProfileCompletion(user) {
    if (user.role !== 'Agency' && user.role !== 'NGO') return;

    try {
        const res = await fetch(`${API_URL}/organization/me`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        
        orgCompletionPct = data.completion_percentage || 0;
        isOrgProfileComplete = data.complete === true;

        const banner = document.getElementById('profileCompletionBanner');
        const pctEl = document.getElementById('profileCompletionPct');

        if (pctEl) pctEl.textContent = orgCompletionPct;

        if (banner) {
            if (!isOrgProfileComplete) {
                banner.style.display = 'flex';
            } else {
                banner.style.display = 'none';
            }
        }
    } catch (e) {
        console.error('Error checking org profile completion:', e);
    }
}

function openDefaultTab(user) {
    const firstTab = rolePermissions[user.role]?.[0];
    
    if (firstTab) {
        document.querySelectorAll(".tab-content").forEach(tab => {
            tab.classList.remove("active");
        });

        document.querySelectorAll(".sidebar-item").forEach(item => {
            item.classList.remove("active");
            if (item.dataset.tab === firstTab) {
                item.classList.add("active");
            }
        });

        const firstContent = document.getElementById(firstTab);
        if (firstContent) {
            firstContent.classList.add("active");
        }

        // Load initial tab content
        switch (firstTab) {
            case "overviewTab":
                loadOverviewStats();
                break;
            case "usersTab":
                loadUsers();
                break;
            case "tasksTab":
                loadTasks();
                break;
            case "newsTab":
                loadNews();
                break;
            case "eventsTab":
                loadEvents();
                break;
            case "galleryTab":
                loadGallery();
                break;
            case "blogsTab":
                loadBlogs();
                break;
            case "enquiriesTab":
                loadEnquiries();
                break;
            case "profileTab":
                loadMyProfile();
                break;
            default:
                break;
        }
    }
}

// ==============================
// TAB SWITCHING
// ==============================
function switchTab(tabId, element) {
    const user = JSON.parse(localStorage.getItem("user"));
    const allowedTabs = rolePermissions[user.role] || [];

    if (!allowedTabs.includes(tabId)) {
        alert("Access Denied");
        return;
    }

    // Lock creation tabs if profile is incomplete for Agency and NGO
    const restrictedTabs = ['newsTab', 'eventsTab', 'galleryTab', 'blogsTab', 'usersTab'];
    if ((user.role === 'Agency' || user.role === 'NGO') && !isOrgProfileComplete && restrictedTabs.includes(tabId)) {
        alert(`⚠️ Profile Incomplete (${orgCompletionPct}%)!\n\nPlease complete your organization profile before managing content or accounts.`);
        // Allow viewing, but keep banner prominent
    }

    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    element.classList.add('active');

    // Load tab content
    showLoading(`Loading ${tabId.replace('Tab', '')}...`);
    setTimeout(() => {
        switch (tabId) {
            case 'overviewTab':
                loadOverviewStats();
                break;
            case 'usersTab':
                loadUsers();
                break;
            case 'tasksTab':
                loadTasks();
                break;
            case 'newsTab':
                loadNews();
                break;
            case 'eventsTab':
                loadEvents();
                break;
            case 'galleryTab':
                loadGallery();
                break;
            case 'blogsTab':
                loadBlogs();
                break;
            case 'enquiriesTab':
                loadEnquiries();
                break;
            case 'heroTab':
                loadHeroSettings();
                break;
            case 'profileTab':
                loadMyProfile();
                break;
            default:
                break;
        }
        hideLoading();
    }, 300);
}

// ==============================
// OVERVIEW STATS & WIDGETS
// ==============================
async function loadOverviewStats() {
    try {
        const tokenHeader = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
        const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const role = savedUser.role || 'User';

        // ── Role-based Widget Visibility ──────────────────────────────────────
        const cardWallet = document.getElementById('cardWallet');
        const cardAssigned = document.getElementById('cardAssignedTasks');
        const cardCompleted = document.getElementById('cardCompletedTasks');
        const widgetRef = document.getElementById('widgetReferral');
        const widgetNotif = document.getElementById('widgetNotifications');
        const widgetAct = document.getElementById('widgetRecentActivities');

        if (cardWallet) cardWallet.style.display = 'flex';
        if (cardAssigned) cardAssigned.style.display = 'flex';
        if (cardCompleted) cardCompleted.style.display = 'flex';

        if (widgetNotif) widgetNotif.style.display = 'block';

        if (role === 'Admin') {
            if (widgetRef) widgetRef.style.display = 'none';
            if (widgetAct) widgetAct.style.display = 'block';
        } else if (role === 'User') {
            if (widgetRef) widgetRef.style.display = 'block';
            if (widgetAct) widgetAct.style.display = 'none';
        } else {
            // Agency, NGO, Member
            if (widgetRef) widgetRef.style.display = 'block';
            if (widgetAct) widgetAct.style.display = 'block';
        }

        // ── Org Profile Completion Widget (Agency & NGO only) ─────────────────
        const cardOrgCompletion   = document.getElementById('cardOrgCompletion');
        const widgetOrgCompletion = document.getElementById('widgetOrgCompletion');

        if (role === 'Agency' || role === 'NGO') {
            if (cardOrgCompletion)   cardOrgCompletion.style.display   = 'flex';
            if (widgetOrgCompletion) widgetOrgCompletion.style.display = 'block';

            // Fetch org profile data
            try {
                const orgRes = await fetch(`${API_URL}/organization/me`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (orgRes.ok) {
                    const orgData = await orgRes.json();
                    const pct     = orgData.completion_percentage || 0;
                    const details = orgData.details || {};

                    // Stat card
                    const pctEl   = document.getElementById('countOrgPct');
                    const iconEl  = document.getElementById('cardOrgIcon');
                    if (pctEl)  pctEl.textContent = pct + '%';
                    if (pctEl)  pctEl.style.color  = pct >= 60 ? '#16A34A' : pct >= 30 ? '#EA580C' : '#DC2626';
                    if (iconEl) {
                        iconEl.style.color      = pct >= 60 ? '#16A34A' : pct >= 30 ? '#EA580C' : '#DC2626';
                        iconEl.style.background = pct >= 60 ? '#F0FDF4' : pct >= 30 ? '#FFF7ED' : '#FEF2F2';
                    }

                    // Dashboard progress bar
                    const dashBar      = document.getElementById('orgDashBar');
                    const dashPctLabel = document.getElementById('orgDashPctLabel');
                    const dashMsg      = document.getElementById('orgCompletionDashMsg');
                    const completeBtn  = document.getElementById('orgCompleteBtnDash');
                    const barColor     = pct >= 60 ? 'linear-gradient(90deg,#16A34A,#22C55E)'
                                       : pct >= 30 ? 'linear-gradient(90deg,#EA580C,#F97316)'
                                       :             'linear-gradient(90deg,#DC2626,#EF4444)';
                    if (dashBar)      { dashBar.style.width = pct + '%'; dashBar.style.background = barColor; }
                    if (dashPctLabel) { dashPctLabel.textContent = pct + '%'; dashPctLabel.style.color = pct >= 60 ? '#16A34A' : pct >= 30 ? '#EA580C' : '#DC2626'; }
                    if (dashMsg) {
                        dashMsg.textContent = pct >= 100 ? '🎉 Your organization profile is 100% complete!'
                            : pct >= 60  ? `✅ Profile is ${pct}% complete. A few more fields to go!`
                            : pct >= 30  ? `⚠️ Profile is ${pct}% complete. Please add more details to unlock features.`
                            :              `❌ Profile is only ${pct}% complete. Complete it to unlock all features.`;
                    }
                    if (completeBtn) {
                        completeBtn.textContent = pct >= 100 ? '✅ View Profile' : 'Complete Profile →';
                        completeBtn.style.background = pct >= 60
                            ? 'linear-gradient(135deg,#16A34A,#15803D)'
                            : 'linear-gradient(135deg,#1a4b6d,#0b2b4a)';
                    }

                    // Circular SVG ring (circumference = 2π×36 ≈ 226)
                    const ring    = document.getElementById('orgRingFill');
                    const ringPct = document.getElementById('orgRingPct');
                    const CIRC    = 226;
                    if (ring) {
                        ring.style.strokeDashoffset = CIRC - (CIRC * pct / 100);
                        ring.style.stroke = pct >= 60 ? '#16A34A' : pct >= 30 ? '#EA580C' : '#DC2626';
                    }
                    if (ringPct) { ringPct.textContent = pct + '%'; }

                    // Field checklist badges
                    const checklist = document.getElementById('orgFieldChecklist');
                    if (checklist) {
                        const fields = [
                            { key: 'organization_name',    label: 'Name' },
                            { key: 'organization_type',    label: 'Type' },
                            { key: 'registration_number',  label: 'Reg. No.' },
                            { key: 'gst_number',           label: 'GST' },
                            { key: 'pan_number',           label: 'PAN' },
                            { key: 'website',              label: 'Website' },
                            { key: 'logo',                 label: 'Logo' },
                            { key: 'registration_document',label: 'Reg. Doc' },
                            { key: 'pan_document',         label: 'PAN Doc' },
                            { key: 'address',              label: 'Address' },
                            { key: 'city',                 label: 'City' },
                            { key: 'state',                label: 'State' },
                            { key: 'pincode',              label: 'Pincode' },
                            { key: 'description',          label: 'About' },
                        ];
                        checklist.innerHTML = fields.map(f => {
                            const filled = details[f.key] && String(details[f.key]).trim() !== '';
                            return `<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:0.72rem;font-weight:600;
                                background:${filled ? '#F0FDF4' : '#FEF2F2'};color:${filled ? '#16A34A' : '#DC2626'};border:1px solid ${filled ? '#BBF7D0' : '#FECACA'};">
                                ${filled ? '✓' : '✗'} ${f.label}
                            </span>`;
                        }).join('');
                    }
                }
            } catch (orgErr) {
                console.error('Org completion fetch error:', orgErr);
            }
        } else {
            if (cardOrgCompletion)   cardOrgCompletion.style.display   = 'none';
            if (widgetOrgCompletion) widgetOrgCompletion.style.display = 'none';
        }


        // ── Fetch Basic CMS Counts ──────────────────────────────────────────
        const [uRes, nRes, eRes, gRes, bRes, enqRes] = await Promise.all([
            fetch(`${API_URL}/users`, { headers: tokenHeader }).catch(() => null),
            fetch(`${API_URL}/news`).catch(() => null),
            fetch(`${API_URL}/events`).catch(() => null),
            fetch(`${API_URL}/gallery`).catch(() => null),
            fetch(`${API_URL}/blogs`).catch(() => null),
            fetch(`${API_URL}/enquiries`, { headers: tokenHeader }).catch(() => null)
        ]);

        if (uRes && uRes.ok) {
            const uData = await uRes.json();
            const countEl = document.getElementById('countUsers');
            if (countEl) countEl.textContent = uData.length || 0;
        }
        if (nRes && nRes.ok) {
            const nData = await nRes.json();
            const countEl = document.getElementById('countNews');
            if (countEl) countEl.textContent = nData.length || 0;
        }
        if (eRes && eRes.ok) {
            const eData = await eRes.json();
            const countEl = document.getElementById('countEvents');
            if (countEl) countEl.textContent = eData.length || 0;
        }
        if (gRes && gRes.ok) {
            const gData = await gRes.json();
            const countEl = document.getElementById('countGallery');
            if (countEl) countEl.textContent = gData.length || 0;
        }
        if (bRes && bRes.ok) {
            const bData = await bRes.json();
            const countEl = document.getElementById('countBlogs');
            if (countEl) countEl.textContent = bData.length || 0;
        }
        if (enqRes && enqRes.ok) {
            const enqData = await enqRes.json();
            const pendingCount = enqData.filter(item => item.status === 'Pending').length;
            const countEl = document.getElementById('countEnquiries');
            if (countEl) countEl.textContent = pendingCount || 0;
        }

        // ── Fetch Wallet Data ────────────────────────────────────────────────
        try {
            const wRes = await fetch(`${API_URL}/wallet/balance`, { headers: tokenHeader });
            if (wRes.ok) {
                const wData = await wRes.json();
                const walletPtsEl = document.getElementById('countWalletPts');
                if (walletPtsEl) walletPtsEl.textContent = `${wData.balance || 0} Pts`;
            }
        } catch (e) {
            console.error('Wallet widget fetch error:', e);
        }

        // ── Fetch Task Assignments Data ──────────────────────────────────────
        try {
            const taRes = await fetch(`${API_URL}/task-assignments`, { headers: tokenHeader });
            if (taRes.ok) {
                const assignments = await taRes.json();
                const assignedCount = assignments.filter(a => ['Pending', 'Assigned', 'In Progress'].includes(a.status)).length;
                const completedCount = assignments.filter(a => ['Approved', 'Completed'].includes(a.status)).length;

                const assignedEl = document.getElementById('countAssignedTasks');
                const completedEl = document.getElementById('countCompletedTasks');

                if (assignedEl) assignedEl.textContent = assignedCount;
                if (completedEl) completedEl.textContent = completedCount;

                // Populate Notifications Widget with task updates
                const notifList = document.getElementById('notificationsList');
                if (notifList) {
                    if (assignments.length === 0) {
                        notifList.innerHTML = '<div style="color:#64748B; font-size:0.88rem;">No new notifications.</div>';
                    } else {
                        notifList.innerHTML = assignments.slice(0, 5).map(a => `
                            <div style="background: rgba(241, 245, 249, 0.6); padding: 0.6rem 0.9rem; border-radius: 12px; border-left: 3px solid #3B82F6; font-size: 0.85rem;">
                                <strong>Task "${a.task_title || 'Assignment'}"</strong>: Status is <span style="font-weight:600; color:#1A4B6D;">${a.status}</span>
                                <div style="font-size:0.75rem; color:#64748B; margin-top:2px;">${new Date(a.assigned_date).toLocaleDateString()}</div>
                            </div>
                        `).join('');
                    }
                }
            }
        } catch (e) {
            console.error('Task assignments widget fetch error:', e);
        }

        // ── Fetch Referral Data (for non-Admins) ──────────────────────────────
        if (role !== 'Admin') {
            try {
                const refRes = await fetch(`${API_URL}/referrals/my`, { headers: tokenHeader });
                if (refRes.ok) {
                    const refData = await refRes.json();
                    const codeEl = document.getElementById('dashReferralCode');
                    const linkEl = document.getElementById('dashReferralLink');
                    if (codeEl) codeEl.textContent = refData.referral_code || 'CODE';
                    if (linkEl) linkEl.value = refData.referral_link || '';
                }
            } catch (e) {
                console.error('Referral widget fetch error:', e);
            }
        }

        // ── Populate Recent Activities Widget ────────────────────────────────
        const actList = document.getElementById('recentActivitiesList');
        if (actList) {
            actList.innerHTML = `
                <div style="background: rgba(241, 245, 249, 0.6); padding: 0.6rem 0.9rem; border-radius: 12px; border-left: 3px solid #10B981; font-size: 0.85rem;">
                    <strong>Session Active</strong>: Logged in as ${savedUser.name || 'User'} (${role})
                    <div style="font-size:0.75rem; color:#64748B; margin-top:2px;">Just now</div>
                </div>
                <div style="background: rgba(241, 245, 249, 0.6); padding: 0.6rem 0.9rem; border-radius: 12px; border-left: 3px solid #F59E0B; font-size: 0.85rem;">
                    <strong>System Ready</strong>: All portal services synchronized.
                    <div style="font-size:0.75rem; color:#64748B; margin-top:2px;">Today</div>
                </div>
            `;
        }

    } catch (err) {
        console.error('Error loading stats & widgets:', err);
    }
}

function copyReferralLink() {
    const linkInput = document.getElementById('dashReferralLink');
    if (linkInput && linkInput.value) {
        navigator.clipboard.writeText(linkInput.value);
        alert('Referral link copied to clipboard!');
    }
}
window.copyReferralLink = copyReferralLink;

// ==============================
// LOGIN
// ==============================
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');

        showLoading('Logging in...');

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('user', JSON.stringify({
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    role: data.role
                }));

                const dest = getDashboardUrl(data.role);
                updateLoadingMessage(`Login successful! Redirecting as ${data.role}...`);
                setTimeout(() => {
                    window.location.href = dest;
                }, 500);
            } else {
                hideLoading();
                errorDiv.textContent = data.error || 'Login failed';
            }
        } catch (err) {
            hideLoading();
            errorDiv.textContent = 'Server error. Please try again.';
        }
    });
}

// ==============================
// FILE UPLOAD
// ==============================
async function uploadFile(fileInput) {
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) return '';
    
    showLoading('Uploading file...');
    
    try {
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);

        const res = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        hideLoading();
        return data.imageUrl || '';
    } catch (error) {
        hideLoading();
        console.error('Upload error:', error);
        return '';
    }
}

// ==============================
// FORM LISTENERS
// ==============================
function setupFormListeners() {
    // Create User Form
    const userForm = document.getElementById('createUserForm');
    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading('Creating user...');
            
            let profile_image_url = null;
            const profileImageInput = document.getElementById('newProfileImage');
            if (profileImageInput && profileImageInput.files.length > 0) {
                const imgData = new FormData();
                imgData.append('image', profileImageInput.files[0]);
                try {
                    const uploadRes = await fetch(`${API_URL}/upload`, {
                        method: 'POST',
                        body: imgData,
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    const uploadData = await uploadRes.json();
                    if (uploadRes.ok && uploadData.url) {
                        profile_image_url = uploadData.url;
                    }
                } catch (err) {
                    console.error('Image upload failed', err);
                }
            }

            const body = {
                name: document.getElementById('newName').value,
                email: document.getElementById('newEmail').value,
                password: document.getElementById('newPassword').value,
                phone: document.getElementById('newPhone').value,
                dob: document.getElementById('newDob').value,
                address: document.getElementById('newAddress').value,
                city: document.getElementById('newCity').value,
                state: document.getElementById('newState').value,
                pincode: document.getElementById('newPincode').value,
                bank_name: document.getElementById('newBankName').value,
                account_no: document.getElementById('newAccountNo').value,
                ifsc_code: document.getElementById('newIfscCode').value,
                upi_id: document.getElementById('newUpiId').value,
                target_role: document.getElementById('targetRole') ? document.getElementById('targetRole').value : null,
                profile_image: profile_image_url
            };

            const errorDiv = document.getElementById('createError');
            try {
                const res = await fetch(`${API_URL}/users`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${localStorage.getItem('token')}` 
                    },
                    body: JSON.stringify(body)
                });
                const data = await res.json();
                hideLoading();
                
                if (res.ok) {
                    errorDiv.style.color = '#16A34A';
                    errorDiv.textContent = '✅ ' + (data.message || 'User created successfully!');
                    userForm.reset();
                    loadUsers();
                } else {
                    errorDiv.style.color = '#DC2626';
                    errorDiv.textContent = '❌ ' + (data.error || 'Failed to create user');
                }
            } catch(err) {
                hideLoading();
                errorDiv.textContent = '❌ Error creating account';
                console.error(err);
            }
        });
    }

    // News Form
    const newsForm = document.getElementById('createNewsForm');
    if (newsForm) {
        newsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading('Creating news...');
            
            const newsImgFile = document.getElementById('newsImage');
            const imageUrl = await uploadFile(newsImgFile);

            const body = {
                title: document.getElementById('newsTitle').value,
                title_hi: document.getElementById('newsTitleHi').value,
                date: document.getElementById('newsDate').value,
                category: document.getElementById('newsCategory').value,
                category_hi: document.getElementById('newsCategoryHi').value,
                snippet: document.getElementById('newsSnippet').value,
                snippet_hi: document.getElementById('newsSnippetHi').value,
                image: imageUrl,
            };
            await sendPost(`${API_URL}/news`, body, newsForm, loadNews, 'newsError');
        });
    }

    // Events Form
    const eventForm = document.getElementById('createEventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading('Creating event...');
            
            const eventImgFile = document.getElementById('eventImage');
            const imageUrl = await uploadFile(eventImgFile);

            const body = {
                day: document.getElementById('eventDay').value,
                month: document.getElementById('eventMonth').value,
                year: document.getElementById('eventYear').value,
                title: document.getElementById('eventTitle').value,
                title_hi: document.getElementById('eventTitleHi').value,
                location: document.getElementById('eventLocation').value,
                location_hi: document.getElementById('eventLocationHi').value,
                category: document.getElementById('eventCategory').value,
                category_hi: document.getElementById('eventCategoryHi').value,
                desc: document.getElementById('eventDesc').value,
                desc_hi: document.getElementById('eventDescHi').value,
                image: imageUrl,
            };
            await sendPost(`${API_URL}/events`, body, eventForm, loadEvents, 'eventError');
        });
    }

    // Gallery Form
    const galleryForm = document.getElementById('createGalleryForm');
    if (galleryForm) {
        galleryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading('Adding to gallery...');
            
            const galleryFile = document.getElementById('gallerySrc');
            const fileObj = galleryFile && galleryFile.files ? galleryFile.files[0] : null;
            const imageUrl = await uploadFile(galleryFile);

            if (!imageUrl) {
                hideLoading();
                const errEl = document.getElementById('galleryError');
                if (errEl) errEl.textContent = 'File upload failed. Please try again.';
                return;
            }

            const isVideo = fileObj && fileObj.type && fileObj.type.startsWith('video/');

            const body = {
                src: imageUrl,
                title: document.getElementById('galleryTitle').value,
                title_hi: document.getElementById('galleryTitleHi').value,
                category: document.getElementById('galleryCategory').value,
                category_hi: document.getElementById('galleryCategoryHi').value,
                type: isVideo ? 'video' : 'image'
            };
            await sendPost(`${API_URL}/gallery`, body, galleryForm, loadGallery, 'galleryError');
        });
    }

    // Blog Form
    const blogForm = document.getElementById('createBlogForm');
    if (blogForm) {
        blogForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading('Creating blog...');
            
            const blogImgFile = document.getElementById('blogImage');
            const imageUrl = await uploadFile(blogImgFile);

            const body = {
                title: document.getElementById('blogTitle').value,
                title_hi: document.getElementById('blogTitleHi').value,
                author: document.getElementById('blogAuthor').value,
                content: document.getElementById('blogContent').value,
                content_hi: document.getElementById('blogContentHi').value,
                image: imageUrl,
            };
            await sendPost(`${API_URL}/blogs`, body, blogForm, loadBlogs, 'blogError');
        });
    }

    // Update Profile Form
    const profileForm = document.getElementById('updateProfileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading('Updating profile...');
            
            const msgDiv = document.getElementById('profileMsg');
            const body = {
                name: document.getElementById('myProfileName').value,
                phone: document.getElementById('myProfilePhone').value,
                dob: document.getElementById('myProfileDob').value,
                address: document.getElementById('myProfileAddress').value,
                city: document.getElementById('myProfileCity').value,
                state: document.getElementById('myProfileState').value,
                pincode: document.getElementById('myProfilePincode').value,
                bank_name: document.getElementById('myProfileBankName').value,
                account_no: document.getElementById('myProfileAccountNo').value,
                ifsc_code: document.getElementById('myProfileIfscCode').value,
                upi_id: document.getElementById('myProfileUpiId').value,
            };

            try {
                const res = await fetch(`${API_URL}/auth/profile`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${localStorage.getItem('token')}` 
                    },
                    body: JSON.stringify(body)
                });
                const data = await res.json();
                hideLoading();
                
                if (res.ok) {
                    msgDiv.style.color = '#16A34A';
                    msgDiv.textContent = '✅ Profile updated successfully!';
                    // Update user name in header
                    const user = JSON.parse(localStorage.getItem('user'));
                    user.name = body.name;
                    localStorage.setItem('user', JSON.stringify(user));
                    document.getElementById('userName').textContent = body.name;
                    document.getElementById('headerUser').textContent = `👋 ${body.name}  ·  ${user.role}`;
                } else {
                    msgDiv.style.color = '#DC2626';
                    msgDiv.textContent = '❌ ' + (data.error || 'Failed to update profile');
                }
            } catch (err) {
                hideLoading();
                msgDiv.textContent = '❌ Error updating profile';
                console.error(err);
            }
        });
    }

    // Change Password Form
    const passForm = document.getElementById('changePasswordForm');
    if (passForm) {
        passForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const msgDiv = document.getElementById('passwordMsg');
            const currPass = document.getElementById('currPass').value;
            const newPass = document.getElementById('newPass').value;
            const confirmPass = document.getElementById('confirmPass').value;

            if (newPass !== confirmPass) {
                msgDiv.style.color = '#DC2626';
                msgDiv.textContent = '❌ New passwords do not match';
                return;
            }

            showLoading('Changing password...');

            try {
                const res = await fetch(`${API_URL}/auth/change-password`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${localStorage.getItem('token')}` 
                    },
                    body: JSON.stringify({ currentPassword: currPass, newPassword: newPass })
                });
                const data = await res.json();
                hideLoading();
                
                if (res.ok) {
                    msgDiv.style.color = '#16A34A';
                    msgDiv.textContent = '✅ Password changed successfully!';
                    passForm.reset();
                } else {
                    msgDiv.style.color = '#DC2626';
                    msgDiv.textContent = '❌ ' + (data.error || 'Failed to change password');
                }
            } catch (err) {
                hideLoading();
                msgDiv.textContent = '❌ Error changing password';
                console.error(err);
            }
        });
    }

    // System Settings Form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const msgDiv = document.getElementById('settingsMsg');
            const theme = document.getElementById('settingTheme').value;
            
           if(theme==="dark"){
    document.body.classList.add("dark-theme");
    document.body.classList.remove("light-theme");
}else{
    document.body.classList.add("light-theme");
    document.body.classList.remove("dark-theme");
}

localStorage.setItem("theme",theme);
            msgDiv.style.color = '#16A34A';
            msgDiv.textContent = '✅ Settings saved successfully!';
            
            setTimeout(() => {
                msgDiv.textContent = '';
            }, 3000);
        });
    }
}

// ==============================
// SEND POST HELPER
// ==============================
async function sendPost(url, body, form, reloadFn, errorId) {
    const errDiv = document.getElementById(errorId);
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        hideLoading();
        
        if (res.ok) {
            errDiv.style.color = '#16A34A';
            errDiv.textContent = '✅ Added successfully! Redirecting...';
            form.reset();
            // If on a standalone add-*.html page, go back to dashboard
            const isStandalonePage = !window.location.pathname.endsWith('dashboard.html') && 
                                     !window.location.pathname.endsWith('index.html');
            if (isStandalonePage) {
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                reloadFn();
            }
        } else {
            errDiv.style.color = '#DC2626';
            errDiv.textContent = '❌ ' + (data.error || 'Failed');
        }
    } catch (err) {
        hideLoading();
        errDiv.textContent = '❌ Error';
        console.error(err);
    }
}

// ==============================
// LOAD FUNCTIONS
// ==============================
async function loadUsers() {
    try {
        const tbody = document.querySelector('#usersTable tbody');
        if (!tbody) return;
        
        const res = await fetch(`${API_URL}/users`, { 
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
        });
        
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const data = await res.json();
        cachedUsers = data;
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#64748B;padding:2rem;">No users found</td></tr>';
            return;
        }
        
        tbody.innerHTML = data.map(u => {
            let badgeBg = '#0369A1';
            if (u.role_name === 'Admin') badgeBg = '#2563EB';
            else if (u.role_name === 'Agency') badgeBg = '#0284C7';
            else if (u.role_name === 'NGO') badgeBg = '#16A34A';
            else if (u.role_name === 'Agent') badgeBg = '#EA580C';
            else if (u.role_name === 'Member') badgeBg = '#7C3AED';

            return `
                <tr>
                    <td><strong>${u.name || 'N/A'}</strong><br><small class="text-muted">${u.email || 'N/A'}</small></td>
                    <td><span class="role-badge" style="background:${badgeBg};color:white;padding:4px 12px;border-radius:20px;font-size:0.8rem;">${u.role_name || 'User'}</span></td>
                    <td>${u.phone || '-'}</td>
                    <td>${u.created_by_name || 'System / Admin'}</td>
                    <td>
                        <button class="btn-sm btn-info" onclick="openDownlineModal(${u.id}, '${(u.name || '').replace(/'/g, "\\'")}')" style="background:#0F172A;color:white;border:none;padding:4px 12px;border-radius:4px;cursor:pointer;">
                            ${u.downline_count || 0} Members 🔍
                        </button>
                    </td>
                    <td>
                        <button class="btn-sm btn-info" onclick="openProfileModal(${u.id})" style="background:#2563EB;color:white;border:none;padding:4px 12px;border-radius:4px;cursor:pointer;">
                            📋 Details
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading users:', error);
        const tbody = document.querySelector('#usersTable tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#DC2626;padding:2rem;">❌ Failed to load users</td></tr>';
        }
    }
}

async function loadNews() {
    try {
        const tbody = document.querySelector('#newsTable tbody');
        if (!tbody) return;

        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const res = await fetch(`${API_URL}/news`, { headers });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#64748B;padding:2rem;">No news articles found</td></tr>';
            return;
        }

        tbody.innerHTML = data.map(n => `
            <tr>
                <td><strong>${n.title || 'N/A'}</strong>${n.title_hi ? `<br><small style="color:#64748B;">${n.title_hi}</small>` : ''}</td>
                <td>${n.category || '-'}</td>
                <td>${n.date || '-'}</td>
                <td>${n.creator_name ? `<span style="font-weight:500;">${n.creator_name}</span><br><small style="color:#94A3B8;">${n.creator_role || ''}</small>` : '<span style="color:#94A3B8;">-</span>'}</td>
                <td>
                    <button class="logout-btn btn-danger" onclick="deleteItem('/news/${n.id}', loadNews)" style="background:#DC2626;color:white;border:none;padding:4px 12px;border-radius:4px;cursor:pointer;">
                        🗑️ Delete
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading news:', error);
        const tbody = document.querySelector('#newsTable tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#DC2626;padding:2rem;">❌ Failed to load news</td></tr>';
        }
    }
}

async function loadEvents() {
    try {
        const tbody = document.querySelector('#eventsTable tbody');
        if (!tbody) return;
        
        const res = await fetch(`${API_URL}/events`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const data = await res.json();
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#64748B;padding:2rem;">No events found</td></tr>';
            return;
        }
        
        tbody.innerHTML = data.map(e => `
            <tr>
                <td><strong>${e.title || 'N/A'}</strong></td>
                <td>${e.day || ''} ${e.month || ''} ${e.year || ''}</td>
                <td>${e.location || '-'}</td>
                <td>
                    <button class="logout-btn btn-danger" onclick="deleteItem('/events/${e.id}', loadEvents)" style="background:#DC2626;color:white;border:none;padding:4px 12px;border-radius:4px;cursor:pointer;">
                        🗑️ Delete
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading events:', error);
        const tbody = document.querySelector('#eventsTable tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#DC2626;padding:2rem;">❌ Failed to load events</td></tr>';
        }
    }
}

async function loadGallery() {
    try {
        const tbody = document.querySelector('#galleryTable tbody');
        if (!tbody) return;

        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const res = await fetch(`${API_URL}/gallery`, { headers });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#64748B;padding:2rem;">No gallery items found</td></tr>';
            return;
        }

        tbody.innerHTML = data.map(g => {
            const isVideo = g.type === 'video' || (g.src && (g.src.endsWith('.mp4') || g.src.endsWith('.webm') || g.src.endsWith('.mov')));
            return `
            <tr>
                <td>
                    ${isVideo ? `
                        <video src="${g.src || ''}" style="width: 50px; height: 35px; object-fit: cover; border-radius: 4px; background: #000;"></video>
                    ` : `
                        <img src="${g.src || ''}" style="width: 50px; height: 35px; object-fit: cover; border-radius: 4px;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2250%22 height=%2235%22%3E%3Crect width=%2250%22 height=%2235%22 fill=%22%23e2e8f0%22/%3E%3C/svg%3E'">
                    `}
                </td>
                <td>
                    ${g.title || '-'}
                    ${isVideo ? '<span style="background:#3b82f6;color:white;font-size:10px;padding:2px 6px;border-radius:10px;margin-left:6px;font-weight:600;">VIDEO</span>' : ''}
                </td>
                <td>${g.category || '-'}</td>
                <td>${g.creator_name ? `${g.creator_name} <small style="color:#64748B">(${g.creator_role || 'User'})</small>` : 'System / Admin'}</td>
                <td>
                    <button class="logout-btn btn-danger" onclick="deleteItem('/gallery/${g.id}', loadGallery)" style="background:#DC2626;color:white;border:none;padding:4px 12px;border-radius:4px;cursor:pointer;">
                        🗑️ Delete
                    </button>
                </td>
            </tr>
        `;
        }).join('');
    } catch (error) {
        console.error('Error loading gallery:', error);
        const tbody = document.querySelector('#galleryTable tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#DC2626;padding:2rem;">❌ Failed to load gallery</td></tr>';
        }
    }
}

async function loadBlogs() {
    try {
        const tbody = document.querySelector('#blogsTable tbody');
        if (!tbody) return;

        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const res = await fetch(`${API_URL}/blogs`, { headers });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#64748B;padding:2rem;">No blogs found</td></tr>';
            return;
        }

        tbody.innerHTML = data.map(b => `
            <tr>
                <td><strong>${b.title || 'N/A'}</strong></td>
                <td>${b.author || '-'} ${b.creator_name ? `<br><small style="color:#64748B">By: ${b.creator_name} (${b.creator_role || 'Org'})</small>` : ''}</td>
                <td>${b.created_at ? new Date(b.created_at).toLocaleDateString() : '-'}</td>
                <td>
                    <button class="logout-btn btn-danger" onclick="deleteItem('/blogs/${b.id}', loadBlogs)" style="background:#DC2626;color:white;border:none;padding:4px 12px;border-radius:4px;cursor:pointer;">
                        🗑️ Delete
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading blogs:', error);
        const tbody = document.querySelector('#blogsTable tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#DC2626;padding:2rem;">❌ Failed to load blogs</td></tr>';
        }
    }
}

async function loadEnquiries() {
    try {
        const tbody = document.querySelector('#enquiriesTable tbody');
        if (!tbody) return;
        
        const res = await fetch(`${API_URL}/enquiries`, { 
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
        });
        
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const data = await res.json();
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#64748B;padding:2rem;">No enquiries found</td></tr>';
            return;
        }
        
        tbody.innerHTML = data.map(e => `
            <tr>
                <td><strong>${e.name || 'N/A'}</strong></td>
                <td>${e.email || 'N/A'}<br><small style="color:#64748B;">${e.phone || ''}</small></td>
                <td>${e.subject || '-'}</td>
                <td style="max-width:200px;word-wrap:break-word;">${e.message || '-'}</td>
                <td>
                    <span style="background:${e.status === 'Pending' ? '#F59E0B' : '#10B981'};color:white;padding:2px 10px;border-radius:12px;font-size:0.8rem;">
                        ${e.status || 'Pending'}
                    </span>
                </td>
                <td>
                    <button onclick="updateEnquiryStatus(${e.id}, '${e.status === 'Pending' ? 'Resolved' : 'Pending'}')" style="background:#0F172A;color:white;border:none;padding:4px 12px;border-radius:4px;cursor:pointer;">
                        ${e.status === 'Pending' ? '✅ Resolve' : '🔄 Reopen'}
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading enquiries:', error);
        const tbody = document.querySelector('#enquiriesTable tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#DC2626;padding:2rem;">❌ Failed to load enquiries</td></tr>';
        }
    }
}

async function updateEnquiryStatus(id, newStatus) {
    showLoading('Updating status...');
    try {
        await fetch(`${API_URL}/enquiries/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            },
            body: JSON.stringify({ status: newStatus })
        });
        hideLoading();
        loadEnquiries();
    } catch (error) {
        hideLoading();
        console.error('Error updating enquiry status:', error);
        alert('Failed to update status');
    }
}

async function loadMyProfile() {
    try {
        const res = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const u = await res.json();
        
        document.getElementById('myProfileName').value = u.name || '';
        document.getElementById('myProfileEmail').value = u.email || '';
        document.getElementById('myProfilePhone').value = u.phone || '';
        document.getElementById('myProfileDob').value = u.dob || '';
        document.getElementById('myProfileAddress').value = u.address || '';
        document.getElementById('myProfileCity').value = u.city || '';
        document.getElementById('myProfileState').value = u.state || '';
        document.getElementById('myProfilePincode').value = u.pincode || '';
        document.getElementById('myProfileBankName').value = u.bank_name || '';
        document.getElementById('myProfileAccountNo').value = u.account_no || '';
        document.getElementById('myProfileIfscCode').value = u.ifsc_code || '';
        document.getElementById('myProfileUpiId').value = u.upi_id || '';

        // Show org profile section only for Agency and NGO
        const role = u.role_name || u.role || '';
        const orgSection = document.getElementById('orgProfileSection');
        if ((role === 'Agency' || role === 'NGO') && orgSection) {
            orgSection.style.display = 'block';
            loadOrgProfile(); // Load org profile data
        } else if (orgSection) {
            orgSection.style.display = 'none';
        }

    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

// ── Load existing organization profile ──────────────────────────────────────
async function loadOrgProfile() {
    try {
        const res = await fetch(`${API_URL}/organization/me`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        const d = data.details;
        if (!d) return; // No org profile yet — form stays empty for new entry

        // Populate fields
        document.getElementById('orgName').value        = d.organization_name || '';
        document.getElementById('orgType').value        = d.organization_type || '';
        document.getElementById('orgRegNo').value       = d.registration_number || '';
        document.getElementById('orgGst').value         = d.gst_number || '';
        document.getElementById('orgPan').value         = d.pan_number || '';
        document.getElementById('orgWebsite').value     = d.website || '';
        document.getElementById('orgDescription').value = d.description || '';
        document.getElementById('orgAddress').value     = d.address || '';
        document.getElementById('orgCity').value        = d.city || '';
        document.getElementById('orgState').value       = d.state || '';
        document.getElementById('orgPincode').value     = d.pincode || '';
        document.getElementById('orgCountry').value     = d.country || 'India';
        document.getElementById('orgRegDoc').value      = d.registration_document || '';
        document.getElementById('orgPanDoc').value      = d.pan_document || '';
        document.getElementById('orgLogo').value        = d.logo || '';

        // Update completion bar
        _updateOrgCompletionUI(data.completion_percentage || 0);
    } catch (e) {
        console.error('Error loading org profile:', e);
    }
}

function _updateOrgCompletionUI(pct) {
    const badge = document.getElementById('orgCompletionBadge');
    const bar   = document.getElementById('orgCompletionBar');
    if (badge) {
        badge.textContent = `${pct}% Complete`;
        badge.style.background = pct >= 60 ? '#F0FDF4' : pct >= 30 ? '#FFF7ED' : '#FEF2F2';
        badge.style.color      = pct >= 60 ? '#16A34A' : pct >= 30 ? '#EA580C' : '#DC2626';
    }
    if (bar) bar.style.width = pct + '%';
}

// ── Save org profile form ────────────────────────────────────────────────────
async function saveOrgProfile(e) {
    e.preventDefault();
    const btn    = document.getElementById('orgProfileSaveBtn');
    const msgEl  = document.getElementById('orgProfileMsg');
    const status = document.getElementById('orgProfileStatus');

    const payload = {
        organization_name:    document.getElementById('orgName').value.trim(),
        organization_type:    document.getElementById('orgType').value,
        registration_number:  document.getElementById('orgRegNo').value.trim(),
        gst_number:           document.getElementById('orgGst').value.trim(),
        pan_number:           document.getElementById('orgPan').value.trim(),
        website:              document.getElementById('orgWebsite').value.trim(),
        description:          document.getElementById('orgDescription').value.trim(),
        address:              document.getElementById('orgAddress').value.trim(),
        city:                 document.getElementById('orgCity').value.trim(),
        state:                document.getElementById('orgState').value.trim(),
        pincode:              document.getElementById('orgPincode').value.trim(),
        country:              document.getElementById('orgCountry').value.trim() || 'India',
        registration_document: document.getElementById('orgRegDoc').value.trim(),
        pan_document:         document.getElementById('orgPanDoc').value.trim(),
        logo:                 document.getElementById('orgLogo').value.trim(),
    };

    if (!payload.organization_name) {
        msgEl.textContent = '❌ Organization Name is required.';
        msgEl.style.background = '#FEF2F2';
        msgEl.style.color = '#DC2626';
        msgEl.style.display = 'block';
        return;
    }

    btn.disabled = true;
    btn.textContent = '⏳ Saving...';
    msgEl.style.display = 'none';
    if (status) status.textContent = '';

    try {
        const res = await fetch(`${API_URL}/organization/me`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (!res.ok) {
            msgEl.textContent = '❌ ' + (data.error || 'Failed to save organization profile.');
            msgEl.style.background = '#FEF2F2';
            msgEl.style.color = '#DC2626';
            msgEl.style.display = 'block';
        } else {
            msgEl.textContent = '✅ Organization profile saved successfully!';
            msgEl.style.background = '#F0FDF4';
            msgEl.style.color = '#16A34A';
            msgEl.style.display = 'block';
            // Update completion bar
            _updateOrgCompletionUI(data.completion_percentage || 0);
            // Refresh the top banner
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            checkOrgProfileCompletion(user);
            setTimeout(() => { if (msgEl) msgEl.style.display = 'none'; }, 4000);
        }
    } catch (err) {
        msgEl.textContent = '❌ Network error. Please try again.';
        msgEl.style.background = '#FEF2F2';
        msgEl.style.color = '#DC2626';
        msgEl.style.display = 'block';
    }

    btn.disabled = false;
    btn.textContent = '💾 Save Organization Profile';
}

// Attach org profile form handler
document.addEventListener('DOMContentLoaded', () => {
    const orgForm = document.getElementById('orgProfileForm');
    if (orgForm) orgForm.addEventListener('submit', saveOrgProfile);
});
window.loadOrgProfile  = loadOrgProfile;
window.saveOrgProfile  = saveOrgProfile;


// ==============================
// MODAL FUNCTIONS
// ==============================
async function openDownlineModal(parentId, parentName) {
    const modal = document.getElementById('detailsModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    modalTitle.textContent = `👥 Downline Members under: ${parentName}`;
    modalBody.innerHTML = '<p style="text-align:center;color:#64748B;">Loading downline list...</p>';
    modal.classList.add('active');

    try {
        const res = await fetch(`${API_URL}/users/${parentId}/downline`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const members = await res.json();

        if (members.length === 0) {
            modalBody.innerHTML = '<p style="text-align:center;color:#64748B;padding:2rem;">No members registered under this account yet.</p>';
            return;
        }

        modalBody.innerHTML = `
            <div style="overflow-x:auto;">
                <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
                    <thead>
                        <tr style="background:#F1F5F9;">
                            <th style="padding:8px 12px;text-align:left;">Name</th>
                            <th style="padding:8px 12px;text-align:left;">Role</th>
                            <th style="padding:8px 12px;text-align:left;">Phone</th>
                            <th style="padding:8px 12px;text-align:left;">Created Date</th>
                            <th style="padding:8px 12px;text-align:left;">Sub-Downline</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${members.map(m => `
                            <tr style="border-bottom:1px solid #E2E8F0;">
                                <td style="padding:8px 12px;"><strong>${m.name || 'N/A'}</strong><br><small style="color:#64748B;">${m.email || 'N/A'}</small></td>
                                <td style="padding:8px 12px;"><span style="background:#7C3AED;color:white;padding:2px 10px;border-radius:12px;font-size:0.8rem;">${m.role_name || 'User'}</span></td>
                                <td style="padding:8px 12px;">${m.phone || '-'}</td>
                                <td style="padding:8px 12px;">${m.created_at ? new Date(m.created_at).toLocaleDateString() : '-'}</td>
                                <td style="padding:8px 12px;"><strong>${m.downline_count || 0}</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        modalBody.innerHTML = '<p style="text-align:center;color:#DC2626;padding:2rem;">❌ Failed to load downline list.</p>';
        console.error('Error loading downline:', error);
    }
}

function openProfileModal(userId) {
    const u = cachedUsers.find(item => item.id === userId);
    if (!u) {
        alert('User not found');
        return;
    }

    const modal = document.getElementById('detailsModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    modalTitle.textContent = `📋 Profile & Payment Details: ${u.name || 'User'}`;
    modalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; font-size: 0.95rem;">
            <div style="background:#F8FAFC; padding: 1.5rem; border-radius: 8px; border:1px solid #E2E8F0;">
                <h4 style="color:#1E293B; margin-bottom: 0.75rem; border-bottom: 1px solid #CBD5E1; padding-bottom: 8px;">👤 Personal Info</h4>
                <p><strong>Name:</strong> ${u.name || 'N/A'}</p>
                <p><strong>Email:</strong> ${u.email || 'N/A'}</p>
                <p><strong>Phone:</strong> ${u.phone || 'N/A'}</p>
                <p><strong>DOB:</strong> ${u.dob || 'N/A'}</p>
                <p><strong>Role:</strong> <span style="background:#2563EB;color:white;padding:2px 10px;border-radius:12px;font-size:0.8rem;">${u.role_name || 'User'}</span></p>
                <p><strong>Created By:</strong> ${u.created_by_name || 'System / Admin'}</p>
                <p><strong>Created:</strong> ${u.created_at ? new Date(u.created_at).toLocaleString() : 'N/A'}</p>
            </div>

            <div style="background:#F8FAFC; padding: 1.5rem; border-radius: 8px; border:1px solid #E2E8F0;">
                <h4 style="color:#1E293B; margin-bottom: 0.75rem; border-bottom: 1px solid #CBD5E1; padding-bottom: 8px;">🏠 Address Details</h4>
                <p><strong>Address:</strong> ${u.address || 'N/A'}</p>
                <p><strong>City:</strong> ${u.city || 'N/A'}</p>
                <p><strong>State:</strong> ${u.state || 'N/A'}</p>
                <p><strong>Pincode:</strong> ${u.pincode || 'N/A'}</p>
            </div>

            <div style="grid-column: span 2; background:#F8FAFC; padding: 1.5rem; border-radius: 8px; border:1px solid #E2E8F0;">
                <h4 style="color:#1E293B; margin-bottom: 0.75rem; border-bottom: 1px solid #CBD5E1; padding-bottom: 8px;">💳 Bank & Payment Details</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <p><strong>Bank Name:</strong> ${u.bank_name || 'N/A'}</p>
                    <p><strong>Account No:</strong> ${u.account_no || 'N/A'}</p>
                    <p><strong>IFSC Code:</strong> ${u.ifsc_code || 'N/A'}</p>
                    <p><strong>UPI ID:</strong> ${u.upi_id || 'N/A'}</p>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('detailsModal');
    if (modal) modal.classList.remove('active');
}

// ==============================
// DELETE ITEM
// ==============================
async function deleteItem(endpoint, reloadFn) {
    if (!confirm('⚠️ Are you sure you want to delete this item?')) return;
    
    showLoading('Deleting...');
    try {
        await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        hideLoading();
        reloadFn();
    } catch (error) {
        hideLoading();
        console.error('Delete error:', error);
        alert('Failed to delete item');
    }
}

// ==============================
// MY TASKS LOADING (Non-Admin)
// ==============================
function loadMyTasks() {
    const tbody = document.querySelector('#myTasksTable tbody');
    const statsBar = document.getElementById('myTaskStatsBar');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:#94A3B8;">⏳ Loading your tasks...</td></tr>`;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'Admin';
    // Non-admins view assignments
    const endpoint = `${API_URL}/task-assignments`;
    fetch(endpoint, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch your tasks');
            return res.json();
        })
        .then(data => {
            const tasks = data.map(item => ({
                id: item.id,
                title: item.task_title,
                description: item.task_description,
                points: item.task_points,
                priority: item.task_priority,
                status: item.status,
                assigned_date: item.assigned_date,
                due_date: item.task_due_date || item.due_date,
            }));
            // Stats bar
            const total = tasks.length;
            const pending = tasks.filter(t => t.status === 'Pending').length;
            const inProgress = tasks.filter(t => t.status === 'In Progress').length;
            const submitted = tasks.filter(t => t.status === 'Submitted').length;
            const approved = tasks.filter(t => t.status === 'Approved').length;
            const rejected = tasks.filter(t => t.status === 'Rejected').length;
            if (statsBar) {
                statsBar.innerHTML = [
                    { label: 'Total', value: total, color: '#1a4b6d', bg: '#EEF4FD' },
                    { label: 'Pending', value: pending, color: '#64748B', bg: '#F8FAFC' },
                    { label: 'In Progress', value: inProgress, color: '#EA580C', bg: '#FFF7ED' },
                    { label: 'Submitted', value: submitted, color: '#0F172A', bg: '#E2E8F0' },
                    { label: 'Approved', value: approved, color: '#16A34A', bg: '#F0FDF4' },
                    { label: 'Rejected', value: rejected, color: '#DC2626', bg: '#FEF2F2' },
                ].map(s => `
                    <div style="background:${s.bg};border-radius:16px;padding:0.8rem 1.4rem;display:flex;flex-direction:column;align-items:center;min-width:110px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                        <span style="font-size:1.5rem;font-weight:800;color:${s.color};">${s.value}</span>
                        <span style="font-size:0.75rem;color:#64748B;font-weight:500;margin-top:2px;">${s.label}</span>
                    </div>`).join('');
            }

            if (tasks.length === 0) {
                tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:3rem;color:#94A3B8;">
                    <div style="font-size:2.5rem;margin-bottom:0.5rem;">📭</div>
                    <div style="font-weight:600;">No tasks assigned to you yet.</div>
                    <div style="font-size:0.88rem;">Check back later or contact admin.</div>
                </td></tr>`;
                return;
            }

            tbody.innerHTML = tasks.map((t, i) => `
                <tr style="transition:background 0.15s;">
                    <td style="font-weight:600;color:#64748B;">${i + 1}</td>
                    <td>
                        <div style="font-weight:600;color:#0b2b4a;">${t.title || 'N/A'}</div>
                        ${t.description ? `<div style="font-size:0.8rem;color:#94A3B8;margin-top:2px;max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${t.description}</div>` : ''}
                    </td>
                    <td>
                        <span style="font-weight:700;color:#1a4b6d;font-size:1rem;">${t.points ?? 0}</span>
                        <span style="font-size:0.75rem;color:#94A3B8;margin-left:2px;">pts</span>
                    </td>
                    <td>${taskPriorityBadge(t.priority)}</td>
                    <td>${taskStatusBadge(t.status)}</td>
                    <td style="color:#475569;font-size:0.88rem;">${formatTaskDate(t.assigned_date)}</td>
                    <td style="color:#475569;font-size:0.88rem;">${formatTaskDate(t.due_date)}</td>
                    <td>
                        <div style="display:flex;gap:6px;flex-wrap:wrap;">
                            ${(() => {
                                const tid   = t.id;
                                const ttl   = (t.title || '').replace(/'/g, "\\'");
                                if (t.status === 'Pending') {
                                    return `<button onclick="startTask(${tid})" style="background:#EEF4FD;color:#1a4b6d;border:none;padding:5px 12px;border-radius:30px;font-size:0.78rem;cursor:pointer;font-weight:600;">▶️ Start</button>`;
                                } else if (t.status === 'In Progress') {
                                    return `<button onclick="openSubmitProofModal(${tid},'${ttl}')" style="background:#FFF7ED;color:#EA580C;border:none;padding:5px 12px;border-radius:30px;font-size:0.78rem;cursor:pointer;font-weight:600;">📤 Submit Proof</button>`;
                                } else if (t.status === 'Submitted') {
                                    return `<button disabled style="background:#F1F5F9;color:#64748B;border:none;padding:5px 12px;border-radius:30px;font-size:0.78rem;cursor:not-allowed;opacity:0.75;">⏳ Awaiting Review</button>`;
                                } else if (t.status === 'Approved') {
                                    return `<button disabled style="background:#F0FDF4;color:#16A34A;border:none;padding:5px 12px;border-radius:30px;font-size:0.78rem;cursor:not-allowed;">✅ Approved</button>`;
                                } else if (t.status === 'Rejected') {
                                    return `<button onclick="openSubmitProofModal(${tid},'${ttl}')" style="background:#FEF2F2;color:#DC2626;border:none;padding:5px 12px;border-radius:30px;font-size:0.78rem;cursor:pointer;font-weight:600;">🔄 Resubmit</button>`;
                                } else {
                                    return '';
                                }
                            })()}
                        </div>
                    </td>
                </tr>
            `).join('');
        })
        .catch(err => {
            console.error('Error loading my tasks:', err);
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:#DC2626;">❌ Failed to load tasks.</td></tr>`;
        });
}
// Expose globally
window.loadMyTasks = loadMyTasks;

// ==============================
// DOM READY
// ==============================
document.addEventListener("DOMContentLoaded", () => {
    // Show loading immediately
    showLoading('Initializing...');
    
    // Check authentication
    checkAuth();

    // Apply saved theme
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);

    const themeSelect = document.getElementById("settingTheme");
    if (themeSelect) {
        themeSelect.addEventListener("change", (e) => {
            applyTheme(e.target.value);
        });
    }

    // Sidebar My Tasks visibility
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'Admin';
    const myTasksItem = document.getElementById('sidebarMyTasksItem');
    if (myTasksItem) {
        myTasksItem.style.display = isAdmin ? 'none' : 'block';
    }
    // Load appropriate data
    if (isAdmin) {
        loadTasks();
    } else {
        loadMyTasks();
    }

    // Close modal on overlay click
    const modal = document.getElementById('detailsModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }

    // Safety timeout - hide loading after 10 seconds max
    setTimeout(() => {
        if (isLoading) {
            console.warn('Loading timeout - forcing hide');
            hideLoading();
        }
    }, 10000);
});

// ==============================
// WINDOW LOAD (Final safety)
// ==============================
window.addEventListener('load', () => {
    // Hide loading if still visible after page fully loads
    setTimeout(() => {
        if (isLoading) {
            hideLoading();
        }
    }, 1000);
});

// Export functions for inline onclick handlers
window.switchTab = switchTab;
window.logout = logout;
window.openDownlineModal = openDownlineModal;
window.openProfileModal = openProfileModal;
window.closeModal = closeModal;
window.deleteItem = deleteItem;
window.updateEnquiryStatus = updateEnquiryStatus;
window.loadUsers = loadUsers;
window.loadNews = loadNews;
window.loadEvents = loadEvents;
window.loadGallery = loadGallery;
window.loadBlogs = loadBlogs;
window.loadEnquiries = loadEnquiries;
window.loadMyProfile = loadMyProfile;

// ==============================
// TASK MANAGEMENT MODULE
// ==============================

let currentTaskDeleteId = null;

const PRIORITY_META = {
    Low:    { emoji: '🟢', color: '#16A34A', bg: '#F0FDF4' },
    Medium: { emoji: '🟡', color: '#B45309', bg: '#FFFBEB' },
    High:   { emoji: '🟠', color: '#EA580C', bg: '#FFF7ED' },
    Urgent: { emoji: '🔴', color: '#DC2626', bg: '#FEF2F2' }
};

const STATUS_META = {
    // Task master statuses
    Active:      { label: '✅ Active',      color: '#16A34A', bg: '#F0FDF4' },
    Inactive:    { label: '⏸️ Inactive',    color: '#94A3B8', bg: '#F8FAFC' },
    // Assignment statuses
    Pending:     { label: '🕐 Pending',     color: '#64748B', bg: '#F8FAFC' },
    Assigned:    { label: '📌 Assigned',    color: '#2563EB', bg: '#EFF6FF' },
    'In Progress':{ label: '⚡ In Progress', color: '#EA580C', bg: '#FFF7ED' },
    Submitted:   { label: '📤 Submitted',   color: '#7C3AED', bg: '#F5F3FF' },
    Approved:    { label: '✅ Approved',    color: '#16A34A', bg: '#F0FDF4' },
    Rejected:    { label: '❌ Rejected',    color: '#DC2626', bg: '#FEF2F2' },
    Completed:   { label: '🏆 Completed',   color: '#0F172A', bg: '#E2E8F0' },
};

function taskPriorityBadge(priority) {
    const m = PRIORITY_META[priority] || { emoji: '⚪', color: '#64748B', bg: '#F1F5F9' };
    return `<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:30px;font-size:0.75rem;font-weight:700;color:${m.color};background:${m.bg};">${m.emoji} ${priority || 'N/A'}</span>`;
}

function taskStatusBadge(status) {
    const m = STATUS_META[status] || { label: status, color: '#64748B', bg: '#F1F5F9' };
    return `<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:30px;font-size:0.75rem;font-weight:700;color:${m.color};background:${m.bg};">${m.label}</span>`;
}

function formatTaskDate(dateStr) {
    if (!dateStr) return '-';
    try {
        return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return dateStr; }
}

function loadTasks() {
    const tbody = document.querySelector('#tasksTable tbody');
    const statsBar = document.getElementById('taskStatsBar');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:#94A3B8;">⏳ Loading tasks...</td></tr>`;

    // Determine user role and appropriate API endpoint
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'Admin';
    const endpoint = isAdmin ? `${API_URL}/tasks` : `${API_URL}/task-assignments`;

    try {
        fetch(endpoint, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch tasks');
                return res.json();
            })
            .then(data => {
                // Normalize data structure for both tasks and assignments
                const tasks = data.map(item => ({
                    id: item.id,
                    title: item.title || item.task_title,
                    description: item.description || item.task_description,
                    points: item.points ?? item.task_points,
                    priority: item.priority || item.task_priority,
                    status: item.status || item.task_status,
                    start_date: item.start_date || item.task_start_date,
                    due_date: item.due_date || item.task_due_date,
                    created_by_name: item.created_by_name || item.assigned_by_name
                }));

                // Stats bar calculations (same as before)
                const total = tasks.length;
                const active = tasks.filter(t => t.status === 'Active').length;
                const inactive = tasks.filter(t => t.status === 'Inactive').length;
                const urgent = tasks.filter(t => t.priority === 'Urgent').length;

                if (statsBar) {
                    statsBar.innerHTML = [
                        { label: 'Total Tasks', value: total, color: '#1a4b6d', bg: '#EEF4FD' },
                        { label: 'Active', value: active, color: '#16A34A', bg: '#F0FDF4' },
                        { label: 'Inactive', value: inactive, color: '#94A3B8', bg: '#F8FAFC' },
                        { label: 'Urgent', value: urgent, color: '#DC2626', bg: '#FEF2F2' }
                    ].map(s => `
                        <div style="background:${s.bg};border-radius:16px;padding:0.8rem 1.4rem;display:flex;flex-direction:column;align-items:center;min-width:110px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                            <span style="font-size:1.5rem;font-weight:800;color:${s.color};">${s.value}</span>
                            <span style="font-size:0.75rem;color:#64748B;font-weight:500;margin-top:2px;">${s.label}</span>
                        </div>`).join('');
                }

                if (tasks.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:3rem;color:#94A3B8;">
                        <div style="font-size:2.5rem;margin-bottom:0.5rem;">📭</div>
                        <div style="font-weight:600;margin-bottom:0.3rem;">No tasks yet</div>
                        <div style="font-size:0.88rem;">Click "+ Add Task" to create the first task.</div>
                    </td></tr>`;
                    return;
                }

                tbody.innerHTML = tasks.map((t, i) => `
                    <tr style="transition:background 0.15s;">
                        <td style="font-weight:600;color:#64748B;">${i + 1}</td>
                        <td>
                            <div style="font-weight:600;color:#0b2b4a;">${t.title || 'N/A'}</div>
                            ${t.description ? `<div style="font-size:0.8rem;color:#94A3B8;margin-top:2px;max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${t.description}</div>` : ''}
                        </td>
                        <td>
                            <span style="font-weight:700;color:#1a4b6d;font-size:1rem;">${t.points ?? 0}</span>
                            <span style="font-size:0.75rem;color:#94A3B8;margin-left:2px;">pts</span>
                        </td>
                        <td>${taskPriorityBadge(t.priority)}</td>
                        <td>${taskStatusBadge(t.status)}</td>
                        <td style="color:#475569;font-size:0.88rem;">${formatTaskDate(t.start_date)}</td>
                        <td style="color:#475569;font-size:0.88rem;">${formatTaskDate(t.due_date)}</td>
                        <td>
                            <div style="display:flex;gap:6px;flex-wrap:wrap;">
                                <button onclick="openTaskDetails(${t.id})"
                                    style="background:#EEF4FD;color:#1a4b6d;border:none;padding:5px 12px;border-radius:30px;font-size:0.78rem;cursor:pointer;font-weight:600;">
                                    👁️ View
                                </button>
                                ${isAdmin ? `
                                <button onclick="openAssignTaskModal(${t.id}, '${(t.title || '').replace(/'/g, "\\'")}')"
                                    style="background:#F0FDF4;color:#16A34A;border:none;padding:5px 12px;border-radius:30px;font-size:0.78rem;cursor:pointer;font-weight:600;">
                                    📌 Assign
                                </button>
                                <button onclick="openEditTaskModal(${t.id})"
                                    style="background:#FFF7ED;color:#EA580C;border:none;padding:5px 12px;border-radius:30px;font-size:0.78rem;cursor:pointer;font-weight:600;">
                                    ✏️ Edit
                                </button>
                                <button onclick="openDeleteTaskModal(${t.id}, '${(t.title || '').replace(/'/g, "\\'")}')"
                                    style="background:#FEF2F2;color:#DC2626;border:none;padding:5px 12px;border-radius:30px;font-size:0.78rem;cursor:pointer;font-weight:600;">
                                    🗑️ Delete
                                </button>` : `
                                ${t.status === 'Pending' ? `
                                <button onclick="startTask(${t.id})"
                                    style="background:#EEF4FD;color:#1a4b6d;border:none;padding:5px 12px;border-radius:30px;font-size:0.78rem;cursor:pointer;font-weight:600;">
                                    ▶️ Start
                                </button>` : ''}
                                ${t.status === 'In Progress' ? `
                                <button onclick="openSubmitProofModal(${t.id})"
                                    style="background:#FFF7ED;color:#EA580C;border:none;padding:5px 12px;border-radius:30px;font-size:0.78rem;cursor:pointer;font-weight:600;">
                                    📤 Submit Proof
                                </button>` : ''}
                                ${t.status === 'Approved' ? `
                                <button onclick="completeTask(${t.id})"
                                    style="background:#F0FDF4;color:#16A34A;border:none;padding:5px 12px;border-radius:30px;font-size:0.78rem;cursor:pointer;font-weight:600;">
                                    ✅ Complete
                                </button>` : ''}
                                `}
                            </div>
                        </td>
                    </tr>
                `).join('');
            })
            .catch(err => {
                console.error('Error loading tasks:', err);
                tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:#DC2626;">❌ Failed to load tasks. Please try again.</td></tr>`;
            });
    } catch (err) {
        console.error('Error initiating task load:', err);
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:#DC2626;">❌ Unexpected error.</td></tr>`;
    }
}



function openAddTaskModal() {
    document.getElementById('taskModalId').value = '';
    document.getElementById('taskModalTitle').textContent = '➕ Create New Task';
    document.getElementById('taskModalTitleInput').value = '';
    document.getElementById('taskModalDesc').value = '';
    document.getElementById('taskModalPoints').value = '';
    document.getElementById('taskModalPriority').value = 'Medium';
    document.getElementById('taskModalStartDate').value = '';
    document.getElementById('taskModalDueDate').value = '';
    document.getElementById('taskModalStatus').value = 'Active';
    const errDiv = document.getElementById('taskModalError');
    errDiv.style.display = 'none';
    errDiv.textContent = '';
    document.getElementById('taskModalSaveBtn').textContent = '💾 Create Task';
    document.getElementById('taskModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

async function openEditTaskModal(taskId) {
    try {
        showLoading('Loading task...');
        const res = await fetch(`${API_URL}/tasks/${taskId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!res.ok) throw new Error('Task not found');
        const task = await res.json();
        hideLoading();

        document.getElementById('taskModalId').value = task.id;
        document.getElementById('taskModalTitle').textContent = '✏️ Edit Task';
        document.getElementById('taskModalTitleInput').value = task.title || '';
        document.getElementById('taskModalDesc').value = task.description || '';
        document.getElementById('taskModalPoints').value = task.points ?? '';
        document.getElementById('taskModalPriority').value = task.priority || 'Medium';
        document.getElementById('taskModalStartDate').value = task.start_date ? task.start_date.substring(0, 10) : '';
        document.getElementById('taskModalDueDate').value = task.due_date ? task.due_date.substring(0, 10) : '';
        document.getElementById('taskModalStatus').value = task.status || 'Active';
        const errDiv = document.getElementById('taskModalError');
        errDiv.style.display = 'none';
        errDiv.textContent = '';
        document.getElementById('taskModalSaveBtn').textContent = '💾 Update Task';
        document.getElementById('taskModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    } catch (err) {
        hideLoading();
        alert('❌ Failed to load task for editing.');
    }
}

function closeTaskModal() {
    document.getElementById('taskModal').style.display = 'none';
    document.body.style.overflow = '';
}

async function saveTask() {
    const taskId    = document.getElementById('taskModalId').value;
    const title     = document.getElementById('taskModalTitleInput').value.trim();
    const desc      = document.getElementById('taskModalDesc').value.trim();
    const points    = document.getElementById('taskModalPoints').value;
    const priority  = document.getElementById('taskModalPriority').value;
    const startDate = document.getElementById('taskModalStartDate').value;
    const dueDate   = document.getElementById('taskModalDueDate').value;
    const status    = document.getElementById('taskModalStatus').value;

    const errDiv = document.getElementById('taskModalError');

    // Client-side validation
    if (!title) { showTaskError('Title is required.'); return; }
    if (points === '' || points === null) { showTaskError('Points are required.'); return; }
    if (!startDate) { showTaskError('Start date is required.'); return; }
    if (!dueDate) { showTaskError('Due date is required.'); return; }
    if (new Date(dueDate) < new Date(startDate)) { showTaskError('Due date cannot be before start date.'); return; }

    const body = { title, description: desc, points: parseInt(points), priority, start_date: startDate, due_date: dueDate, status };
    const isEdit = !!taskId;
    const url    = isEdit ? `${API_URL}/tasks/${taskId}` : `${API_URL}/tasks`;
    const method = isEdit ? 'PUT' : 'POST';

    errDiv.style.display = 'none';
    const saveBtn = document.getElementById('taskModalSaveBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = '⏳ Saving...';

    try {
        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (!res.ok) {
            showTaskError(data.error || 'Failed to save task.');
            saveBtn.disabled = false;
            saveBtn.textContent = isEdit ? '💾 Update Task' : '💾 Create Task';
            return;
        }

        closeTaskModal();
        loadTasks();
    } catch (err) {
        showTaskError('Network error. Please try again.');
        saveBtn.disabled = false;
        saveBtn.textContent = isEdit ? '💾 Update Task' : '💾 Create Task';
    }
}

function showTaskError(msg) {
    const errDiv = document.getElementById('taskModalError');
    errDiv.textContent = '❌ ' + msg;
    errDiv.style.display = 'block';
}

async function openTaskDetails(taskId) {
    try {
        showLoading('Loading task details...');
        const res = await fetch(`${API_URL}/tasks/${taskId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!res.ok) throw new Error('Task not found');
        const t = await res.json();
        hideLoading();

        const body = document.getElementById('taskDetailsBody');
        const detailRow = (label, value) => `
            <div style="display:flex;gap:1rem;padding:0.7rem 0;border-bottom:1px solid #f1f5f9;align-items:flex-start;">
                <span style="font-weight:600;color:#64748B;font-size:0.85rem;min-width:120px;">${label}</span>
                <span style="color:#0b2b4a;font-size:0.92rem;">${value || '-'}</span>
            </div>
        `;

        body.innerHTML = `
            ${detailRow('Title', `<strong>${t.title}</strong>`)}
            ${detailRow('Description', t.description || '<em style="color:#94A3B8;">No description</em>')}
            ${detailRow('Points', `<strong style="color:#1a4b6d;font-size:1.1rem;">${t.points ?? 0} pts</strong>`)}
            ${detailRow('Priority', taskPriorityBadge(t.priority))}
            ${detailRow('Status', taskStatusBadge(t.status))}
            ${detailRow('Start Date', formatTaskDate(t.start_date))}
            ${detailRow('Due Date', formatTaskDate(t.due_date))}
            ${detailRow('Created By', t.created_by_name || 'Admin')}
            ${detailRow('Created At', t.created_at ? new Date(t.created_at).toLocaleString('en-IN') : '-')}
            ${detailRow('Updated At', t.updated_at ? new Date(t.updated_at).toLocaleString('en-IN') : '-')}
        `;

        // Wire up Edit button
        document.getElementById('taskDetailsEditBtn').onclick = () => {
            closeTaskDetailsModal();
            openEditTaskModal(t.id);
        };

        document.getElementById('taskDetailsModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    } catch (err) {
        hideLoading();
        alert('❌ Failed to load task details.');
    }
}

function closeTaskDetailsModal() {
    document.getElementById('taskDetailsModal').style.display = 'none';
    document.body.style.overflow = '';
}

function openDeleteTaskModal(taskId, taskTitle) {
    currentTaskDeleteId = taskId;
    document.getElementById('taskDeleteName').textContent = `"${taskTitle}"`;
    document.getElementById('taskDeleteModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeTaskDeleteModal() {
    document.getElementById('taskDeleteModal').style.display = 'none';
    document.body.style.overflow = '';
    currentTaskDeleteId = null;
}

async function confirmDeleteTask() {
    if (!currentTaskDeleteId) return;

    const deleteBtn = document.getElementById('taskDeleteConfirmBtn');
    deleteBtn.disabled = true;
    deleteBtn.textContent = '⏳ Deleting...';

    try {
        const res = await fetch(`${API_URL}/tasks/${currentTaskDeleteId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!res.ok) {
            const data = await res.json();
            alert('❌ ' + (data.error || 'Failed to delete task.'));
            deleteBtn.disabled = false;
            deleteBtn.textContent = '🗑️ Delete';
            return;
        }

        closeTaskDeleteModal();
        loadTasks();
    } catch (err) {
        alert('❌ Network error. Please try again.');
        deleteBtn.disabled = false;
        deleteBtn.textContent = '🗑️ Delete';
    }
}

// Close modals when clicking backdrop
document.getElementById('taskModal')?.addEventListener('click', function(e) {
    if (e.target === this) closeTaskModal();
});
document.getElementById('taskDetailsModal')?.addEventListener('click', function(e) {
    if (e.target === this) closeTaskDetailsModal();
});
document.getElementById('taskDeleteModal')?.addEventListener('click', function(e) {
    if (e.target === this) closeTaskDeleteModal();
});

// Expose task functions globally
window.loadTasks = loadTasks;
window.openAddTaskModal = openAddTaskModal;
window.openEditTaskModal = openEditTaskModal;
window.closeTaskModal = closeTaskModal;
window.saveTask = saveTask;
window.openTaskDetails = openTaskDetails;
window.closeTaskDetailsModal = closeTaskDetailsModal;
window.openDeleteTaskModal = openDeleteTaskModal;
window.closeTaskDeleteModal = closeTaskDeleteModal;
window.confirmDeleteTask = confirmDeleteTask;

// ==============================
// TASK ASSIGNMENT & COMPLETION
// ==============================
function openAssignTaskModal(taskId, taskTitle) {
    document.getElementById('assignTaskId').value = taskId;
    document.getElementById('assignTaskName').textContent = `Task: ${taskTitle}`;
    document.getElementById('assignTaskError').style.display = 'none';
    document.getElementById('assignTaskModal').style.display = 'flex';
}

function closeAssignTaskModal() {
    document.getElementById('assignTaskModal').style.display = 'none';
}

async function confirmAssignTask() {
    const taskId = document.getElementById('assignTaskId').value;
    const role = document.getElementById('assignTaskRole').value;
    const btn = document.getElementById('assignTaskConfirmBtn');
    const err = document.getElementById('assignTaskError');
    
    btn.disabled = true;
    btn.textContent = '⏳ Assigning...';
    err.style.display = 'none';

    try {
        const res = await fetch(`${API_URL}/task-assignments`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            },
            body: JSON.stringify({ task_id: taskId, target_role: role })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            err.textContent = '❌ ' + (data.error || 'Failed to assign task');
            err.style.display = 'block';
            btn.disabled = false;
            btn.textContent = 'Assign Task';
            return;
        }

        alert(`✅ ${data.message}`);
        closeAssignTaskModal();
    } catch (error) {
        err.textContent = '❌ Network error';
        err.style.display = 'block';
    }
    
    btn.disabled = false;
    btn.textContent = 'Assign Task';
}

async function startTask(assignmentId) {
    if(!confirm('Are you sure you want to start this task?')) return;
    try {
        const res = await fetch(`${API_URL}/task-assignments/${assignmentId}/start`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if(res.ok) loadTasks();
        else alert('Failed to start task.');
    } catch(e) { alert('Error starting task.'); }
}

// ─── Selected proof file state ───────────────────────────────────────────────
let _proofSelectedFile = null;     // File object chosen by user
let _proofUploadedUrl  = '';       // URL returned after upload

// ─── Open proof modal ─────────────────────────────────────────────────────────
function openSubmitProofModal(assignmentId, taskTitle) {
    // Reset all fields
    document.getElementById('submitProofTaskId').value = assignmentId;
    document.getElementById('submitProofText').value = '';
    document.getElementById('submitProofVideoUrl').value = '';
    document.getElementById('submitProofFile').value = '';
    document.getElementById('submitProofError').style.display = 'none';
    document.getElementById('submitProofSuccess').style.display = 'none';
    _proofSelectedFile = null;
    _proofUploadedUrl  = '';
    _hideProofFilePreview();
    _hideProofProgress();

    // Set task name in header
    const titleEl = document.getElementById('submitProofTaskName');
    if (titleEl) titleEl.textContent = taskTitle ? `Task: ${taskTitle}` : '';

    // Re-enable submit button
    const btn = document.getElementById('submitProofConfirmBtn');
    const btnIcon = document.getElementById('submitProofBtnIcon');
    const btnText = document.getElementById('submitProofBtnText');
    if (btn) { btn.disabled = false; }
    if (btnIcon) btnIcon.textContent = '📤';
    if (btnText) btnText.textContent = 'Submit Proof';

    // Show modal
    const modal = document.getElementById('submitProofModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// ─── Close proof modal ────────────────────────────────────────────────────────
function closeSubmitProofModal() {
    const modal = document.getElementById('submitProofModal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
}

// ─── Drag & drop handler ──────────────────────────────────────────────────────
function handleProofDrop(event) {
    event.preventDefault();
    const dz = document.getElementById('proofDropZone');
    if (dz) { dz.style.borderColor = '#cbd5e1'; dz.style.background = '#f8fafc'; }
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
        _setProofFile(files[0]);
    }
}

// ─── File input change handler ────────────────────────────────────────────────
function handleProofFileSelect(input) {
    if (input.files && input.files.length > 0) {
        _setProofFile(input.files[0]);
    }
}

function _setProofFile(file) {
    const ALLOWED = ['image/jpeg','image/png','image/webp','image/gif','application/pdf'];
    if (!ALLOWED.includes(file.type)) {
        _showProofError('❌ Only images (JPG, PNG, WebP, GIF) and PDF files are allowed.');
        return;
    }
    if (file.size > 20 * 1024 * 1024) {
        _showProofError('❌ File size must be under 20 MB.');
        return;
    }
    _proofSelectedFile = file;
    _proofUploadedUrl  = '';
    _hideProofError();
    _showProofFilePreview(file);
}

function clearProofFile() {
    _proofSelectedFile = null;
    _proofUploadedUrl  = '';
    document.getElementById('submitProofFile').value = '';
    _hideProofFilePreview();
}

function _showProofFilePreview(file) {
    const isPdf   = file.type === 'application/pdf';
    const iconEl  = document.getElementById('proofFileIcon');
    const nameEl  = document.getElementById('proofFileName');
    const sizeEl  = document.getElementById('proofFileSize');
    const preview = document.getElementById('proofFilePreview');
    if (!preview) return;
    if (iconEl)  iconEl.textContent  = isPdf ? '📄' : '🖼️';
    if (nameEl)  nameEl.textContent  = file.name;
    if (sizeEl)  sizeEl.textContent  = _formatBytes(file.size);
    preview.style.display = 'flex';
}

function _hideProofFilePreview() {
    const preview = document.getElementById('proofFilePreview');
    if (preview) preview.style.display = 'none';
}

function _showProofProgress(pct) {
    const wrap = document.getElementById('proofUploadProgress');
    const bar  = document.getElementById('proofUploadBar');
    const pctEl= document.getElementById('proofUploadPct');
    if (wrap) wrap.style.display = 'block';
    if (bar)  bar.style.width    = pct + '%';
    if (pctEl) pctEl.textContent = pct + '%';
}

function _hideProofProgress() {
    const wrap = document.getElementById('proofUploadProgress');
    if (wrap) wrap.style.display = 'none';
}

function _showProofError(msg) {
    const el = document.getElementById('submitProofError');
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
}
function _hideProofError() {
    const el = document.getElementById('submitProofError');
    if (el) el.style.display = 'none';
}

function _showProofSuccessMsg(msg) {
    const el = document.getElementById('submitProofSuccess');
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
}

function _formatBytes(bytes) {
    if (bytes < 1024)       return bytes + ' B';
    if (bytes < 1024*1024)  return (bytes/1024).toFixed(1) + ' KB';
    return (bytes/(1024*1024)).toFixed(1) + ' MB';
}

// ─── Upload proof file via XHR (so we can show progress) ─────────────────────
async function _uploadProofFile(file) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('proof_file', file);

        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                const pct = Math.round((e.loaded / e.total) * 100);
                _showProofProgress(pct);
            }
        };

        xhr.onload = () => {
            _hideProofProgress();
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    resolve(data.url || data.publicUrl || '');
                } catch(e) {
                    reject(new Error('Invalid server response'));
                }
            } else {
                try {
                    const data = JSON.parse(xhr.responseText);
                    reject(new Error(data.error || 'Upload failed'));
                } catch(e) {
                    reject(new Error('Upload failed'));
                }
            }
        };

        xhr.onerror = () => { _hideProofProgress(); reject(new Error('Network error during upload')); };
        xhr.onabort = () => { _hideProofProgress(); reject(new Error('Upload cancelled')); };

        xhr.open('POST', `${API_URL}/upload/proof`);
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
        xhr.send(formData);
    });
}

// ─── Main submit handler ──────────────────────────────────────────────────────
async function confirmSubmitProof() {
    const assignmentId = document.getElementById('submitProofTaskId').value;
    const text         = document.getElementById('submitProofText').value.trim();
    const videoUrl     = document.getElementById('submitProofVideoUrl')?.value.trim() || '';
    const btn          = document.getElementById('submitProofConfirmBtn');
    const btnIcon      = document.getElementById('submitProofBtnIcon');
    const btnText      = document.getElementById('submitProofBtnText');

    _hideProofError();

    // Validation — need either text or file
    if (!text && !_proofSelectedFile && !videoUrl) {
        _showProofError('❌ Please provide a description, upload a file, or add a video URL as proof.');
        return;
    }

    // Set loading state
    if (btn)     { btn.disabled = true; }
    if (btnIcon) { btnIcon.textContent = '⏳'; }
    if (btnText) { btnText.textContent = 'Submitting...'; }

    try {
        // Step 1: Upload file if selected
        let proofFileUrl = _proofUploadedUrl;
        if (_proofSelectedFile && !proofFileUrl) {
            proofFileUrl = await _uploadProofFile(_proofSelectedFile);
            _proofUploadedUrl = proofFileUrl;
        }

        // Step 2: Submit proof to assignment endpoint
        const res = await fetch(`${API_URL}/task-assignments/${assignmentId}/submit`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                proof_text: text || null,
                proof_file: proofFileUrl || null,
                video_url:  videoUrl || null
            })
        });

        const data = await res.json();

        if (!res.ok) {
            _showProofError('❌ ' + (data.error || 'Failed to submit proof.'));
            if (btn)     btn.disabled = false;
            if (btnIcon) btnIcon.textContent = '📤';
            if (btnText) btnText.textContent = 'Submit Proof';
            return;
        }

        // Success
        _showProofSuccessMsg('✅ Proof submitted successfully! Awaiting admin review.');
        if (btnText) btnText.textContent = 'Submitted!';

        setTimeout(() => {
            closeSubmitProofModal();
            // Reload whichever task list is visible
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.role === 'Admin') loadTasks();
            else loadMyTasks();
        }, 1800);

    } catch (error) {
        _showProofError('❌ ' + (error.message || 'An unexpected error occurred.'));
        if (btn)     btn.disabled = false;
        if (btnIcon) btnIcon.textContent = '📤';
        if (btnText) btnText.textContent = 'Submit Proof';
    }
}

async function completeTask(assignmentId) {
    if(!confirm('Mark this task as fully completed?')) return;
    try {
        const res = await fetch(`${API_URL}/task-assignments/${assignmentId}/complete`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.role === 'Admin') loadTasks(); else loadMyTasks();
        } else alert('Failed to complete task.');
    } catch(e) { alert('Error completing task.'); }
}

// Close modals when clicking backdrop
document.getElementById('assignTaskModal')?.addEventListener('click', function(e) {
    if (e.target === this) closeAssignTaskModal();
});
document.getElementById('submitProofModal')?.addEventListener('click', function(e) {
    if (e.target === this) closeSubmitProofModal();
});

// Expose globally
window.openAssignTaskModal     = openAssignTaskModal;
window.closeAssignTaskModal    = closeAssignTaskModal;
window.confirmAssignTask       = confirmAssignTask;
window.startTask               = startTask;
window.openSubmitProofModal    = openSubmitProofModal;
window.closeSubmitProofModal   = closeSubmitProofModal;
window.confirmSubmitProof      = confirmSubmitProof;
window.completeTask            = completeTask;
window.handleProofDrop         = handleProofDrop;
window.handleProofFileSelect   = handleProofFileSelect;
window.clearProofFile          = clearProofFile;

console.log('✅ Dashboard application loaded successfully');

// ==============================
// FORGOT PASSWORD (CMS ADMIN PANEL)
// ==============================
let currentForgotEmail = '';

function showForgotStep(step) {
  const loginCard = document.getElementById('loginCard');
  const forgotCard = document.getElementById('forgotCard');
  if (!loginCard || !forgotCard) return;
  loginCard.style.display = 'none';
  forgotCard.style.display = 'block';
  if (step === 1) {
    document.getElementById('forgotStep1').style.display = 'block';
    document.getElementById('forgotStep2').style.display = 'none';
  } else {
    document.getElementById('forgotStep1').style.display = 'none';
    document.getElementById('forgotStep2').style.display = 'block';
  }
}

function showLoginCard() {
  const loginCard = document.getElementById('loginCard');
  const forgotCard = document.getElementById('forgotCard');
  if (!loginCard || !forgotCard) return;
  forgotCard.style.display = 'none';
  loginCard.style.display = 'block';
}

document.getElementById('forgotForm1')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const emailInput = document.getElementById('forgotEmail');
  const msgEl = document.getElementById('forgotMsg1');
  const btn = document.getElementById('sendOtpBtn');
  if (!emailInput || !emailInput.value) return;

  currentForgotEmail = emailInput.value.trim();
  if (btn) btn.disabled = true;
  if (msgEl) { msgEl.style.display = 'none'; msgEl.textContent = ''; }

  try {
    const res = await fetch(`${API_URL}/auth/forgot-password/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: currentForgotEmail })
    });
    const data = await res.json();
    if (res.ok) {
      document.getElementById('sentEmailBadge').textContent = currentForgotEmail;
      const devBanner = document.getElementById('devOtpBanner');
      if (data.otpLogged && devBanner) {
        devBanner.textContent = `ℹ️ Dev OTP Code: ${data.otpLogged}`;
        devBanner.style.display = 'block';
      } else if (devBanner) {
        devBanner.style.display = 'none';
      }
      showForgotStep(2);
    } else {
      if (msgEl) {
        msgEl.textContent = data.error || 'Failed to send OTP';
        msgEl.style.display = 'block';
      }
    }
  } catch (err) {
    if (msgEl) {
      msgEl.textContent = 'Network error sending OTP';
      msgEl.style.display = 'block';
    }
  } finally {
    if (btn) btn.disabled = false;
  }
});

document.getElementById('forgotForm2')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const otpInput = document.getElementById('forgotOtp');
  const passInput = document.getElementById('newPassword');
  const confirmPassInput = document.getElementById('confirmNewPassword');
  const msgEl = document.getElementById('forgotMsg2');
  const btn = document.getElementById('resetPassBtn');

  if (!otpInput || !passInput || !confirmPassInput) return;

  const otp = otpInput.value.trim();
  const newPassword = passInput.value;
  const confirmPassword = confirmPassInput.value;

  if (newPassword !== confirmPassword) {
    if (msgEl) {
      msgEl.textContent = 'Passwords do not match!';
      msgEl.style.display = 'block';
    }
    return;
  }

  if (newPassword.length < 6) {
    if (msgEl) {
      msgEl.textContent = 'Password must be at least 6 characters long!';
      msgEl.style.display = 'block';
    }
    return;
  }

  if (btn) btn.disabled = true;
  if (msgEl) { msgEl.style.display = 'none'; msgEl.textContent = ''; }

  try {
    const res = await fetch(`${API_URL}/auth/forgot-password/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: currentForgotEmail, otp, newPassword })
    });
    const data = await res.json();
    if (res.ok) {
      alert('Password reset successfully! You can now login with your new password.');
      showLoginCard();
      otpInput.value = '';
      passInput.value = '';
      confirmPassInput.value = '';
    } else {
      if (msgEl) {
        msgEl.textContent = data.error || 'Failed to reset password';
        msgEl.style.display = 'block';
      }
    }
  } catch (err) {
    if (msgEl) {
      msgEl.textContent = 'Network error resetting password';
      msgEl.style.display = 'block';
    }
  } finally {
    if (btn) btn.disabled = false;
  }
});

window.showForgotStep = showForgotStep;
window.showLoginCard = showLoginCard;

// ─── HERO VIDEO BANNER MANAGEMENT ───────────────────────────────────────────
async function loadHeroSettings() {
  try {
    const res = await fetch(`${API_URL}/hero`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.hero) {
        const h = data.hero;
        if (document.getElementById('heroVideoUrl')) document.getElementById('heroVideoUrl').value = h.video_url || '';
        if (document.getElementById('heroTitle')) document.getElementById('heroTitle').value = h.title || '';
        if (document.getElementById('heroTitleHi')) document.getElementById('heroTitleHi').value = h.title_hi || '';
        if (document.getElementById('heroSubtitle')) document.getElementById('heroSubtitle').value = h.subtitle || '';
        if (document.getElementById('heroSubtitleHi')) document.getElementById('heroSubtitleHi').value = h.subtitle_hi || '';
        if (document.getElementById('heroBadgeText')) document.getElementById('heroBadgeText').value = h.badge_text || '';
        if (document.getElementById('heroBadgeTextHi')) document.getElementById('heroBadgeTextHi').value = h.badge_text_hi || '';
        if (document.getElementById('heroBtn1Text')) document.getElementById('heroBtn1Text').value = h.btn1_text || '';
        if (document.getElementById('heroBtn1Link')) document.getElementById('heroBtn1Link').value = h.btn1_link || '';
        if (document.getElementById('heroBtn2Text')) document.getElementById('heroBtn2Text').value = h.btn2_text || '';
        if (document.getElementById('heroBtn2Link')) document.getElementById('heroBtn2Link').value = h.btn2_link || '';
      }
    }
  } catch (e) {
    console.error('Error loading hero settings:', e);
  }
}

async function uploadHeroVideo(input) {
  const file = input.files[0];
  if (!file) return;
  const alertEl = document.getElementById('heroAlert');
  if (alertEl) {
    alertEl.style.display = 'block';
    alertEl.style.background = '#EFF6FF';
    alertEl.style.color = '#2563EB';
    alertEl.textContent = 'Uploading video file, please wait...';
  }

  try {
    const formData = new FormData();
    formData.append('proof_file', file);
    const res = await fetch(`${API_URL}/upload/proof`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (res.ok && data.url) {
      if (document.getElementById('heroVideoUrl')) {
        document.getElementById('heroVideoUrl').value = data.url;
      }
      if (alertEl) {
        alertEl.style.background = '#F0FDF4';
        alertEl.style.color = '#16A34A';
        alertEl.textContent = 'Video uploaded successfully! Click Save & Publish below to finish.';
      }
    } else {
      if (alertEl) {
        alertEl.style.background = '#FFF5F5';
        alertEl.style.color = '#B13E44';
        alertEl.textContent = data.error || 'Video upload failed';
      }
    }
  } catch (err) {
    if (alertEl) {
      alertEl.style.background = '#FFF5F5';
      alertEl.style.color = '#B13E44';
      alertEl.textContent = 'Error uploading video';
    }
  }
}

async function saveHeroSettings(e) {
  if (e) e.preventDefault();
  const alertEl = document.getElementById('heroAlert');
  const payload = {
    video_url: document.getElementById('heroVideoUrl')?.value || '',
    title: document.getElementById('heroTitle')?.value || '',
    title_hi: document.getElementById('heroTitleHi')?.value || '',
    subtitle: document.getElementById('heroSubtitle')?.value || '',
    subtitle_hi: document.getElementById('heroSubtitleHi')?.value || '',
    badge_text: document.getElementById('heroBadgeText')?.value || '',
    badge_text_hi: document.getElementById('heroBadgeTextHi')?.value || '',
    btn1_text: document.getElementById('heroBtn1Text')?.value || '',
    btn1_link: document.getElementById('heroBtn1Link')?.value || '',
    btn2_text: document.getElementById('heroBtn2Text')?.value || '',
    btn2_link: document.getElementById('heroBtn2Link')?.value || ''
  };

  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/hero`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      if (alertEl) {
        alertEl.style.display = 'block';
        alertEl.style.background = '#F0FDF4';
        alertEl.style.color = '#16A34A';
        alertEl.textContent = 'Hero Video Banner settings saved & published successfully!';
      }
    } else {
      if (alertEl) {
        alertEl.style.display = 'block';
        alertEl.style.background = '#FFF5F5';
        alertEl.style.color = '#B13E44';
        alertEl.textContent = data.error || 'Failed to save settings';
      }
    }
  } catch (err) {
    if (alertEl) {
      alertEl.style.display = 'block';
      alertEl.style.background = '#FFF5F5';
      alertEl.style.color = '#B13E44';
      alertEl.textContent = 'Network error saving settings';
    }
  }
}

window.loadHeroSettings = loadHeroSettings;
window.uploadHeroVideo = uploadHeroVideo;
window.saveHeroSettings = saveHeroSettings;
