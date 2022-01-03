import { useColorModeValue, Spinner, Center } from "@chakra-ui/react";

export const FullPageLoader = () => (
  <Center height="100vh" w="100%" bg={useColorModeValue("white", "gray.700")}>
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
