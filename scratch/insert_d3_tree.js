const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '../Back/public/js/app.js');
let content = fs.readFileSync(target, 'utf8');

const d3Code = `

let d3TreeRoot = null;

function renderD3TreeDiagram(data) {
    const container = document.getElementById('treeContent');
    if (!container) return;
    container.innerHTML = '';

    if (typeof d3 === 'undefined') {
        container.innerHTML = \`<div style="color:#f87171; padding:2rem; text-align:center; font-weight:700;">⚠️ D3.js library is loading... Please refresh the page.</div>\`;
        return;
    }

    if (!data) {
        container.innerHTML = \`<div style="color:#94a3b8; padding:2rem; text-align:center;">No tree data available.</div>\`;
        return;
    }

    try {
        const margin = { top: 50, right: 260, bottom: 50, left: 160 };
        const containerWidth = container.clientWidth || 1000;
        const containerHeight = container.clientHeight || 580;
        const width = Math.max(containerWidth, 1000) - margin.left - margin.right;
        const height = Math.max(containerHeight, 580) - margin.top - margin.bottom;

        // Parent SVG Container
        const svgContainer = d3.select(container)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', \`0 0 \${width + margin.left + margin.right} \${height + margin.top + margin.bottom}\`)
            .attr('style', 'background:#0b0f17; user-select:none; font-family: Outfit, sans-serif; cursor: grab;');

        const svg = svgContainer.append('g')
            .attr('transform', \`translate(\${margin.left},\${margin.top})\`);

        // D3 Zoom & Pan Behavior
        const zoom = d3.zoom()
            .scaleExtent([0.4, 2.5])
            .on('zoom', (event) => {
                svg.attr('transform', \`translate(\${event.transform.x + margin.left},\${event.transform.y + margin.top}) scale(\${event.transform.k})\`);
            });

        svgContainer.call(zoom);

        let i = 0;
        const duration = 400;

        const treemap = d3.tree().nodeSize([42, 220]);
        const root = d3.hierarchy(data, d => d.children);
        root.x0 = height / 2;
        root.y0 = 0;

        d3TreeRoot = root;

        function collapseDeep(d) {
            if (d.children && Array.isArray(d.children) && d.children.length > 0) {
                d._children = d.children;
                d._children.forEach(collapseDeep);
                d.children = null;
            }
        }
        if (root.children) {
            root.children.forEach(child => {
                if (child.children) {
                    child.children.forEach(collapseDeep);
                }
            });
        }

        updateTree(root);

        function updateTree(source) {
            const treeData = treemap(root);
            const nodes = treeData.descendants();
            const links = treeData.descendants().slice(1);

            nodes.forEach(d => { d.y = d.depth * 220; });

            // ── NODES ─────────────────────────────────────────────────────────────
            const node = svg.selectAll('g.node')
                .data(nodes, d => d.id || (d.id = ++i));

            const nodeEnter = node.enter().append('g')
                .attr('class', 'node')
                .attr('transform', d => \`translate(\${source.y0 || 0},\${source.x0 || 0})\`)
                .style('cursor', 'pointer')
                .on('click', (event, d) => {
                    if (d.children) {
                        d._children = d.children;
                        d.children = null;
                    } else {
                        d.children = d._children;
                        d._children = null;
                    }
                    updateTree(d);
                });

            // Outer Circle Glow (OSINT Mindmap style)
            nodeEnter.append('circle')
                .attr('class', 'node-circle')
                .attr('r', 6)
                .attr('fill', d => d._children ? '#38bdf8' : '#0f172a')
                .attr('stroke', d => {
                    const role = d.data.role_name;
                    if (role === 'Admin') return '#FF9933';
                    if (role === 'Agency') return '#EA580C';
                    if (role === 'NGO') return '#DB2777';
                    if (role === 'Member') return '#7C3AED';
                    return '#38bdf8';
                })
                .attr('stroke-width', 2.5);

            // Node Text Label
            nodeEnter.append('text')
                .attr('dy', '.35em')
                .attr('x', d => d.children || d._children ? -12 : 12)
                .attr('text-anchor', d => d.children || d._children ? 'end' : 'start')
                .text(d => {
                    const name = d.data.name || d.data.title || 'Account';
                    const role = d.data.role_name ? \` (\${d.data.role_name})\` : '';
                    const code = d.data.referral_code ? \` [\${d.data.referral_code}]\` : '';
                    return \`\${name}\${role}\${code}\`;
                })
                .attr('fill', d => d.data.role_name === 'Admin' ? '#fbbf24' : '#f8fafc')
                .attr('font-size', '12px')
                .attr('font-weight', d => d.children || d._children ? '700' : '500')
                .attr('font-family', 'Outfit, sans-serif');

            const nodeUpdate = nodeEnter.merge(node);

            nodeUpdate.transition()
                .duration(duration)
                .attr('transform', d => \`translate(\${d.y},\${d.x})\`);

            nodeUpdate.select('circle.node-circle')
                .attr('r', d => d._children ? 7.5 : 6)
                .attr('fill', d => d._children ? '#38bdf8' : '#0f172a');

            const nodeExit = node.exit().transition()
                .duration(duration)
                .attr('transform', d => \`translate(\${source.y},\${source.x})\`)
                .remove();

            nodeExit.select('circle').attr('r', 1e-6);
            nodeExit.select('text').style('fill-opacity', 1e-6);

            // ── LINKS (Cubic Bezier Curves) ──────────────────────────────────────
            const link = svg.selectAll('path.link')
                .data(links, d => d.id);

            const linkEnter = link.enter().insert('path', 'g')
                .attr('class', 'link')
                .attr('fill', 'none')
                .attr('stroke', 'rgba(56, 189, 248, 0.4)')
                .attr('stroke-width', 1.8)
                .attr('d', d => {
                    const o = { x: source.x0 || 0, y: source.y0 || 0 };
                    return diagonal(o, o);
                });

            const linkUpdate = linkEnter.merge(link);

            linkUpdate.transition()
                .duration(duration)
                .attr('d', d => diagonal(d, d.parent));

            link.exit().transition()
                .duration(duration)
                .attr('d', d => {
                    const o = { x: source.x, y: source.y };
                    return diagonal(o, o);
                })
                .remove();

            nodes.forEach(d => {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }

        function diagonal(s, d) {
            return \`M \${s.y} \${s.x}
                    C \${(s.y + d.y) / 2} \${s.x},
                      \${(s.y + d.y) / 2} \${d.x},
                      \${d.y} \${d.x}\`;
        }
    } catch (err) {
        console.error('Error rendering D3 Tree Diagram:', err);
    }
}

function expandAllD3Nodes() {
    if (!d3TreeRoot) return;
    function expand(d) {
        if (d._children) {
            d.children = d._children;
            d._children = null;
        }
        if (d.children) d.children.forEach(expand);
    }
    expand(d3TreeRoot);
    renderAccountsTree();
}
window.expandAllD3Nodes = expandAllD3Nodes;

function collapseAllD3Nodes() {
    if (!d3TreeRoot) return;
    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        }
        if (d._children) d._children.forEach(collapse);
    }
    if (d3TreeRoot.children) {
        d3TreeRoot.children.forEach(collapse);
    }
    renderAccountsTree();
}
window.collapseAllD3Nodes = collapseAllD3Nodes;

function resetD3TreeRoot() {
    currentTreeRootId = null;
    selectedTreeUserId = null;
    const select = document.getElementById('treeFocusUserSelect');
    if (select) select.value = '';
    renderAccountsTree();
}
window.resetD3TreeRoot = resetD3TreeRoot;
`;

const regex = /(renderD3TreeDiagram\(rootData\);\s*\})/
if (regex.test(content)) {
    content = content.replace(regex, '$1' + d3Code);
    fs.writeFileSync(target, content, 'utf8');
    console.log('Regex insertion of renderD3TreeDiagram successful!');
} else {
    console.error('Regex match failed');
}
