import { Container, Heading, Stack, Text, Button } from "@chakra-ui/react";

import Typing from "../Typing";

export default function CallToActionWithIllustration() {
  return (
    <Container maxW="5xl">
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
          Keep track of your progress and get notified when SCRUMS are about to
          start. Easily look back at your last quarter come review period. You
          have enough meetings on your place, let us handle this.
        </Text>
        <Stack spacing={6} direction="row">
          <Button
            rounded="full"
            px={6}
            colorScheme="purple"
            bg="purple.400"
            _hover={{ bg: "purple.500" }}
          >
            Get started
          </Button>
          <Button rounded="full" px={6}>
            Learn more
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
