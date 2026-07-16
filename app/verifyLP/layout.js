// qup-pulse-admin/src/app/(bare)/layout.js
// BARE_LAYOUT_V1 — a chrome-free layout for standalone pages that people land
// on from outside the app (email links, store review), where the site header /
// AppNav would be noise or actively confusing: the visitor isn't signed in and
// has nowhere to navigate to. Route groups in parentheses don't appear in the
// URL, so app/(bare)/verify/page.js still serves /verify.
//
// This layout deliberately renders `children` and nothing else. The <html> and
// <body> tags, fonts, and global CSS all come from the root app/layout.js,
// which still wraps this one — a nested layout must NOT re-declare them.
export default function BareLayout({ children }) {
  return <>{children}</>;
}