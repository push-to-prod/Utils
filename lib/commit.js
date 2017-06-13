const rp = require('request-promise');
const fs = require('fs');

// files = [{repoLocation: '/asdf/asdf', localLocation: '/name/asdf/asdf'}]
function create(projectName, slug, message = "Greenkeeper bitbucket commit", files = []) {
    if (!this.auth) {
        throw new Error('Credentials are required.')
    }
    if (!projectName || !slug) {
        throw new Error('Missing required arguments.');
    }
    
    let formData = {
        message: message
    };
    files.forEach(fileObj => formData[fileObj.repoLocation] = fs.createReadStream(fileObj.localLocation));
    const options = {
        simple: false,
        resolveWithFullResponse: true,
        url: `https://api.bitbucket.org/2.0/repositories/${projectName}/${slug}/src`,
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        auth: this.auth,
        formData: formData
    };

    return rp(options)
        .then(res => {
            if (res.statusCode != 201) {
                throw new Error(`Unexpected status code ${response.statusCode}`);
            }
        });
}

module.exports = {
    create
}