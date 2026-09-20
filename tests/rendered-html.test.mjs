import assert from "node:assert/strict";
import test from "node:test";

let workerModulePromise;

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  workerModulePromise ??= import(workerUrl.href);
  const { default: worker } = await workerModulePromise;
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

async function htmlAt(path, status = 200) {
  const response = await render(path);
  assert.equal(response.status, status, path);
  return response.text();
}

test("server-renders the redesigned portfolio home", async () => {
  const html = await htmlAt("/");
  assert.match(html, /<title>Leon Zhou — Technical Designer<\/title>/i);
  assert.match(html, /class="home-intro/);
  assert.match(html, /Designing play\./);
  assert.match(html, /Building systems\./);
  assert.match(html, /class="featured-section[^"]*"[^>]*id="work"/);
  assert.match(html, /href="\/projects\/zworkflow\/?"/);
  assert.match(html, /href="\/projects\/tactics-design\/?"/);
  assert.match(html, /ActionQueue/);
  assert.doesNotMatch(html, /href="\/projects\/actionqueue\/?"/);
  assert.match(html, /class="featured-card is-pending"/);
  assert.match(html, /href="\/other\/?"/);
  assert.match(html, /class="site-footer"/);
  assert.match(html, /leonzhouziang@gmail\.com/);
  assert.match(html, /href="\/resume\/Ziang-Zhou-Resume\.pdf"/);
  assert.doesNotMatch(html, /brand-mark[^>]*>LZ<\/span>/);
});

test("category pages contain overview cards and no reader chapters", async () => {
  const cases = [
    ["/technical", "Technical Projects — Leon Zhou", ["zWorkFlow", "Interaction System", "Unity Editor Tools", "Procedural Locomotion", "Rendering studies"]],
    ["/games", "Game Projects — Leon Zhou", ["Punch-in Rush", "Hunt in Darkness", "Outlaw’s Deadend", "Alive", "Top Hotpot"]],
    ["/design", "Design Projects — Leon Zhou", ["Tactical Game Design Document", "Comparative Game Analysis", "Design Breakdown Notes"]],
  ];

  for (const [path, title, projectTitles] of cases) {
    const html = await htmlAt(path);
    assert.match(html, new RegExp(`<title>${title}</title>`, "i"));
    for (const project of projectTitles)
      assert.ok(html.includes(project), project);
    assert.match(html, /class="archive-header/);
    assert.match(html, /class="project-grid/);
    assert.doesNotMatch(html, /class="case-section|class="case-toc|class="project-reader|class="chapter-button/);
    assert.doesNotMatch(html, /href="#project-/);
  }
});

test("technical archive renders rendering studies as a gallery section", async () => {
  const html = await htmlAt("/technical");
  assert.ok(html.includes('<section id="project-rendering-studies"'), "rendering studies should be a section");
  assert.ok(!html.includes('<article id="project-rendering-studies"'), "rendering studies should not be a project card");
  for (const title of ["Stylized grass in Unity", "Depth-based water and caustics", "Wind-shaped desert", "Geometry Nodes grass source"])
    assert.ok(html.includes(title), `rendering gallery button: ${title}`);
  assert.ok((html.match(/class="rendering-gallery-strip"/g) ?? []).length === 1, "rendering gallery should have one strip");
});

test("the tactical design document keeps the GitHub vault link on its case page", async () => {
  const html = await htmlAt("/projects/tactics-design");
  assert.match(html, /GitHub design document/);
  assert.match(html, /GameDesignVault/);
  assert.match(html, /Legacy Notion document/);
  assert.match(html, /A navigable design vault/);
  assert.match(html, /Three phases, one consequence loop/);
  assert.match(html, /Make weakness part of the strategy/);
  assert.match(html, /Commitment, coordination, and uncertainty/);
  assert.match(html, /A settlement with a memory/);
  assert.match(html, /From scattered references to linked knowledge/);
  for (const id of ["vault-structure", "phase-loop", "design-principles", "decisions", "continuity", "maintenance"])
    assert.ok(html.includes(`id="chapter-${id}"`), `tactical chapter: ${id}`);
  assert.ok(html.includes("Obsidian"), "tactical case should identify the Obsidian vault");
  assert.ok(!/src="[^"]*(?:design-document|hunt-overview|hunt-design|hunt-systems|hunt-production)\.webp/.test(html), "tactical case should not render the old demo images");

  const notesHtml = await htmlAt("/projects/design-vault");
  assert.doesNotMatch(notesHtml, /GameDesignVault/);
});

test("direct project routes render full case studies", async () => {
  const html = await htmlAt("/projects/zworkflow");
  assert.match(html, /<title>zWorkFlow — Leon Zhou<\/title>/i);
  assert.match(html, /class="case-header/);
  assert.match(html, /class="case-summary/);
  assert.match(html, /id="chapter-change-lifecycle"/);
  assert.match(html, /id="chapter-shared-context"/);
  assert.match(html, /CHANGE_LIFECYCLE/);
  assert.match(html, /href="https:\/\/github\.com\/Hubr1zz\/zWorkFlow"/);
  assert.doesNotMatch(html, /Enlarge image:/);
});

test("image-backed cases keep real media and image-only expansion controls", async () => {
  const html = await htmlAt("/projects/punch-in-rush");
  assert.match(html, /id="chapter-punch-0"/);
  assert.match(html, /src="\/images\/portfolio\/punch-overview\.webp"/);
  assert.match(html, /class="media-expand"/);
  assert.match(html, /aria-label="Enlarge image: From combat study to morning commute"/);
  assert.match(html, /class="image-dialog"/);
});

test("article collection renders comparative essays without media", async () => {
  const html = await htmlAt("/projects/comparative-writing");
  const mainHtml = html.slice(html.indexOf("<main"), html.lastIndexOf("</main>") + "</main>".length);
  for (const title of ["Elden Ring and the Souls-like formula", "League of Legends / Dota: systems and strategy"])
    assert.ok(mainHtml.includes(title), `article title: ${title}`);
  for (const id of ["elden-ring", "lol-dota"])
    assert.ok(mainHtml.includes(`id="chapter-${id}"`), `article chapter: ${id}`);
  assert.ok((mainHtml.match(/href="https:\/\/docs\.qq\.com\/doc\/DWkdJTnVvUURTRHpU"/g) ?? []).length === 1, "Elden Ring article link should appear once");
  assert.ok((mainHtml.match(/href="https:\/\/docs\.qq\.com\/doc\/DWm5td0ZHUVBDem9v"/g) ?? []).length === 1, "LoL / Dota article link should appear once");
  assert.ok((mainHtml.match(/Read article/g) ?? []).length === 2, "both article cards should expose Read article");
  assert.ok(!/class="case-media|class="image-dialog"/.test(mainHtml), "article collection should not render media");
  const caseHeader = mainHtml.slice(mainHtml.indexOf('class="case-header'), mainHtml.indexOf("</header>") + "</header>".length);
  assert.ok(!caseHeader.includes('class="project-links"'), "article header should not render project links");

  const notesHtml = await htmlAt("/projects/design-vault");
  assert.match(notesHtml, /Notion notebook/);
  assert.doesNotMatch(notesHtml, /class="case-layout|class="case-toc|class="case-media|class="image-dialog"/);
});

test("all known project slugs pre-render and unknown slugs return framework 404", async () => {
  const slugs = [
    "zworkflow", "interaction", "editor-tools", "procedural-motion", "rendering-studies",
    "punch-in-rush", "hunting-in-darkness", "outlaws-dead-end", "alive", "top-hotpot",
    "tactics-design", "comparative-writing", "design-vault",
  ];
  for (const slug of slugs)
    assert.equal((await render(`/projects/${slug}`)).status, 200, slug);
  await htmlAt("/projects/not-a-real-project", 404);
});

test("other routes are reachable and expose their empty state", async () => {
  const other = await htmlAt("/other");
  assert.match(other, /<title>Other — Leon Zhou<\/title>/i);
  assert.match(other, /OFF THE CLOCK/);
  const projects = await htmlAt("/other/projects");
  assert.match(projects, /On the workbench\./);
});
