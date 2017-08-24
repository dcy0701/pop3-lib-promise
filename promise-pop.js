// created by dcy 2017-03-01

const POP3Client = require("poplib")

exports.CreateClient = CreateClient

function errorHandler(client, reject) {
    function onError(err) {
        if (err.errno === 111) err = "Unable to connect to server"
        else err = "Server error occurred: " + err.errno
        reject(new Error(err))
        client.quit()
    }

    function onInvalidState(cmd) {
        let err = "Invalid state. You tried calling " + cmd
        reject(new Error(err))
        client.quit()
    }

    function onLocked(cmd) {
        let err = "Current command has not finished yet. You tried calling " + cmd
        reject(new Error(err))
        client.quit()
    }
    client.on("error", onError)
    client.on("invalid-state", onInvalidState)
    client.on("locked", onLocked)
    return function() {
        client.removeListener('error', onError)
        client.removeListener('invalid-state', onInvalidState)
        client.removeListener('locked', onLocked)
    }
}

function CreateClient() {
    return new Promise((resolve, reject) => {
        const client = new POP3Client(...arguments)
        const cleanup = errorHandler(client, reject)
        client.on('connect', () => {
            cleanup()
            resolve(new Client(client))
        })
    })
}

class Client {
    constructor(client) {
        this._client = client
    }
    login(...arg) {
        return runMethod(this, 'login', ...arg)
    }
    stat() {
        return runMethod(this, 'stat')
    }
    list(...arg) {
        return runMethod(this, 'list', ...arg)
    }
    retr(...arg) {
        return runMethod(this, 'retr', ...arg)
    }
    quit() {
        return runMethod(this, 'quit')
    }
}

function runMethod(clientWrapper, methodname, ...arg) {
    return new Promise((resolve, reject) => {
        clientWrapper._client[methodname](...arg)
        let cleanup = errorHandler(clientWrapper._client, reject)
        clientWrapper._client.on(methodname, (...rest) => {
            cleanup()
            resolve(rest)
        })
    })
}


