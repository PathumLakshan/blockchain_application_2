const SHA256 = require('crypto-js/sha256')

const { DIFFICULTY, MINE_RATE } = require('../config')

class Block{
    constructor(timestamp, lastHash, hash, nonce, difficulty, data){
        this.timestamp = timestamp
        this.lastHash  = lastHash
        this.hash      = hash
        this.nonce     = nonce
        this.difficulty= difficulty || DIFFICULTY
        this.data      = data
    }

    toString() {
        return `Block - 
            Timestamp : ${this.timestamp},
            Last Hash : ${this.lastHash.substring(0,10)},
            Hash      : ${this.hash.substring(0,10)},
            Nonce     : ${this.nonce}
            Difficulty: ${this.difficulty}
            Data      : ${this.data}`
    }

    static genesis() {
        return new this('Genesis time', '-----','f1r57-h45h',0,DIFFICULTY, []);
    }

    static mineBlock(lastBlock, data) {
        let hash, timestamp;
        const lastHash = lastBlock.hash
        let nonce = 0
        let { difficulty } = lastBlock

        do{
            nonce++
            timestamp = Date.now()
            difficulty = Block.adjustDifficulty(lastBlock, timestamp)
            hash      = Block.hash(timestamp, lastHash, nonce, difficulty, data)
        } while(hash.substring(0, difficulty) !== '0'.repeat(difficulty))
        
        console.log(hash)
        return new this(timestamp, lastHash, hash, nonce, difficulty, data);
    }

    static hash(timestamp, lastHash, nonce, difficulty, data) {
        return SHA256(`${timestamp}${lastHash}${nonce}${difficulty}${data}`).toString();
    }

    static blockHash(block) {
        const { timestamp, lastHash, nonce, difficulty, data } = block;
        return Block.hash(timestamp, lastHash, nonce, difficulty, data);
    }

    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1: difficulty - 1
        return difficulty
    }
}

module.exports = Block;