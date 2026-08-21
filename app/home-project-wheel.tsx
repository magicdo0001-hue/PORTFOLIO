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

const wheelProjects = [
  {
    id: "sangre",
    index: "01",
    title: "SANGRE",
    meta: "医疗产品 / 2024",
    href: "/work/sangre",
    image: "/portfolio/sangre-cutout.png",
    imageClass: "home-project-wheel__image--sangre",
  },
  {
    id: "bambino",
    index: "02",
    title: "BAMBINO V2",
    meta: "产品再设计 / 2024",
    href: "/work/bambino",
    image: "/portfolio/bambino-cutout.png",
    imageClass: "home-project-wheel__image--bambino",
  },
  {
    id: "unilife",
    index: "03",
    title: "SIMPLE UNI LIFE",
    meta: "数字产品 / 2024",
    href: "/work/simple-uni-life",
    image: "/portfolio/unilife-hero.webp",
    imageClass: "home-project-wheel__image--unilife",
  },
];

export default function HomeProjectWheel() {
  const [active, setActive] = useState(1);
  const [paused, setPaused] = useState(false);
  const dragStart = useRef<number | null>(null);
  const wheelLocked = useRef(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  const select = (index: number) => {
    setActive((index + wheelProjects.length) % wheelProjects.length);
  };

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % wheelProjects.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    const options = optionsRef.current;
    if (!options) return;

    const handleWheel = (event: globalThis.WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (wheelLocked.current || Math.abs(event.deltaY) < 4) return;

      wheelLocked.current = true;
      setActive(
        (current) =>
          (current + (event.deltaY > 0 ? 1 : -1) + wheelProjects.length) %
          wheelProjects.length,
      );
      window.setTimeout(() => {
        wheelLocked.current = false;
      }, 420);
    };

    options.addEventListener("wheel", handleWheel, { passive: false });
    return () => options.removeEventListener("wheel", handleWheel);
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragStart.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
    setPaused(true);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current !== null) {
      const distance = event.clientY - dragStart.current;
      if (Math.abs(distance) > 24) select(active + (distance < 0 ? 1 : -1));
    }
    dragStart.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setPaused(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    select(active + (event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1));
  };

  const current = wheelProjects[active];

  return (
    <div
      className="home-hero__visual home-project-wheel"
      data-project={current.id}
      tabIndex={0}
      aria-label="精选项目转轮，使用滚轮、拖拽或方向键切换"
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Link
        className="home-project-wheel__stage"
        href={current.href}
        aria-label={`查看 ${current.title} 项目`}
      >
        {wheelProjects.map((project, index) => (
          <figure
            key={project.href}
            className={`home-project-wheel__object ${project.imageClass}${
              index === active ? " is-active" : ""
            }`}
            aria-hidden={index !== active}
          >
            {project.id === "unilife" ? (
              <span className="home-project-wheel__laptop" aria-hidden="true">
                <span className="home-project-wheel__laptop-screen">
                  <img src={project.image} alt="" />
                </span>
                <span className="home-project-wheel__laptop-base">
                  <span className="home-project-wheel__laptop-keyboard" />
                  <span className="home-project-wheel__laptop-trackpad" />
                </span>
              </span>
            ) : (
              <img
                className="home-project-wheel__image"
                src={project.image}
                alt={index === active ? `${project.title} 项目主视觉` : ""}
              />
            )}
          </figure>
        ))}
        <span className="home-project-wheel__caption" aria-live="polite">
          精选项目 / {current.index}
          <strong>{current.meta}</strong>
        </span>
      </Link>

      <div
        ref={optionsRef}
        className="home-project-wheel__options"
        role="listbox"
        aria-label="选择首页主视觉项目"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          dragStart.current = null;
          setPaused(false);
        }}
      >
        {wheelProjects.map((project, index) => {
          let distance = index - active;
          if (distance > 1) distance -= wheelProjects.length;
          if (distance < -1) distance += wheelProjects.length;
          const style = {
            "--wheel-y": `${distance * 64}px`,
            "--wheel-x": `${Math.abs(distance) * 18}px`,
            "--wheel-r": `${distance * -7}deg`,
            "--wheel-o": index === active ? 1 : 0.38,
            "--wheel-s": index === active ? 1 : 0.82,
          } as CSSProperties;

          return (
            <button
              key={project.href}
              type="button"
              role="option"
              aria-selected={index === active}
              className={index === active ? "is-active" : ""}
              style={style}
              onClick={() => select(index)}
            >
              <small>{project.index}</small>
              <span>{project.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
