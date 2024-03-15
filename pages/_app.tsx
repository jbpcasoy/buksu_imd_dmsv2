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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin={""}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        ></link>
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
