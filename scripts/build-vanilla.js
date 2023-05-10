/**
    Builds all of the vanilla demonstrations. For demonstrations that have multiple source versions,
 all of the versions are built.

*/

const g = require('./gatlight')
const cp = require('child_process')
const common = require('./build-common')

const VANILLA_ROOT = './src/vanilla'

const vanillaDemonstrations = common.listCandidates(VANILLA_ROOT)
const results = {}

vanillaDemonstrations.forEach(v => {
    console.log(v)
    _maybeBuildES5(v)
    _maybeBuildES6_TS(v, "es6")
    _maybeBuildES6_TS(v, "ts")
})

g.write("./demonstrations-vanilla.json", JSON.stringify(results))

function _maybeBuildES5(demoId) {
    const demoRoot = `${VANILLA_ROOT}/${demoId}`
    const es5Root = `${demoRoot}/es5`
    if (g.exists(es5Root)) {
        console.log(`Building ES5 version of ${demoId}`)
        cp.execSync('npm i', { cwd: es5Root, env: process.env, stdio: 'inherit' });
        results[demoId] = "es5"
    }
}

function _maybeBuildES6_TS(demoId, version) {
    const demoRoot = `${VANILLA_ROOT}/${demoId}`
    const root = `${demoRoot}/${version}`
    if (g.exists(root)) {
        common.buildDemonstration(root)
        results[demoId] = version
    }
}
