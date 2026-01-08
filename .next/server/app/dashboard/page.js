const CHUNK_PUBLIC_PATH = "server/app/dashboard/page.js";
const runtime = require("../../chunks/ssr/[turbopack]_runtime.js");
runtime.loadChunk("server/chunks/ssr/node_modules_60d6fa._.js");
runtime.loadChunk("server/chunks/ssr/[root of the server]__a582fb._.js");
runtime.getOrInstantiateRuntimeModule("[project]/.next-internal/server/app/dashboard/page/actions.js [app-rsc] (ecmascript)", CHUNK_PUBLIC_PATH);
module.exports = runtime.getOrInstantiateRuntimeModule("[project]/node_modules/next/dist/esm/build/templates/app-page.js?page=/dashboard/page { COMPONENT_0 => \"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)\", COMPONENT_1 => \"[project]/src/app/not-found.tsx [app-rsc] (ecmascript, Next.js server component)\", COMPONENT_2 => \"[project]/src/app/dashboard/page.tsx [app-rsc] (ecmascript, Next.js server component)\" } [app-rsc] (ecmascript) <facade>", CHUNK_PUBLIC_PATH).exports;
