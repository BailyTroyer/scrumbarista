import { Box, Heading } from '@chakra-ui/layout';
import { Center, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import type { NextPage } from 'next';
import useSWR from 'swr';

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
        <HealthResponse />
      </Box>
    </Center>
  );
};

export default Home;
