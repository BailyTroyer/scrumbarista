import {
  Center,
  Button,
  Flex,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";

import Anim from "components/Animation";

const Profile: NextPage = () => {
  return (
    <Flex flex={1} bg={useColorModeValue("white", "gray.700")}>
      <Center w="full" h="full">
        <VStack spacing={10}>
          <Center width="sm" height="sm" mb={-20}>
            <Anim name="soon" />
          </Center>

          <Link passHref href="/home">
            <Button
              colorScheme="teal"
              bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
              color="white"
              variant="solid"
            >
              Go Home
            </Button>
          </Link>
        </VStack>
      </Center>
    </Flex>
  );
};

export default Profile;
