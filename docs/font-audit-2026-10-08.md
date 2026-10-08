# 项目字体检查报告

- 检查日期：2026-10-08。
- 项目目录：`E:\Codex File\OWN WEB`。
- 源码基线：`main`，提交 `ba2ccb62342ea3bcabff23afe8265c9d28af51c4`。
- 浏览器实测：Windows，Chrome `154.0.8037.98`，1440 × 1000，无头浏览器；读取计算样式、FontFace 状态及 Chrome 实际渲染字体。
- 本次只新增检查报告，没有修改页面、样式、字体或依赖。
- 下文代码位置以项目根目录为基准；压缩 CSS 的多个规则可能都在第 1 行。

## 1. 结论

当前项目使用 **3 个本地正文/界面 Web 字体家族：MiSans、Manrope、Azeret Mono**，共 **11 个 WOFF2 文件**。另有一套内嵌的 `webflow-icons` 图标字体，本次 SANGRE 页面未发现对应节点或实际加载。

主站其余字体通过系统字体栈选择，没有随项目提供对应字体文件。CSS 首选字体与用户最终看到的字体不一定相同：本机多个主站标题、正文实际使用 **Microsoft YaHei（微软雅黑）**；编号使用 **Cascadia Mono**；英文衬线强调使用 **Georgia**；中文衬线强调回退到 **SimSun（宋体）**。

字体资源检查通过：11 个 WOFF2 均存在，源码文件与生成目录副本逐字节一致，本地 HTTP 请求全部返回 200，响应内容也与源文件一致。当前实现不需要为字体额外安装 npm 依赖。

## 2. 本次重新确认的项目状态

| 当前区域 | 字体检查应采用的依据 |
| --- | --- |
| 首页 `/`、`/en` | 已由 `RhineLabExperience` 承载档案界面；外层工具条与 iframe 内部各有字体配置，不能把旧首页的字体结论直接套用。 |
| 档案跳转 | 增加了打开项目时的准备状态提示，提示层使用 Arial 字体栈。 |
| SANGRE | 当前通过独立展示 iframe 加载 `standalone/aether-replica` 的构建产物；展示部分新增 Manrope、Azeret Mono，`#story` 案例正文仍使用主站字体栈。 |
| BAMBINO | 使用独立工作台和锁定演示组件；标题继承工作台正文字体，编号、时间轴与数据使用主站等宽栈。 |
| 项目城市页 | Simple Uni Life 的 UniLife 品牌字使用 Georgia；Battery、ARTI64 的品牌字有覆盖规则，使用主站正文字体栈。 |
| 旧 SANGRE orbit | 文件仍在仓库，本次未发现当前路由挂载它；不计入当前主展示页面。 |

## 3. 当前页面的字体与使用位置

