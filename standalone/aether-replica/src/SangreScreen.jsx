import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { panelCorners, quadMatrix } from './screen-projection.js';
import './screen-ui.css';

const periods=['Today','Week','Month','3 Months'];
const metrics=[
  {name:'Uric Acid',value:359.5,unit:'µmol/L',color:'#f77555',kind:'bars'},
  {name:'Blood sugar',value:9.88,unit:'mmol/L',color:'#6d608d',kind:'ring'},
  {name:'LDL-C',value:3.57,unit:'mmol/L',color:'#49b4cf',kind:'bars'},
  {name:'HDL-C',value:1.77,unit:'mmol/L',color:'#e7ae52',kind:'line'},
];
const history=[{date:'06 Oct · 09:41',value:'9.88'},{date:'05 Oct · 09:32',value:'9.62'},{date:'04 Oct · 08:58',value:'9.71'}];

function Chart({metric,period,large=false}) {
  const samples=[.38,.71,.48,.84,.56,.34,.66,.92,.53,.77,.42,.62].map((v,i)=>.18+((v+period*.12+i*.018)% .8));
  return <svg className={`screen-chart ${large?'is-large':''}`} viewBox="0 0 200 110" aria-hidden="true" key={`${metric.name}-${period}`}>
    {metric.kind==='ring'?<>
      <circle className="screen-ring-track" cx="100" cy="55" r="44"/>
      <circle className="screen-ring" cx="100" cy="55" r="44" stroke={metric.color} pathLength="100" strokeDasharray={`${62+period*6} 100`}/>
      <text x="100" y="56" textAnchor="middle" className="screen-gauge-value">{(metric.value+period*.08).toFixed(2)}</text>
      <text x="100" y="73" textAnchor="middle" className="screen-gauge-unit">{metric.unit}</text>
    </>:metric.kind==='bars'?samples.map((v,i)=><rect key={i} x={i*16+7} y={100-v*85} width="5" height={v*85} rx="2.5" fill={i%3===0?metric.color:i%3===1?'#f6bc62':'#e8e9e9'} style={{animationDelay:`${i*25}ms`}}/>):<>
      {[25,50,75,100].map(y=><path key={y} d={`M0 ${y} H200`} stroke="#e7e8e8"/>)}
      <polyline className="screen-line" points={samples.map((v,i)=>`${i*18},${100-v*82}`).join(' ')} fill="none" stroke={metric.color} strokeWidth="3" pathLength="100"/>
      <polyline points={samples.map((v,i)=>`${i*18},${25+v*68}`).join(' ')} fill="none" stroke="#6d608d" strokeWidth="2"/>
    </>}
  </svg>;
}

