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
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Anim from "components/Animation";
import authenticatedRoute from "components/AuthenticatedRoute";
import Link from "components/Link";
import StandupCard from "components/StandupCard";
import { useStandups } from "hooks/swr";

const EmptyStandup = () => (
  <Center flex={1} h="100%" flexDir={"column"}>
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

const Home: NextPage = () => {
  const { standups, isLoading, error } = useStandups();
  const router = useRouter();

  if (isLoading) {
    return (
      <Center
        height="100vh"
        w="100%"
        bg={useColorModeValue("white", "gray.700")}
        flexDir={"column"}
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Text mt={4}>Looking for nearby standups 🕵️</Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {JSON.stringify(error)}
      </Alert>
    );
  }

  return (
    <Flex flex={1} bg={useColorModeValue("white", "gray.700")}>
      <VStack w="full" h="full" padding={10} maxW="5xl" mx="auto">
        {standups.length === 0 ? (
          <EmptyStandup />
        ) : (
          <VStack gap={6}>
            <HStack
              justifyContent={"space-between"}
              alignItems={"center"}
              w="full"
              mb={10}
            >
              <Heading textAlign="center">Standups</Heading>
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
