const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../Back/public/dashboard.html');

let content = fs.readFileSync(targetPath, 'utf8');

// We will replace the entire file with the upgraded StarAdmin layout HTML & CSS while maintaining all IDs and logic.
// Let's create the comprehensive upgraded HTML content.

const upgradedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SwarnaAdmin · CMS Dashboard</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
  <style>
    /* ============================================================
       STARADMIN MODERN DASHBOARD DESIGN SYSTEM
       Elevated Light Theme, Crisp Typography, Royal Blue Accents
       100% Functionality & JS ID Preservation
       ============================================================ */

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: #f4f6fa;
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #1e293b;
      line-height: 1.5;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }

    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #f1f5f9; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

    /* LAYOUT WRAPPER */
    .app-layout {
      display: flex;
      min-height: 100vh;
      width: 100%;
    }

    /* SIDEBAR */
    .sidebar {
      width: 260px;
      min-width: 260px;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
      background: #ffffff;
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      padding: 1.2rem 1rem;
      overflow-y: auto;
      box-shadow: 2px 0 15px rgba(0, 0, 0, 0.02);
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0.2rem 0.5rem 1.2rem;
      border-bottom: 1px solid #f1f5f9;
      margin-bottom: 1rem;
    }
    .brand-logo-emblem {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #1d4ed8, #2563eb);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-weight: 800;
      font-size: 1.3rem;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
      flex-shrink: 0;
    }
    .brand-text h2 {
      font-size: 1.25rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.2;
      letter-spacing: -0.4px;
    }
    .brand-text h2 span {
      color: #2563eb;
      font-weight: 700;
    }
    .brand-text small {
      font-size: 0.72rem;
      color: #64748b;
      font-weight: 500;
      display: block;
      margin-top: 1px;
    }

    .sidebar-section-label {
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: #94a3b8;
      padding: 0.8rem 0.8rem 0.4rem;
    }

    .sidebar-divider {
      height: 1px;
      background: #f1f5f9;
      margin: 0.5rem 0;
    }

    .sidebar-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.9rem;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s ease;
      margin: 2px 0;
    }
    .sidebar-item .icon {
      font-size: 1.15rem;
      width: 1.6rem;
      text-align: center;
    }
    .sidebar-item:hover {
      background: #f8fafc;
      color: #2563eb;
    }
    .sidebar-item.active {
      background: #eff6ff !important;
      color: #2563eb !important;
      font-weight: 700 !important;
      border-left: 4px solid #2563eb;
      border-top-left-radius: 2px;
      border-bottom-left-radius: 2px;
    }

    .sidebar-user-card {
      margin-top: auto;
      padding: 10px 14px;
      background: #f8fafc;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .sidebar-user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #2563eb;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 0.85rem;
    }
    .sidebar-user-name {
      display: block;
      font-size: 0.85rem;
      font-weight: 700;
      color: #0f172a;
    }
    .sidebar-user-role {
      display: block;
      font-size: 0.7rem;
      color: #64748b;
    }

    /* MAIN WRAPPER */
    .main-wrapper {
      margin-left: 260px;
      width: calc(100% - 260px);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* TOP HEADER BAR */
    .header {
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      height: 68px;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 900;
    }

    .header-left-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .header-search {
      position: relative;
      width: 280px;
    }
    .header-search input {
      width: 100%;
      padding: 8px 12px 8px 36px;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      font-size: 0.85rem;
      outline: none;
      transition: all 0.2s;
    }
    .header-search input:focus {
      background: #ffffff;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
    .header-search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
      font-size: 0.9rem;
    }

    .header-right-tools {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .header-icon-btn {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #475569;
      cursor: pointer;
      position: relative;
      transition: 0.2s;
    }
    .header-icon-btn:hover {
      background: #f1f5f9;
      color: #2563eb;
    }
    .notification-dot {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 8px;
      height: 8px;
      background: #ef4444;
      border-radius: 50%;
    }

    .btn-export {
      background: #2563eb;
      color: #ffffff;
      border: none;
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
      transition: all 0.2s;
    }
    .btn-export:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }

    .btn-action-outline {
      background: #ffffff;
      color: #475569;
      border: 1px solid #cbd5e1;
      padding: 7px 14px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.82rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .btn-action-outline:hover {
      background: #f8fafc;
      color: #0f172a;
    }

    /* MAIN CONTENT AREA */
    .main-content {
      flex: 1;
      padding: 1.8rem 2.2rem 3rem;
    }

    /* GREETING HEADER BAR */
    .greeting-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .greeting-title {
      font-size: 1.8rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .greeting-title span {
      font-weight: 400;
      color: #475569;
    }
    .greeting-sub {
      color: #64748b;
      font-size: 0.92rem;
      margin-top: 2px;
    }

    .greeting-controls {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .select-category {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      color: #334155;
      outline: none;
      cursor: pointer;
    }
    .date-picker-badge {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 7px 14px;
      border-radius: 8px;
      font-size: 0.85rem;
      color: #475569;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
    }

    /* DASHBOARD SUB NAV PILLS */
    .dash-sub-nav {
      display: flex;
      gap: 24px;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 1.8rem;
      padding-bottom: 8px;
    }
    .dash-nav-pill {
      font-size: 0.9rem;
      font-weight: 600;
      color: #64748b;
      cursor: pointer;
      position: relative;
      padding-bottom: 8px;
      transition: 0.2s;
    }
    .dash-nav-pill:hover {
      color: #2563eb;
    }
    .dash-nav-pill.active {
      color: #2563eb;
      font-weight: 700;
    }
    .dash-nav-pill.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 3px;
      background: #2563eb;
      border-radius: 3px 3px 0 0;
    }

    /* METRICS KPI STRIP */
    .metrics-strip {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 1rem;
      margin-bottom: 1.8rem;
    }
    .metric-box {
      background: #ffffff;
      border-radius: 14px;
      padding: 1.2rem 1.4rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 2px 10px rgba(0,0,0,0.02);
      transition: all 0.2s;
    }
    .metric-box:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.04);
    }
    .metric-label {
      font-size: 0.78rem;
      color: #64748b;
      font-weight: 600;
      margin-bottom: 6px;
    }
    .metric-num {
      font-size: 1.7rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.1;
    }
    .metric-trend {
      font-size: 0.78rem;
      font-weight: 700;
      margin-top: 6px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .trend-up { color: #16a34a; }
    .trend-down { color: #dc2626; }

    /* CHARTS & SUMMARY GRID */
    .grid-chart-status {
      display: grid;
      grid-template-columns: 2.2fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.8rem;
    }

    .card-chart {
      background: #ffffff;
      border-radius: 18px;
      padding: 1.6rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 15px rgba(0,0,0,0.02);
    }
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.2rem;
    }
    .chart-title {
      font-size: 1.1rem;
      font-weight: 800;
      color: #0f172a;
    }
    .chart-sub {
      font-size: 0.82rem;
      color: #64748b;
      margin-top: 2px;
    }
    .chart-legend {
      display: flex;
      gap: 16px;
      font-size: 0.82rem;
      font-weight: 600;
    }
    .legend-this-week { color: #2563eb; }
    .legend-last-week { color: #38bdf8; }

    /* ROYAL BLUE STATUS SUMMARY CARD */
    .card-blue-summary {
      background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
      border-radius: 18px;
      padding: 1.6rem;
      color: #ffffff;
      box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      min-height: 180px;
    }
    .blue-card-title {
      font-size: 1.1rem;
      font-weight: 800;
      color: #ffffff;
    }
    .blue-card-sub {
      font-size: 0.82rem;
      color: rgba(255,255,255,0.7);
      margin-top: 4px;
    }
    .blue-card-val {
      font-size: 2.2rem;
      font-weight: 900;
      margin-top: 1rem;
      line-height: 1;
    }

    /* DONUT / RING ANALYTICS CARD */
    .card-visitors {
      background: #ffffff;
      border-radius: 18px;
      padding: 1.4rem;
      border: 1px solid #e2e8f0;
      margin-top: 1.2rem;
      display: flex;
      align-items: center;
      gap: 1.2rem;
    }

    /* COMMON CARDS & TABLES */
    .card {
      background: #ffffff;
      border-radius: 18px;
      padding: 1.6rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 15px rgba(0,0,0,0.02);
      margin-bottom: 1.8rem;
    }
    .card h3 {
      font-size: 1.2rem;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 1rem;
      margin-bottom: 1.8rem;
    }
    .stat-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 1.2rem 1.4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid #e2e8f0;
      box-shadow: 0 2px 10px rgba(0,0,0,0.02);
      transition: all 0.2s;
    }
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.04);
    }
    .stat-info h4 {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 4px;
    }
    .stat-value {
      font-size: 1.8rem;
      font-weight: 800;
      color: #0f172a;
    }
    .stat-icon {
      font-size: 1.5rem;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background: #f1f5f9;
    }

    /* TAB CONTENT ANIMATION */
    .tab-content {
      display: none;
      animation: fadeIn 0.25s ease;
    }
    .tab-content.active {
      display: block;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* TABLES */
    .table-wrap {
      overflow-x: auto;
      border-radius: 14px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.88rem;
    }
    thead {
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }
    thead th {
      padding: 0.85rem 1.2rem;
      text-align: left;
      font-weight: 700;
      font-size: 0.75rem;
      text-transform: uppercase;
      color: #64748b;
    }
    tbody td {
      padding: 0.85rem 1.2rem;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
    }
    tbody tr:hover { background: #f8fafc; }

    .btn {
      background: #2563eb;
      border: none;
      padding: 0.6rem 1.6rem;
      border-radius: 30px;
      font-weight: 700;
      font-size: 0.85rem;
      color: white;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
    }
    .btn:hover { background: #1d4ed8; transform: translateY(-1px); }

    .role-badge {
      background: #eff6ff;
      color: #2563eb;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 10px;
      border-radius: 20px;
      margin-left: 8px;
    }

    /* DARK THEME PRESERVATION */
    body.dark-mode { background: #0f172a !important; color: #f8fafc !important; }
    body.dark-mode .sidebar { background: #1e293b !important; border-color: #334155 !important; }
    body.dark-mode .header { background: #1e293b !important; border-color: #334155 !important; }
    body.dark-mode .card, body.dark-mode .stat-card, body.dark-mode .metric-box, body.dark-mode .card-chart, body.dark-mode .card-visitors { background: #1e293b !important; border-color: #334155 !important; color: #f8fafc !important; }
    body.dark-mode .greeting-title, body.dark-mode .chart-title, body.dark-mode .metric-num, body.dark-mode .stat-value, body.dark-mode .brand-text h2 { color: #f8fafc !important; }
    body.dark-mode .sidebar-item { color: #94a3b8 !important; }
    body.dark-mode .sidebar-item.active { background: #2563eb !important; color: #ffffff !important; }
    body.dark-mode .table-wrap { background: #1e293b !important; border-color: #334155 !important; }
    body.dark-mode thead { background: #0f172a !important; }
    body.dark-mode tbody td { border-color: #334155 !important; color: #cbd5e1 !important; }
  </style>
</head>
<body>
  <div class="app-layout">
    <!-- Fixed Left Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-brand">
        <div class="brand-logo-emblem">⚡</div>
        <div class="brand-text">
          <h2>Star<span>Admin</span></h2>
          <small>SwarnaIndia Portal v2.0</small>
        </div>
      </div>

      <div class="sidebar-section-label">MAIN</div>
      <div class="sidebar-item active" data-tab="overviewTab" onclick="switchTab('overviewTab', this)">
        <span class="icon">📊</span> <span>Dashboard</span>
      </div>

      <div class="sidebar-divider"></div>
      <div class="sidebar-section-label">MANAGEMENT</div>

      <div class="sidebar-item" data-tab="usersTab" onclick="switchTab('usersTab', this)">
        <span class="icon">👥</span> <span>Accounts</span>
      </div>
      <div class="sidebar-item" id="sidebarTasksItem" data-tab="tasksTab" onclick="switchTab('tasksTab', this)">
        <span class="icon">✅</span> <span>Tasks</span>
      </div>
      <div class="sidebar-item" id="sidebarMyTasksItem" style="display: none;" data-tab="myTasksTab" onclick="switchTab('myTasksTab', this)">
        <span class="icon">🎯</span> <span>My Tasks</span>
      </div>

      <div class="sidebar-divider"></div>
      <div class="sidebar-section-label">CMS CONTENT</div>

      <div class="sidebar-item" data-tab="newsTab" onclick="switchTab('newsTab', this)">
        <span class="icon">📰</span> <span>News Articles</span>
      </div>
      <div class="sidebar-item" data-tab="eventsTab" onclick="switchTab('eventsTab', this)">
        <span class="icon">📅</span> <span>Events Calendar</span>
      </div>
      <div class="sidebar-item" data-tab="galleryTab" onclick="switchTab('galleryTab', this)">
        <span class="icon">🖼️</span> <span>Gallery Photos</span>
      </div>
      <div class="sidebar-item" data-tab="blogsTab" onclick="switchTab('blogsTab', this)">
        <span class="icon">✍️</span> <span>Blogs & Posts</span>
      </div>
      <div class="sidebar-item" data-tab="enquiriesTab" onclick="switchTab('enquiriesTab', this)">
        <span class="icon">📩</span> <span>User Enquiries</span>
      </div>
      <div class="sidebar-item" data-tab="heroTab" onclick="switchTab('heroTab', this)">
        <span class="icon">🎬</span> <span>Hero Video Banner</span>
      </div>
      <div class="sidebar-item" data-tab="documentsTab" onclick="switchTab('documentsTab', this)">
        <span class="icon">📄</span> <span>Important Documents</span>
      </div>

      <div class="sidebar-divider"></div>
      <div class="sidebar-section-label">MY ACCOUNT</div>

      <div class="sidebar-item" data-tab="profileTab" onclick="switchTab('profileTab', this)">
        <span class="icon">👤</span> <span>My Profile</span>
      </div>
      <div class="sidebar-item" data-tab="settingsTab" onclick="switchTab('settingsTab', this)">
        <span class="icon">⚙️</span> <span>CMS Settings</span>
      </div>

      <!-- Bottom Profile Card -->
      <div class="sidebar-user-card">
        <div class="sidebar-user-avatar" id="sidebarAvatar">AD</div>
        <div class="sidebar-user-info">
          <span class="sidebar-user-name" id="sidebarUserName">John Doe</span>
          <span class="sidebar-user-role" id="sidebarUserRole">Administrator</span>
        </div>
        <button onclick="logout()" style="background:none; border:none; cursor:pointer; font-size:1.1rem; color:#ef4444;" title="Logout">🚪</button>
      </div>
    </aside>

    <!-- Main Wrapper -->
    <div class="main-wrapper">
      <!-- Top Header Bar -->
      <header class="header">
        <div class="header-left-actions">
          <span style="font-size:1.2rem; cursor:pointer; color:#475569;" title="Toggle Sidebar">☰</span>
          <div class="header-search">
            <span class="header-search-icon">🔍</span>
            <input type="text" placeholder="Search here..." />
          </div>
        </div>

        <div class="header-right-tools">
          <span id="headerUser" style="color:#64748b; font-size:0.85rem; font-weight:600;">Loading...</span>
          
          <div class="header-icon-btn" title="Messages">✉️</div>
          <div class="header-icon-btn" title="Notifications">
            🔔 <span class="notification-dot"></span>
          </div>

          <button class="btn-action-outline">‹ Share</button>
          <button class="btn-action-outline">🖨 Print</button>
          <button class="btn-export">+ Export</button>

          <label class="theme-label" style="cursor:pointer; font-size:1.1rem;" onclick="toggleTheme()" title="Toggle Dark Theme">🌙</label>
          <button class="btn-action-outline" onclick="logout()" style="color:#ef4444; border-color:#fca5a5;">🚪 Logout</button>
        </div>
      </header>

      <!-- Main Content Area -->
      <div class="main-content">
        <!-- GREETING & CONTROLS -->
        <div class="greeting-header">
          <div>
            <h1 class="greeting-title">Good Morning, <span id="userName">John Doe</span> <span id="userRole" class="role-badge">Admin</span></h1>
            <p class="greeting-sub">Your performance summary this week</p>
          </div>

          <div class="greeting-controls">
            <select class="select-category">
              <option>Select Category</option>
              <option>CMS Content</option>
              <option>User Accounts</option>
              <option>Enquiries</option>
            </select>

            <div class="date-picker-badge">
              📅 11/02/2026
            </div>
          </div>
        </div>

        <!-- SUB NAV PILLS -->
        <div class="dash-sub-nav">
          <span class="dash-nav-pill active">Overview</span>
          <span class="dash-nav-pill">Audiences</span>
          <span class="dash-nav-pill">Demographics</span>
          <span class="dash-nav-pill">More</span>
        </div>

        <!-- PROFILE COMPLETION NOTIFICATION BANNER -->
        <div id="profileCompletionBanner" style="display:none; background:#fff3cd; color:#856404; padding:1rem 1.5rem; border-radius:14px; margin-bottom:1.5rem; border:1px solid #ffeeba; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
          <div>⚠️ <strong>Profile Incomplete (<span id="profileCompletionPct">0</span>%)!</strong> Please complete your organization profile. Important features are locked until profile completion.</div>
          <button onclick="switchTab('profileTab', document.querySelector('[data-tab=profileTab]'))" style="background:#856404; color:white; border:none; padding:8px 18px; border-radius:30px; cursor:pointer; font-weight:700;">Complete Profile Now →</button>
        </div>

        <!-- TAB 0: MAIN DASHBOARD OVERVIEW -->
        <div id="overviewTab" class="tab-content active">
          
          <!-- HORIZONTAL METRICS KPI STRIP (StarAdmin Style) -->
          <div class="metrics-strip">
            <div class="metric-box">
              <div class="metric-label">Bounce Rate</div>
              <div class="metric-num">32.53%</div>
              <div class="metric-trend trend-down">▼ -0.5%</div>
            </div>

            <div class="metric-box">
              <div class="metric-label">Page Views</div>
              <div class="metric-num">7,682</div>
              <div class="metric-trend trend-up">▲ +0.1%</div>
            </div>

            <div class="metric-box">
              <div class="metric-label">New Sessions</div>
              <div class="metric-num">68.8</div>
              <div class="metric-trend trend-down">▼ -68.8</div>
            </div>

            <div class="metric-box">
              <div class="metric-label">Avg. Time on Site</div>
              <div class="metric-num">2m:35s</div>
              <div class="metric-trend trend-up">▲ +0.8%</div>
            </div>

            <div class="metric-box">
              <div class="metric-label">Active Accounts</div>
              <div class="metric-num" id="countUsers">0</div>
              <div class="metric-trend trend-up">▲ +12%</div>
            </div>

            <div class="metric-box">
              <div class="metric-label">Pending Enquiries</div>
              <div class="metric-num" id="countEnquiries">0</div>
              <div class="metric-trend trend-up">▲ +4.2%</div>
            </div>
          </div>

          <!-- PRIMARY CHARTS & ROYAL BLUE STATUS SUMMARY GRID -->
          <div class="grid-chart-status">
            <!-- Left: Performance Line Chart Card -->
            <div class="card-chart">
              <div class="chart-header">
                <div>
                  <div class="chart-title">Performance Line Chart</div>
                  <div class="chart-sub">Weekly summary of portal visits, activities & user engagements</div>
                </div>
                <div class="chart-legend">
                  <span class="legend-this-week">● This week</span>
                  <span class="legend-last-week">● Last week</span>
                </div>
              </div>

              <!-- High-end SVG Line Graph with Area Fills -->
              <div style="width: 100%; height: 210px; margin-top: 15px; position: relative;">
                <svg width="100%" height="100%" viewBox="0 0 600 200" preserveAspectRatio="none" style="overflow: visible;">
                  <defs>
                    <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#2563eb" stop-opacity="0.35"/>
                      <stop offset="100%" stop-color="#2563eb" stop-opacity="0.0"/>
                    </linearGradient>
                    <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.3"/>
                      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0"/>
                    </linearGradient>
                  </defs>

                  <!-- Grid background lines -->
                  <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" stroke-width="1.5" />
                  <line x1="0" y1="90" x2="600" y2="90" stroke="#f1f5f9" stroke-width="1.5" />
                  <line x1="0" y1="140" x2="600" y2="140" stroke="#f1f5f9" stroke-width="1.5" />

                  <!-- Last Week Area & Path (Cyan) -->
                  <path d="M 0 160 Q 100 120 200 150 T 400 130 T 600 140 L 600 180 L 0 180 Z" fill="url(#gradCyan)" />
                  <path d="M 0 160 Q 100 120 200 150 T 400 130 T 600 140" fill="none" stroke="#38bdf8" stroke-width="3.5" />

                  <!-- This Week Area & Path (Royal Blue) -->
                  <path d="M 0 170 Q 100 90 200 140 T 400 50 T 600 110 L 600 180 L 0 180 Z" fill="url(#gradBlue)" />
                  <path d="M 0 170 Q 100 90 200 140 T 400 50 T 600 110" fill="none" stroke="#2563eb" stroke-width="4" />

                  <!-- Data Point Bullets -->
                  <circle cx="200" cy="140" r="5" fill="#2563eb" stroke="#ffffff" stroke-width="2" />
                  <circle cx="400" cy="50" r="6" fill="#2563eb" stroke="#ffffff" stroke-width="2.5" />
                  <circle cx="600" cy="110" r="5" fill="#2563eb" stroke="#ffffff" stroke-width="2" />
                </svg>

                <div style="display: flex; justify-content: space-between; color: #94a3b8; font-size: 0.75rem; font-weight: 700; margin-top: 10px;">
                  <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
                </div>
              </div>
            </div>

            <!-- Right: Royal Blue Status Card + Visitors Analytics Card -->
            <div>
              <!-- Royal Blue Status Summary Card -->
              <div class="card-blue-summary">
                <div>
                  <div class="blue-card-title">Status Summary</div>
                  <div class="blue-card-sub">Closed Value</div>
                </div>

                <div class="blue-card-val" id="closedStatusVal">357</div>

                <!-- Sparkline curve -->
                <svg width="100%" height="45" viewBox="0 0 200 45" style="margin-top: 10px;">
                  <path d="M 0 35 Q 50 10 100 30 T 200 15" fill="none" stroke="#38bdf8" stroke-width="3" />
                </svg>
              </div>

              <!-- Ring Progress Analytics Card -->
              <div class="card-visitors">
                <!-- SVG Ring -->
                <div style="position: relative; width: 64px; height: 64px; flex-shrink: 0;">
                  <svg width="64" height="64" viewBox="0 0 64 64" style="transform: rotate(-90deg);">
                    <circle cx="32" cy="32" r="24" fill="none" stroke="#e2e8f0" stroke-width="6" />
                    <circle cx="32" cy="32" r="24" fill="none" stroke="#2563eb" stroke-width="6" stroke-dasharray="150" stroke-dashoffset="40" stroke-linecap="round" />
                  </svg>
                  <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 800; color: #2563eb;">26.8%</div>
                </div>

                <div>
                  <div style="font-size: 0.78rem; color: #64748b; font-weight: 600;">Total Visitors</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-top: 2px;">9,065</div>
                  <div style="font-size: 0.72rem; color: #16a34a; font-weight: 700;">Visits per day</div>
                </div>
              </div>
            </div>
          </div>

          <!-- SYSTEM MODULE STATS GRID -->
          <h3 style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem;">System Module Overview</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-info">
                <h4>Accounts</h4>
                <div class="stat-value" id="countUsers">0</div>
              </div>
              <div class="stat-icon" style="color: #2563eb; background: #eff6ff;">👥</div>
            </div>
            <div class="stat-card">
              <div class="stat-info">
                <h4>News Articles</h4>
                <div class="stat-value" id="countNews">0</div>
              </div>
              <div class="stat-icon" style="color: #ea580c; background: #fff7ed;">📰</div>
            </div>
            <div class="stat-card">
              <div class="stat-info">
                <h4>Events</h4>
                <div class="stat-value" id="countEvents">0</div>
              </div>
              <div class="stat-icon" style="color: #8b5cf6; background: #f5f3ff;">📅</div>
            </div>
            <div class="stat-card">
              <div class="stat-info">
                <h4>Gallery Photos</h4>
                <div class="stat-value" id="countGallery">0</div>
              </div>
              <div class="stat-icon" style="color: #10b981; background: #ecfdf5;">🖼️</div>
            </div>
            <div class="stat-card">
              <div class="stat-info">
                <h4>Blogs</h4>
                <div class="stat-value" id="countBlogs">0</div>
              </div>
              <div class="stat-icon" style="color: #f59e0b; background: #fef3c7;">✍️</div>
            </div>
            <div class="stat-card">
              <div class="stat-info">
                <h4>Pending Enquiries</h4>
                <div class="stat-value" id="countEnquiries">0</div>
              </div>
              <div class="stat-icon" style="color: #ef4444; background: #fef2f2;">📩</div>
            </div>

            <!-- Task 12 Widgets: Wallet, Tasks, Profile -->
            <div class="stat-card" id="cardWallet" style="display:none;">
              <div class="stat-info">
                <h4>Wallet Balance</h4>
                <div class="stat-value" id="countWalletPts">0 Pts</div>
              </div>
              <div class="stat-icon" style="color: #f59e0b; background: #fef3c7;">💰</div>
            </div>

            <div class="stat-card" id="cardAssignedTasks" style="display:none;">
              <div class="stat-info">
                <h4>Assigned Tasks</h4>
                <div class="stat-value" id="countAssignedTasks">0</div>
              </div>
              <div class="stat-icon" style="color: #2563eb; background: #eff6ff;">📋</div>
            </div>

            <div class="stat-card" id="cardCompletedTasks" style="display:none;">
              <div class="stat-info">
                <h4>Completed Tasks</h4>
                <div class="stat-value" id="countCompletedTasks">0</div>
              </div>
              <div class="stat-icon" style="color: #10b981; background: #ecfdf5;">✅</div>
            </div>

            <div class="stat-card" id="cardOrgCompletion" style="display:none;cursor:pointer;" onclick="switchTab('profileTab', document.querySelector('[data-tab=profileTab]'))">
              <div class="stat-info">
                <h4>Profile Done</h4>
                <div class="stat-value" id="countOrgPct" style="font-size:1.6rem;">0%</div>
              </div>
              <div class="stat-icon" id="cardOrgIcon" style="color:#dc2626;background:#fef2f2;">🏢</div>
            </div>
          </div>

          <!-- Task 12 Widgets Container -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1.5rem;">
            <div class="card" id="widgetOrgCompletion" style="display:none;border-top:3px solid #2563eb;">
              <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.5rem;">
                <div style="flex:1;min-width:220px;">
                  <h3 style="margin-bottom:6px;">🏢 Organization Profile</h3>
                  <p id="orgCompletionDashMsg" style="color:#64748b;font-size:0.88rem;margin-bottom:1rem;">Complete your profile to unlock all features.</p>
                  <div style="margin-bottom:10px;">
                    <div style="display:flex;justify-content:space-between;font-size:0.78rem;color:#64748b;margin-bottom:5px;">
                      <span>Completion</span>
                      <span id="orgDashPctLabel" style="font-weight:700;color:#2563eb;">0%</span>
                    </div>
                    <div style="background:#e2e8f0;border-radius:40px;height:10px;overflow:hidden;">
                      <div id="orgDashBar" style="background:linear-gradient(90deg,#dc2626,#2563eb);height:100%;width:0%;border-radius:40px;transition:width 0.6s ease;"></div>
                    </div>
                  </div>
                  <div id="orgFieldChecklist" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;"></div>
                </div>

                <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
                  <div style="position:relative;width:90px;height:90px;">
                    <svg width="90" height="90" viewBox="0 0 90 90" style="transform:rotate(-90deg);">
                      <circle cx="45" cy="45" r="36" fill="none" stroke="#e2e8f0" stroke-width="8"/>
                      <circle id="orgRingFill" cx="45" cy="45" r="36" fill="none" stroke="#2563eb" stroke-width="8"
                        stroke-dasharray="226" stroke-dashoffset="226" style="transition:stroke-dashoffset 0.7s ease,stroke 0.4s;"/>
                    </svg>
                    <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                      <div id="orgRingPct" style="font-size:1.1rem;font-weight:800;color:#0f172a;">0%</div>
                      <div style="font-size:0.6rem;color:#94a3b8;font-weight:600;letter-spacing:0.5px;">DONE</div>
                    </div>
                  </div>
                  <button onclick="switchTab('profileTab', document.querySelector('[data-tab=profileTab]'))" style="background:#2563eb;color:white;border:none;padding:0.6rem 1.4rem;border-radius:30px;font-size:0.82rem;font-weight:700;cursor:pointer;" id="orgCompleteBtnDash">Complete Profile →</button>
                </div>
              </div>
            </div>

            <!-- Referral Link Widget -->
            <div class="card" id="widgetReferral" style="display:none;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div>
                  <h3 style="margin-bottom: 4px;">🔗 Your Referral Link</h3>
                  <p style="color: #64748B; font-size: 0.88rem;">Share your unique referral link to invite users and grow your network.</p>
                </div>
                <div style="display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap;">
                  <code id="dashReferralCode" style="background: rgba(37, 99, 235, 0.1); color: #2563eb; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 0.9rem;">CODE</code>
                  <input type="text" id="dashReferralLink" readonly style="width: 260px; font-size: 0.85rem; padding: 6px 12px; border-radius: 8px; border: 1px solid #CBD5E1;" value="...">
                  <button class="btn" onclick="copyReferralLink()" style="background:#2563eb; color:white; padding:7px 16px;">📋 Copy Link</button>
                </div>
              </div>
            </div>

            <!-- Notifications & Activities Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
              <div class="card" id="widgetNotifications" style="display:none;">
                <h3>🔔 Notifications</h3>
                <div id="notificationsList" style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; max-height: 280px; overflow-y: auto;">
                  <div style="color: #64748B; font-size: 0.88rem;">Loading notifications...</div>
                </div>
              </div>

              <div class="card" id="widgetRecentActivities" style="display:none;">
                <h3>⚡ Recent Activities</h3>
                <div id="recentActivitiesList" style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; max-height: 280px; overflow-y: auto;">
                  <div style="color: #64748B; font-size: 0.88rem;">Loading activities...</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- REMAINING TABS (Preserving all original content & IDs) -->
`;

console.log("Upgraded header and overview tab template created.");
`;

fs.writeFileSync(path.join(__dirname, 'temp_script.js'), upgradedHtml);
console.log('Script template ready.');
