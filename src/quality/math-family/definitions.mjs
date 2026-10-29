export const ids=['fraction-calculator','prime-number-checker','percentage-calculator','number-to-words-converter','ratio-proportion-calculator'];
export const definitions={
'fraction-calculator':{engine:'fraction',modes:['calculate','simplify','compare','sum'],fields:{a:{value:'1/2',type:'textarea'},b:{value:'1/3'},operation:{value:'add',options:['add','subtract','multiply','divide']}},visible:{calculate:['a','b','operation'],simplify:['a'],compare:['a','b'],sum:['a']}},
'prime-number-checker':{engine:'prime',modes:['check'],fields:{a:{value:'561'}},visible:{check:['a']}},
'percentage-calculator':{engine:'percentage',modes:['of','share','whole','change','difference','increase','decrease','error'],fields:{a:{value:'15'},b:{value:'200'}},visible:{}},
'number-to-words-converter':{engine:'words',modes:['cardinal','digits','usd'],fields:{a:{value:'1234567'},letterCase:{value:'lower',options:['lower','title','upper']}},visible:{}},
'ratio-proportion-calculator':{engine:'ratio',modes:['simplify','solve','scale'],fields:{a:{value:'12:18'},b:{value:'2'},c:{value:'3'},d:{value:'?'}},visible:{simplify:['a'],solve:['a','b','c','d'],scale:['a','b']}}
};
ids.push('discount-calculator','random-number-generator','average-calculator','age-calculator','fuel-cost-calculator');
Object.assign(definitions,{
'discount-calculator':{engine:'discount',modes:['percent','reverse','amount','recover','stack'],fields:{a:{value:'100'},b:{value:'20'}},visible:{}},
'random-number-generator':{engine:'random',modes:['integers','decimals'],fields:{a:{value:'1'},b:{value:'100'},c:{value:'10'},unique:{value:'yes',options:['yes','no']},places:{value:'2',options:['0','1','2','3','6','12','15']}},visible:{integers:['a','b','c','unique'],decimals:['a','b','c','unique','places']}},
'average-calculator':{engine:'average',modes:['mean','weighted','final'],fields:{a:{type:'textarea',value:'10\n12\n14'},b:{type:'textarea',value:'1\n1\n1'},c:{value:'90'}},visible:{mean:['a'],weighted:['a','b'],final:['a','b','c']}},
'age-calculator':{engine:'age',modes:['age'],fields:{a:{type:'date',value:'2000-01-15'},b:{type:'date',value:'2026-10-29',today:true},policy:{value:'feb28',options:['feb28','march1']}},visible:{}},
'fuel-cost-calculator':{engine:'fuel',modes:['metric','us','imperial'],fields:{a:{value:'100'},b:{value:'8'},c:{value:'1.50'},d:{value:'2'},currency:{value:'USD',options:['USD','EUR','GBP','CAD','AUD','INR','BDT','CNY','JPY','KRW','IDR','RUB','TRY','VND']},trip:{value:'oneway',options:['oneway','roundtrip']}},visible:{}}
});
