import { ReactElement, ReactNode } from "react";

import { ChakraProvider } from "@chakra-ui/react";
import { NextPage } from "next";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

import Layout from "components/Layout";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available

  const getLayout = Component.getLayout || ((page: ReactNode) => page);

  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
      </ChakraProvider>
    </SessionProvider>
  );
}