| 字体或字体栈 | 使用位置 | 代码位置 |
| --- | --- | --- |
| **MiSans** | 首页档案 iframe 内的品牌字、导航、读取档案按钮、档案文字及设置界面；RhineLab Canvas 绘制文字 | `RhineLabUI/src/style.css:1`、`:33`；`RhineLabUI/src/brand.ts:4`；`RhineLabUI/src/scene.ts:727` 起 |
| **Manrope** | SANGRE 独立展示的标题、正文、导航等继承 `.body` 的文字；设备屏幕 DOM 界面；静态降级版内容 | `standalone/aether-replica/public/assets/vendor/d0af8c6effae91.css:1`；`standalone/aether-replica/src/screen-ui.css:9`；`standalone/aether-replica/src/static-project.css:3` |
| **Azeret Mono**，CSS 名称 `Azeretmono` | SANGRE 展示的标签云 `.tagcloud-w` 与滚动数字指示 `.indicator-w` | `standalone/aether-replica/public/assets/vendor/d0af8c6effae91.css:1` |
| **主站正文栈**，首选 Aptos | `.project` 项目正文、`.site-nav` 导航、BAMBINO 工作台及其标题、城市页顶部导航、Battery/ARTI64 城市品牌字 | `app/site-system.css:11`、`:49`、`:54`；`app/project-system.css:43`；`app/work/bambino/workbench.css:1`；`app/work/simple-uni-life/city-hero.css:134`；`app/work/project-city/city-theme.css:3` |
| **主站标题栈**，首选 Helvetica Neue | `.project` 内 h1/h2/h3/strong；项目城市首屏 h1。BAMBINO 的 `.bw` 工作台不属于 `.project`，不适用该标题规则 | `app/site-system.css:9`；`app/project-system.css:108`；`app/work/simple-uni-life/city-hero.css:67` |
| **主站数据栈**，首选 SFMono-Regular | 项目元信息、章节标签、滚动提示、图注、下一项目标签、项目导航编号、BAMBINO 数据和时间轴、城市目录编号 | `app/site-system.css:12`；`app/project-system.css:116`；`app/globals.css:349`；详见下一节 |
| **Georgia** 衬线栈 | `/work` 与 `/en/work` 展馆过渡语的强调文字；Simple Uni Life 城市页的 `UniLife.` 品牌字 | `app/globals.css:433`；`app/work/simple-uni-life/city-hero.css:65` |
| **Arial** 默认栈 | 未被局部规则覆盖的页面文字，例如主站 body 继承区域 | `app/globals.css:25` |
| **Arial / Microsoft YaHei** | 首页档案外层工具条，含 RHINE LAB、交互体验及导航文字 | `app/rhine-lab-experience.css:22` |
| **Arial / sans-serif** | 从档案打开项目时的准备进度、状态提示与按钮；中文由浏览器另行回退 | `app/archive-project-portal.css:5` |
| **Helvetica Neue / Helvetica / Arial** 等 | 可直接访问的 Quiet Focus 独立静态模板；未发现主站路由引用该模板 | `public/templates/quiet-focus/style.css:2`；地址 `/templates/quiet-focus/index.html` |

SANGRE iframe 的 CSS 不继承主站字体变量；因此同一个项目页面上，展示区和案例正文可以使用不同字体。

### 主站数据字体的详细位置

| 页面或组件 | 元素/选择器 | 代码位置 |
| --- | --- | --- |
| 共享项目样式 | `.project-hero__meta`、`.project-hero__title > p`、`.chapter-label`、`.scroll-cue`、`.screen-rail__intro`、`figcaption` | `app/project-system.css:116` |
| ARTI64 | `.arti64-system__copy dt` | `app/project-system.css:467` |
| 下一项目链接 | `.next-project span` | `app/project-system.css:542` |
| 电池包装项目 | `.battery-regulation__copy dt`、`.battery-safety__goals span`、`.battery-circular__copy aside span` | `app/project-system.css:841`、`:897`、`:942` |
| 导航快捷入口 | `.site-nav__project-shortcuts a span` | `app/globals.css:349` |
| 项目城市目录 | `.uni-city__districts button > span` | `app/work/simple-uni-life/city-hero.css:82` |
| BAMBINO 工作台 | `.bw-chapter-count`、`.bw-model-id`、`.bw-stage-bottom`、`.bw-marker > span`、`.bw-evidence-stage figcaption`、`.bw-observations li > span` | `app/work/bambino/workbench.css:1` |
| BAMBINO 交互数据 | `.bw-timeline button > span`、`.bw-finding > span`、`.bw-slider output`、`.bw-next-project > span`、`.bw-footer nav span` | `app/work/bambino/workbench.css:1` |
| BAMBINO 锁定演示 | `.bw-film-caption`、`.bw-film-chapters button span`、`.bw-film-timeline output` | `app/work/bambino/locking-film.css:4`、`:13`、`:17` |

## 4. 完整字体栈与回退关系

以下顺序是 CSS 声明顺序。浏览器按字体可用性及具体字符逐字选择；同一个元素可以同时使用两种以上字体。`sans-serif`、`serif`、`monospace`、`system-ui` 是通用类别，不是随项目安装的字体。

