import React from "react";

import { Center, Spinner } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const FullPageLoader = () => (
  <Center height="100vh">
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
      label="loading"
    />
  </Center>
);

const authenticatedRoute = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const AuthenticatedRoute: React.FC<P> = (props: any) => {
    const { status } = useSession();
    const router = useRouter();

    if (process.env.NODE_ENV === "development") {
      return <Component {...props} />;
    }

    if (status === "loading") {
      return <FullPageLoader />;
    }

    if (status === "unauthenticated") {
      router.push("/");
      return <FullPageLoader />;
    }

    return <Component {...props} />;
  };

  return AuthenticatedRoute;
};

export default authenticatedRoute;
