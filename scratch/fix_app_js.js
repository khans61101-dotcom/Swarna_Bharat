const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '../Back/public/js/app.js');
let content = fs.readFileSync(target, 'utf8');

const targetStr = `    const roleFilter = document.getElementById('treeRoleFilter')?.value || 'All';
    let filterSet = null;
    if (roleFilter !== 'All') {
            ">
                No accounts match the current filter or search criteria.
            </div>
        \`;
        return;
    }

    // Reset scale
    // treeContent.style.transform = 'scale(1)';  
    fitTreeToScreen();  

    // Render complete hierarchy
    treeContent.innerHTML = treeData
        .map(rootNode => renderTreeNodeHTML(rootNode, true))
        .join('');
}`;

const replacementStr = `    const roleFilter = document.getElementById('treeRoleFilter')?.value || 'All';
    let filterSet = null;
    if (roleFilter !== 'All') {
        filterSet = new Set(fullList.filter(user => user.role_name === roleFilter).map(user => Number(user.id)));
    }

    const treeDataArray = buildUserTreeStructure(fullList, currentTreeRootId, filterSet);
    if (!Array.isArray(treeDataArray) || treeDataArray.length === 0) {
        treeContent.innerHTML = \`<div style="color:#94a3b8; padding:3rem; text-align:center;">No accounts match the current filter or search criteria.</div>\`;
        return;
    }

    const rootData = treeDataArray.length === 1 ? treeDataArray[0] : {
        id: 0,
        name: 'Swarna Bharat Network',
        role_name: 'Root System',
        referral_code: 'ROOT-SYSTEM',
        children: treeDataArray
    };

    renderD3TreeDiagram(rootData);
}`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacementStr);
    fs.writeFileSync(target, content, 'utf8');
    console.log('Successfully replaced syntax error block in app.js!');
} else {
    console.log('Target block not found via exact match. Will try regex fix.');
    const regex = /if\s*\(roleFilter\s*!==\s*'All'\)\s*\{\s*">\s*No accounts match the current filter or search criteria\.[\s\S]*?renderTreeNodeHTML\(rootNode,\s*true\)\)\s*\.join\(''\);\s*\}/;
    if (regex.test(content)) {
        content = content.replace(regex, replacementStr.replace('    const roleFilter = document.getElementById(\'treeRoleFilter\')?.value || \'All\';\n    let filterSet = null;\n', ''));
        fs.writeFileSync(target, content, 'utf8');
        console.log('Regex replacement successful!');
    } else {
        console.error('Regex match failed too');
    }
}
