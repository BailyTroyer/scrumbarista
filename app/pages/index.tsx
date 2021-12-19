import { Box, Heading } from "@chakra-ui/layout";
import { Center, Spinner, Alert, AlertIcon, Button } from "@chakra-ui/react";
import type { NextPage } from "next";
import { signIn, getSession, getProviders } from "next-auth/react";
import useSWR from "swr";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = (url: string): Promise<string> =>
  fetch(url).then((res) => res.text());

const Home: NextPage = () => {
  const { data, error } = useSWR(`${API_URL}/health`, fetcher);

  const HealthResponse = () => {
    if (error)
      return (
        <Alert status="error">
          <AlertIcon />
          There was an error processing your request
        </Alert>
      );
    if (!data)
      return (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      );
    return (
      <Heading as="h2" size="2xl">
        ✨ {data} 💸
      </Heading>
    );
  };

  return (
    <Center height="100vh">
      <Box textAlign="center">
        {/* <HealthResponse /> */}

        <Button
          onClick={() =>
            signIn("slack", {
              callbackUrl: `${window.location.origin}/home`,
            })
          }
        >
          Sign in
        </Button>

        {/* <a
          href="https://slack.com/openid/connect/authorize?scope=openid&amp;response_type=code&amp;redirect_uri=https%3A%2F%2Fbfd6-76-180-77-48.ngrok.io%2Fslack&amp;client_id=1704809032615.2750811155632"
          className="align-items:center;color:#000;background-color:#fff;border:1px solid #ddd;border-radius:4px;display:inline-flex;font-family:Lato, sans-serif;font-size:16px;font-weight:600;height:48px;justify-content:center;text-decoration:none;width:256px"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="height:20px;width:20px;margin-right:12px"
            viewBox="0 0 122.8 122.8"
          >
            <path
              d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"
              fill="#e01e5a"
            ></path>
            <path
              d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"
              fill="#36c5f0"
            ></path>
            <path
              d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"
              fill="#2eb67d"
            ></path>
            <path
              d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
              fill="#ecb22e"
            ></path>
          </svg>
          Sign in with Slack
        </a> */}
      </Box>
    </Center>
  );
};

export default Home;
