import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ActiveFacultyContextProvider } from "@/contexts/ActiveFacultyContext";
import Head from "next/head";
import "reactflow/dist/style.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <Head>
        <title>BukSU IMD DMS</title>
      </Head>

      <SessionProvider session={session}>
        <ActiveFacultyContextProvider>
          <Component {...pageProps} />
        </ActiveFacultyContextProvider>
      </SessionProvider>
    </>
  );
}
