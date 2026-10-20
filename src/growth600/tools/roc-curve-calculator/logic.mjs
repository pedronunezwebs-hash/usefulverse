export function calculateRoc(rows) {
  if (!Array.isArray(rows) || rows.length < 2 || rows.length > 5000) throw new RangeError('Enter between 2 and 5,000 labeled observations.');
  const data = rows.map((row, index) => {
    const labelText=String(row.label??'').trim(),scoreText=String(row.score??'').trim(),label=Number(labelText),score=Number(scoreText);
    if (!['0','1'].includes(labelText) || !scoreText || !Number.isFinite(score) || score < 0 || score > 1) throw new TypeError(`Row ${index + 1} needs a binary label (0 or 1) and a score from 0 to 1.`);
    return { label, score };
  });
  const positives = data.filter((row) => row.label === 1).length, negatives = data.length - positives;
  if (!positives || !negatives) throw new RangeError('The sample must contain at least one positive and one negative label.');
  data.sort((a,b)=>b.score-a.score);
  const points = [{threshold:Infinity,tpr:0,fpr:0,tp:0,fp:0}];
  let tp=0,fp=0;
  for(let index=0;index<data.length;){
    const threshold=data[index].score;
    do{if(data[index].label===1)tp++;else fp++;index++;}while(index<data.length&&data[index].score===threshold);
    points.push({threshold,tpr:tp/positives,fpr:fp/negatives,tp,fp});
  }
  let auc=0;
  for(let i=1;i<points.length;i++)auc+=(points[i].fpr-points[i-1].fpr)*(points[i].tpr+points[i-1].tpr)/2;
  return Object.freeze({count:data.length,positives,negatives,auc,points:Object.freeze(points.map(Object.freeze))});
}
