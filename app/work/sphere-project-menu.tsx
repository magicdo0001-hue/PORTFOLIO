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
    type: "医疗产品",
    year: "2024",
    href: "/work/sangre",
    images: [
      "/portfolio/sangre-sphere.jpg",
      "/portfolio/sangre-layer-02.jpg",
      "/portfolio/sangre-layer-03.jpg",
      "/portfolio/sangre-layer-04.jpg",
    ],
    description: "家庭慢病检测系统，从研究、交互到可验证原型。",
  },
  {
    index: "02",
    title: "BAMBINO V2",
    type: "产品再设计",
    year: "2024",
    href: "/work/bambino",
    images: [
      "/portfolio/bambino-layer-01.jpg",
      "/portfolio/bambino-layer-02.png",
      "/portfolio/bambino-layer-03.jpg",
      "/portfolio/bambino-layer-04.jpg",
    ],
    description: "重新设计机械锁定与动态反馈，让操作更稳、更清楚。",
  },
  {
    index: "03",
    title: "SIMPLE UNI LIFE",
    type: "数字产品",
    year: "2024",
    href: "/work/simple-uni-life",
    images: [
      "/portfolio/unilife-layer-01.png",
      "/portfolio/unilife-layer-02.png",
      "/portfolio/unilife-layer-03.png",
      "/portfolio/unilife-layer-04.png",
    ],
    description: "把分散的课程信息转化为可比较、可行动的决策工具。",
  },
];

const sphereNodes = [
  { lat: -54, offset: 0, projectOffset: 0 },
  { lat: -18, offset: 30, projectOffset: 1 },
  { lat: 18, offset: 0, projectOffset: 2 },
  { lat: 54, offset: 30, projectOffset: 0 },
].flatMap((ring, ringIndex) =>
  Array.from({ length: 6 }, (_, index) => ({
    lat: ring.lat,
    lon: ring.offset + index * 60,
    project: (index + ring.projectOffset) % projects.length,
    imageIndex: ringIndex,
  })),
);

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

function nodeDepths(rotation: { x: number; y: number }) {
  const rx = toRadians(rotation.x);
  const ry = toRadians(rotation.y);
  return sphereNodes.map((node) => {
    const lat = toRadians(node.lat);
    const lon = toRadians(node.lon);
    const x = Math.cos(lat) * Math.sin(lon);
    const y = -Math.sin(lat);
    const z = Math.cos(lat) * Math.cos(lon);
    return (
      y * Math.sin(rx) +
      (-x * Math.sin(ry) + z * Math.cos(ry)) * Math.cos(rx)
    );
  });
}

function frontNode(rotation: { x: number; y: number }) {
  const depths = nodeDepths(rotation);
  return depths.reduce(
    (selected, depth, index) =>
      depth > depths[selected] ? index : selected,
    0,
  );
}

const closestRotation = (current: number, target: number) =>
  target + Math.round((current - target) / 360) * 360;

