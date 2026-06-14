const withMDX = require("@next/mdx")({
    extension: /\.mdx?$/,
    options: {
        providerImportSource: "@mdx-js/react",
    },
});

/** @type {import('next').NextConfig} */
const config = {
    output: "export",
    images: {
        unoptimized: true,
    },
    reactStrictMode: true,
    pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
    env: {
        NEXT_PUBLIC_BASE_PATH: "",
    },
};

if (process.env.GITHUB_ACTIONS) {
    const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, "");
    config.assetPrefix = `/${repo}/`;
    config.basePath = `/${repo}`;
    config.env.NEXT_PUBLIC_BASE_PATH = `/${repo}`;
}

module.exports = withMDX(config);
