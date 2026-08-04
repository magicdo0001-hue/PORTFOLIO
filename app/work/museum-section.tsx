import InfiniteMenu from "../infinite-menu-lab/InfiniteMenu";
import { museumItems } from "./museum-data";

export default function MuseumSection() {
  return (
    <section
      className="work-museum"
      id="museum"
      aria-labelledby="work-museum-title"
    >
      <div className="work-museum__transition shell">
        <div className="work-museum__chapter" aria-hidden="true">
          <span>第二章</span>
          <span>项目博物馆</span>
        </div>
        <h2 id="work-museum-title">
          从完整案例，
          <br />
          <em>进入可探索的作品场域。</em>
        </h2>
        <div className="work-museum__intro">
          <p>
            五个项目以图像节点彼此连接。拖动球体、选择编号，
            或点击右侧按钮进入对应的项目详情。
          </p>
          <a href="#museum-stage">
            向下进入
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      <div
        className="work-museum__stage"
        id="museum-stage"
        aria-label="可旋转的项目博物馆"
      >
        <InfiniteMenu items={museumItems} />
      </div>
    </section>
  );
}
