const request = require('request-promise')

function File (projectName,repo, branchName, path) {
    if (!this.auth) {
        throw new Error('credentials required')
    }

    const options = {
        simple: false,
        resolveWithFullResponse: true,
        url: `https://api.bitbucket.org/1.0/repositories/${projectName}/${repo}/raw/${branchName}/${path}`,
        method: 'GET',
        auth: this.auth
    }
    return request(options)
        .then(response => {
            // Branch creation always returns redirect status code on success
            if (response.statusCode != 200) throw new Error(`Unexpected status code ${response.statusCode}`);
            return response.body;
        })
}

module.exports = {
    File
}
