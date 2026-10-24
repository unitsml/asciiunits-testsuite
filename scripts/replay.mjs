// Replays the asciiunits conformance corpus against the asciiunits-ts
// runtime. Usage: node scripts/replay.mjs [--corpus <dir>]
//
// TODO(suleman-uzair): implement with the completed @unitsml/asciiunits-ts
// runtime; each case must match expected-kinds.json, and tree-checking
// modes must match corpus.json parsanol trees.
const corpusDir = process.env.CORPUS_DIR ?? new URL("../corpora/unitsml/", import.meta.url).pathname;
console.log(`asciiunits-testsuite replay against ${corpusDir}: not implemented yet`);
process.exit(2);
