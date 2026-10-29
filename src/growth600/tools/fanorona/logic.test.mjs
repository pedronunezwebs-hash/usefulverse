import test from 'node:test';
import assert from 'node:assert/strict';
import { createFanorona, legalSteps, applyStep, finishRelay, pieceCounts, isStrong, WHITE, BLACK } from './logic.mjs';

test('standard opening has 22 pieces each and an empty center',()=>{const s=createFanorona();assert.deepEqual(pieceCounts(s),{white:22,black:22});assert.equal(s.board[2*9+4],null);assert.equal(s.turn,WHITE);});
test('diagonal links are allowed only at strong intersections',()=>{assert.ok(isStrong(0,0));assert.ok(!isStrong(0,1));});
test('opening exposes mandatory captures only when available',()=>{const s=createFanorona();const moves=legalSteps(s);assert.ok(moves.length);assert.ok(moves.every(m=>m.kind!=='paika'));});
test('approach and withdrawal remove the whole contiguous line',()=>{for(const kind of ['approach','withdrawal']){const board=Array(45).fill(null);board[2*9+2]=WHITE;if(kind==='approach'){board[2*9+4]=BLACK;board[2*9+5]=BLACK;}else{board[2*9+0]=BLACK;board[2*9+1]=BLACK;}const s={board,turn:WHITE,over:null,chain:null,history:[]};const move=legalSteps(s).find(m=>m.kind===kind);assert.ok(move);const next=applyStep(s,move);assert.equal(next.board[kind==='approach'?22:18],null);assert.equal(next.board[kind==='approach'?23:19],null);assert.equal(next.board.filter(p=>p===BLACK).length,0);assert.equal(next.over,WHITE);}});
test('a capture relay may be ended early and hands over the turn',()=>{const board=Array(45).fill(null);board[20]=WHITE;board[22]=BLACK;board[31]=BLACK;const s={board,turn:WHITE,over:null,chain:null,history:[]};const capture=legalSteps(s).find(m=>m.kind==='approach');assert.ok(capture);const next=applyStep(s,capture);if(next.chain)assert.equal(finishRelay(next).turn,BLACK);else assert.equal(next.turn,BLACK);});
test('an illegal move is rejected',()=>{const s=createFanorona();assert.throws(()=>applyStep(s,{from:0,to:44,kind:'paika'}),{code:'illegal-move'});});
