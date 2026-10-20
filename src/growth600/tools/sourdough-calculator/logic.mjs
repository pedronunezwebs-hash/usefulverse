export function calculateSourdough({totalFlour,hydrationPercent,saltPercent,prefermentedFlourPercent,starterHydrationPercent}={}) {
  const values={totalFlour:Number(totalFlour),hydrationPercent:Number(hydrationPercent),saltPercent:Number(saltPercent),prefermentedFlourPercent:Number(prefermentedFlourPercent),starterHydrationPercent:Number(starterHydrationPercent)};
  const ranges={totalFlour:[1,100000],hydrationPercent:[30,150],saltPercent:[0,5],prefermentedFlourPercent:[0,50],starterHydrationPercent:[0,200]};
  for(const [key,value] of Object.entries(values)){const [min,max]=ranges[key];if(!Number.isFinite(value)||value<min||value>max)throw Object.assign(new RangeError('Check each baker’s percentage and flour amount.'),{code:'invalid-input'});}
  const totalWater=values.totalFlour*values.hydrationPercent/100;
  const prefermentedFlour=values.totalFlour*values.prefermentedFlourPercent/100;
  const starterWater=prefermentedFlour*values.starterHydrationPercent/100;
  const addedWater=totalWater-starterWater;
  if(addedWater<0)throw Object.assign(new RangeError('The starter already contains more water than the target dough.'),{code:'starter-water-exceeds-target'});
  const salt=values.totalFlour*values.saltPercent/100;
  const starter=prefermentedFlour+starterWater;
  const remainingFlour=values.totalFlour-prefermentedFlour;
  return Object.freeze({totalFlour:values.totalFlour,remainingFlour,prefermentedFlour,starterWater,starter,addedWater,salt,totalDough:values.totalFlour+totalWater+salt});
}
