const rp = require('request-promise');
const fs = require('fs');

// files = [{repoLocation: '/asdf/asdf', localLocation: '/name/asdf/asdf'}]
function create(files = [], message = Math.random()) {
    const formData = rp.form();
    files.forEach(fileObj => formData.append(fileObj.repoLocation, fs.createReadStream(localLocation)));

    const options = {
        simple: false,
        resolveWithFullResponse: true,
        url: `https://api.bitbucket.org/2.0/repositories/${projectName}/${branchName}/src?message=${message}`,
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        body: {},
        auth: this.auth
    };

    return rp(options)
        .then(res => {
            console.log(`Successfully created a commit to ${projectName}/${branchName}`);
            return res.body;
        });
}