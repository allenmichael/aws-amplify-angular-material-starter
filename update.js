const fs = require('fs');
const { exec } = require('child_process');

let pkg;
try {
    pkg = JSON.parse(fs.readFileSync('package.json'));
    if (pkg.dependencies) {
        fs.writeFileSync('package.clone.json', JSON.stringify(pkg));
    } else {
        pkg = JSON.parse(fs.readFileSync('package.clone.json'));
        fs.writeFileSync('package.clone.json', JSON.stringify(pkg));
    }
} catch (e) {
    pkg = JSON.parse(fs.readFileSync('package.clone.json'));
    fs.writeFileSync('package.clone.json', JSON.stringify(pkg));
}
console.log(pkg);
try {
    fs.unlinkSync('package.json');
} catch (e) {
}

const pkgNoDeps = JSON.parse(JSON.stringify(pkg));
delete pkgNoDeps.dependencies;
delete pkgNoDeps.devDependencies;
fs.writeFileSync('package.json', JSON.stringify(pkgNoDeps));

Object.keys(pkg.dependencies).forEach(pkgName => {
    exec(`npm i --save ${pkgName}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
    exec(`echo ${pkgName}`, (err, stdout, stderr) => {
        console.log(stdout)
    });
    exec(`npm i --save ${pkgName}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
});

