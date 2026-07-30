import type { Metadata } from "next";
import InfiniteMenu from "./InfiniteMenu";

export const metadata: Metadata = {
  title: "Infinite Menu 设计验证 — 严文厚",
  description: "基于 React Bits Infinite Menu 的项目主页交互验证。",
};

const projects = [
  {
    images: [
      "/portfolio/sangre-menu-01.jpg",
      "/portfolio/sangre-menu-02.jpg",
      "/portfolio/sangre-menu-03.png",
      "/portfolio/sangre-menu-04.jpg",
    ],
    link: "/work/sangre",
    title: "SANGRE",
    index: "01",
    meta: "01 / 医疗产品 / 2024",
    description: "家庭慢病检测系统 · 研究、结构与功能原型",
  },
  {
    images: [
      "/portfolio/bambino-menu-01.jpg",
      "/portfolio/bambino-menu-02.jpg",
      "/portfolio/bambino-menu-03.jpg",
      "/portfolio/bambino-menu-04.jpg",
    ],
    link: "/work/bambino",
    title: "BAMBINO V2",
    index: "02",
    meta: "02 / 产品再设计 / 2024",
    description: "机械锁定与动态反馈 · 产品再设计",
  },
  {
    images: [
      "/portfolio/unilife-menu-01.png",
      "/portfolio/unilife-menu-02.png",
      "/portfolio/unilife-menu-03.png",
      "/portfolio/unilife-menu-04.png",
    ],
    link: "/work/simple-uni-life",
    title: "SIMPLE UNI LIFE",
    index: "03",
    meta: "03 / 数字产品 / 2025",
    description: "课程信息与决策体验 · 数字产品",
  },
  {
    images: [
      "/portfolio/battery-museum-01.jpeg",
      "/portfolio/battery-museum-02.jpeg",
      "/portfolio/battery-museum-03.jpeg",
      "/portfolio/battery-museum-04.jpeg",
      "/portfolio/battery-museum-05.jpeg",
    ],
    link: "/work/battery-packaging",
    title: "ENERGIZER PACKAGING",
    index: "04",
    meta: "04 / 包装设计 / 2025",
    description: "电池包装与开启体验 · 项目资料待补充",
  },
  {
    images: [
      "/portfolio/frame-museum-01.jpg",
      "/portfolio/frame-museum-02.jpg",
      "/portfolio/frame-museum-03.jpg",
    ],
    link: "/work/vertical-car-park",
    title: "VERTICAL CAR PARK",
    index: "05",
    meta: "05 / 工业设计 / 2025",
    description: "模块化车架与空间系统 · 项目资料待补充",
  },
];

const items = projects.flatMap(({ images, ...project }) =>
  images.map((image) => ({ ...project, image })),
);

export default function InfiniteMenuLabPage() {
  return (
    <main
      style={{
        position: "relative",
        width: "100%",
        height: "100svh",
        overflow: "hidden",
        background: "#000",
        color: "#fff",
      }}
    >
      <InfiniteMenu items={items} />
    </main>
  );
}