function DeviceUI({state,actions}) {
  const {period,view,selected,run,unit,records,entry}=state;
  const metric=metrics[selected];
  return <div className="device-ui" lang="en" data-view={view}>
    <header className="screen-header"><strong role="heading" aria-level="2" tabIndex={-1}>{view==='dashboard'?'Dashboard':view==='detail'?metric.name:view==='history'?'History':view==='test'?'New test':'Settings'}</strong><span>DEMO<span className="screen-status-dot"/></span></header>
    <div className="screen-content" data-lenis-prevent={view==='history'?'':undefined}>
      {view==='dashboard'?<>
        <div className="screen-periods" role="group" aria-label="Time range">{periods.map((p,i)=><button type="button" key={p} aria-pressed={period===i} onClick={()=>actions.period(i)}>{p}</button>)}</div>
        <div className="screen-metrics">{metrics.map((m,i)=><button type="button" className="screen-metric" key={m.name} style={{'--metric-color':m.color}} onClick={()=>actions.detail(i)} aria-label={`View ${m.name} details`}>
          <span className="screen-metric-heading">{unit==='short'?['UA','GLU','LDL-C','HDL-C'][i]:m.name}<span className="screen-metric-dot"/></span><Chart metric={m} period={period}/>
          {m.kind!=='ring'&&<span className="screen-metric-value">{(m.value+period*(i===0?2.4:.08)).toFixed(i===0?1:2)} <small>{m.unit}</small></span>}
        </button>)}</div>
        <div className="screen-extension"><button type="button" className="screen-next" onClick={actions.test} aria-label="Start demo test"><span>YOUR NEXT CHECK-IN</span><strong>Tomorrow, 09:00</strong><span className="screen-start">Start demo test <span>+</span></span></button>
          <div className="screen-lipids"><span>Lipid profile</span><div>LDL-C <strong>3.57</strong></div><div>HDL-C <strong>1.77</strong></div></div>
        </div>
      </>:view==='detail'?<div className="screen-detail"><button type="button" className="screen-back" onClick={()=>actions.view('dashboard')}>← Dashboard</button><p>{entry?entry.date:periods[period]} · Demo trend</p><strong className="screen-detail-value">{entry?entry.value:(metric.value+period*(selected===0?2.4:.08)).toFixed(selected===0?1:2)} <small>{metric.unit}</small></strong><Chart metric={{...metric,kind:'line'}} period={period} large/><div className="screen-periods" role="group" aria-label="Detail time range">{periods.map((p,i)=><button key={p} type="button" aria-pressed={period===i} onClick={()=>actions.period(i)}>{p}</button>)}</div><p>Explore the trend by choosing a time range.</p></div>
      :view==='history'?<div className="screen-history"><p>Recent check-ins · Demo data</p>{records.map((entry,i)=><button key={`${entry.date}-${i}`} type="button" onClick={()=>actions.detail(1,entry)}><span>{entry.date}<small>Blood sugar</small></span><strong>{entry.value}<small>mmol/L</small></strong></button>)}</div>
      :view==='test'?<div className="screen-test" data-run={run}><span className="screen-test-label">ILLUSTRATIVE TEST</span><div className={`screen-scanner ${run==='running'?'is-running':''}`}><span/><span/><span/></div><h2 aria-live="polite">{run==='running'?'Reading the strip…':run==='complete'?'Demo complete':'Ready for a check-in'}</h2><p>{run==='running'?'Following the sample through the sensing module.':run==='complete'?'Your demonstration reading is saved in History.':'Try the on-screen sequence with a sample strip.'}</p><progress max="100" value={run==='complete'?100:run==='running'?undefined:0} aria-label="Demo test progress"/>{run==='running'?<button type="button" className="screen-primary" onClick={actions.cancel}>Cancel demo</button>:<button type="button" className="screen-primary" onClick={run==='complete'?()=>actions.view('history'):actions.start}>{run==='complete'?'View saved reading':'Run demo test'}</button>}</div>
      :<div className="screen-settings"><p>Display preferences</p><label>Trend labels<select value={unit} onChange={e=>actions.unit(e.target.value)}><option value="full">Full names</option><option value="short">Short names</option></select></label><p className="screen-preference-preview">Preview: {unit==='full'?'Blood sugar':'GLU'}</p><button type="button" className="screen-back" onClick={actions.reset}>Reset demo</button></div>}
    </div>
    <footer className="screen-footer"><nav aria-label="Device navigation">{[['dashboard','Overview'],['history','History'],['test','+ Test'],['settings','Settings']].map(([v,label])=><button key={v} type="button" aria-current={view===v?'page':undefined} onClick={()=>v==='test'?actions.test():actions.view(v)}>{label}</button>)}</nav><span>Interactive prototype · Demo data</span></footer>
  </div>;
}

