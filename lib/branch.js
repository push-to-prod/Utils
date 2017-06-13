const request = require('request-promise')

function create (projectName, repo, fromBranch, branchName) {
    if (!this.auth) {
        throw new Error('credentials required')
    }
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    const dataString = `repository=${projectName}/${repo}&from_branch=${fromBranch}&branch_name=${branchName}`
    const options = {
        simple: false,
        resolveWithFullResponse: true,
        url: 'https://bitbucket.org/branch/create',
        method: 'POST',
        headers: headers,
        body: dataString,
        auth: this.auth
    }
    return request(options)
        .then(response => {
            // Branch creation always returns redirect status code on success
            if (response.statusCode !== 302 || 200)
                throw new Error(`Unexpected status code ${response.statusCode}`)
            return response.body
        })
}

module.exports = {
    create
}
