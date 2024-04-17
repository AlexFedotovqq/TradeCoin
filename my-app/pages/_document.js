import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className="scroll-smooth">
        <Head />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/coinlogo.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#fff"
        />
        <Main />
        <NextScript />
      </Html>
    );
  }
}

export default MyDocument;
