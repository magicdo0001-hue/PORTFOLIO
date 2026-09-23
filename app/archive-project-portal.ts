type PortalBridge = {
  prepare(href?: string): Promise<void>;
  rect(): { x: number; y: number; width: number; height: number };
  opening(amount: number): void;
  sound(type: "explode" | "assemble"): (() => void) | undefined;
  unlockAudio(): void;
  suspend(value: boolean): void;
  release(returnToArchive?: boolean): void;
  reduced(): boolean;
};
type ArchiveWindow = Window & { rhine?: { projectPortal: PortalBridge; stats(): { ready: boolean } } };
const projectPath = /^\/(?:en\/)?work\/(?:bambino|sangre|simple-uni-life|battery-packaging|vertical-car-park)$/;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const x = clamp(value); return x * x * (3 - 2 * x); };

// Keep the live archive mounted while a real, independently scrollable project expands above it.
export function installArchiveProjectPortal(archive: HTMLIFrameElement) {
  let phase: "idle" | "preparing" | "opening" | "open" | "closing" = "idle";
  let bridge: PortalBridge | undefined;
  let overlay: HTMLDivElement | undefined, sheet: HTMLDivElement | undefined, project: HTMLIFrameElement | undefined;
  let status: HTMLDivElement | undefined;
  let progress = 0, animation = 0, generation = 0, disposed = false, ownsHistory = false;
  let baseTitle = document.title, overflow = "";
  let siblings: { node: HTMLElement; inert: boolean }[] = [];
  let removeProjectListeners = () => {};
  let stopSound: (() => void) | undefined;
  let source = { x: 0, y: 0, width: 1, height: 1 };
  const marker = "rhineProjectPortal";

  function measure() {
    if (!bridge) return;
    const rect = bridge.rect(), frame = archive.getBoundingClientRect();
    source = { x: frame.x + rect.x, y: frame.y + rect.y, width: rect.width, height: rect.height };
  }
  function paint(value: number) {
    progress = value;
    if (!sheet || !bridge) return;
    bridge.opening(value);
    const expansion = smooth((value - .63) / .37);
    const width = innerWidth, height = innerHeight;
    const startX = source.x + source.width * .12, startY = source.y + source.height * .2;
    const sx = source.width * .76 / width, sy = source.height * .6 / height;
    sheet.style.transform = `translate3d(${startX * (1 - expansion)}px,${startY * (1 - expansion)}px,0) scale(${sx + (1 - sx) * expansion},${sy + (1 - sy) * expansion})`;
    sheet.style.opacity = String(smooth((value - .63) / .10));
    sheet.style.borderRadius = `${12 * (1 - expansion)}px`;
    sheet.style.filter = `brightness(${.78 + .22 * expansion})`;
  }
  function setPhase(next: typeof phase) { phase = next; if (overlay) overlay.dataset.phase = next; }
  function animate(to: number, duration: number, done: () => void) {
    cancelAnimationFrame(animation);
    stopSound?.(); stopSound = undefined;
    const from = progress, began = performance.now();
    let sounded = false;
    if (bridge?.reduced() || matchMedia("(prefers-reduced-motion: reduce)").matches) duration = 0;
    const tick = (now: number) => {
      const t = duration ? clamp((now - began) / duration) : 1;
      const next = from + (to - from) * t;
      // Reuse the viewer's original cues at release / seating, once per direction.
      // Progress-based cues cannot leak out of cancelled loading or a reversed animation.
      if (!sounded && from !== to && (to === 1 ? next >= .18 : next <= .3)) {
        sounded = true;
        const stop = bridge?.sound(to === 1 ? "explode" : "assemble");
        if (duration) stopSound = stop;
      }
      paint(next);
      if (t < 1) animation = requestAnimationFrame(tick); else done();
    };
    animation = requestAnimationFrame(tick);
  }
  function cleanup(returnToArchive = true) {
    cancelAnimationFrame(animation);
    stopSound?.(); stopSound = undefined;
    removeProjectListeners(); removeProjectListeners = () => {};
    bridge?.suspend(false); bridge?.release(returnToArchive);
    overlay?.remove(); overlay = sheet = project = status = undefined;
    siblings.forEach(({ node, inert }) => { node.inert = inert; }); siblings = [];
    document.documentElement.style.overflow = overflow;
    document.title = baseTitle;
    setPhase("idle"); progress = 0;
    if (!disposed) archive.contentDocument?.querySelector<HTMLButtonElement>(".read-file")?.focus({ preventScroll: true });
  }
  function close() {
    if (phase === "idle" || phase === "closing") return;
    generation++;
    if (project) project.inert = true;
    if (status) status.hidden = true;
    bridge?.suspend(false); measure(); setPhase("closing");
    animate(0, 1400 * progress, () => cleanup());
  }
  function requestClose() {
    if (phase === "idle" || phase === "closing") return;
    if (navigator.userActivation.isActive) bridge?.unlockAudio();
    if (ownsHistory && history.state?.[marker]) history.back();
    else {
      const state = { ...history.state }; delete state[marker];
      history.replaceState(state, "", location.pathname + location.search); close();
    }
  }
  function bindProject(doc: Document) {
    const click = (event: MouseEvent) => {
      const link = (event.target as Element)?.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download") || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === "/" || url.pathname === "/en") {
        event.preventDefault(); event.stopImmediatePropagation();
        if (url.hash) window.location.assign(url.href); else requestClose();
      } else if (url.pathname !== project?.contentWindow?.location.pathname) {
        // Other project/language links keep their normal full-page navigation semantics.
        event.preventDefault(); event.stopImmediatePropagation(); window.location.assign(url.href);
      }
    };
    const key = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented || doc.querySelector('[role="dialog"][aria-modal="true"]')) return;
      event.preventDefault(); requestClose();
    };
    doc.addEventListener("click", click, true); doc.addEventListener("keydown", key);
    removeProjectListeners = () => { doc.removeEventListener("click", click, true); doc.removeEventListener("keydown", key); };
  }
  async function waitForPage(frame: HTMLIFrameElement, ticket: number) {
    const began = performance.now();
    while (ticket === generation && !disposed) {
      const doc = frame.contentDocument;
      const main = doc?.querySelector("main");
      const model = doc?.querySelector<HTMLElement>("[data-testid=model-viewport]");
      if (main && doc?.readyState === "complete" && doc.fonts.status === "loaded" &&
          (!model || model.dataset.status !== "loading" || performance.now() - began > 9000)) {
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        return doc;
      }
      if (performance.now() - began > 18000) throw new Error("Project did not become ready");
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    throw new DOMException("Transition cancelled", "AbortError");
  }
  async function open(href: string, push = true) {
    if (phase !== "idle" || disposed) return;
    const url = new URL(href, location.origin);
    if (url.origin !== location.origin || !projectPath.test(url.pathname)) return;
    bridge = (archive.contentWindow as ArchiveWindow | null)?.rhine?.projectPortal;
    if (!bridge) { location.assign(url.href); return; }
    const ticket = ++generation;
    baseTitle = document.title;
    overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    overlay = document.createElement("div"); overlay.className = "archive-project-portal";
    overlay.setAttribute("role", "dialog"); overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "项目详情 / Project details");
    sheet = document.createElement("div"); sheet.className = "archive-project-portal__sheet";
    project = document.createElement("iframe"); project.title = "项目详情 / Project details"; project.inert = true;
    project.src = url.pathname + url.search + url.hash;
    sheet.append(project); overlay.append(sheet);
    status = document.createElement("div"); status.className = "archive-project-portal__status";
    const message = document.createElement("span"); message.setAttribute("role", "status");
    message.textContent = url.pathname.startsWith("/en/") ? "Preparing the project…" : "正在展开项目…";
    const cancel = document.createElement("button"); cancel.textContent = url.pathname.startsWith("/en/") ? "Cancel" : "取消";
    cancel.onclick = requestClose; status.append(message, cancel); overlay.append(status);
    document.body.append(overlay);
    siblings = Array.from(document.body.children).filter((node): node is HTMLElement => node instanceof HTMLElement && node !== overlay && !["SCRIPT", "STYLE"].includes(node.tagName)).map(node => ({ node, inert: node.inert }));
    siblings.forEach(({ node }) => { node.inert = true; });
    setPhase("preparing"); cancel.focus({ preventScroll: true });
    if (push) {
      ownsHistory = true;
      history.pushState({ ...history.state, [marker]: url.pathname }, "", `${location.pathname}${location.search}#project=${encodeURIComponent(url.pathname)}`);
    }
    try {
      const [doc] = await Promise.all([waitForPage(project, ticket), bridge.prepare(url.pathname)]);
      if (ticket !== generation || disposed) { if (phase === "idle") bridge.release(false); return; }
      bindProject(doc); document.title = doc.title; measure();
      status.hidden = true; setPhase("opening");
      animate(1, 1800, () => {
        setPhase("open"); bridge?.suspend(true);
        if (project) { project.inert = false; project.contentWindow?.focus(); }
      });
    } catch (error) {
      if (ticket !== generation || disposed) { if (phase === "idle") bridge.release(false); return; }
      console.warn("Archive transition unavailable; opening the project directly.", error);
      cleanup(false); location.replace(url.href);
    }
  }
  const message = (event: MessageEvent) => {
    if (event.origin !== location.origin || event.source !== archive.contentWindow || event.data?.type !== "rhine-open-project" || typeof event.data.href !== "string") return;
    void open(event.data.href);
  };
  const pop = (event: PopStateEvent) => {
    const href = event.state?.[marker];
    if (phase === "idle" && !href) return;
    event.stopImmediatePropagation();
    if (typeof href === "string" && phase === "idle") void open(href, false);
    else if (!href) close();
  };
  const key = (event: KeyboardEvent) => { if (event.key === "Escape" && phase !== "idle") { event.preventDefault(); requestClose(); } };
  const resize = () => { if (phase !== "idle") { measure(); paint(progress); } };
  window.addEventListener("message", message);
  window.addEventListener("popstate", pop, true);
  window.addEventListener("keydown", key);
  window.addEventListener("resize", resize);
  let resumeTimer: ReturnType<typeof setTimeout>;
  const resumeFromHash = () => {
    if (disposed || phase !== "idle" || !location.hash.startsWith("#project=")) return;
    let href: string;
    try { href = decodeURIComponent(location.hash.slice(9)); } catch { return; }
    if (!projectPath.test(href)) return;
    if (!(archive.contentWindow as ArchiveWindow | null)?.rhine?.stats().ready) {
      resumeTimer = setTimeout(resumeFromHash, 100); return;
    }
    void open(href, false);
  };
  archive.addEventListener("load", resumeFromHash);
  resumeFromHash();
  archive.setAttribute("data-project-portal", "ready");
  return () => {
    disposed = true; generation++;
    clearTimeout(resumeTimer); archive.removeEventListener("load", resumeFromHash);
    archive.removeAttribute("data-project-portal");
    window.removeEventListener("message", message); window.removeEventListener("popstate", pop, true);
    window.removeEventListener("keydown", key); window.removeEventListener("resize", resize);
    if (phase !== "idle") cleanup(false);
  };
}
