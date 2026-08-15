import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders Leon Zhou's portfolio shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Leon Zhou — Technical Designer<\/title>/i);
  assert.match(html, /Technical Designer/);
  assert.match(html, /Selected work/);
  assert.match(html, /zWorkFlow/);
  assert.match(html, /Tactical Game Design Document/);
  assert.match(html, /Next signature work/);
  assert.match(html, /theme-amber/);
  assert.match(html, /leonzhouziang@gmail\.com/);
  assert.doesNotMatch(html, /mailto:|accent-picker/);
  assert.match(html, /href="\/technical"/);
  assert.match(html, /href="\/games"/);
  assert.match(html, /href="\/design"/);
  assert.doesNotMatch(html, /Published projects|PROJECT_MEDIA/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("assigns the GitHub design vault to the tactical design document", async () => {
  const response = await render("/design");
  const html = await response.text();
  const tacticalStart = html.indexOf("project-tactics-design");
  const notesStart = html.indexOf("project-design-vault");
  const tacticalSection = html.slice(tacticalStart, notesStart);
  const notesSection = html.slice(notesStart);

  assert.match(tacticalSection, /GitHub design document/);
  assert.match(tacticalSection, /GameDesignVault/);
  assert.match(tacticalSection, /Legacy Notion document/);
  assert.doesNotMatch(notesSection, /GitHub vault|GameDesignVault/);
});

test("renders isolated category pages with route-specific metadata", async () => {
  const cases = [
    ["/technical", "Technical Projects — Leon Zhou", "Published projects"],
    ["/games", "Game Works — Leon Zhou", "Punch In Rush"],
    ["/design", "Design Experience — Leon Zhou", "Tactical Game Design Document"],
  ];

  for (const [path, title, content] of cases) {
    const response = await render(path);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp(`<title>${title}</title>`, "i"));
    assert.match(html, new RegExp(content));
    assert.match(html, /uniform-project-card/);
    assert.doesNotMatch(html, /<h2>Selected work<\/h2>/i);
    assert.doesNotMatch(html, /page-crosslinks/);
    assert.doesNotMatch(html, /property="og:image"|name="twitter:image"/i);
  }
});

test("renders framed project boards and the updated zWorkFlow tags", async () => {
  const response = await render("/technical");
  const html = await response.text();

  assert.match(html, /project-board-shell/);
  assert.match(html, /PROJECT_BOARD \/ /);
  assert.match(html, /Enlarge image: Reviewed change lifecycle/);
  assert.match(html, /Enlarge image: Unified 3D and UI routing/);
  assert.match(html, /CHANGE_LIFECYCLE/);
  assert.match(html, />Unity</);
  assert.doesNotMatch(html, />Python</);
});