export const SangreScreen=forwardRef(function SangreScreen(_,ref) {
  const host=useRef(null),panels=useRef([]),live=useRef(null),timer=useRef(null),cache=useRef(new WeakMap());
  const [state,setState]=useState({period:0,view:'dashboard',selected:0,run:'idle',unit:'full',records:history,entry:null});
  const change=patch=>setState(previous=>({...previous,...patch}));
  const cancel=()=>{clearTimeout(timer.current);timer.current=null;change({run:'idle'});};
  const actions={period:period=>change({period,entry:null}),view:view=>change({view}),detail:(selected,entry=null)=>change({selected,view:'detail',entry}),unit:unit=>change({unit}),
    test:()=>change({view:'test'}),cancel,start:()=>{
      clearTimeout(timer.current);change({run:'running'});
      timer.current=setTimeout(()=>{timer.current=null;setState(s=>({...s,run:'complete',records:[{date:'Just now · Demo',value:'9.88'},...s.records]}));},3200);
    },reset:()=>{clearTimeout(timer.current);change({period:0,view:'dashboard',selected:0,run:'idle',unit:'full',records:history,entry:null});}};
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  useEffect(()=>{
    if(live.current&&!live.current.inert&&!live.current.hidden){
      live.current.querySelector('.screen-content').scrollTop=0;
      live.current.querySelector('[role="heading"]').focus({preventScroll:true});
    }
  },[state.view]);
  useImperativeHandle(ref,()=>({
    update(s,bridge,enabled){
      const root=host.current;
      if(!enabled||!s?.pose){root.hidden=true;return;}
      root.hidden=false;
      const {THREE:T,gl}=bridge,w=gl.sizes.width,h=gl.sizes.height;
      let data=cache.current.get(s);
      if(!data){data=['display-upper-pixels','display-lower-pixels'].map(name=>{const mesh=s.device.getObjectByName(name);return {mesh,corners:panelCorners(mesh,T)};});cache.current.set(s,data);}
      s.device.updateMatrixWorld(true);s.camera.updateMatrixWorld(true);
      const projected=data.map(({mesh,corners})=>{
        const world=corners.map(c=>c.clone().applyMatrix4(mesh.matrixWorld));
        const height=600*world[0].distanceTo(world[3])/world[0].distanceTo(world[1]);
        const quad=world.map(c=>{const v=c.clone().project(s.camera);return[(v.x+1)*w/2,(1-v.y)*h/2];});
        const facing=(quad[1][0]-quad[0][0])*(quad[3][1]-quad[0][1])-(quad[1][1]-quad[0][1])*(quad[3][0]-quad[0][0])>1;
        return {quad,height,facing};
      });
      const opening=s.pose.unfold,extension=Math.max(0,Math.min(1,(opening-.5)/.5));
      const height=projected[1].height+projected[0].height*extension;
      root.style.setProperty('--screen-height',`${height}px`);
      root.style.setProperty('--screen-half',`${projected[1].height}px`);
      root.style.setProperty('--screen-extension',extension);
      root.style.setProperty('--screen-shift',`${projected[0].height*extension}px`);
      root.style.setProperty('--screen-reveal',`${projected[0].height*(1-extension)}px`);
      const interactive=s.pose.closeup>.98&&opening>.999;
      root.classList.toggle('is-interactive',interactive);
      root.dataset.unfold=opening.toFixed(3);
      data.forEach(({mesh},i)=>{
        const panel=panels.current[i],p=projected[i];
        panel.hidden=!p.facing;panel.style.height=`${p.height}px`;
        panel.style.transform=`matrix3d(${quadMatrix(p.quad,600,p.height).join(',')})`;
        mesh.visible=!p.facing; // DOM uses the actual screen plane; the GLB material remains a transition fallback.
      });
      live.current.inert=!interactive;
      live.current.hidden=!interactive;
      live.current.style.height=`${height}px`;
      live.current.style.transform=`matrix3d(${quadMatrix([projected[0].quad[0],projected[0].quad[1],projected[1].quad[2],projected[1].quad[3]],600,height).join(',')})`;
      root.setAttribute('aria-hidden',String(!interactive));
    },
    hide(s){host.current.hidden=true;live.current.inert=true;if(s)for(const name of ['display-upper-pixels','display-lower-pixels'])s.device.getObjectByName(name).visible=true;},
  }));
  return <div ref={host} className="sangre-screen-overlay" hidden>
    {[0,1].map(i=><div className={`screen-surface screen-mirror screen-mirror-${i}`} key={i} ref={el=>{panels.current[i]=el;}} inert aria-hidden="true"><DeviceUI state={state} actions={actions}/></div>)}
    <section ref={live} className="screen-surface screen-live" aria-label="SANGRE interactive screen" inert hidden><DeviceUI state={state} actions={actions}/></section>
  </div>;
});
