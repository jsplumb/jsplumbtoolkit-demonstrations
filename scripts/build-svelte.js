const g = require('./gatlight')
const cp = require('child_process')
const common = require('./build-common')

const ROOT = './src/svelte'

const demonstrations = common.listCandidates(ROOT)
const results = {}

// install common angular deps to speed up individual installations
console.log("INSTALLING COMMON SVELTE DEPENDENCIES...")
cp.execSync('npm i', { cwd: ROOT, env: process.env, stdio: 'inherit' });

demonstrations.forEach(v => {
    common.buildDemonstration(`${ROOT}/${v}`)
    results[v] = "svelte"
})

g.write("./demonstrations-svelte.json", JSON.stringify(results))
