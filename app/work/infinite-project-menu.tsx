"use client";

import Link from "next/link";
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
  },
  {
    index: "02",
    title: "BAMBINO V2",
    type: "PRODUCT REDESIGN",
    year: "2024",
    href: "/work/bambino",
    image: "/portfolio/bambino-cutout.png",
  },
  {
    index: "03",
    title: "SIMPLE UNI LIFE",
    type: "DIGITAL PRODUCT",
    year: "2024",
    href: "/work/simple-uni-life",
    image: "/portfolio/unilife-hero.webp",
  },
];

const wrap = (value: number) =>
  (value + projects.length * 1000) % projects.length;

export default function InfiniteProjectMenu() {
  const [step, setStep] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStart = useRef<number | null>(null);
  const didDrag = useRef(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const wheelLocked = useRef(false);
  const active = wrap(step);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const onWheel = (event: globalThis.WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (wheelLocked.current || Math.abs(event.deltaY) < 4) return;
      wheelLocked.current = true;
      setStep((current) => current + (event.deltaY > 0 ? 1 : -1));
      window.setTimeout(() => {
        wheelLocked.current = false;
      }, 420);
    };

    menu.addEventListener("wheel", onWheel, { passive: false });
    return () => menu.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragStart.current = event.clientX;
    didDrag.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    const distance = event.clientX - dragStart.current;
    if (Math.abs(distance) > 6) didDrag.current = true;
    setDragOffset(distance);
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (Math.abs(dragOffset) > 36) {
      setStep((current) => current + (dragOffset < 0 ? 1 : -1));
    }
    dragStart.current = null;
    setDragOffset(0);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
      return;
    }
    event.preventDefault();
    setStep((current) =>
      current +
      (event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1),
    );
  };

  const ringStyle = {
    "--ring-turn": `${step * -120 + dragOffset * 0.16}deg`,
  } as CSSProperties;

  return (
    <div
      ref={menuRef}
      className="infinite-project-menu"
      role="region"
      aria-label="项目环形菜单"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        dragStart.current = null;
        setDragOffset(0);
      }}
    >
      <div className="infinite-project-menu__orbit" style={ringStyle}>
        {projects.map((project, index) => (
          <Link
            key={project.href}
            className={`infinite-project-menu__card${
              index === active ? " is-active" : ""
            }`}
            href={project.href}
            style={{ "--slot": index } as CSSProperties}
            aria-hidden={index !== active}
            tabIndex={index === active ? 0 : -1}
            onClick={(event) => {
              if (!didDrag.current) return;
              event.preventDefault();
              didDrag.current = false;
            }}
          >
            <img src={project.image} alt="" draggable={false} />
            <span>
              {project.index} / {project.type}
            </span>
            <h2>{project.title}</h2>
            <small>{project.year}</small>
            <strong aria-hidden="true">↗</strong>
          </Link>
        ))}
      </div>

      <div className="infinite-project-menu__controls" aria-label="选择项目">
        {projects.map((project, index) => (
          <button
            key={project.href}
            type="button"
            className={index === active ? "is-active" : ""}
            onClick={() =>
              setStep((current) => current + (index - wrap(current)))
            }
            aria-label={`选择 ${project.title}`}
            aria-pressed={index === active}
          >
            <span>{project.index}</span>
            {project.title}
          </button>
        ))}
      </div>

      <p className="infinite-project-menu__hint">
        DRAG / SCROLL / ARROW KEYS
      </p>
    </div>
  );
}
