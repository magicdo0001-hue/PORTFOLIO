export type CityTheme = "battery" | "arti64";
export type Locale = "zh" | "en";
export type DistrictCopy = { name: string; feature: string; description: string; link: string };
export type CityDistrict = { id: string; position: [number, number]; height: number; target: string; zh: DistrictCopy; en: DistrictCopy };
export type CityProject = {
  slug: string; title: string; brand: string; archive: string; fallback: string;
  zh: { headline: [string, string]; intro: string; explore: string; scene: string };
  en: { headline: [string, string]; intro: string; explore: string; scene: string };
  districts: CityDistrict[];
};

export const cityProjects: Record<CityTheme, CityProject> = {
  battery: {
    slug: "battery-packaging", title: "CR2032 PACKAGING", brand: "CR2032", archive: "X4-01", fallback: "/portfolio/battery-museum-02.jpeg",
    zh: { headline: ["安全取用，", "也为循环而设计。"], intro: "从儿童防护到单颗释放，再到纸塑分离。", explore: "探索安全园区", scene: "CR2032 循环安全园区" },
    en: { headline: ["Safety,", "one cell at a time."], intro: "Child protection, single-cell access and material separation.", explore: "Explore the campus", scene: "CR2032 circular safety campus" },
    districts: [
      { id: "archive", position: [-5.1,-3.1], height: 3.8, target: "regulation", zh: { name: "安全档案馆", feature: "设计边界", description: "把法规研究转化为开启顺序、结构与成人操作的设计边界。", link: "查看法规研究" }, en: { name: "Safety Archive", feature: "Design boundaries", description: "Translate safety research into structural and operating requirements.", link: "Read the safety research" } },
      { id: "vault", position: [0,-3.1], height: 4.5, target: "safety", zh: { name: "防护金库", feature: "儿童防护", description: "以明确的操作顺序保护电池，减少直觉误开与意外接触。", link: "查看防护思路" }, en: { name: "Protective Vault", feature: "Child protection", description: "A deliberate operating sequence guides the child-resistant design.", link: "Explore the safety approach" } },
      { id: "release", position: [5.1,-3.1], height: 3.2, target: "single-release", zh: { name: "单颗释放站", feature: "单颗取用", description: "一次开放一颗电池，将取用数量与暴露范围控制在结构之中。", link: "了解单颗释放" }, en: { name: "Release Lab", feature: "Single-cell access", description: "Expose one cell at a time, with access controlled by the structure.", link: "Read about single-cell access" } },
      { id: "recovery", position: [0,3.1], height: 3.1, target: "circular", zh: { name: "材料回收馆", feature: "纸塑分离", description: "减少不可逆连接，让纸质背板与 PET 保护盖在使用后分开处理。", link: "查看循环设计" }, en: { name: "Material Recovery", feature: "Material separation", description: "Separate the paper backing and PET cover after use by reducing permanent bonds.", link: "Explore circular design" } },
      { id: "exhibition", position: [5.1,3.1], height: 2.9, target: "recognition", zh: { name: "项目展览馆", feature: "方案与认可", description: "从结构探索到完整包装方案，记录 PIDA 学生组决赛入围。", link: "查看项目认可" }, en: { name: "Project Exhibition", feature: "Design & recognition", description: "The packaging proposal and its PIDA Student Award finalist recognition.", link: "Read the project recognition" } },
    ],
  },
  arti64: {
    slug: "vertical-car-park", title: "ARTI64", brand: "ARTI64", archive: "X5-01", fallback: "/portfolio/arti64-display-wall.jpg",
    zh: { headline: ["一辆小车，", "一个不断生长的世界。"], intro: "从展示单元出发，走进结构、制造与真实销售。", explore: "探索模型车工坊", scene: "ARTI64 模型车工坊" },
    en: { headline: ["A small car.", "A growing world."], intro: "From a display module to a working product system.", explore: "Explore the workshop", scene: "ARTI64 model-car maker district" },
    districts: [
      { id: "collector", position: [-5.1,-3.1], height: 3.4, target: "collectors", zh: { name: "收藏者展厅", feature: "收藏场景", description: "从原包装、透明盒与桌面的真实收纳状态，寻找统一的展示语言。", link: "查看收藏场景" }, en: { name: "Collector Gallery", feature: "Collector context", description: "Observe the mix of boxes, cases and open stands in real collections.", link: "Explore collector context" } },
      { id: "tower", position: [0,-3.1], height: 4.7, target: "display-system", zh: { name: "模块展示塔", feature: "模块展示", description: "横向连接、纵向叠加，让基础停车单元随着收藏数量继续扩展。", link: "查看展示系统" }, en: { name: "Display Tower", feature: "Modular display", description: "Connect horizontally and stack vertically as a collection grows.", link: "Explore the display system" } },
      { id: "studio", position: [5.1,-3.1], height: 3.3, target: "design-process", zh: { name: "结构设计室", feature: "结构设计", description: "草图与 CAD 围绕立柱刚度、层间连接和车辆净空反复收敛。", link: "查看设计过程" }, en: { name: "Design Studio", feature: "Structure design", description: "Refine stiffness, connections and vehicle clearance through sketches and CAD.", link: "Read the design process" } },
      { id: "printer", position: [-5.1,3.1], height: 3.8, target: "printing", zh: { name: "打印工坊", feature: "打印原型", description: "把结构带到打印平台，检验支撑、制造方向与真实使用空间。", link: "查看打印原型" }, en: { name: "Print Shop", feature: "Print prototypes", description: "Test support, print orientation and real clearances on the build plate.", link: "Explore print prototypes" } },
      { id: "assembly", position: [0,3.1], height: 2.8, target: "production", zh: { name: "组装车间", feature: "小批量制造", description: "从单件原型走向批量打印、零件分类与快速装配。", link: "查看制造过程" }, en: { name: "Assembly Workshop", feature: "Small-batch making", description: "Move from a prototype to batch printing, sorting and assembly.", link: "Explore small-batch making" } },
      { id: "market", position: [5.1,3.1], height: 3.0, target: "brand-market", zh: { name: "品牌市集", feature: "品牌与销售", description: "将产品、价格与陈列带到真实收藏者面前，用反馈检验下一步。", link: "查看品牌与销售" }, en: { name: "Market Pavilion", feature: "Brand & sales", description: "Bring the product, pricing and display to collectors for real feedback.", link: "Explore brand and sales" } },
    ],
  },
};
