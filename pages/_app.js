import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Rodzic-Chat AI – zadaj anonimowe pytanie o swoje dziecko</title>
        <meta
          name="description"
          content="Anonimowy czat oparty na AI. Zadaj pytanie dotyczące rozwoju dziecka i otrzymaj informację bazującą na literaturze."
        />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
