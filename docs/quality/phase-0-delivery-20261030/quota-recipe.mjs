import{writeFile}from'node:fs/promises';
const account='c32922f3c1e392caba10a5727d770468';
const read=async path=>{const r=await fetch('https://api.cloudflare.com/client/v4/accounts/'+account+'/'+path,{headers:{Authorization:'Bearer '+process.env.CLOUDFLARE_API_TOKEN}}),j=await r.json();if(!r.ok||!j.success)throw Error('Read failed: '+r.status+' '+JSON.stringify(j.errors?.map(e=>({code:e.code,message:e.message}))));return j.result;};
const projects=await read('pages/projects?per_page=10');if(projects.length>=10)throw Error('Project pagination must be extended');
const now=new Date(),start=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),1)-7*3600_000);
let count=0,pages=0;const own=[];
for(const project of projects){for(let page=1;page<=51;page++){
 const rows=await read('pages/projects/'+project.name+'/deployments?per_page=10&page='+page);pages++;
 count+=rows.filter(d=>new Date(d.created_on)>=start).length;
 if(['usefulverse','usefulverse-tools'].includes(project.name))own.push(...rows.map(d=>({project:project.name,id:d.id,created_on:d.created_on,environment:d.environment,branch:d.deployment_trigger?.metadata?.branch,status:d.latest_stage?.status})));
 if(count>=500)throw Error('Monthly deployment event count reaches conservative free budget');
 if(rows.length<10||new Date(rows.at(-1).created_on)<start)break;
 if(page===51)throw Error('Incomplete deployment pagination');
}}
own.sort((a,b)=>Date.parse(b.created_on)-Date.parse(a.created_on));
const report={checkedAt:now.toISOString(),readOnly:true,mutations:0,existingProjects:projects.length,queryPages:pages,conservativeDeploymentEventsThisMonth:count,conservativeFreeBuildBudget:500,oneAdditionalEventWithinBudget:count+1<=500,latestUsefulVerseEvents:own.slice(0,4),nextUsefulVerseDeploymentNotBefore:'2026-10-30T00:00:00+07:00',directUploadOnly:true,buildMinutesEstimated:0,notes:['All deployment events counted conservatively; Git sources absent on UsefulVerse projects.','No quota change, paid plan or new service. Event count is not a billable-minute measurement.']};
await writeFile('.qa-phase0/quota.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
