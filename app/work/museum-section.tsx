import InfiniteMenu from "../infinite-menu-lab/InfiniteMenu";
import { museumItems } from "./museum-data";

const englishProjects: Record<
  string,
  { title?: string; meta: string; description: string }
> = {
  "01": {
    meta: "01 / HEALTHCARE PRODUCT / 2024",
    description: "Home chronic-care system · Research, structure and functional prototype",
  },
  "02": {
    meta: "02 / PRODUCT REDESIGN / 2024",
    description: "Mechanical locking and dynamic feedback · Product redesign",
  },
  "03": {
    meta: "03 / DIGITAL PRODUCT / 2025",
    description: "Course information and decision experience · Digital product",
  },
  "04": {
    meta: "04 / PACKAGING DESIGN / 2025",
    description: "Battery packaging and opening experience · Documentation in progress",
  },
  "05": {
    title: "ARTI64 MODEL CAR DISPLAY",
    meta: "05 / INDUSTRIAL DESIGN / 2025",
    description: "A modular display system for 1:64 scale model cars",
  },
};

export default function MuseumSection({ locale = "zh" }: { locale?: "zh" | "en" }) {
  const isEnglish = locale === "en";
  const items = isEnglish
    ? museumItems.map((item) => {
        const translation = englishProjects[item.index];
        const hasEnglishCase = ["01", "02", "03"].includes(item.index);
        return {
          ...item,
          ...translation,
          link: hasEnglishCase ? `/en${item.link}` : item.link,
        };
      })
    : museumItems;

  return (
    <section
      className="work-museum"
      id="museum"
      aria-labelledby="work-museum-title"
    >
      <div className="work-museum__transition shell">
        <div className="work-museum__chapter" aria-hidden="true">
          <span>{isEnglish ? "CHAPTER TWO" : "第二章"}</span>
          <span>{isEnglish ? "PROJECT MUSEUM" : "项目博物馆"}</span>
        </div>
        <h2 id="work-museum-title">
          {isEnglish ? "Beyond complete case studies," : "从完整案例，"}
          <br />
          <em>
            {isEnglish
              ? "enter an explorable field of work."
              : "进入可探索的作品场域。"}
          </em>
        </h2>
        <div className="work-museum__intro">
          <p>
            {isEnglish
              ? "Five projects are connected as image nodes. Drag the sphere, choose a number, or open a project from the action on the right."
              : "五个项目以图像节点彼此连接。拖动球体、选择编号，或点击右侧按钮进入对应的项目详情。"}
          </p>
          <a href="#museum-stage">
            {isEnglish ? "Enter museum" : "向下进入"}
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      <div
        className="work-museum__stage"
        id="museum-stage"
        aria-label={isEnglish ? "Rotating project museum" : "可旋转的项目博物馆"}
      >
        <InfiniteMenu items={items} />
      </div>
    </section>
  );
}