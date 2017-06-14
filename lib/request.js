const request = require('request-promise')

function get (url) {
    if (!this.auth) {
        throw new Error('credentials required')
    }
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    const options = {
        simple: false,
        resolveWithFullResponse: true,
        url: url,
        method: 'GET',
        headers: headers,
        auth: this.auth
    }
    return request(options)
        .then(response => {
            const { statusCode } = response
            if (statusCode !== 200)
                throw new Error(`Unexpected status code ${response.statusCode}`)
            return response.body
        })
}

module.exports = {
    get
}
