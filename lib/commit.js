const rp = require('request-promise');
const fs = require('fs');
const execProcess = require('../exec_process');

const originalDir = process.cwd()

// files = [{repoLocation: '/asdf/asdf', localLocation: '/name/asdf/asdf'}]
function create({tempDir, projectName, branch, file, slug, message = "Greenkeeper bitbucket commit", files = []}) {
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

    process.chdir(tempDir)

    return new Promise((resolve, reject) => {
        execProcess(`git clone https://${this.auth.user}:${this.auth.pass}@bitbucket.org/${projectName}/${slug} ` +
            `&& cd ${slug} && git fetch origin ${branch} && git checkout ${branch} && mv ${file} . && git add package.json ` +
            `&& git commit -m "${message}"  && git push origin ${branch} --force`, function(err,response) {
            process.chdir(originalDir)
            if(err){
                console.log(err)
                return reject(err)
            }
            console.log(response)
            resolve(response)
        });
    })
}

module.exports = {
    create
}
