const { CreateClient } = require('./promise-pop')
async function run() {
    const userProfile = {
        // recent模式，获取30天内全部的邮件信息
        mail: 'recent:chongyang1994@gmail.com',
        password: 'memeda'
    }

    const port = 995
    const host = 'pop.gmail.com'
    const client = await CreateClient(port, host, {
        tlserrs: false,
        enabletls: true,
        debug: false
    })
    let res = await client.login(userProfile.mail, userProfile.password)
    let list = await client.list()
    for (let id of [...Array(list[1]).keys()].reverse()) {
        let reponse = await client.retr(id + 1)
        console.log(reponse[2]);
    }
}
run()
