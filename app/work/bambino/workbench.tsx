"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { chapters, finishes, iterations, partLabels, type Finish, type Locale } from "./workbench-data";
import type { WorkbenchApi, WorkbenchState } from "./workbench-scene";
import "./workbench.css";

function Arrow({ back = false }: { back?: boolean }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" style={back ? { transform: "rotate(180deg)" } : undefined}><path d="M4 12h15M13 5l7 7-7 7" /></svg>;
}

export default function BambinoWorkbench({ locale = "zh" }: { locale?: Locale }) {
  const en = locale === "en";
  const t = (zh: string, english: string) => en ? english : zh;
  const [chapter, setChapter] = useState(0);
  const [finish, setFinish] = useState<Finish>("steel");
  const [iteration, setIteration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [lock, setLock] = useState(0);
  const [lockPlaying, setLockPlaying] = useState(false);
  const [explosion, setExplosion] = useState(0.7);
  const [focus, setFocus] = useState(false);
  const [reading, setReading] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [selected, setSelected] = useState("");
  const [retry, setRetry] = useState(0);
  const viewport = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const api = useRef<WorkbenchApi | null>(null);
  const modelState = useRef<WorkbenchState>({ chapter, finish, explosion, lock, focus, active: true });
  const state: WorkbenchState = { chapter, finish, explosion, lock, focus, active: !reading && !(chapter === 2 && iteration < 3) };

  useEffect(() => {
    if (!viewport.current) return;
    const host = viewport.current; let mounted = true; let sceneApi: WorkbenchApi | null = null;
    import("./workbench-scene").then(({ createWorkbench }) => createWorkbench(host, {
      onReady: () => { if (mounted) setStatus("ready"); },
      onError: () => { if (mounted) setStatus("error"); },
      onPart: (name) => { if (mounted) setSelected(name); },
      onMarker: (x, y, visible) => { if (marker.current) { marker.current.style.transform = `translate(${x}px, ${y}px)`; marker.current.style.opacity = visible ? "1" : "0"; } },
    })).then((instance) => { if (!mounted) { instance.dispose(); return; } sceneApi = instance; api.current = instance; instance.update(modelState.current); }).catch(() => { if (mounted) setStatus("error"); });
    return () => { mounted = false; sceneApi?.dispose(); api.current = null; };
  }, [retry]);

  useEffect(() => { modelState.current = { chapter, finish, explosion, lock, focus, active: !reading && !(chapter === 2 && iteration < 3) }; api.current?.update(modelState.current); }, [chapter, finish, explosion, lock, focus, reading, iteration]);
  useEffect(() => {
    const sync = () => { const index = chapters.findIndex(item => `#${item.id}` === window.location.hash); if (index >= 0) { setChapter(index); setFocus(index === 1); } };
    const id = requestAnimationFrame(sync); window.addEventListener("hashchange", sync);
    return () => { cancelAnimationFrame(id); window.removeEventListener("hashchange", sync); };
  }, []);
  useEffect(() => {
    if (!playing || chapter !== 2 || reading) return;
    const timer = window.setTimeout(() => { if (iteration === 3) setPlaying(false); else setIteration(iteration + 1); }, 3500);
    return () => window.clearTimeout(timer);
  }, [playing, chapter, reading, iteration]);
  useEffect(() => {
    if (!lockPlaying || chapter !== 3 || reading) return;
    let frame = 0; const started = performance.now();
    const tick = (now: number) => { const progress = Math.min(1, (now - started) / 3200); setLock(progress); if (progress < 1) frame = requestAnimationFrame(tick); else setLockPlaying(false); };
    frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, [lockPlaying, chapter, reading]);

  function navigate(index: number) {
    const next = Math.max(0, Math.min(4, index)); setChapter(next); setPlaying(false); setLockPlaying(false); setFocus(next === 1); setSelected("");
    api.current?.selectPart(""); window.history.replaceState(null, "", `#${chapters[next].id}`);
    if (reading) document.getElementById(`read-${chapters[next].id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function choosePart(key: string) { setSelected(key); api.current?.selectPart(key); }
  const stage = iterations[iteration];
  const modelLabel = chapter === 1 ? t("原版 BAMBINO · 外观示意", "ORIGINAL BAMBINO · FORM REFERENCE") : t("BAMBINO V2 · 最终设计", "BAMBINO V2 · FINAL DESIGN");
  const currentFinish = finishes.find(item => item.id === finish)!;

  return <main className={`bw ${reading ? "bw--reading" : ""}`} lang={en ? "en" : "zh-CN"}>
    <a className="bw-skip" href="#bw-content">{t("跳到项目说明", "Skip to project content")}</a>
    <header className="bw-header">
      <Link className="bw-back" href={en ? "/en?archive=X2-01" : "/?archive=X2-01"}><Arrow back /><span>{t("返回档案架", "Back to archive")}</span></Link>
      <Link className="bw-name" href={en ? "/en" : "/"}>WENHOU YAN<span> / BAMBINO V2</span></Link>
      <div className="bw-header-actions">
        <button onClick={() => { setReading(value => !value); setPlaying(false); setLockPlaying(false); }} aria-pressed={reading}>{reading ? t("返回工作台", "3D workbench") : t("阅读模式", "Reading mode")}</button>
        <Link href={`${en ? "/work/bambino" : "/en/work/bambino"}#${chapters[chapter].id}`} hrefLang={en ? "zh-CN" : "en"}>{en ? "中文" : "EN"}</Link>
      </div>
    </header>

    <div className="bw-layout">
      <div className={`bw-stage ${chapter === 2 && iteration < 3 ? "bw-stage--evidence" : ""}`} aria-label={t("产品工作台", "Product workbench")}>
        <div className="bw-model-id"><span className="bw-dot" />{modelLabel}</div>
        <div ref={viewport} className="bw-canvas" tabIndex={0} aria-label={t("三维模型：拖动旋转，滚轮缩放；方向键旋转，加减键缩放，Home 重置", "3D model: drag to orbit, scroll to zoom. Arrow keys rotate, plus/minus zoom, Home resets.")} data-testid="model-viewport" data-status={status} data-model={chapter === 1 ? "original" : "v2"} data-explosion={chapter === 4 ? explosion.toFixed(2) : "0"} />
        <span ref={marker} className="bw-marker" hidden={chapter !== 3}><i /><span>{t("拇指支点", "THUMB SUPPORT")}</span></span>
        {status !== "ready" && <div className="bw-loading" role="status">
          <img src="/portfolio/bambino-cutout.png" alt="BAMBINO V2" />
          <p>{status === "loading" ? t("正在准备三维工作台…", "Preparing the workbench…") : t("此设备暂时无法显示三维模型，项目内容仍可阅读。", "3D is unavailable on this device. The project remains readable.")}</p>
          {status === "error" && <button onClick={() => { setStatus("loading"); setRetry(value => value + 1); }}>{t("重新加载模型", "Retry 3D")}</button>}
        </div>}
        {chapter === 2 && iteration < 3 && <div className="bw-evidence-stage">
          {iterations.slice(0, 3).map((item, index) => <figure key={item.image} className={index === iteration ? "is-active" : ""} aria-hidden={index !== iteration}>
            <img src={item.image} alt={en ? item.en : item.zh} />
            <figcaption><span>0{index + 1} / 04</span>{t("真实原型记录", "PHYSICAL PROTOTYPE RECORD")}</figcaption>
          </figure>)}
        </div>}
        <div className="bw-stage-bottom"><span>{chapter === 2 && iteration < 3 ? t("原型照片 · 阶段对照", "Prototype photographs · stage comparison") : t("拖动旋转 / 滚轮缩放", "DRAG TO ORBIT / SCROLL TO ZOOM")}</span><button onClick={() => api.current?.reset()} disabled={status !== "ready" || !state.active} aria-label={t("重置模型视角", "Reset model view")}>{t("重置视角", "Reset view")}<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true"><path d="M4 7a6 6 0 1 1-1 5M4 3v4h4" /></svg></button></div>
      </div>

      <div className="bw-content" id="bw-content">
        <div className="bw-chapter-count" aria-live="polite"><span>0{chapter + 1}</span><span>/ 05</span><span>{chapters[chapter].label}</span></div>
        <section id="read-overview" hidden={!reading && chapter !== 0} className="bw-panel">
          <h1>BAMBINO<span>V2</span></h1>
          <h2>{t("让锁定更稳，\n让动作得到回应。", "A steadier lock.\nA clearer response.")}</h2>
          <p className="bw-intro">{t("围绕一只手的动作，重新思考家用意式咖啡机的冲煮头、操作界面与机械反馈。", "A home espresso-machine redesign, built around the relationship between the hand, the group head and physical feedback.")}</p>
          <dl className="bw-facts"><div><dt>{t("方向", "Discipline")}</dt><dd>{t("产品再设计", "Product redesign")}</dd></div><div><dt>{t("周期", "Duration")}</dt><dd>{t("12 周", "12 weeks")}</dd></div><div><dt>{t("职责", "Role")}</dt><dd>{t("独立项目", "Independent project")}</dd></div></dl>
          <fieldset className="bw-finishes"><legend>{t("材质与配色", "Material & finish")}<span>{en ? currentFinish.en : currentFinish.zh}</span></legend><div>{finishes.map(item => <button key={item.id} style={{ "--swatch": item.swatch } as CSSProperties} aria-label={en ? item.en : item.zh} aria-pressed={finish === item.id} onClick={() => setFinish(item.id)}><i /></button>)}</div></fieldset>
          <button className="bw-primary" onClick={() => navigate(1)}>{t("从问题开始", "Start with the problem")}<Arrow /></button>
        </section>

        <section id="read-problem" hidden={!reading && chapter !== 1} className="bw-panel">
          <h2>{t("锁住手柄，\n不该推走机器。", "Lock the handle.\nKeep the machine still.")}</h2>
          <p className="bw-intro">{t("一台小型咖啡机，不该在锁定手柄时被自己推走。原有旋转动作将反力传给机身，使用者往往需要另一只手扶住机器。", "A compact espresso machine should not move away while the portafilter locks. The rotational action transfers a reaction to the body, often calling for a second hand to steady it.")}</p>
          <ol className="bw-observations"><li><span>01</span><div><h3>{t("旋转与机身位移", "Rotation and movement")}</h3><p>{t("观察施力方向与机身稳定性的关系。", "Observe how turning the handle affects body stability.")}</p></div></li><li><span>02</span><div><h3>{t("手部支撑位置", "A place for the thumb")}</h3><p>{t("寻找同一只手可以接触的反向支点。", "Find an opposing support reachable by the same hand.")}</p></div></li><li><span>03</span><div><h3>{t("状态如何被感知", "Legible physical states")}</h3><p>{t("让动作、结构位置与反馈对应。", "Connect the action to a clear physical state.")}</p></div></li></ol>
          <button className="bw-text-button" onClick={() => setFocus(value => !value)}>{focus ? t("查看原版整机", "View original body") : t("靠近原版冲煮头", "Inspect original group head")}<Arrow /></button>
          <figure className="bw-reference"><img src="/bambino/original-reference.webp" alt={t("Breville Bambino 官方外观参考", "Official Breville Bambino reference")} loading="lazy" /><figcaption>{t("原版模型为外观示意。", "The original model is a form reference.")}<a href="https://www.breville.com/en-au/product/bes450" target="_blank" rel="noreferrer">{t("查看官方产品参考", "Official product reference")}</a></figcaption></figure>
        </section>

        <section id="read-iterations" hidden={!reading && chapter !== 2} className="bw-panel">
          <h2>{reading ? t("从粗模走向完整方案。", "From rough volume to final form.") : en ? stage.enTitle : stage.zhTitle}</h2>
          <p className="bw-intro">{en ? stage.enBody : stage.zhBody}</p>
          <div className="bw-timeline" aria-label={t("原型演进阶段", "Prototype stages")}>{iterations.map((item, index) => <button key={item.en} aria-pressed={iteration === index} onClick={() => { setIteration(index); setPlaying(false); }}><span>0{index + 1}</span><i /><strong>{en ? item.en : item.zh}</strong></button>)}</div>
          <div className="bw-finding" aria-live="polite"><span>{t("这一轮关注", "THIS STAGE")}</span><p>{en ? stage.enFinding : stage.zhFinding}</p></div>
          <button className="bw-primary" onClick={() => { if (iteration === 3) setIteration(0); setPlaying(value => !value); }} aria-pressed={playing}>{playing ? t("暂停演进", "Pause sequence") : t("播放演进过程", "Play the sequence")}<span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span></button>
          <p className="bw-note">{t("每一阶段保留真实原型证据；最终材质用于表达设计意图。", "Physical records document the iterations; final materials communicate the design intent.")}</p>
          {reading && <div className="bw-reading-gallery">{iterations.map(item => <figure key={item.image}><img src={item.image} alt={en ? item.en : item.zh} loading="lazy" /><figcaption>{en ? item.enBody : item.zhBody}</figcaption></figure>)}</div>}
        </section>

        <section id="read-locking" hidden={!reading && chapter !== 3} className="bw-panel">
          <h2>{t("一个支点，\n连接手与结构。", "One support.\nHand meets structure.")}</h2>
          <p className="bw-intro">{t("握住手柄，让大拇指抵住冲煮头旁的突出结构。手柄转动时，这个接触位置成为动作的一部分。", "Grip the handle and rest the thumb against the projecting support beside the group head. This contact becomes part of the turning action.")}</p>
          <div className="bw-motion-steps"><span className={lock < 0.35 ? "is-current" : ""}>{t("接近", "Approach")}</span><span className={lock >= 0.35 && lock < 0.95 ? "is-current" : ""}>{t("支撑与转动", "Support & turn")}</span><span className={lock >= 0.95 ? "is-current" : ""}>{t("就位", "Seated")}</span></div>
          <label className="bw-slider"><span>{t("操作进度", "Interaction progress")}<output>{Math.round(lock * 100)}%</output></span><input type="range" min="0" max="1" step="0.01" value={lock} onChange={event => { setLockPlaying(false); setLock(Number(event.target.value)); }} /></label>
          <div className="bw-button-row"><button className="bw-primary" onClick={() => { if (lockPlaying) { setLockPlaying(false); return; } setLock(0); setLockPlaying(true); }}>{lockPlaying ? t("暂停动作", "Pause motion") : t("播放锁定示意", "Play locking motion")}<Arrow /></button><button className="bw-text-button" onClick={() => { setLockPlaying(false); setLock(0); }}>{t("复位", "Reset")}</button></div>
          <figure className="bw-lock-reference"><img src="/portfolio/bambino-layer-04.jpg" alt={t("BAMBINO V2 冲煮头与拇指支点渲染", "BAMBINO V2 group head and thumb support")} loading="lazy" /></figure>
          <p className="bw-note">{t("54 mm 粉碗与手柄为交互示意。动画说明可见操作，不代表内部机构、受力或锁定角度的工程验证。", "The nominal 54 mm basket and handle illustrate the visible action. This is not an engineering validation of the internal mechanism, forces or locking angle.")}</p>
        </section>

        <section id="read-structure" hidden={!reading && chapter !== 4} className="bw-panel">
          <h2>{t("展开结构，\n看见设计的组成。", "Open the assembly.\nRead the design.")}</h2>
          <p className="bw-intro">{t("从完整机身到独立部件，检查外壳、冲煮头、水箱与内部组件的关系。点击模型部件或下方名称，可以定位对应结构。", "Move between the assembled product and its components. Select a part in the model or the list to inspect its place in the design.")}</p>
          <label className="bw-slider"><span>{t("拆解程度", "Exploded view")}<output>{Math.round(explosion * 100)}%</output></span><input type="range" min="0" max="1" step="0.01" value={explosion} onChange={event => setExplosion(Number(event.target.value))} /></label>
          <div className="bw-button-row"><button className="bw-text-button" onClick={() => setExplosion(0)}>{t("完整组装", "Assemble")}</button><button className="bw-text-button" onClick={() => setExplosion(1)}>{t("全部展开", "Explode all")}</button></div>
          <div className="bw-parts" aria-label={t("部件选择", "Select a component")}>{["左侧", "顶部", "group head", "方水箱", "污水池", "PCB"].map(key => <button key={key} onClick={() => choosePart(key)} aria-pressed={selected === key}>{partLabels[key][en ? 1 : 0]}</button>)}</div>
          <p className="bw-selected" aria-live="polite">{selected ? partLabels[selected]?.[en ? 1 : 0] ?? selected : t("选择部件以高亮查看", "Select a part to highlight it")}</p>
          <p className="bw-note">{t("爆炸图展示部件分组关系，位移不代表实际装配顺序。", "The exploded view shows component groups; displacement does not prescribe an assembly sequence.")}</p>
          <Link className="bw-next-project" href={en ? "/en/work/simple-uni-life" : "/work/simple-uni-life"}><span>{t("下一个项目", "NEXT PROJECT")}</span><strong>SIMPLE UNI LIFE</strong><Arrow /></Link>
        </section>
      </div>
    </div>

    <footer className="bw-footer"><nav aria-label={t("项目章节", "Project chapters")}>{chapters.map((item, index) => <button key={item.id} aria-current={chapter === index ? "step" : undefined} onClick={() => navigate(index)}><span>0{index + 1}</span><strong>{en ? item.en : item.zh}</strong><i /></button>)}</nav><div className="bw-paging"><button onClick={() => navigate(chapter - 1)} disabled={chapter === 0} aria-label={t("上一章节", "Previous chapter")}><Arrow back /></button><button onClick={() => navigate(chapter + 1)} disabled={chapter === 4} aria-label={t("下一章节", "Next chapter")}><Arrow /></button></div></footer>
  </main>;
}
