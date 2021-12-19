import { useEffect } from "react";

import { Box } from "@chakra-ui/layout";
import { Center, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useRecoilState } from "recoil";
import useSWR from "swr";

import { BoltAuthResponse, slackAuth, slackUser } from "../store/slack.recoil";

const API_URL = process.env.NEXT_PUBLIC_BOLT_URL;

const slackAuthFetcher = (url: string) => fetch(url).then((res) => res.json());

const SlackAuth: NextPage = () => {
  const router = useRouter();
  const { code } = router.query;

  const { data, error } = useSWR<BoltAuthResponse>(
    code ? `${API_URL}/auth?code=${code}` : null,
    code ? slackAuthFetcher : null
  );

  const [, setAuth] = useRecoilState(slackAuth);
  const [, setUser] = useRecoilState(slackUser);

  useEffect(() => {
    if (!data) return;

    const { ok: tokenOk, ...authData } = data.token;
    const { ok: userOk, ...userData } = data.user;

    if (tokenOk && userOk) {
      setAuth(authData);
      setUser(userData);

      router.push("/home");
    }
  }, [data, router, setAuth, setUser]);

  const SlackLoader = () => {
    if (error) {
      return (
        <Alert status="error">
          <AlertIcon />
          There was an error processing your request
          {JSON.stringify(error)}
        </Alert>
      );
    }

    return (
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    );
  };

  return (
    <Center height="100vh">
      <Box textAlign="center">
        <SlackLoader />
      </Box>
    </Center>
  );
};

export default SlackAuth;
