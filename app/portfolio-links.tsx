"use client";

import type { AriaAttributes, MouseEventHandler, ReactNode } from "react";
import Link from "next/link";

const assetBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const isGitHubPagesExport = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true";

export function assetPath(path: string) {
  if (!assetBasePath || !path.startsWith("/"))
    return path;
  return `${assetBasePath}${path}`;
}

function staticPageHref(href: string) {
  const [pathname, fragment] = href.split("#");
  const pagePath = pathname === "/" ? "/" : `${pathname.replace(/\/+$/g, "")}/`;
  return `${assetBasePath}${pagePath}${fragment ? `#${fragment}` : ""}`;
}

export function InternalLink({ href, id, className, children, "aria-current": ariaCurrent, "aria-label": ariaLabel, onClick }: { href: string; id?: string; className?: string; children: ReactNode; "aria-current"?: AriaAttributes["aria-current"]; "aria-label"?: string; onClick?: MouseEventHandler<HTMLAnchorElement> }) {
  if (isGitHubPagesExport)
    return <a id={id} className={className} href={staticPageHref(href)} aria-current={ariaCurrent} aria-label={ariaLabel} onClick={onClick}>{children}</a>;
  return <Link id={id} className={className} href={href} prefetch aria-current={ariaCurrent} aria-label={ariaLabel} onClick={onClick}>{children}</Link>;
}
