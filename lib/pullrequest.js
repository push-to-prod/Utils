const request = require('request-promise')

function create (projectName,repo, destinationBranch, sourceBranch, prTitle) {
    if (!this.auth) {
        throw new Error('credentials required')
    }

    const headers = {
        'Content-Type': 'application/json'
    }

    const dataString =
        {
            "destination": {
                "branch": {
                    "name": `${destinationBranch}`
                }
            },
            "source": {
                "branch": {
                    "name": `${sourceBranch}`
                }
            },
            "title": `${prTitle}`
        };

    const options = {
        simple: false,
        resolveWithFullResponse: true,
        url: `https://api.bitbucket.org/2.0/repositories/${projectName}/${repo}/pullrequests`,
        method: 'POST',
        headers: headers,
        body: JSON.stringify(dataString),
        auth: this.auth
    }
    return request(options)
        .then(response => {
            // Branch creation always returns redirect status code on success
            if (response.statusCode == 400) throw new Error('400: invalid permissions or invalid document posted');
            else if (response.statusCode == 401) throw new Error('401: Unauthenticated request');
            else if (response.statusCode != 201) throw new Error(`Unexpected status code ${response.statusCode}`);
            return response.body;
        })
}

module.exports = {
    create
}
