import { AddIcon } from "@chakra-ui/icons";
import {
  Center,
  useColorModeValue,
  Text,
  Alert,
  AlertIcon,
  Spinner,
  VStack,
  HStack,
  Flex,
  Button,
  Heading,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import Anim from "src/components/Animation";
import authenticatedRoute from "src/components/AuthenticatedRoute";
import Link from "src/components/Link";
import StandupCard from "src/components/StandupCard";
import { useStandups } from "src/hooks/swr";

const EmptyStandup = () => (
  <Center flex={1} h="100%" flexDir="column">
    <VStack spacing={5}>
      <Anim name="space" />
      <Heading as="h4" size="lg" color={useColorModeValue("gray.500", "white")}>
        You're all alone now, Wales
      </Heading>
      <Text>
        Seems like there's no standups yet ... feel free to make one below!
      </Text>
      <Button
        colorScheme="teal"
        bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
        color="white"
        variant="solid"
      >
        <Link href="/standups/new">Create a Standup</Link>
      </Button>
    </VStack>
  </Center>
);

const FullPageLoader = ({ message }: { message: string }) => (
  <Center
    height="100vh"
    w="100%"
    bg={useColorModeValue("white", "gray.700")}
    flexDir="column"
  >
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
    />
    <Text mt={4}>{message}</Text>
  </Center>
);

const Home: NextPage = () => {
  const { standups, isLoading, error } = useStandups();
  const router = useRouter();

  if (isLoading) {
    return <FullPageLoader message="Looking for nearby standups 🕵️" />;
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
      </Alert>
    );
  }

  return (
    <Flex flex={1} bg={useColorModeValue("white", "gray.700")}>
      <VStack w="full" h="full" padding={6} maxW="5xl" mx="auto">
        {standups.length === 0 ? (
          <EmptyStandup />
        ) : (
          <VStack w="full">
            <HStack w="full" mb={5} justifyContent="space-between">
              <Heading>Standups</Heading>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="pink"
                variant="solid"
                onClick={() => router.push("/standups/new")}
              >
                New Standup
              </Button>
            </HStack>
            {standups.map((standup) => (
              <StandupCard key={standup.channelId} standup={standup} />
            ))}
          </VStack>
        )}
      </VStack>
    </Flex>
  );
};

export default authenticatedRoute(Home);
