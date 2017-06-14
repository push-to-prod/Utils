const request = require('request-promise')

function create (owner, repo, title, content) {
    if (!this.auth) {
        throw new Error('credentials required')
    }
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    const dataString = `title=${title}&content=${content}`
    const options = {
        simple: false,
        resolveWithFullResponse: true,
        url: `https://api.bitbucket.org/1.0/repositories/${owner}/${repo}/issues`,
        method: 'POST',
        headers: headers,
        body: dataString,
        auth: this.auth
    }
    return request(options)
        .then(response => {
            const { statusCode } = response
            if (statusCode !== 302 && statusCode !== 200)
                throw new Error(`Unexpected status code ${response.statusCode}`)
            return response.body
        })
}

module.exports = {
    create
}
