const request = require('request-promise')


function getDefaultReviewers(auth, projectName,repo){
    if (!auth) {
        throw new Error('credentials required')
    }

    const options = {
        simple: false,
        resolveWithFullResponse: true,
        url: `https://api.bitbucket.org/2.0/repositories/${projectName}/${repo}/default-reviewers`,
        method: 'GET',
        auth: auth
    }
    return request(options)
        .then(response => {
            if (response.statusCode != 200) throw new Error(`Unexpected status code ${response.statusCode}`);
           // console.log(typeof response.body === 'string')
            const json = JSON.parse(response.body);
            //console.log(JSON.stringify(json,null,4));
            //throw new Error('stop');
            //console.log(response);
            if(json.values === undefined) throw new Error('malformed response body getting default reviewers')
            return json.values;
        })
}

function create (projectName,repo, destinationBranch, sourceBranch, prTitle) {
    if (!this.auth) {
        throw new Error('credentials required')
    }

    const headers = {
        'Content-Type': 'application/json'
    }

    // get defaultReviewers first

    return getDefaultReviewers(this.auth,projectName,repo).then(response => {
       // console.log(JSON.stringify(response,null,4));
         console.log(response);
       //  console.log(response[0].links);
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
                "title": `${prTitle}`,
                "close_source_branch": true,
                "reviewers": response

            };

      //console.log(dataString);

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
    });

}

module.exports = {
    create
}
