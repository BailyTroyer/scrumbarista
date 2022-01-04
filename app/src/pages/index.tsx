import { Flex } from "@chakra-ui/layout";
import type { NextPage } from "next";

import Footer from "src/components/Footer";
import Hero from "src/components/Hero";

const Home: NextPage = () => {
  return (
    <Flex direction="column" flexGrow={1} minHeight="100vh">
      <Flex direction="column" flexGrow={1}>
        <Hero />
      </Flex>
      <Footer />
    </Flex>
  );
};

export default Home;
