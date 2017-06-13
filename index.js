const fs = require('fs')
const path = require('path')

// Load lib/*.js for usage such as bitbucket.branch.create() while keeping self
// context (auth details)
function loadLibs (self) {
    const libFiles = fs.readdirSync('./lib')
    for (const file of libFiles) {
        const trimmedFile = file.split('.')[0]
        const lib = require(path.resolve(__dirname, 'lib', file))
        self[trimmedFile] = {}
        Object.keys(lib).forEach(func => {
            self[trimmedFile][func] = lib[func].bind(self)
        })
    }
}

class BitbucketAPI {
    constructor(username, password) {
        if (username || password) {
            this.setAuth(username, password);
        }
    
        loadLibs(this);
    }

    setAuth(username, password){
        this.auth = {
            'user': username,
            'pass': password
        }
    }
}

module.exports = new BitbucketAPI()
