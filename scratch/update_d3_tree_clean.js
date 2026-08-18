const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '../Back/public/js/app.js');
let content = fs.readFileSync(target, 'utf8');

const newD3TreeFn = `function renderD3TreeDiagram(data) {
    const container = document.getElementById('treeContent');
    if (!container) return;
    container.innerHTML = '';

    if (typeof d3 === 'undefined') {
        container.innerHTML = \`<div style="color:#f87171; padding:2rem; text-align:center; font-weight:700;">⚠️ D3.js library is loading... Please refresh page.</div>\`;
        return;
    }

    if (!data) {
        container.innerHTML = \`<div style="color:#94a3b8; padding:2rem; text-align:center;">No tree data available.</div>\`;
        return;
    }

    try {
        const root = d3.hierarchy(data, d => Array.isArray(d.children) && d.children.length > 0 ? d.children : null);
        const nodesList = root.descendants();
        const nodeCount = nodesList.length;
        const maxDepth = root.height || 1;

        const svgWidth = Math.max(1100, (maxDepth + 1) * 260);
        const svgHeight = Math.max(580, nodeCount * 45);

        const margin = { top: 40, right: 240, bottom: 40, left: 160 };
        const innerWidth = svgWidth - margin.left - margin.right;
        const innerHeight = svgHeight - margin.top - margin.bottom;

        const treemap = d3.tree().size([innerHeight, innerWidth]);
        const treeData = treemap(root);
        const nodes = treeData.descendants();
        const links = treeData.descendants().slice(1);

        const svgContainer = d3.select(container)
            .append('svg')
            .attr('width', '100%')
            .attr('height', \`\${svgHeight}px\`)
            .attr('viewBox', \`0 0 \${svgWidth} \${svgHeight}\`)
            .attr('style', 'background:#0b0f17; user-select:none; font-family: Outfit, sans-serif; display:block;');

        const svg = svgContainer.append('g')
            .attr('transform', \`translate(\${margin.left},\${margin.top})\`);

        // ── LINKS (Cubic Bezier Curves) ──────────────────────────────────────
        svg.selectAll('path.link')
            .data(links, d => d.id || (d.id = Math.random()))
            .enter().insert('path', 'g')
            .attr('class', 'link')
            .attr('fill', 'none')
            .attr('stroke', 'rgba(56, 189, 248, 0.45)')
            .attr('stroke-width', 2)
            .attr('d', d => \`M \${d.y} \${d.x}
                            C \${(d.y + d.parent.y) / 2} \${d.x},
                              \${(d.y + d.parent.y) / 2} \${d.parent.x},
                              \${d.parent.y} \${d.parent.x}\`);

        // ── NODES (Glowing circles & Labels) ─────────────────────────────────
        let i = 0;
        const nodeGroup = svg.selectAll('g.node')
            .data(nodes, d => d.id || (d.id = ++i))
            .enter().append('g')
            .attr('class', 'node')
            .attr('transform', d => \`translate(\${d.y},\${d.x})\`)
            .style('cursor', 'pointer')
            .on('click', (event, d) => {
                if (d.data.children) {
                    if (d.data._children) {
                        d.data.children = d.data._children;
                        d.data._children = null;
                    } else {
                        d.data._children = d.data.children;
                        d.data.children = null;
                    }
                }
                renderD3TreeDiagram(data);
            });

        nodeGroup.append('circle')
            .attr('r', 7)
            .attr('fill', d => d.data._children ? '#38bdf8' : '#0f172a')
            .attr('stroke', d => {
                const role = d.data.role_name;
                if (role === 'Admin') return '#FF9933';
                if (role === 'Agency') return '#EA580C';
                if (role === 'NGO') return '#DB2777';
                if (role === 'Member') return '#7C3AED';
                return '#38bdf8';
            })
            .attr('stroke-width', 2.5);

        nodeGroup.append('text')
            .attr('dy', '.35em')
            .attr('x', d => d.children || d.data._children ? -14 : 14)
            .attr('text-anchor', d => d.children || d.data._children ? 'end' : 'start')
            .text(d => {
                const name = d.data.name || d.data.title || 'Account';
                const role = d.data.role_name ? \` (\${d.data.role_name})\` : '';
                const code = d.data.referral_code ? \` [\${d.data.referral_code}]\` : '';
                return \`\${name}\${role}\${code}\`;
            })
            .attr('fill', d => d.data.role_name === 'Admin' ? '#fbbf24' : '#f8fafc')
            .attr('font-size', '13px')
            .attr('font-weight', d => d.children || d.data._children ? '700' : '500');

    } catch (err) {
        console.error('Error rendering D3 Tree Diagram:', err);
    }
}`;

const startMarker = 'function renderD3TreeDiagram(data) {';
const endMarker = 'function expandAllD3Nodes() {';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + newD3TreeFn + '\n\n' + content.substring(endIndex);
    fs.writeFileSync(target, content, 'utf8');
    console.log('SUCCESS: Updated renderD3TreeDiagram cleanly in app.js!');
} else {
    console.error('FAIL: Could not locate markers in app.js. Start:', startIndex, 'End:', endIndex);
}