| 配置 | 字体顺序 |
| --- | --- |
| 主站 body | Arial → Helvetica Neue → PingFang SC → Microsoft YaHei → sans-serif |
| `--site-font-display` | Helvetica Neue → Arial Nova → PingFang SC → Noto Sans CJK SC → Microsoft YaHei → sans-serif |
| `--site-font-body` | Aptos → Helvetica Neue → PingFang SC → Noto Sans CJK SC → Microsoft YaHei → sans-serif |
| `--site-font-data` | SFMono-Regular → Roboto Mono → Cascadia Mono → Consolas → monospace |
| 展馆强调文字 / `--site-font-editorial` 的声明值 | Georgia → Times New Roman → Songti SC → serif |
| Simple Uni Life 品牌字 | Georgia → serif |
| RhineLab 根节点 | MiSans → Mi Sans → PingFang SC → Microsoft YaHei → system-ui → sans-serif |
| 首页外层工具条 | Arial → Microsoft YaHei → sans-serif |
| 档案项目准备提示 | Arial → sans-serif |
| SANGRE 展示 / 设备屏幕 | Manrope → Arial → sans-serif |
| SANGRE 静态降级版 | Manrope → sans-serif |
| SANGRE 数据标签 | Azeretmono → Arial → sans-serif |
| Quiet Focus 模板 | Helvetica Neue → Helvetica → Arial → PingFang SC → Microsoft YaHei → sans-serif |
| SANGRE vendor lightbox 工具样式 | Helvetica Neue → Helvetica → Ubuntu → Segoe UI → Verdana → sans-serif；本次页面无 lightbox 节点 |

### 字体名称逐项索引

除通用类别外，上述主站、独立展示及静态模板的配置共涉及 **23 个字体名称**，包含回退别名和未使用的 vendor 字体，不能理解为页面同时加载了 23 套字体。

| 字体名称 | 当前角色 |
| --- | --- |
| MiSans | 本地 Web 字体，档案界面实际使用 |
| Mi Sans | RhineLab 的备用名称；没有以此名称定义独立 `@font-face` |
| Manrope | 本地 Web 字体，SANGRE 展示和静态版实际使用 |
| Azeretmono / Azeret Mono | 同一套本地 Web 字体的 CSS 名称/字体名称，SANGRE 标签与数字使用 |
| Arial | 主站默认字体、外层工具条及多个栈的回退 |
| Helvetica Neue | 主站标题首选、主站正文与模板等区域的回退 |
| Helvetica | Quiet Focus 模板与 vendor lightbox 的回退；旧 SANGRE SVG 素材也声明它 |
| Arial Nova | 主站标题栈回退 |
| Aptos | 主站正文栈首选；本机抽样未实际选中 |
| PingFang SC（苹方） | 主站、RhineLab、模板的中文回退 |
| Noto Sans CJK SC | 主站正文与标题的中文回退 |
| Microsoft YaHei（微软雅黑） | 主站、RhineLab、模板的中文回退；本机多个主站区域的实际字体 |
| Georgia | 展馆英文强调与 UniLife 品牌字的实际字体 |
| Times New Roman | 展馆衬线强调的回退 |
| Songti SC（宋体-简） | 展馆衬线强调的中文回退 |
| SFMono-Regular | 主站数据栈首选 |
| Roboto Mono | 主站数据栈回退 |
| Cascadia Mono | 主站数据栈回退，本机数据编号实际使用 |
| Consolas | 主站数据栈回退 |
| Ubuntu | 仅 vendor lightbox 回退，本次无对应节点 |
| Segoe UI | 仅 vendor lightbox 显式回退；系统通用类别也可能自行选择它，但本次未据此认定实际使用 |
| Verdana | 仅 vendor lightbox 回退，本次无对应节点 |
| webflow-icons | vendor 内嵌图标字体，本次无对应图标节点且未加载 |

**额外观察：SimSun（宋体）** 未出现在上述 CSS 字体名称中，但本机 Chrome 为 `/work` 的中文衬线强调实际选择了它。它属于浏览器自动回退，不能与 `Songti SC` 混为同一个已安装字体。

## 5. 本地字体文件与字重

### MiSans

源目录：`RhineLabUI/public/fonts/`。部署副本：`public/rhine-lab/fonts/`。定义位置：`RhineLabUI/src/style.css:1` 起。

