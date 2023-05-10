const g = require('./gatlight')
const cp = require('child_process')
const common = require('./build-common')

const ROOT = './src/vue2'

const demonstrations = common.listCandidates(ROOT)
const results = {}

// install common angular deps to speed up individual installations
console.log("INSTALLING COMMON VUE2 DEPENDENCIES...")
cp.execSync('npm i', { cwd: ROOT, env: process.env, stdio: 'inherit' });

demonstrations.forEach(v => {
    common.buildDemonstration(`${ROOT}/${v}`)
    results[v] = "vue2"
})

g.write("./demonstrations-vue2.json", JSON.stringify(results))
