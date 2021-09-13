import minimist from "minimist"

let params = process.argv.slice(2)
export let args = minimist(params, {
    default: {
        jobName : 'TestRail_Integration_A.K.'
    }
})