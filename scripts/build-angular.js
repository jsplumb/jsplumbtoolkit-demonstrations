const g = require('./gatlight')
const cp = require('child_process')
const common = require('./build-common')

const ANGULAR_ROOT = './src/angular'

const angularDemonstrations = common.listCandidates(ANGULAR_ROOT)
const results = {}

// install common angular deps to speed up individual installations
console.log("INSTALLING COMMON ANGULAR DEPENDENCIES...")
cp.execSync('npm i', { cwd: ANGULAR_ROOT, env: process.env, stdio: 'inherit' });

angularDemonstrations.forEach(v => {
    common.buildDemonstration(`${ANGULAR_ROOT}/${v}`)
    results[v] = "angular"
})

g.write("./demonstrations-angular.json", JSON.stringify(results))
