const CHUNK_PUBLIC_PATH = "server/app/demo/page.js";
const runtime = require("../../chunks/ssr/[turbopack]_runtime.js");
runtime.loadChunk("server/chunks/ssr/node_modules_d1dad1._.js");
runtime.loadChunk("server/chunks/ssr/[root of the server]__29ab30._.js");
runtime.getOrInstantiateRuntimeModule("[project]/.next-internal/server/app/demo/page/actions.js [app-rsc] (ecmascript)", CHUNK_PUBLIC_PATH);
module.exports = runtime.getOrInstantiateRuntimeModule("[project]/node_modules/next/dist/esm/build/templates/app-page.js?page=/demo/page { COMPONENT_0 => \"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)\", COMPONENT_1 => \"[project]/src/app/not-found.tsx [app-rsc] (ecmascript, Next.js server component)\", COMPONENT_2 => \"[project]/src/app/demo/page.tsx [app-rsc] (ecmascript, Next.js server component)\" } [app-rsc] (ecmascript) <facade>", CHUNK_PUBLIC_PATH).exports;
