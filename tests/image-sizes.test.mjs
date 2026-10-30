import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../app/portfolio-data.ts", import.meta.url), "utf8");
const output = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const { flatProjects, getBoardItems } = await import(`data:text/javascript;charset=utf-8,${encodeURIComponent(output)}`);

// Canvas size from the WebP header: lossy (VP8), lossless (VP8L) or extended (VP8X).
async function webpSize(src) {
  const bytes = await readFile(new URL("../public" + src, import.meta.url));
  assert.equal(bytes.toString("ascii", 0, 4) + bytes.toString("ascii", 8, 12), "RIFFWEBP", src);
  const chunk = bytes.toString("ascii", 12, 16);
  if (chunk === "VP8X")
    return [bytes.readUIntLE(24, 3) + 1, bytes.readUIntLE(27, 3) + 1];
  if (chunk === "VP8L") {
    assert.equal(bytes[20], 0x2f, src);
    const bits = bytes.readUInt32LE(21);
    return [(bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1];
  }
  assert.equal(chunk, "VP8 ", src);
  assert.equal(bytes.readUIntBE(23, 3), 0x9d012a, src);
  return [bytes.readUInt16LE(26) & 0x3fff, bytes.readUInt16LE(28) & 0x3fff];
}

function declaredImages(project) {
  const gallery = (project.gallery ?? []).map((image, index) => ({ where: "gallery." + index, src: image.src, size: [image.width, image.height] }));
  const cover = project.image ? [{ where: "image", src: project.image, size: [project.imageWidth, project.imageHeight] }] : [];
  const chapters = getBoardItems(project).filter((item) => item.image).flatMap((item) => [item.image, item.imageZh].filter(Boolean).map((src) => ({ where: "section." + item.id, src, size: [item.imageWidth, item.imageHeight] })));
  const pages = getBoardItems(project).flatMap((item) => (item.pages ?? []).map((page, index) => ({ where: "section." + item.id + ".pages." + index, src: page.src, size: [page.width, page.height] })));
  return [...gallery, ...cover, ...chapters, ...pages].map((image) => ({ ...image, where: project.id + "." + image.where }));
}

test("every project image declares the pixel size of its WebP file", async () => {
  const images = flatProjects.flatMap(declaredImages);
  assert.ok(images.some((image) => image.where.includes(".section.")), "chapter images should be checked");
  for (const { where, src, size } of images)
    assert.deepEqual(size, await webpSize(src), `${where} (${src})`);
});
