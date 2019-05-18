const { INITIAL_BALANCE } = require('../config')

class Wallet{
    constructor() {
        this.balance = INITIAL_BALANCE
        this.keyPair = null
        this.publickKey = null
    }

    toString() {
        return `Wallet -
        publicKey : ${this.publickKey.toString()}
        balance   : ${this.balance}`
    }
}

module.exports = Wallet