import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ActiveFacultyContextProvider } from "@/contexts/ActiveFacultyContext";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ActiveFacultyContextProvider>
        <Component {...pageProps} />
      </ActiveFacultyContextProvider>
    </SessionProvider>
  );
}
