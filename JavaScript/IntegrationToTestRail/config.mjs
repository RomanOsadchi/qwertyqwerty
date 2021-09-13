import minimist from "minimist";

let params = process.argv.slice(2)
export let args = minimist(params, {
    default: {
        baseURL: 'https://crexiqa.testrail.io',
        login: 'al.khamitski@gmail.com',
        password: 'Password123!',
        suiteId: 1,
        projectId: 1
    }
})

