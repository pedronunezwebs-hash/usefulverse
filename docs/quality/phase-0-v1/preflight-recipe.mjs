import {writeFile} from 'node:fs/promises';
import {resolve,relative} from 'node:path';
const output=resolve(process.argv[2]??'');if(!relative(process.cwd(),output).startsWith('.qa-')||relative(process.cwd(),output).includes('..'))throw Error('Use an owned .qa- output');
const account='c32922f3c1e392caba10a5727d770468',token=process.env.CLOUDFLARE_API_TOKEN;
if(!token)throw Error('No existing scoped Cloudflare token');
const read=async path=>{const response=await fetch('https://api.cloudflare.com/client/v4/accounts/'+account+'/'+path,{headers:{Authorization:'Bearer '+token}});const json=await response.json();if(!response.ok||!json.success)return {ok:false,status:response.status,errors:json.errors?.map(e=>({code:e.code,message:e.message}))};return {ok:true,value:json.result,info:json.result_info};};
const projects=await read('pages/projects?per_page=10');if(!projects.ok)throw Error('Cannot inspect existing Pages projects: '+JSON.stringify(projects));
const proof={checkedAt:new Date().toISOString(),readOnly:true,mutations:0,newProductsOrPlans:0,existingProjects:projects.value.length,projects:[],currentCycleUsageReviewed:false,authorizedCeilingUSD:10};
for(const name of ['usefulverse','usefulverse-tools']){
 const p=projects.value.find(p=>p.name===name);if(!p)throw Error('Expected project missing');
 const d=await read('pages/projects/'+name+'/deployments?per_page=10');if(!d.ok)throw Error('Cannot inspect deployments: '+JSON.stringify(d));
 proof.projects.push({name,sourceType:p.source?.type??null,productionBuildsEnabled:p.source?.config?.production_deployments_enabled??null,previewSetting:p.source?.config?.preview_deployment_setting??null,productionBranch:p.production_branch,productionDeployment:p.canonical_deployment?{id:p.canonical_deployment.id,created_on:p.canonical_deployment.created_on,environment:p.canonical_deployment.environment}:null,recentDeployments:d.value.map(d=>({id:d.id,created_on:d.created_on,environment:d.environment,branch:d.deployment_trigger?.metadata?.branch,commit:d.deployment_trigger?.metadata?.commit_hash,status:d.latest_stage?.status}))});
}
const subscriptions=await read('subscriptions'),info=await read('billable-usage/info');
proof.billingReadPermissions={subscriptions:subscriptions.ok,usageInfo:info.ok,...(!subscriptions.ok?{subscriptionsError:subscriptions}:{}),...(!info.ok?{usageInfoError:info}:{})};
if(subscriptions.ok&&info.ok){
 const active=subscriptions.value.filter(s=>['paid','active'].includes(String(s.state).toLowerCase()));
 const workers=active.find(s=>/workers/i.test(s.rate_plan?.public_name??s.plan?.name??''));
 proof.workersPaidExistingConfirmed=Boolean(workers);
 const monthly=active.filter(s=>s.frequency==='monthly');
 const fixed=monthly.reduce((sum,s)=>sum+Number(s.price??0),0);
 proof.existingMonthlyPlansWithinCeiling=Number.isFinite(fixed)&&fixed<=10;
 const subscription=info.value.subscriptions?.find(s=>!s.end_timestamp)??info.value.subscriptions?.at(-1);
 const currentStarts=monthly.map(s=>new Date(s.current_period_start)).filter(d=>!Number.isNaN(d.getTime()));
 const stamp=subscription?.billing_cycle_anchor_timestamp;
 const anchor=typeof stamp==='number'?new Date(stamp*(stamp<1e12?1000:1)):new Date(stamp);
 if(!Number.isNaN(anchor.getTime())){
  const now=new Date(),day=anchor.getUTCDate();let year=now.getUTCFullYear(),month=now.getUTCMonth();
  let start=new Date(Date.UTC(year,month,Math.min(day,new Date(Date.UTC(year,month+1,0)).getUTCDate())));
  if(start>now){month--;start=new Date(Date.UTC(year,month,Math.min(day,new Date(Date.UTC(year,month+1,0)).getUTCDate())));}
  if(currentStarts.length===monthly.length&&currentStarts.length)start=new Date(Math.min(...currentStarts.map(d=>d.getTime())));
  const usage=await read('billable-usage?from='+start.toISOString().slice(0,10)+'&to='+now.toISOString().slice(0,10));
  proof.billingReadPermissions.usage=usage.ok;
  if(usage.ok&&Array.isArray(usage.value)&&usage.value.every(r=>Number.isFinite(Number(r.BilledCost))&&r.BillingCurrency==='USD')){
   const positiveCost=usage.value.reduce((sum,r)=>sum+Math.max(0,Number(r.BilledCost)),0);
   proof.currentCycleUsageReviewed=true;proof.observedTotalBelowAuthorizedCeiling=fixed+positiveCost<=10;
  }else if(!usage.ok)proof.billingReadPermissions.usageError=usage;
 }
}
proof.note='Private billing rows and monetary details are not written. Static-only upload incremental cost must still be demonstrated; daily window not bypassed.';
await writeFile(output,JSON.stringify(proof,null,2)+'\n');
console.log(JSON.stringify({...proof,projects:proof.projects.map(p=>({...p,recentDeployments:p.recentDeployments.slice(0,2),recentDeploymentCount:p.recentDeployments.length}))}));
