import {
  Flex,
  Container,
  Heading,
  Stack,
  Text,
  Button,
} from "@chakra-ui/react";
import type { NextPage } from "next";

import Footer from "src/components/Footer";

import Typing from "../components/Typing";

const Home: NextPage = () => {
  return (
    <Flex direction="column" grow={1} minHeight="100vh">
      <Flex direction="column" grow={1}>
        <Container>
          <Stack
            textAlign="center"
            align="center"
            spacing={{ base: 8, md: 10 }}
            py={{ base: 20, md: 28 }}
          >
            <Heading
              fontWeight={600}
              fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
              lineHeight="110%"
            >
              Making SCRUMs <br />
              <Text as="span" color="purple.400">
                <Typing words={["easier", "quicker", "measurable"]} />
              </Text>
            </Heading>
            <Text color="gray.500" maxW="3xl">
              Keep track of your progress and get notified when SCRUMS are about
              to start. Easily look back at your last quarter come review
              period. You have enough meetings on your place, let us handle
              this.
            </Text>
            <Stack spacing={6} direction="row">
              <Button
                rounded="full"
                px={6}
                colorScheme="purple"
                bg="purple.400"
              >
                Get started
              </Button>
              <Button rounded="full" px={6}>
                Learn more
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Flex>
      <Footer />
    </Flex>
  );
};

export default Home;
