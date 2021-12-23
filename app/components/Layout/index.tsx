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
    if (router.pathname === "/") {
      return (
        <>
          <MarketingNavbar />
          {children}
        </>
      );
    } else if (status === "loading" || status === "unauthenticated") {
      return <>{children}</>;
    }

    return <Navbar>{children}</Navbar>;
  };

  return (
    <Flex minHeight="100vh" flexDirection="column">
      <DynamicNavbar>
        <main>{children}</main>
      </DynamicNavbar>
    </Flex>
  );
}