export default function SphereProjectMenu() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const rotation = useRef({ x: 54, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const pointer = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const didDrag = useRef(false);
  const pressedProject = useRef<number | null>(null);
  const snapNode = useRef<number | null>(0);
  const snapTimer = useRef<number | null>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const globe = globeRef.current;
    if (!viewport || !globe) return;
    const tiles = Array.from(
      globe.querySelectorAll<HTMLElement>(".sphere-project-menu__tile"),
    );

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let frame = 0;

    const render = () => {
      if (!dragging.current) {
        if (snapNode.current !== null) {
          const node = sphereNodes[snapNode.current];
          const targetX = closestRotation(rotation.current.x, -node.lat);
          const targetY = closestRotation(rotation.current.y, -node.lon);
          velocity.current.x += (targetX - rotation.current.x) * 0.082;
          velocity.current.y += (targetY - rotation.current.y) * 0.082;
          velocity.current.x *= reducedMotion ? 0.5 : 0.79;
          velocity.current.y *= reducedMotion ? 0.5 : 0.79;
          rotation.current.x += velocity.current.x;
          rotation.current.y += velocity.current.y;

          if (
            Math.abs(targetX - rotation.current.x) < 0.04 &&
            Math.abs(targetY - rotation.current.y) < 0.04 &&
            Math.hypot(velocity.current.x, velocity.current.y) < 0.04
          ) {
            rotation.current = { x: targetX, y: targetY };
            velocity.current = { x: 0, y: 0 };
            snapNode.current = null;
          }
        } else {
          rotation.current.x += velocity.current.x;
          rotation.current.y += velocity.current.y;
          velocity.current.x *= reducedMotion ? 0 : 0.94;
          velocity.current.y *= reducedMotion ? 0 : 0.94;
        }
      }

      globe.style.transform = `rotateX(${rotation.current.x}deg) rotateY(${rotation.current.y}deg)`;
      const depths = nodeDepths(rotation.current);
      const nearest = depths.reduce(
        (selected, depth, index) =>
          depth > depths[selected] ? index : selected,
        0,
      );
      tiles.forEach((tile, index) => {
        const proximity = Math.max(
          0,
          Math.min(1, (depths[index] - 0.28) / 0.72),
        );
        const emphasis = proximity * proximity * proximity;
        tile.style.setProperty(
          "--focus-scale",
          (1 + emphasis * 0.64).toFixed(3),
        );
        tile.style.setProperty(
          "--focus-opacity",
          (0.18 + proximity * 0.82).toFixed(3),
        );
        tile.style.setProperty(
          "--focus-brightness",
          (0.44 + proximity * 0.56).toFixed(3),
        );
        tile.style.setProperty("--focus-glow", emphasis.toFixed(3));
      });

      const next = sphereNodes[nearest].project;
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }
      frame = window.requestAnimationFrame(render);
    };

    const onWheel = (event: globalThis.WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      snapNode.current = null;
      velocity.current.y += event.deltaY * 0.012;
      velocity.current.x += event.deltaX * -0.006;
      if (snapTimer.current !== null) window.clearTimeout(snapTimer.current);
      snapTimer.current = window.setTimeout(() => {
        const predicted = {
          x: rotation.current.x + velocity.current.x * 8,
          y: rotation.current.y + velocity.current.y * 8,
        };
        snapNode.current = frontNode(predicted);
      }, 150);
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    frame = window.requestAnimationFrame(render);
    return () => {
      viewport.removeEventListener("wheel", onWheel);
      window.cancelAnimationFrame(frame);
      if (snapTimer.current !== null) window.clearTimeout(snapTimer.current);
    };
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const tile = target.closest<HTMLElement>("[data-project]");
    pressedProject.current = tile ? Number(tile.dataset.project) : null;
    pointer.current = { x: event.clientX, y: event.clientY };
    velocity.current = { x: 0, y: 0 };
    snapNode.current = null;
    if (snapTimer.current !== null) window.clearTimeout(snapTimer.current);
    dragging.current = true;
    didDrag.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = event.clientX - pointer.current.x;
    const dy = event.clientY - pointer.current.y;
    if (Math.hypot(dx, dy) > 3) didDrag.current = true;
    rotation.current.x -= dy * 0.32;
    rotation.current.y += dx * 0.32;
    velocity.current = { x: -dy * 0.052, y: dx * 0.052 };
    pointer.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
    if (!didDrag.current && pressedProject.current !== null) {
      router.push(projects[pressedProject.current].href);
    }
    const predicted = {
      x: rotation.current.x + velocity.current.x * 8,
      y: rotation.current.y + velocity.current.y * 8,
    };
    snapNode.current = frontNode(predicted);
    pressedProject.current = null;
  };

  const selectProject = (projectIndex: number) => {
    const nodeIndex = sphereNodes.findIndex(
      (item) => item.project === projectIndex,
    );
    if (nodeIndex < 0) return;
    velocity.current = { x: 0, y: 0 };
    snapNode.current = nodeIndex;
    activeRef.current = projectIndex;
    setActive(projectIndex);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const amount = 46;
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
    snapNode.current = frontNode(rotation.current);
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
          snapNode.current = frontNode(rotation.current);
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
                <img
                  src={project.images[node.imageIndex]}
                  alt=""
                  draggable={false}
                />
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
        <span>查看</span>
        <strong>项目</strong>
        <i aria-hidden="true">↗</i>
      </Link>

      <p className="sphere-project-menu__hint">
        拖动旋转 · 点击图片或“查看项目”进入
      </p>
    </div>
  );
}
