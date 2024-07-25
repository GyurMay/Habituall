const fs = require("fs");

let apiEnv = 'api/.env';
let clientEnv = "client/src/clientDotEnv.js";

// Read files synchronously
let r1 = fs.readFileSync(apiEnv, 'utf8'); // Specify encoding to get string directly
let r2 = fs.readFileSync(clientEnv, 'utf8');

let prod = false;

// Check if production environment
if (r1.includes("='production'")) {
    prod = true;
    console.log(prod, "<-- prod");
}

let p1 = "=8080", p2 = "=3001";
let n1 = "='production'", n2 = "='development'";
let cs = "false", cs2 = "true";

// If not production, swap values
if (!prod) {
    console.log("not prod");
    [p1, p2] = [p2, p1];
    [n1, n2] = [n2, n1];
    [cs, cs2] = [cs2, cs];
}

// Perform string replacements using regular expressions for global replacement
let contents = r1.replace(new RegExp(escapeRegExp(p1), 'g'), p2)
                 .replace(new RegExp(escapeRegExp(n1), 'g'), n2);
let content2 = r2.replace(new RegExp(escapeRegExp(cs), 'g'), cs2);

// Function to escape special characters in a string for RegExp
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// Write modified contents back to files
fs.writeFileSync(apiEnv, contents);
fs.writeFileSync(clientEnv, content2);

console.log(prod ? "switched to dev" : "switched to prod");
