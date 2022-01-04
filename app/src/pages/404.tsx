import {
  Box,
  Text,
  Button,
  Center,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";

import Anim from "src/components/Animation";

const NotFound: NextPage = () => {
  return (
    <Flex flex={1} bg={useColorModeValue("gray.50", "gray.700")}>
      <Center w="100%">
        <Box textAlign="center" py={10} px={6}>
          <Box width="sm" height="sm">
            <Anim name="notfound" />
          </Box>

          <Text fontSize="18px" mt={3} mb={2}>
            Page Not Found
          </Text>
          <Text color="gray.500" mb={6}>
            The page you&apos;re looking for does not seem to exist
          </Text>

          <Link passHref href="/">
            <Button
              colorScheme="teal"
              bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
              color="white"
              variant="solid"
            >
              Go to Home
            </Button>
          </Link>
        </Box>
      </Center>
    </Flex>
  );
};

export default NotFound;
