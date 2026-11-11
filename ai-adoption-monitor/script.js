const TARGET={adoption:60,accuracy:85,latency:2.0};
let tools=[
  {name:"Code assistant",dept:"Engineering",licensed:80,active:68,accuracy:91,latency:1.2,hours:120},
  {name:"Support chatbot",dept:"Support",licensed:40,active:22,accuracy:82,latency:2.6,hours:60},
  {name:"Sales email writer",dept:"Sales",licensed:35,active:14,accuracy:88,latency:1.4,hours:25},
  {name:"Resume screener",dept:"HR",licensed:12,active:9,accuracy:79,latency:1.9,hours:18}
];
const $=id=>document.getElementById(id);
const rate=t=>t.licensed?Math.round(t.active/t.licensed*1000)/10:0;
function status(t){
  const issues=[];
  if(rate(t)<TARGET.adoption)issues.push("Low adoption ("+rate(t)+"%)");
  if(t.accuracy<TARGET.accuracy)issues.push("Accuracy below "+TARGET.accuracy+"% ("+t.accuracy+"%)");
  if(t.latency>TARGET.latency)issues.push("Slow responses ("+t.latency+"s)");
  return issues;
}
function bars(el,list,key,target){
  el.innerHTML=list.length?"":'<div class="empty">No tools to show.</div>';
  list.forEach(t=>{
    const v=key(t),c=v>=target?"var(--good)":"var(--warn)";
    el.insertAdjacentHTML("beforeend",
      `<div class="bar"><span class="name" title="${esc(t.name)}">${esc(t.name)}</span>
       <div class="track"><div class="fill" style="width:${Math.min(v,100)}%;background:${c}"></div><div class="mark" style="left:${target}%"></div></div>
       <span>${v}%</span></div>`);
  });
}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function render(){
  const f=$("filter").value;
  const list=f==="All"?tools:tools.filter(t=>t.dept===f);
  const n=list.length||1;
  const avg=k=>Math.round(list.reduce((s,t)=>s+k(t),0)/n*10)/10;
  const healthy=list.filter(t=>!status(t).length).length;
  $("kpis").innerHTML=[
    [list.length,"Tools tracked"],
    [avg(rate)+"%","Average adoption"],
    [avg(t=>t.accuracy)+"%","Average accuracy"],
    [list.reduce((s,t)=>s+t.hours,0),"Hours saved per week"],
    [healthy+" / "+list.length,"Tools meeting all targets"]
  ].map(([b,s])=>`<div class="kpi"><b>${b}</b><span>${s}</span></div>`).join("");
  bars($("adoption"),list,rate,TARGET.adoption);
  bars($("accuracy"),list,t=>t.accuracy,TARGET.accuracy);
  const alerts=list.flatMap(t=>status(t).map(m=>`<li><b>${esc(t.name)}:</b> ${m}</li>`));
  $("alerts").innerHTML=alerts.length?alerts.join(""):'<li class="good">All tools are meeting their targets.</li>';
  $("rows").innerHTML=list.length?list.map(t=>{
    const s=status(t),cls=s.length===0?"good":s.length===1?"warn":"bad",label=s.length===0?"Healthy":s.length===1?"Watch":"At risk";
    return `<tr><td>${esc(t.name)}</td><td>${t.dept}</td><td>${rate(t)}%</td><td>${t.accuracy}%</td><td>${t.latency}s</td><td>${t.hours}</td>
      <td><span class="pill ${cls}">${label}</span></td>
      <td><button class="ghost small" data-del="${esc(t.name)}">Remove</button></td></tr>`;
  }).join(""):'<tr><td colspan="8" class="empty">No tools in this department yet. Add one above.</td></tr>';
}
$("form").addEventListener("submit",e=>{
  e.preventDefault();
  const d=Object.fromEntries(new FormData(e.target));
  const t={name:d.name.trim(),dept:d.dept,licensed:+d.licensed,active:Math.min(+d.active,+d.licensed),
    accuracy:+d.accuracy,latency:+d.latency,hours:+d.hours};
  const i=tools.findIndex(x=>x.name.toLowerCase()===t.name.toLowerCase());
  if(i>=0)tools[i]=t;else tools.push(t);
  e.target.name.value="";render();
});
$("rows").addEventListener("click",e=>{
  const n=e.target.dataset.del;
  if(n){tools=tools.filter(t=>t.name!==n);render();}
});
$("filter").addEventListener("change",render);
["Engineering","Support","Sales","HR","Finance"].forEach(d=>$("filter").insertAdjacentHTML("beforeend",`<option>${d}</option>`));
render();
