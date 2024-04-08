import Loading from "@/components/Loading";
import SnackbarContextProvider from "@/components/SnackbarProvider";
import { ActiveFacultyContextProvider } from "@/contexts/ActiveFacultyContext";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "reactflow/dist/style.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <Loading />
      </div>
    );
  }

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
