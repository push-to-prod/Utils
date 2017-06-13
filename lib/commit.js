const rp = require('request-promise');
const fs = require('fs');
const execProcess = require('../exec_process');

// files = [{repoLocation: '/asdf/asdf', localLocation: '/name/asdf/asdf'}]
function create(projectName, slug, message = "Greenkeeper bitbucket commit", file,branch) {
    if (!this.auth) {
        throw new Error('Credentials are required.')
    }
    if (!projectName || !slug) {
        throw new Error('Missing required arguments.');
    }

    let formData = {
        message: message
    };
    //files.forEach(fileObj => formData[fileObj.repoLocation] = fs.createReadStream(fileObj.localLocation));
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

    /*    return rp(options)
     .then(res => {
     if (res.statusCode != 201) {
     throw new Error(`Unexpected status code ${res.statusCode}`);
     }
     });*/
    return execProcess(`git remote set-url origin https://${this.auth.user}:${this.auth.pass}@bitbucket.org/${projectName}/${slug} && git add ${file} && git commit -m "${message}" -- ${file} && git push origin ${branch} --force`,function(err,response){
        if(!err){
            console.log(response);
        }else {
            console.log(err);
        }
    });
}

module.exports = {
    create
}
