const fs = require('fs')
const path = require('path')

// Load lib/*.js for usage such as bitbucket.branch.create() while keeping self
// context (auth details)
function loadLibs (self) {
    const basePath = path.resolve(__dirname, 'lib')
    const libFiles = fs.readdirSync(basePath)
    for (const file of libFiles) {
        const trimmedFile = file.split('.')[0]
        const lib = require(path.resolve(basePath, file))
        self[trimmedFile] = {}
        Object.keys(lib).forEach(func => {
            self[trimmedFile][func] = lib[func].bind(self)
        })
    }

    console.log(self)
}

class BitbucketAPI {
    constructor(username, password){
      if (username || password)
        this.setAuth(username, password)
      loadLibs(this)
    }

    setAuth(username, password){
        this.auth = {
            'user': username,
            'pass': password
        }
    }
}

module.exports = new BitbucketAPI()
