import { Head, Html, Main, NextScript } from "next/document";

const analytics = `
  var _hmt = _hmt || [];
  (function() {
    var hm = document.createElement("script");
    hm.src = "https://www.googletagmanager.com/gtag/js?id=G-03EDS7WMQT";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
  })();
`;

// Avoid a flash of the wrong theme before React hydrates.
const themeInit = `
  try {
    var t = localStorage.getItem('theme');
    if (t === 'light') document.documentElement.classList.remove('dark');
    else document.documentElement.classList.add('dark');
  } catch (e) { document.documentElement.classList.add('dark'); }
`;

export default function Document() {
    return (
        <Html lang="en" suppressHydrationWarning>
            <Head>
                <meta charSet="utf-8" />
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                <meta name="theme-color" content="#070711" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
                    rel="stylesheet"
                />
                <script dangerouslySetInnerHTML={{ __html: themeInit }} />
                <script dangerouslySetInnerHTML={{ __html: analytics }} />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
