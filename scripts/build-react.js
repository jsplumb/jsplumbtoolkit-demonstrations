const g = require('./gatlight')
const cp = require('child_process')
const common = require('./build-common')

const REACT_ROOT = './src/react'

const reactDemonstrations = common.listCandidates(REACT_ROOT)
const results = {}

// install common angular deps to speed up individual installations
console.log("INSTALLING COMMON REACT DEPENDENCIES...")
cp.execSync('npm i', { cwd: REACT_ROOT, env: process.env, stdio: 'inherit' });

reactDemonstrations.forEach(v => {
    _maybeBuildES6_TS(v, "es6")
    _maybeBuildES6_TS(v, "ts")
})

function _maybeBuildES6_TS(demoId, version) {
    const demoRoot = `${REACT_ROOT}/${demoId}`
    const root = `${demoRoot}/${version}`
    if (g.exists(root)) {
        common.buildDemonstration(root)
        results[demoId] = version
    }
}

g.write("./demonstrations-react.json", JSON.stringify(results))