| 字重 | 文件 |
| --- | --- |
| 300 Light | `MiSans-Light.woff2` |
| 400 Regular | `MiSans-Regular.woff2` |
| 600 Demibold | `MiSans-Demibold.woff2` |
| 700 Bold | `MiSans-Bold.woff2` |

四个字重均设置 `font-style: normal`、`font-display: swap`。本次浏览器四个字重均加载成功。`RhineLabUI/src/main.ts:930`、`:931` 显式请求 400 与 700 字重。

Canvas 在 `RhineLabUI/src/scene.ts:727`、`:729`、`:733`、`:737`、`:740` 设置 MiSans（包括 81px、32px、130px、24px、64px）；这是源码确认，CDP 的 DOM 字体采样不能直接证明 Canvas 每个字符的最终像素字体。

### Manrope 与 Azeret Mono

源目录：`standalone/aether-replica/public/assets/vendor/`。部署副本：`public/sangre-showcase/assets/vendor/`。定义位置：同目录 `d0af8c6effae91.css:1`。

| 字体 | 字重 | 文件 |
| --- | --- | --- |
| Manrope | 200 | `4f6b6ff9881198.woff2` |
| Manrope | 300 | `ad7a02660c7c8e.woff2` |
| Manrope | 400 | `260037fd616be9.woff2` |
| Manrope | 500 | `a66fc77c4cbb4c.woff2` |
| Azeretmono | 300 | `6f990391e9b3f5.woff2` |
| Azeretmono | 400 | `3fbc8f997d5d73.woff2` |
| Azeretmono | 600 | `3e239c212ee2c1.woff2` |

七个字重均设置 `font-style: normal`、`font-display: swap`。首屏观察到 Manrope 400/500、Azeretmono 300 加载；其他文件的独立请求也全部成功。未被当前文字请求的字重显示 `unloaded` 是按需加载状态，不等于文件缺失。

`webflow-icons` 的 400 常规字重以 base64 TTF 内嵌在 vendor CSS 中，不计入上述 11 个 WOFF2 文件。生成目录是源码资源的副本，不重复计算字体数量。

## 6. 浏览器实际渲染结果

以下是本机抽样结果；“计算样式”显示的 CSS 字体栈与“实际渲染字体”分别核对，未以字体栈首项代替实测结论。

| 页面与抽样位置 | 实际渲染字体 | 说明 |
| --- | --- | --- |
| `/` 外层工具条 | Arial + Microsoft YaHei | 拉丁字与中文字分别选字 |
| `/rhine-lab/index.html` 品牌 h1、读取按钮、列导航 | MiSans | `isCustomFont: true`，本地 Web 字体 |
| `/work` 展馆过渡强调中文 | SimSun | 衬线中文字自动回退 |
| `/en/work` 展馆过渡强调英文 | Georgia | 系统字体 |
| `/work`、`/en/work` 导航内抽样文字 | Microsoft YaHei | 主站正文栈回退 |
| `/work/bambino` 标题和介绍 | Microsoft YaHei | 包括拉丁标题字样；未选中 Aptos |
| BAMBINO 章节数字 | Cascadia Mono | 等宽栈回退 |
| BAMBINO 模型状态标签 | Cascadia Mono + Microsoft YaHei | 同一元素内存在混合字体 |
| `/work/simple-uni-life` UniLife 品牌字 | Georgia | 独立品牌规则 |
| Simple Uni Life 城市标题 / 目录数字 | Microsoft YaHei / Cascadia Mono | 两种不同字体角色 |
| Battery、ARTI64 城市品牌与标题 | Microsoft YaHei | 品牌字的 Georgia 已被主题规则覆盖 |
| `/work/sangre#story` 案例标题和正文 | Microsoft YaHei | 使用主站字体栈 |
| SANGRE 案例章节标签、图注 | Cascadia Mono + Microsoft YaHei | 数字与中文混排 |
| SANGRE 动画展示 `.section__title` | Manrope Medium | CDP 返回字体内部名称；对应 CSS Manrope 500 |
| SANGRE 动画展示 `.indicator-w`、标签文字 | Azeret Mono Light | 对应 CSS Azeretmono 300 |
| SANGRE 减少动态效果模式的品牌字 | Manrope Medium | 静态版使用 Manrope 栈 |

