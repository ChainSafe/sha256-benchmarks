const Benchmark = require('benchmark');
const Sha256Rust = require('@chainsafe/sha256-rust-wasm');
const Sha256Js = require('js-sha256');
const Sha256Asm = require('asmcrypto.js');
const Sha256BCrypto = require('bcrypto/lib/sha256');

var suite = new Benchmark.Suite;

const message = new Uint8Array(Buffer.from('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'));

// add tests
suite
  .add('Sha256Rust#hash', function () {
    Sha256Rust.Sha256.hash(message);
  })
  .add('Sha256Js#hash', function () {
    var hash = Sha256Js.sha256.create();
    hash.update(message);
    hash.digest();
  })
  .add('Sha256Asm#hash', function () {
    var hash = new Sha256Asm.Sha256();
    hash.process(message);
    hash.finish();
  })
  .add('Sha256BCrypto#hash', function () {
    Sha256BCrypto.hash(message)
  })
  // add listeners
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({async: true});
