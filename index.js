const request = require('request');

class BitbucketAPI {
    constructor(username,password){

    }

    setAuth(username,password){
        this.auth = {
            'user': username,
            'pass': password
        }
    }

    // right now this receives a 302, despite creating the branch sucessfully. Weird but whatever it works
    createBranch(projectName, repo, fromBranch, branchName) {
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        const dataString = `repository=${projectName}/${repo}&from_branch=${fromBranch}&branch_name=${branchName}`;
        const options = {
            url: 'https://bitbucket.org/branch/create',
            method: 'POST',
            headers: headers,
            body: dataString,
            auth: this.auth
        };
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        }
        request(options,callback);
    }






}

module.exports = new BitbucketAPI();
