import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </RecoilRoot>
    </SessionProvider>
  );
}

export default MyApp;
