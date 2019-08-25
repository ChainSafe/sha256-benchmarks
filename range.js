const Benchmark = require('benchmark');
const Sha256Rust = require('@chainsafe/sha256-rust-wasm');
const Sha256Js = require('js-sha256');
const Sha256Asm = require('asmcrypto.js');
const Sha256BCrypto = require('bcrypto/lib/sha256');
const Sha256AS = require('./sha256-as');

const messages = []
const wasmMessages = []

for (let i = 0; i < 5; i++) {
    if (i > 0) {
        const message = "1".repeat(i)
        messages.push(new Uint8Array(Buffer.from(message)));
        wasmMessages.push(Sha256AS.__retain(Sha256AS.__allocArray(Sha256AS.UINT8ARRAY_ID, message)));
    }
}

for (let i = 0; i < messages.length; i++) {
    // add tests
    console.log(`Test values \n\tString: ${messages[i]} \n\tWasm: ${wasmMessages[i]}`)
    const suite = new Benchmark.Suite;
    suite
        .add(`LENGTH ${messages[i].length} Sha256Rust#hash`, function () {
            Sha256Rust.Sha256.hash(messages[i]);
        })
        .add(`LENGTH ${messages[i].length} Sha256Js#hash`, function () {
            var hash = Sha256Js.sha256.create();
            hash.update(messages[i]);
            hash.digest();
        })
        .add(`LENGTH ${messages[i].length} Sha256Asm#hash`, function () {
            var hash = new Sha256Asm.Sha256();
            hash.process(messages[i]);
            hash.finish();
        })
        .add(`LENGTH ${messages[i].length} Sha256BCrypto#hash`, function () {
            const hash = new Sha256BCrypto();
            hash.init();
            hash.update(messages[i]);
            hash.final();
        })
        .add(`LENGTH ${messages[i].length} Sha256AS#hash`, function (){
            Sha256AS.hashMe(wasmMessages[i]);
        })
        // add listeners
        .on(`LENGTH ${messages[i].length} cycle`, function (event) {
            console.log(String(event.target));
        })
        .on('complete', function () {
         console.log(`Fastest for LENGTH ${messages[i].length} is ${this.filter('fastest').map('name')}`);
         console.log("\n")
        })
        // run async
        .run({async: false});
}