const fs = require('fs');
let js = fs.readFileSync('chatbot.js', 'utf8').replace(/\r/g, '\n');

// Fix: replace 'key': with key: in packing lines
// Pattern: packing: {'climate':'value','dress':'value',...}
// Target: packing: { climate: "value", dress: "value", ... }
let count = 0;
const lines = js.split('\n');
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('packing: {') && line.includes("'climate':")) {
        // Convert from JSON-style to JS-style
        let fixed = line
            .replace(/packing: \{/, 'packing: { ')
            .replace(/'([a-z]+)':/g, '$1: ')
            .replace(/'([^']+)'/g, '"$1"')
            .replace(/\},\s*$/, ' },');
        lines[i] = fixed;
        count++;
    }
}

js = lines.join('\n');

// Also add missing commas after tips: [...] lines where packing follows
// Pattern: tips: [...]\n        packing:
const fixed2 = js.replace(/(\]\s*\n)(\s*packing:)/g, '$1        ,\n$2');
if (fixed2 !== js) {
    console.log('Fixed missing commas');
    js = fixed2;
    count++;
}

fs.writeFileSync('chatbot.js', js);
console.log('Fixed', count, 'lines');
