import type { Metadata } from "next";
import InfiniteMenu from "./InfiniteMenu";

export const metadata: Metadata = {
  title: "Infinite Menu 设计验证 — 严文厚",
  description: "基于 React Bits Infinite Menu 的项目主页交互验证。",
};

const items = [
  {
    image: "/portfolio/sangre-menu-01.jpg",
    link: "/work/sangre",
    title: "SANGRE",
    description: "家庭慢病检测系统",
  },
  {
    image: "/portfolio/sangre-menu-02.jpg",
    link: "/work/sangre",
    title: "SANGRE",
    description: "研究、结构与功能原型",
  },
  {
    image: "/portfolio/bambino-menu-03.jpg",
    link: "/work/bambino",
    title: "BAMBINO V2",
    description: "机械锁定与动态反馈",
  },
  {
    image: "/portfolio/bambino-menu-04.jpg",
    link: "/work/bambino",
    title: "BAMBINO V2",
    description: "产品再设计与实体验证",
  },
  {
    image: "/portfolio/unilife-menu-01.png",
    link: "/work/simple-uni-life",
    title: "SIMPLE UNI LIFE",
    description: "课程信息与决策体验",
  },
  {
    image: "/portfolio/unilife-menu-04.png",
    link: "/work/simple-uni-life",
    title: "SIMPLE UNI LIFE",
    description: "数字产品与界面系统",
  },
];

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
