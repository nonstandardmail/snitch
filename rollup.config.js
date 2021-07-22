"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var plugin_commonjs_1 = require("@rollup/plugin-commonjs");
var plugin_node_resolve_1 = require("@rollup/plugin-node-resolve");
var plugin_typescript_1 = require("@rollup/plugin-typescript");
var rollup_plugin_terser_1 = require("rollup-plugin-terser");
exports.default = {
    input: "src/index.ts",
    output: {
        file: "dist/snitch.min.js",
        name: 'Snitch',
        format: 'iife',
        sourcemap: true
    },
    plugins: [plugin_typescript_1.default(), plugin_commonjs_1.default(), plugin_node_resolve_1.nodeResolve(), rollup_plugin_terser_1.terser({ format: { comments: false } })]
};
//# sourceMappingURL=rollup.config.js.map