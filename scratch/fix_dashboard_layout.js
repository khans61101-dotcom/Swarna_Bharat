const fs = require('fs');
const path = require('path');

const dashPath = path.join(__dirname, '../Back/public/dashboard.html');
let content = fs.readFileSync(dashPath, 'utf8');

// Replace the overviewTab block with OUR actual system cards in the StarAdmin KPI strip format
const overviewStart = '<div id="overviewTab" class="tab-content active">';
const overviewEnd = '<!-- Task 12 Widgets Container -->';

const overviewStartIdx = content.indexOf(overviewStart);
const overviewEndIdx = content.indexOf(overviewEnd);

if (overviewStartIdx === -1 || overviewEndIdx === -1) {
  console.error("Could not locate overviewTab indices");
  process.exit(1);
}

const newOverviewHtml = `<div id="overviewTab" class="tab-content active">
          
          <!-- STARADMIN KPI STRIP USING OUR ACTUAL SYSTEM COUNTERS -->
          <div class="metrics-strip">
            <div class="metric-box">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <div class="metric-label">ACCOUNTS</div>
                  <div class="metric-num" id="countUsers">0</div>
                </div>
                <div class="stat-icon" style="color: #2563eb; background: #eff6ff; width:38px; height:38px; font-size:1.2rem; border-radius:10px;">👥</div>
              </div>
              <div class="metric-trend trend-up">▲ Active Users</div>
            </div>

            <div class="metric-box">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <div class="metric-label">NEWS ARTICLES</div>
                  <div class="metric-num" id="countNews">0</div>
                </div>
                <div class="stat-icon" style="color: #ea580c; background: #fff7ed; width:38px; height:38px; font-size:1.2rem; border-radius:10px;">📰</div>
              </div>
              <div class="metric-trend trend-up">▲ Published</div>
            </div>

            <div class="metric-box">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <div class="metric-label">EVENTS</div>
                  <div class="metric-num" id="countEvents">0</div>
                </div>
                <div class="stat-icon" style="color: #8b5cf6; background: #f5f3ff; width:38px; height:38px; font-size:1.2rem; border-radius:10px;">📅</div>
              </div>
              <div class="metric-trend trend-up">▲ Scheduled</div>
            </div>

            <div class="metric-box">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <div class="metric-label">GALLERY PHOTOS</div>
                  <div class="metric-num" id="countGallery">0</div>
                </div>
                <div class="stat-icon" style="color: #10b981; background: #ecfdf5; width:38px; height:38px; font-size:1.2rem; border-radius:10px;">🖼️</div>
              </div>
              <div class="metric-trend trend-up">▲ Uploaded</div>
            </div>

            <div class="metric-box">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <div class="metric-label">BLOGS</div>
                  <div class="metric-num" id="countBlogs">0</div>
                </div>
                <div class="stat-icon" style="color: #f59e0b; background: #fef3c7; width:38px; height:38px; font-size:1.2rem; border-radius:10px;">✍️</div>
              </div>
              <div class="metric-trend trend-up">▲ Active Posts</div>
            </div>

            <div class="metric-box">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <div class="metric-label">PENDING ENQUIRIES</div>
                  <div class="metric-num" id="countEnquiries">0</div>
                </div>
                <div class="stat-icon" style="color: #ef4444; background: #fef2f2; width:38px; height:38px; font-size:1.2rem; border-radius:10px;">📩</div>
              </div>
              <div class="metric-trend trend-up">▲ Action Req.</div>
            </div>

            <!-- Task 12 Conditional Widgets: Wallet, Assigned Tasks, Completed Tasks, Org Completion -->
            <div class="metric-box" id="cardWallet" style="display:none;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <div class="metric-label">WALLET BALANCE</div>
                  <div class="metric-num" id="countWalletPts">0 Pts</div>
                </div>
                <div class="stat-icon" style="color: #f59e0b; background: #fef3c7; width:38px; height:38px; font-size:1.2rem; border-radius:10px;">💰</div>
              </div>
              <div class="metric-trend trend-up">▲ Points</div>
            </div>

            <div class="metric-box" id="cardAssignedTasks" style="display:none;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <div class="metric-label">ASSIGNED TASKS</div>
                  <div class="metric-num" id="countAssignedTasks">0</div>
                </div>
                <div class="stat-icon" style="color: #2563eb; background: #eff6ff; width:38px; height:38px; font-size:1.2rem; border-radius:10px;">📋</div>
              </div>
              <div class="metric-trend trend-up">▲ Active</div>
            </div>

            <div class="metric-box" id="cardCompletedTasks" style="display:none;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <div class="metric-label">COMPLETED TASKS</div>
                  <div class="metric-num" id="countCompletedTasks">0</div>
                </div>
                <div class="stat-icon" style="color: #10b981; background: #ecfdf5; width:38px; height:38px; font-size:1.2rem; border-radius:10px;">✅</div>
              </div>
              <div class="metric-trend trend-up">▲ Done</div>
            </div>

            <div class="metric-box" id="cardOrgCompletion" style="display:none;cursor:pointer;" onclick="switchTab('profileTab', document.querySelector('[data-tab=profileTab]'))">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <div class="metric-label">PROFILE DONE</div>
                  <div class="metric-num" id="countOrgPct" style="font-size:1.6rem;">0%</div>
                </div>
                <div class="stat-icon" id="cardOrgIcon" style="color:#dc2626; background:#fef2f2; width:38px; height:38px; font-size:1.2rem; border-radius:10px;">🏢</div>
              </div>
              <div class="metric-trend trend-up">▲ Progress</div>
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
              <div class="card-blue-summary">
                <div>
                  <div class="blue-card-title">Status Summary</div>
                  <div class="blue-card-sub">Pending Enquiries & Actions</div>
                </div>

                <div class="blue-card-val" id="closedStatusVal">0</div>

                <svg width="100%" height="45" viewBox="0 0 200 45" style="margin-top: 10px;">
                  <path d="M 0 35 Q 50 10 100 30 T 200 15" fill="none" stroke="#38bdf8" stroke-width="3" />
                </svg>
              </div>

              <div class="card-visitors">
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

          `;

const updatedContent = content.substring(0, overviewStartIdx) + newOverviewHtml + content.substring(overviewEndIdx);

fs.writeFileSync(dashPath, updatedContent, 'utf8');
console.log("Successfully integrated real system counters into StarAdmin KPI strip!");
