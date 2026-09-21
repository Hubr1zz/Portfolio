# 暖白精密档案风 / Warm Editorial Archive

日期：2026-09-17
状态：本地重构已实现，待持续内容补充；未部署

## 2026-09-20 实施补充

本地重构已把视觉提案推进到可预览的页面结构：当前按五分类导航组织内容，首页保留三项精选位置，其中第三项为 `ActionQueue` 待补；项目详情拆成 13 个独立项目详情页，各页按连续章节组织内容，并提供桌面右侧目录。Other 已拆为 Games I Played 与 Other Projects 两个子页；Steam 使用本地快照，当前没有账号连接，页面仍保持空态。背景使用离线生成的静态 prerendered WebP，运行时不提供参数覆盖或控制面板，只保留有界的指针局部 transform；作品图和正文优先于背景。

补充参考 [Pentagram Work](https://www.pentagram.com/work) 的作品索引节奏，以及 [IBM 2x Grid](https://www.ibm.com/design/language/2x-grid/) 的对齐与间距方法；借鉴信息节奏，不搬运视觉资产、品牌或具体作品内容。

参考观察日期为2026-09-17；公开 main 分支与线上预览可能继续更新，本文不声称两者属于同一提交；线上预览见 [RhineLabUI](https://rhine.lubeiluchen.cc/)，仓库见 [RhineLabUI GitHub](https://github.com/LBEILC/RhineLabUI)。

## 核心方向

“暖白精密档案风 / Warm Editorial Archive”是本项目的工作名称，不是参考项目的官方名称，也不是公认的设计流派。它把暖灰白的安静底面、深色无衬线排版、少量琥珀信号、精密对齐与细线索引组合起来，再用柔和半透明层次和短促、可中断的状态转场赋予页面生命感。主项目图与成果证据始终是主角：访客应能先看懂作品，再通过职责、问题、方案和链接继续深入。整体词汇为清晰、理性、温和、克制、精密，并带一点研究机构的未来感。本文记录设计参考和可执行提案，目标是后续改版时能在本地预览、逐项验证；不是已完成的网站改版报告。

## 目标与根本问题

| 访客的根本问题 | 作品集需要给出的回答 | 可观察的页面目标 |
| --- | --- | --- |
| 你做什么？ | 用一句身份话语说明主要能力、媒介和关心的问题。 | 首屏先出现身份与项目入口，详细个人介绍可后置，文案待后续确认。 |
| 我该看哪些？ | 以精选项目作为第一入口，并提供 technical、games、design 三类索引。 | 访客不用猜路径即可进入项目详情，分类也不应把首屏变成目录墙。 |
| 为什么可信？ | 每个项目说明本人职责、所解决的问题、采取的方案和可查看的证据。 | 证据链接、实机画面、架构图、规则图或文档局部要比装饰更醒目。 |
| 怎样深入？ | 项目入口、媒体查看、Case、Code、Play 等语义清楚的链接。 | 直达项目与媒体，图片可放大，返回时保留焦点和滚动位置。 |
| 我会记住什么？ | 跨页面一致的细节、索引语言和克制动态。 | 通过统一的线、编号和琥珀信号建立识别度，而不是靠持续追踪光或大声特效。 |

“30 秒内知道定位并找到相关项目”是待验证的设计目标，不是已经测得的数据。后续应通过本地桌面、手机、长标题、缺图和连续交互逐项观察，再根据结果调整。

## 参考美术分析

以下内容按“参考事实”“风格解读”“作品集建议”区分。参考事实来自已查看的公开源码、设计文档和浏览器中的主要视图；没有把参考项目全部场景实现都当作已审阅对象。除明确标注源码事实外，本文的颜色、尺寸、时长和比例均为提案或待验证优选值。

### 色彩、空间与层次

【参考事实】参考界面呈现暖灰白底面，搭配黑色或深灰文字，以及低饱和杏金一类的信号色。背景对比保持低，文字对比保持高。画面使用宽留白和边缘锚点，主视觉与文字之间不是平均分栏，而是带有非对称配重；详情视图约为左侧视觉、右侧资料。磨砂透明和轻阴影被用作局部层次手段，内容面以更深的文字形成阅读层；本次没有逐元素测量参考站的对比度。

【风格解读】暖色的价值在于削弱冷硬的仪器感，让资料页仍有人的尺度；深色文字又为档案、说明和证据提供可靠阅读基线。留白不是空置，而是为作品图、编号和章节边缘建立呼吸区。透明层只有在信息关系明确时才有用，若每个卡片都加玻璃和阴影，档案感会变成表面噪声。

【作品集建议】把大面积中性色交给页面，把作品自身的色彩留给作品。游戏画面、界面和设计材料不要统一调成灰褐色。首页应让主图在宽留白中占据明确面积；详情页可采用左图右资料的方向，但不要把所有内容永远锁成同一个比例。需要浮起的查看器或提示层再使用磨砂与轻阴影，正文区域不应因透明效果而变灰。

### 字体、装饰与节奏

【参考事实】参考图面将粗主标题、细辅助文字、短英文标注和中文正文分成层级；不会把所有正文做成等宽字或全大写。1px 细线、短横、点、箭头、刻度、编号和基准线只在节点处出现。重复单元形成节奏；选中项突出，其余元素退后。大部分页面保持稳定，状态变化有明确原因。

【风格解读】装饰语言像索引系统，作用是标记位置、关系或阶段，而不是替内容发声。粗标题负责远距离识别，辅助层负责定位，正文负责解释证据。重复单元让多个项目共享规则，选中状态才有对比，页面因此可以有未来感而无需依赖复杂模型。稳定背景给变动留出意义：只有访客动作、章节进入或查看器开关需要动时，动态才成为反馈。

【作品集建议】主语法只选“索引编号 + 细基准线 + 少量定位角”。圆弧、点阵或扫描只能作为一处可选签名，不与全部语法叠加。编号必须真实，图注必须解释正在展示的证据，不能编造权限、分析进度或在线人数。每个组件最多一种主装饰；非交互装饰不应看起来像按钮。项目名称必须立即可读，不能为了模拟档案系统而延迟显示。

### 参考世界观与作品集任务的边界

【参考事实】参考项目的界面围绕世界观沉浸、档案检索、身份验证、场景切换和三维总览建立体验；它的模型、品牌、图片和音效属于该项目自身的内容。

【风格解读】我们借鉴的是对齐、信息层级、细线索引、局部透明深度、重复单元和有原因的动效。模型不是这种气质的必要条件，3D 也不是所有高级感的来源。

【作品集建议】作品集服务的是作品检索与成果说明。可以学习“像进入档案”的秩序，但不复制参考项目的确切模型、品牌、图片或音效，不要求安装库或 Three.js。每一处沉浸感都要能回答“它怎样帮助访客理解这个项目”。

## UI 与动效实现证据

下表列出可复查的公开源码事实，以及它们对作品集的转译。源码中的参数是参考实现的事实；转译后的时长、尺寸和使用范围是本作品集提案。

| 来源与【参考事实】 | 【风格解读】 | 【作品集建议】 |
| --- | --- | --- |
| [`src/style.css`](https://github.com/LBEILC/RhineLabUI/blob/main/src/style.css) 的 `:root` 使用 MiSans 与 system fallback，正文色为 `#080a08`，底色为 `#e8e5e1`；`scene-atmosphere` 使用 linear/radial gradient；细线以及独立的 label、metadata 层承担结构提示。 | 可靠气质来自基线、留白和层次关系，不只来自字体名字或渐变。 | 可复用已配置的 Geist/Geist Mono，并统一实际应用；建立暖白、深文字、琥珀信号的统一 token。梯度只作低对比背景大气，不能盖住图和正文。 |
| [`src/ui-transitions.ts`](https://github.com/LBEILC/RhineLabUI/blob/main/src/ui-transitions.ts) 的 `SurfaceTransition` 使用 Web Animations API；默认进入 300ms、退出 200ms，进入位移 12px、退出 8px；进入缓动为 `cubic-bezier(0.22,1,0.36,1)`，退出为 `cubic-bezier(0.4,0,1,1)`。它从当前 computed opacity/transform 接续，并用 revision 排除过期完成回调；`ContentTransition` 为 150ms；reduced motion 直接完成。 | 可中断和连续的状态比固定时长本身更重要。连续点击时，最新状态应取代旧状态，不能等一串动画排完。 | 采用统一快启动、慢停止的短转场；可用 WAAPI 从当前状态接续，并让 revision 或等价机制防止旧回调隐藏新内容。时长只作为提案，必须配合键盘、触控和 reduced motion 验证。 |
| [`src/document-decryption.ts`](https://github.com/LBEILC/RhineLabUI/blob/main/src/document-decryption.ts) 用 `Range.getClientRects` 根据实际换行生成装饰遮罩，语义文字本身不拆分；遮罩 `aria-hidden`。玻璃 clarity 开始后约 0.95 秒揭示，遮罩横向移走；reduced motion 直接移除。 | 细节揭示可制造档案感，但正文的可读性和语义不能被效果拦住。以实际排版生成遮罩，比把字拆成动画碎片更稳妥。 | 只把这类思路转译为图片或章节边缘的短揭示，正文一加载就可读，不能让访客等待“解密”。遮罩必须是辅助层，并在无动态模式中直接消失。 |
| [`src/boot-motion.ts`](https://github.com/LBEILC/RhineLabUI/blob/main/src/boot-motion.ts) 按输入时间计算阶段和元素属性，分为 access、logo、auth、scan、welcome；连续运动与分帧切换分工。 | 阶段性动作有叙事意义，但完整启动流程属于它的世界观，不能直接成为作品集加载门槛。 | 把它转译成页面已可操作时的短入场：身份、导航、首张主图在一次短序列中进入，不照搬长身份验证开场、闪烁或等待。 |
| [`DESIGN.md`](https://github.com/LBEILC/RhineLabUI/blob/main/DESIGN.md) 的设计文档描述标题/编号约 460ms 滚动、最新目标接续、不排队中间输入，reduced motion 保持最终文字。此处仅引用文档描述，不声称读过所有 scene 实现。 | 编号可以用来强化检索感，但项目标题应优先于档案戏剧性。 | 编号动画可选 240–360ms，标题保持立即可读；页面不为每条内容排长队。可借鉴“最新目标接续”和 reduced 状态的原则，不要求安装库或 Three.js。 |

## 可迁移的平面设计原则

这些原则用于补充作品集判断，不能表述为参考作者的师承关系。

1. 瑞士国际主义设计强调网格、无衬线、清楚的信息关系和克制颜色。迁移结果是先定对齐线和内容顺序，再决定装饰；网格服务项目证据，而不是把每张图塞进同样大小的格子。参考：[瑞士国家图书馆（Swiss National Library）关于 International Style 1950–1970](https://www.nb.admin.ch/en/the-international-style-1950-1970)。
2. IBM 2x Grid 用有限的空间单位处理间距、对齐和图片比例。迁移结果是采用 12 列桌面、4 列移动，使用 4px 微调和 8px 空间节奏；12 列是本项目的易读提案，不要求遵照 IBM 的 2x 列数。参考：[IBM 2x Grid](https://www.ibm.com/design/language/2x-grid/)。
3. IBM editorial rhythm 通过大小版块的重复与交替形成阅读节奏。迁移结果是让精选项目、章节说明、证据图和次级链接交替出现，避免每一段都用同一种卡片。参考：[IBM Layout Tips and Techniques](https://www.ibm.com/design/language/layout/tips-and-techniques/)。
4. Dieter Rams/Vitsœ 的有用、清楚、细节周到和减少非必要元素，可转成作品集里的行动准则：每个动效都给反馈，每条说明都能帮助判断，每个装饰都要有索引作用。参考：[Vitsœ 关于 good design](https://www.vitsoe.com/us/about/good-design)。Carbon 的 motion 原则可补充功能反馈与表现动效分层：反馈先服务操作，表现动效才作为轻量氛围。参考：[Carbon Motion Overview](https://carbondesignsystem.com/elements/motion/overview/)。

## 本地当前网站对照

【参考事实】本段基于本地源码和浏览器桌面观察，不是猜测。当前站点使用黑色底、荧光黄绿强调和琥珀等高线；首页首屏以巨型、紧排的 “Leon Zhou” 和自我介绍为主。technical 页的大标题区当前 CSS `min-height: 60svh`。项目卡片由外卡片、浅色网格展板和内图多重边框组成；technical 的明亮展板里有两张窄图，桌面观察中内容被缩小并裁掉两侧，后续应优先完整或横向可读地展示。持续 Canvas 等高线和指针视差会与内容争夺注意。站点已有 technical、games、design 三类，以及项目文字、链接、材料、可放大图片和减少动态样式等价值。

【风格解读】现有内容已经能证明作品范围和材料基础；问题主要在视觉重心：首屏的名字比项目更先占据注意，多个边框和两套强调色增加了扫描成本，持续画布和指针反馈让稳定阅读变难。这是基于源码结构与视觉观察的判断，不是用户测试结果。

【作品集建议】保留现有内容与三类分类。把标题缩到能给精选项目让路的尺寸，导航保持稳定，主图放大并减少套框，辅助文字从 12px 起步，去掉正文视差和全页追踪光。若保留背景等高线，只留一处低对比、静态的签名，并统一使用琥珀信号，不保留两套强调色。第三个作品的位置不默认删除或改写其文案；待后续确认精选组合后再决定弱化方式，不替用户选择第三个项目。

观察依据：[`app/portfolio.tsx`](D:/MyLibrary/MyLibrary/app/portfolio.tsx)、[`app/globals.css`](D:/MyLibrary/MyLibrary/app/globals.css)、[`app/layout.tsx`](D:/MyLibrary/MyLibrary/app/layout.tsx) 与 localhost:3000 的桌面浏览；localhost:3000 当前版本只是对照浏览，未实施本提案。

## 可执行视觉规范（提案）

| 项目 | 初始提案 | 使用边界 |
| --- | --- | --- |
| 画布与内容面 | 画布 `#F2F0EB`；内容面 `#FAF9F6`。 | 大面积使用中性色，作品媒体保留自身颜色。 |
| 文字与结构 | 正文 `#22251F`；次级 `#666961`；装饰分隔 `#D9D6CE`。 | `#D9D6CE` 不能作为唯一交互边界；必要状态要有文字、形状或更深边线。 |
| 琥珀信号 | 亮琥珀 `#B68850`；文字/焦点深琥珀 `#79572E`；浅琥珀 `#E9DCC9`。 | 亮琥珀适合点、填充和装饰，不直接做小字号文字；深琥珀用于文字和焦点。 |
| 字体 | 可复用已配置的 Geist/Geist Mono，并统一实际应用。正文 16–18px、行高 1.55–1.7；小标签 12–13px、行高约 1.4；项目名 28–40px；章节 36–56px；首页桌面 56–88px、移动 36–48px。 | 中英分别校准字距；中文不要大字距，也不要照搬参考项目的微小屏幕文字。所有尺寸是提案。 |
| 网格与容器 | 桌面 12 列、移动 4 列；内容最大宽 1200–1280px；桌面页边 48–64px，手机 20–24px。 | 在窄屏优先保留标题、图和证据按钮，避免横向滚动。 |
| 间距与比例 | 4px 微调、8px 空间节奏；段间桌面 64–96px、移动 40–56px；图文可用 7:5 或 8:4 示意。 | 主图优先横图 16:9 或 4:3；文档/架构图完整 `contain` 并可放大，不强裁。 |
| 表面与形状 | 角半径 0–4px；不做胶囊式满屏控件。最多一层主框，悬浮才加轻阴影。 | 非交互装饰不可伪装成按钮；阴影不能替代边界、焦点或层级。 |

以上是纯色前景与 `#F2F0EB` 背景的相对亮度计算：`#22251F` 为 13.63:1，`#666961` 为 4.91:1，`#79572E` 为 5.73:1，`#B68850` 为 2.78:1，`#D9D6CE` 为 1.28:1。它们解释了为什么亮琥珀、浅分隔线只能作装饰，选中态指示线、必要图标和 focus 应使用深琥珀；浅琥珀的点不能独自传达状态。透明叠加、图片背景和实际页面组合仍需复测。正文和大字目标可参照 [WCAG 2.2 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)，必要非文字控件可参照 [WCAG 2.2 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)。

## 装饰语法与内容证据

首版只启用“索引编号、细基准线、少量定位角”。编号可以表达项目序号、章节顺序或真实年份，但不要虚构权限、分析进度、在线人数或其他系统状态。图注要解释画面证明了什么，例如“负责交互逻辑与状态切换”，前提是该职责确有内容支持。每个组件最多使用一种主装饰：有编号就不再加扫描条，有基准线就不需要点阵包围。

图片应保持自己的风格。technical 项目优先呈现真实工作流、操作证据、架构关键点或可运行结果；games 优先实机截图或短片，并说明本人贡献；design 优先规则图、文档局部和解说，说明问题、约束、机制与验证。概念图必须标注“示意”或等价说明，不能伪装成运行截图。项目预览至少展示名称、类型、一句价值、本人的角色（现有内容没有时待补，不能臆造）、主媒体，以及语义清楚的 Case/Code/Play 链接。媒体查看器应允许放大，说明文字靠近证据而非藏进装饰层。

## 动效提案

| 触发 | 效果 | 时长提案 | 边界与无障碍 |
| --- | --- | --- | --- |
| hover / focus | 颜色或边线变化。 | 140–180ms | 键盘 focus 与鼠标同等反馈；不只靠颜色。 |
| 导航切换 | 当前指示线平移到新项。 | 180–240ms | 导航仍然稳定可点，不把页面滚动锁住。 |
| 章节进入 | 内容整体向上或向下 8–16px、opacity 进入一次。 | 300–450ms | 每个章节一次，不逐条排成长队。 |
| 卡片聚焦 | 边线强调或主图轻微放大，二选一。 | 180–240ms | scale 不超过 1.015；文字不要同时晃动。 |
| 图片查看器打开/关闭 | 从来源位置连续展开并淡入，关闭回到来源。 | 打开 260–320ms；关闭 160–220ms | 无法连续展开时可降级为淡入；退出恢复焦点与滚动位置。 |
| 编号显示 | 编号轻微进入或计数。 | 240–360ms，可选 | 项目标题不延迟滚动；最新目标接续，旧回调不能覆盖新状态。 |
| 签名图形 | 轻呼吸或极慢偏移。 | 6–10s，可选 | 首版建议静态；不能持续干扰阅读。 |

统一采用快启动、慢停止的无弹跳曲线；同一时刻只有一个主运动。全屏不做滚动劫持、自动轮播、长开场或声音自动播放。`prefers-reduced-motion` 下停用位移、滚动和呼吸，直接呈现最终状态；连续点击时最终状态优先。动效管理要允许打断，从当前 computed 状态接续，避免旧完成回调隐藏新内容。

## 页面应用建议

首页顺序可从导航、名字与身份一句话开始，尽快接上两项现有精选入口及主图，再给出 technical、games、design 三类索引，最后放简历与联系入口。详细个人介绍下放，文案以后确认。首屏的任务是让作品被看见，不是完成完整个人传记。

technical 详情先给图片区，配架构关键点、本人职责、解决的问题和证据按钮。games 先让访客看到实际玩法，再说明本人贡献和可玩的入口。design 以问题→约束→机制→验证组织材料，避免把整页缩小的文档当成封面。每个项目的预览卡保持名称、类型、一句价值、角色、主媒体和 Case/Code/Play 链接的稳定顺序；缺少角色资料时标记待补，不替作者补写。

布局可以逐步演进，不强制立刻新增路由或复杂 CMS。现有 React、CSS 和 SVG 足以承载首版；只有真实作品需要且确能提升理解时才增加 3D。每项新增装饰先回答它帮助访客定位、比较、理解证据中的哪一个问题。

## 落地顺序与验收边界

先完成静态层级：首屏内容顺序、导航、项目预览、详情结构和证据链接；再统一颜色、字体、网格、边框和焦点样式；最后只选择一两处动效做中断与 reduced motion 验证。改版期间使用本地预览，不部署。验证覆盖桌面、手机、长标题、缺图、高色彩项目、连续点击、键盘操作与减少动态模式，优先保证内容首屏，而不是加载模型。

网页在没有 WebGL 时也必须能访问全部项目：正文放在 DOM，链接使用原生交互，视觉效果采用 CSS/SVG/现有 React，动效用 WAAPI 或等价的可中断机制做渐进增强。正文与项目链接默认可见，动画脚本未执行或失败时也能阅读；不能依赖 reveal 才恢复内容可见性。不要强制换栈。验收视口包括 320、390、768、1440px；还要检查 200% 缩放。正文目标对比度为普通文字至少 4.5:1，大字至少 3:1；必要控件的边界和状态至少 3:1，装饰细线可按其非文字装饰性质处理；触控目标建议至少 44px，这是本项目的触控设计建议，不是 WCAG AA 的统一要求。这些都是待实施验证项目，不代表测试已经通过。

本次工作的证据范围是源码检查、桌面浏览器观察和参考设计文档审查；没有做手机实机、性能、Lighthouse 或用户测试，不承诺 60fps 或任何 Lighthouse 分数。后续实现后仍需在本地检查实际加载与交互流畅度，发现瓶颈再做针对性测量。

## 可直接复用的风格简述

暖白精密档案风 / Warm Editorial Archive 是面向作品集的暖灰白编辑式档案视觉：以安静中性色、深色无衬线、精密网格、真实编号、细基准线和少量琥珀信号组织内容，让主项目图与成果证据先被看见，再由职责、问题、方案和链接支持深入阅读。页面大部分时间稳定，章节进入、导航切换和图片查看器只在有原因时以短促、平滑、可打断的动作反馈。透明层、阴影、定位角和可选签名图形都只局部使用；作品自身色彩不被抹平，正文始终可读。它借鉴档案检索的秩序和研究机构的克制未来感，不复制任何参考项目的模型、品牌、图片或音效，也不把 3D 当作必要条件。

## 集中参考来源

- [RhineLabUI `src/style.css`](https://github.com/LBEILC/RhineLabUI/blob/main/src/style.css)
- [RhineLabUI `src/ui-transitions.ts`](https://github.com/LBEILC/RhineLabUI/blob/main/src/ui-transitions.ts)
- [RhineLabUI `src/document-decryption.ts`](https://github.com/LBEILC/RhineLabUI/blob/main/src/document-decryption.ts)
- [RhineLabUI `src/boot-motion.ts`](https://github.com/LBEILC/RhineLabUI/blob/main/src/boot-motion.ts)
- [RhineLabUI `DESIGN.md`](https://github.com/LBEILC/RhineLabUI/blob/main/DESIGN.md)
- [瑞士国家图书馆（Swiss National Library）：The International Style 1950–1970](https://www.nb.admin.ch/en/the-international-style-1950-1970)
- [IBM Design Language：2x Grid](https://www.ibm.com/design/language/2x-grid/)
- [IBM Design Language：Layout Tips and Techniques](https://www.ibm.com/design/language/layout/tips-and-techniques/)
- [Vitsœ：Good design](https://www.vitsoe.com/us/about/good-design)
- [Carbon Design System：Motion Overview](https://carbondesignsystem.com/elements/motion/overview/)

## 2026-09-20 页面迭代补充

本轮页面整理把背景统一为离线生成的静态 prerendered WebP，正文内容层保持相对定位并位于背景之上；运行时只保留有界的指针局部 transform，不提供参数覆盖或控制面板。首页保留轻几何切割，technical、design、games 档案页分别使用互连节点、错位文档注册线、轨迹节点 SVG 装饰。technical 内容改为更易扫描的横向 row cards，rendering 项目使用一个主 stage 配合可滚动的缩略图条，便于在完整查看画面与快速切换之间移动。

内容结构补充了比较文章的 article collection，把文章标题、摘要、语言和入口集中呈现；Tactical 项目则以 Obsidian vault 的可导航叙事说明 Hunt、Showdown、Settlement 及其规则、词汇和修订关系。导航增加稳定的 panel 入口，让访客可以在首页、分类、项目和 Other 之间移动，同时保留正文链接和键盘路径。

这次迭代继续把参考实现中的空间秩序、层级和可中断状态转译为平面作品集语言，不复制参考项目内容。具体源码事实与参考来源仍以 [RhineLabUI DESIGN.md](https://github.com/LBEILC/RhineLabUI/blob/main/DESIGN.md) 及文中列出的 [RhineLabUI GitHub](https://github.com/LBEILC/RhineLabUI) 文件为准；本地实现的项目内容和证据链接以 [Portfolio GitHub](https://github.com/Hubr1zz/Portfolio) 为准。

本轮内容层级让编号紧邻真实标题：Technical 分为 `01 Published projects`、`02 Studies & experiments`、`03 Rendering studies`，标题左齐，说明从标题起始线展开。卡片 metadata 只保留编号与年份，首页精选标题直接左齐，Résumé 位于右侧斜切区上方、Explore 位于其下方，并以暖金 outlined 按钮作为次级入口。标签改为细线 capsule，完整单词保持在同一标签内；vault-map 的三条上下堆叠，分别说明 Principles & world、Hunt / Showdown / Settlement、Shared rules / Terms / References。

案例章节按内容差异选择 prose 或同权重 bullet。Scene Tools 说明 Camera follow & LookAt、Rotation root、Saved expansion 三项；Interaction input-control 保留 Input phases、Targeting、Control 三项。Unity Editor Tools 明确区分 Favorites 重构、Inspector workflows、Unity 兼容性与 Scene Tools，并在详情 header 使用 `Built on vSeries` 归属面板列出五个原作链接；章节下方安静列出对应 commit 证据。

全屏纹理由离线生成器导出为静态 prerendered WebP；运行时没有 contour controls、URL 参数、localStorage 覆盖或浏览器调参入口。页面只保留有界的指针局部 transform，生成器在离线流程运行，发布页面不承担纹理计算。

## 2026-09-20 首页构图、阅读层与动效实现摘要

本轮首页移除了 `Other` teaser 行，导航仍保留 Other；首屏保留原主文案，Resume 位于 Explore selected work 上方。Selected work 的标题直接左齐，不再为首页标题预留编号空列。Profile 区移动到 hero 与 Selected work 之间，改为 `About Me`；左侧以两个独立块级名字行 `Leon`、`Zhou` 标识，并在名字下保留完整 profile lead，右侧先显示 USC 在读说明，再接 RPI、mechanics/math 与 seeking-goal 原文；桌面使用 480px 以上的双栏阅读区，右栏下移 40px，窄屏自然单列。

首页下半段使用全宽双栏网格，摘要限制在 620px；右侧 actions 使用暖金斜切 plane、直角注册 SVG、Resume 暖金 outline 和深色 Explore。按钮保持明确顺序与触控高度，320px 宽度下也不会溢出。正文相关内容使用连续的暖白 `reading-surface` 和柔化纸面边缘（`background: var(--paper)` 与 `box-shadow: 0 0 14px 10px var(--paper)`），没有把所有段落变成独立卡片；图片、流程图和深色 Continue 区保留原有表面。

入场效果是 CSS/SVG 的短序列：职位行使用约 560ms 的 `steps(40)` clip reveal，首页标题两行以 520ms、90ms 间隔从左侧进入，actions plane 约 600ms 滑入，按钮使用 340ms 级联并以 100ms 错开；archive/case header 使用 420–440ms 的侧向 reveal，档案 SVG 路径使用 `pathLength=1` 的 640ms 描边绘制，圆点使用 260ms 淡入并延迟 440ms。所有动画只运行一次，没有视频、WebGL 或无穷循环；`prefers-reduced-motion` 会立即清除 delay、clip、opacity、transform 和描边偏移，完整 DOM 文本始终可读。页面入场使用 `backwards`，动画结束后不会留下破坏 sticky 或文本渲染的 transform。

本轮实际纹理由离线生成器导出为静态 prerendered WebP，运行时不暴露“仅边缘线”调参面板、Warp 滑块、URL 参数或 localStorage 覆盖；页面只保留有界的指针局部 transform，纹理生成过程在发布前的离线流程完成。纹理仍只位于全屏留白和板块间隙，阅读层通过纸面连续底保持清晰。

动效转译继续以 RhineLabUI 的公开源码为参考事实：[`boot.ts`](https://github.com/LBEILC/RhineLabUI/blob/main/src/boot.ts) 负责 DOM/SVG 启动入口，[`boot-motion.ts`](https://github.com/LBEILC/RhineLabUI/blob/main/src/boot-motion.ts) 提供自定义时间轴、clipPath 面板和 transform 滑入思路，[`style.css`](https://github.com/LBEILC/RhineLabUI/blob/main/src/style.css) 提供线条、label 与 atmosphere 的层级参考。作品集只采用这些可迁移的时序和几何原则，不复制参考项目的品牌、内容或长启动门槛。
