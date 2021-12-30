import { ReactNode, FC } from "react";

import { Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import MarketingNavbar from "../MarketingNavbar";
import Navbar from "../Navbar";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const router = useRouter();
  const { status } = useSession();

  const DynamicNavbar: FC<Props> = ({ children }: Props) => {
    // if (router.pathname === "/") {
    //   return (
    //     <Flex minHeight="100vh" flexDirection="column" flex={1}>
    //       <MarketingNavbar />
    //       {children}
    //     </Flex>
    //   );
    // } else if (status === "loading" || status === "unauthenticated") {
    //   return <>{children}</>;
    // }

    return (
      <Flex minHeight="100vh" flexDirection="column" flex={1}>
        <Navbar />
        {children}
      </Flex>
    );
  };

  return (
    <DynamicNavbar>
      <main style={{ display: "flex", flex: 1 }}>{children}</main>
    </DynamicNavbar>
  );
}
