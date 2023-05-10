const cp = require('child_process')
const g = require('./gatlight')

const NODE_MODULES = "node_modules"

function buildDemonstration(demoRoot) {
    console.log(`Building ${demoRoot}`)
    cp.execSync('npm i', { cwd: demoRoot, env: process.env, stdio: 'inherit' });
    cp.execSync('npm run build', { cwd: demoRoot, env: process.env, stdio: 'inherit' });
}

function listCandidates(rootDir) {
    return g.ls(rootDir, {
        filter:(candidate) => {
            return candidate !== NODE_MODULES && g.isDirectory(`${rootDir}/${candidate}`)
        }
    })
}

exports.buildDemonstration = buildDemonstration;
exports.listCandidates = listCandidates;
