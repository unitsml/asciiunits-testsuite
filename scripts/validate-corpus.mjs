import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve, relative, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
const root=resolve(process.argv[2]??resolve(dirname(fileURLToPath(import.meta.url)),"../corpora/unitsml"));
const read=path=>JSON.parse(readFileSync(path,"utf8"));
const seal=bytes=>"sha256:"+createHash("sha256").update(bytes).digest("hex");
function inside(base,path){const result=resolve(base,path);const rel=relative(base,result);assert.ok(!rel.startsWith("..")&&!isAbsolute(rel),"path escapes corpus");return result;}
function verify(base,files){assert.ok(Object.keys(files).length>0);for(const[path,expected]of Object.entries(files))assert.equal(seal(readFileSync(inside(base,path))),expected,`changed byte seal: ${path}`);}
const provenance=read(resolve(root,"PROVENANCE.json"));verify(root,provenance.files_sha256);
const corpus=read(resolve(root,"corpus.json"));const kinds=read(resolve(root,"expected-kinds.json"));
assert.equal(corpus.artifact_checksum,provenance.artifact_checksum);assert.ok(corpus.cases.length>0);assert.equal(corpus.cases.length,kinds.cases.length);
for(let i=0;i<corpus.cases.length;i++){const row=corpus.cases[i];assert.equal(typeof row.input,"string");assert.equal(row.input,kinds.cases[i].input);assert.equal(row.kind,kinds.cases[i].kind);}
const previous=inside(root,provenance.supersedes.preserved_at);const generation=read(resolve(previous,"generation.json"));verify(previous,generation.files_sha256);verify(previous,provenance.supersedes.files_sha256);
const older=read(resolve(previous,"corpus.json"));assert.equal(older.artifact_checksum,generation.artifact_checksum);assert.equal(older.cases.length,generation.cases);assert.equal(generation.source_commit,provenance.supersedes.testsuite_commit);
console.log(JSON.stringify({current_cases:corpus.cases.length,previous_cases:older.cases.length,producer:provenance.producer_commit,byte_seals:"verified"}));