SANGRE 独立展示分别访问了 `?lang=en` 与 `?lang=zh`。本次两者的抽样展示文案仍为英文，字体结果一致；不能据此声称已经验证该独立展示的中文字体覆盖。

## 7. 需要留意的配置与历史残留

1. **系统字体依赖仍然存在。** Aptos、Helvetica Neue、Arial Nova、SFMono-Regular、Roboto Mono 等只有字体栈声明，没有对应 Web 字体文件。它们不是导致页面无法运行的缺依赖，但不同机器会出现字体、字宽和换行差异。本次没有替换字体。
2. **Manrope 没有独立的 600/700 文件。** 例如静态版 `.static-brand` 请求 700，而现有最大声明字重为 500；本机该节点实际字体内部名称为 Manrope Medium。更高字重会依浏览器的字重匹配与合成规则呈现，不能视为已经提供原生 Manrope Bold。
3. **`--site-font-editorial` 仍是未被 `var()` 引用的变量。** 展馆强调直接写了相同的衬线栈。单独修改该变量不会改变当前展馆强调文字。
4. **旧 `--site-font-ui` 未定义引用问题，本次当前源码未再发现。** 不再将其列为现存问题。
5. **旧 SANGRE orbit 样式尚存，但未挂载。** `app/work/sangre/orbit.css:1` 声明 Arial / Microsoft YaHei。它的 `orbit-scene.ts:48` 引用 `public/sangre/portrait-dashboard.svg`，SVG 第 5 行声明 Arial / Helvetica / sans-serif；当前 iframe 展示不能据此被归类为 Arial 界面。
6. **SANGRE vendor 含未使用规则。** Azeretmono 还用于 `.modal__close-w`、`.preorder__footer-title`、`.specs__header`、`.specs__footer`、`.feature__desc` 等历史样式，不能仅凭规则存在认定当前页面仍显示这些区域。当前首屏实际确认的是标签云和数字指示。
7. **内嵌图标字体当前未使用。** 动画版与静态版均未发现 `[class^="w-icon-"]` / `[class*=" w-icon-"]` 或 `.w-lightbox-backdrop` 节点，`webflow-icons` 状态为 `unloaded`。
8. **Inter 只出现在旧备份中。** `app/globals.previous.txt`、`app/globals.v1.previous.txt` 的 Inter 不属于当前入口加载的样式，不应列为当前页面使用字体。

## 8. 检查范围与限制

- 检查主站 `app/` 的字体声明、继承与路由关系，RhineLab 源码、SVG 和 Canvas 字体声明，SANGRE 独立展示源码与 vendor 字体定义，以及公开静态模板。
- 浏览器抽样覆盖首页、档案 iframe、中文/英文作品目录、BAMBINO、Simple Uni Life、Battery、ARTI64、SANGRE 案例、SANGRE 动画与静态模式。没有逐个操作所有章节、弹窗和设备屏幕状态；未显示的节点只按源码或计算样式记录。
- Quiet Focus 静态模板与 `RhineLabUI/reference/` 检查辅助页进行了源码核对，没有逐页浏览器验证。辅助页主要使用 system-ui、monospace、Arial / Microsoft YaHei，`wave-compare.css` 另使用 MiSans；这些不等于主站生产页面字体。
- 未将 `node_modules`、构建副本、临时目录、参考素材和旧备份里的字体重复计入。图片、视频、PDF 内已经栅格化或转轮廓的文字不属于网页可切换的字体；外部嵌入站点也未进行字体审计。
- 未验证 macOS、iOS、Android 或其他浏览器；未开展字体许可专项审查，也未进行全站视觉回归或重新构建生产包。此报告的“实际字体”结论限定于上述 Windows Chrome 环境。
- 验证用临时浏览器均已关闭，额外启动的临时预览服务已停止；原有本地预览保持运行。
