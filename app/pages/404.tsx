import { Box, Text, Button, Center } from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";

import Animation from "../components/NotFoundAnimation";

const NotFound: NextPage = () => {
  return (
    <Center height="100vh">
      <Box textAlign="center" py={10} px={6}>
        <Box width="sm" height="sm">
          <Animation />
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
  );
};

export default NotFound;
