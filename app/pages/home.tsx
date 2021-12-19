import { Box, Heading } from "@chakra-ui/layout";
import { Center, Flex } from "@chakra-ui/react";
import type { NextPage } from "next";

import NavBar from "../components/Navbar";

const Home: NextPage = () => {
  return (
    <Flex height="100vh" flexDirection="column">
      <NavBar>
        <Flex height="100%">
          <Center>
            <Box textAlign="center">
              <Heading>Home</Heading>
            </Box>
          </Center>
        </Flex>
      </NavBar>
    </Flex>
  );
};

export default Home;
