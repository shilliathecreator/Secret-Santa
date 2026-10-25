import test from 'node:test';
import assert from 'node:assert/strict';
import { drawSecretSanta } from '../lib/draw.mjs';
test('each person gives and receives exactly once, never to themselves',()=>{
 for(let n=2;n<=50;n++) for(let run=0;run<30;run++){
 const ids=Array.from({length:n},(_,i)=>String(i));const result=drawSecretSanta(ids);
 assert.equal(new Set(result.map(x=>x.recipient)).size,n);
 assert.deepEqual(result.map(x=>x.giver),ids);
 assert.ok(result.every(x=>x.giver!==x.recipient && ids.includes(x.recipient)));
 }
});
test('invalid participant sets are rejected',()=>{for(const ids of [[],['a'],['a','a'],['', 'a']])assert.throws(()=>drawSecretSanta(ids));});
