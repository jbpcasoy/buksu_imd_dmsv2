import SnackbarContextProvider from "@/components/SnackbarProvider";
import { ActiveFacultyContextProvider } from "@/contexts/ActiveFacultyContext";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
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

      <SnackbarContextProvider>
        <SessionProvider session={session}>
          <ActiveFacultyContextProvider>
            <Component {...pageProps} />
          </ActiveFacultyContextProvider>
        </SessionProvider>
      </SnackbarContextProvider>
    </>
  );
}
