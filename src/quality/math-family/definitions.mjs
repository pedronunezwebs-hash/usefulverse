export const ids=['fraction-calculator','prime-number-checker','percentage-calculator','number-to-words-converter','ratio-proportion-calculator'];
export const definitions={
'fraction-calculator':{engine:'fraction',modes:['calculate','simplify','compare','sum'],fields:{a:{value:'1/2',type:'textarea'},b:{value:'1/3'},operation:{value:'add',options:['add','subtract','multiply','divide']}},visible:{calculate:['a','b','operation'],simplify:['a'],compare:['a','b'],sum:['a']}},
'prime-number-checker':{engine:'prime',modes:['check'],fields:{a:{value:'561'}},visible:{check:['a']}},
'percentage-calculator':{engine:'percentage',modes:['of','share','whole','change','difference','increase','decrease','error'],fields:{a:{value:'15'},b:{value:'200'}},visible:{}},
'number-to-words-converter':{engine:'words',modes:['cardinal','digits','usd'],fields:{a:{value:'1234567'},letterCase:{value:'lower',options:['lower','title','upper']}},visible:{}},
'ratio-proportion-calculator':{engine:'ratio',modes:['simplify','solve','scale'],fields:{a:{value:'12:18'},b:{value:'2'},c:{value:'3'},d:{value:'?'}},visible:{simplify:['a'],solve:['a','b','c','d'],scale:['a','b']}}
};
