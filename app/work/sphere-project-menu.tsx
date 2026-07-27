"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

const projects = [
  {
    index: "01",
    title: "SANGRE",
    type: "MEDICAL PRODUCT",
    year: "2024",
    href: "/work/sangre",
    image: "/portfolio/sangre-hero.webp",
    description: "家庭慢病检测系统，从研究、交互到可验证原型。",
  },
  {
    index: "02",
    title: "BAMBINO V2",
    type: "PRODUCT REDESIGN",
    year: "2024",
    href: "/work/bambino",
    image: "/portfolio/bambino-cutout.png",
    description: "重新设计机械锁定与动态反馈，让操作更稳、更清楚。",
  },
  {
    index: "03",
    title: "SIMPLE UNI LIFE",
    type: "DIGITAL PRODUCT",
    year: "2024",
    href: "/work/simple-uni-life",
    image: "/portfolio/unilife-hero.webp",
    description: "把分散的课程信息转化为可比较、可行动的决策工具。",
  },
];

const sphereNodes = [
  ...[0, 72, 144, 216, 288].map((lon, index) => ({
    lat: -46,
    lon,
    project: index % 3,
  })),
  ...[36, 108, 180, 252, 324].map((lon, index) => ({
    lat: 0,
    lon,
    project: (index + 2) % 3,
  })),
  ...[0, 72, 144, 216, 288].map((lon, index) => ({
    lat: 46,
    lon,
    project: (index + 1) % 3,
  })),
];

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

function frontProject(rotation: { x: number; y: number }) {
  const rx = toRadians(rotation.x);
  const ry = toRadians(rotation.y);
  let selected = 0;
  let nearest = -Infinity;

  sphereNodes.forEach((node) => {
    const lat = toRadians(node.lat);
    const lon = toRadians(node.lon);
    const x = Math.cos(lat) * Math.sin(lon);
    const y = -Math.sin(lat);
    const z = Math.cos(lat) * Math.cos(lon);
    const rotatedZ =
      y * Math.sin(rx) +
      (-x * Math.sin(ry) + z * Math.cos(ry)) * Math.cos(rx);

    if (rotatedZ > nearest) {
      nearest = rotatedZ;
      selected = node.project;
    }
  });

  return selected;
}

export default function SphereProjectMenu() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const rotation = useRef({ x: -8, y: 8 });
  const velocity = useRef({ x: 0, y: 0 });
  const pointer = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const didDrag = useRef(false);
  const pressedProject = useRef<number | null>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const globe = globeRef.current;
    if (!viewport || !globe) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let frame = 0;

    const render = () => {
      if (!dragging.current) {
        rotation.current.x += velocity.current.x;
        rotation.current.y += velocity.current.y;
        velocity.current.x *= reducedMotion ? 0 : 0.94;
        velocity.current.y *= reducedMotion ? 0 : 0.94;
      }

      globe.style.transform = `rotateX(${rotation.current.x}deg) rotateY(${rotation.current.y}deg)`;
      const next = frontProject(rotation.current);
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }
      frame = window.requestAnimationFrame(render);
    };

    const onWheel = (event: globalThis.WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      velocity.current.y += event.deltaY * 0.012;
      velocity.current.x += event.deltaX * -0.006;
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    frame = window.requestAnimationFrame(render);
    return () => {
      viewport.removeEventListener("wheel", onWheel);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const tile = target.closest<HTMLElement>("[data-project]");
    pressedProject.current = tile ? Number(tile.dataset.project) : null;
    pointer.current = { x: event.clientX, y: event.clientY };
    velocity.current = { x: 0, y: 0 };
    dragging.current = true;
    didDrag.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = event.clientX - pointer.current.x;
    const dy = event.clientY - pointer.current.y;
    if (Math.hypot(dx, dy) > 3) didDrag.current = true;
    rotation.current.x -= dy * 0.28;
    rotation.current.y += dx * 0.28;
    velocity.current = { x: -dy * 0.045, y: dx * 0.045 };
    pointer.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
    if (!didDrag.current && pressedProject.current !== null) {
      router.push(projects[pressedProject.current].href);
    }
    pressedProject.current = null;
  };

  const selectProject = (projectIndex: number) => {
    const node = sphereNodes.find((item) => item.project === projectIndex);
    if (!node) return;
    rotation.current = { x: -node.lat, y: -node.lon };
    velocity.current = { x: 0, y: 0 };
    activeRef.current = projectIndex;
    setActive(projectIndex);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const amount = 18;
    if (event.key === "Enter") {
      router.push(projects[activeRef.current].href);
      return;
    }
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
      return;
    }
    event.preventDefault();
    if (event.key === "ArrowLeft") rotation.current.y -= amount;
    if (event.key === "ArrowRight") rotation.current.y += amount;
    if (event.key === "ArrowUp") rotation.current.x -= amount;
    if (event.key === "ArrowDown") rotation.current.x += amount;
    velocity.current = { x: 0, y: 0 };
  };

  const current = projects[active];

  return (
    <div className="sphere-project-menu">
      <div
        ref={viewportRef}
        className="sphere-project-menu__viewport"
        role="application"
        aria-label="可旋转项目球面，拖动或使用方向键选择，按回车进入项目"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          dragging.current = false;
          pressedProject.current = null;
        }}
      >
        <div ref={globeRef} className="sphere-project-menu__globe">
          {sphereNodes.map((node) => {
            const project = projects[node.project];
            const style = {
              "--tile-lat": `${node.lat}deg`,
              "--tile-lon": `${node.lon}deg`,
            } as CSSProperties;

            return (
              <Link
                key={`${node.lat}-${node.lon}`}
                className="sphere-project-menu__tile"
                href={project.href}
                style={style}
                data-project={node.project}
                tabIndex={-1}
                aria-hidden="true"
                onClick={(event) => {
                  if (didDrag.current) event.preventDefault();
                }}
              >
                <img src={project.image} alt="" draggable={false} />
                <span>{project.index}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="sphere-project-menu__info" aria-live="polite">
        <span>
          {current.index} / {current.type} / {current.year}
        </span>
        <h1>{current.title}</h1>
        <p>{current.description}</p>
      </div>

      <div className="sphere-project-menu__selectors" aria-label="选择项目">
        {projects.map((project, index) => (
          <button
            key={project.href}
            type="button"
            className={index === active ? "is-active" : ""}
            onClick={() => selectProject(index)}
            aria-label={`选择 ${project.title}`}
            aria-pressed={index === active}
          >
            {project.index}
          </button>
        ))}
      </div>

      <Link
        className="sphere-project-menu__open"
        href={current.href}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <span>OPEN</span>
        <strong>PROJECT</strong>
        <i aria-hidden="true">↗</i>
      </Link>

      <p className="sphere-project-menu__hint">
        DRAG TO ROTATE · CLICK A TILE OR OPEN PROJECT
      </p>
    </div>
  );
}
