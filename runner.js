const argly = require('argly')
const bitbucket = require('.')
const REQUIRED_ARGS = [ 'user', 'pass', 'owner', 'repo' ]
const args = argly
    .createParser({
        '--user -u': 'string',
        '--pass -p': 'string',
        '--owner -o': 'string',
        '--repo -r': 'string',
        '--message -m': 'string',
        '--repoFile -z': 'string',
        '--localFile -x': 'string',
    })
    .usage('Usage: $0 [options]')
    .example(
        '$0 -u james.beavers@inin.com -p some_s1ck_pass -o Druotic -r greenkeeper-testing-bitbucket'
    )
    .example(
        '$0 -u james.beavers@inin.com -p some_s1ck_pass -o Druotic -r greenkeeper-testing-bitbucket -z repoFileLocation -x localFileLocation'
    )
    .validate(function (args) {
        REQUIRED_ARGS.forEach(requiredArg => {
            if (!args[requiredArg]) {
                this.printUsage()
                console.log(`${requiredArg} required`)
                process.exit(1)
            }
        })
    })
    .parse()

bitbucket.setAuth(args.user, args.pass)

if (args.localFile) {
    bitbucket.commit.create(args.owner, args.repo, args.message,args.localFile,'lastTimeTesting');
} else {
    bitbucket.branch.create(args.owner, args.repo, 'master', `runner-test-${Math.random()}`)
        .then(body => console.log('branch created!'))

    bitbucket.pullrequest.create(args.owner,args.repo,'master','TESTINGTESTING','wut a cool pr')
        .then(body => console.log('pr made!'));
}
