const fs = require('fs');
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
}
const files = walk('e:/Notex/New Client/user-new/src');
let count = 0;
files.forEach(file => {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        let content = fs.readFileSync(file, 'utf8');
        let searchStr = 'fetch(`${process.env.NEXT_PUBLIC_BASE_URL}';
        if (content.includes(searchStr)) {
            let newContent = content.split(searchStr).join('fetch(`${process.env.NEXT_PUBLIC_API_URL}');
            fs.writeFileSync(file, newContent, 'utf8');
            count++;
        }
    }
});
console.log('Replaced in ' + count + ' files');
