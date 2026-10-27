import {test} from 'node:test';
import assert from 'node:assert/strict';
import {positiveQuantity,validDate} from '../server/validation.js';
test('unit: quantity boundaries reject negative, empty, nonnumeric and infinite values',()=>{for(const v of [-1,0,'',null,true,'abc',Infinity,'1e999',100000001])assert.equal(positiveQuantity(v),false,String(v));for(const v of [.001,1,'25',100000000])assert.equal(positiveQuantity(v),true,String(v));});
test('unit: date validation checks real calendar days and upper boundary',()=>{const max='2026-10-26';for(const v of ['2026-02-30','2026-13-01','not-a-date','2026-10-27','2026-02-29',null])assert.equal(validDate(v,max),false,String(v));for(const v of ['2024-02-29','2026-10-26','2026-01-01'])assert.equal(validDate(v,max),true,v);});
