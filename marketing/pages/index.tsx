import { Flex } from "@chakra-ui/layout";
import type { NextPage } from "next";

import Footer from "../components/Footer";
import Hero from "../components/Hero";
import WithSubnavigation from "../components/Navbar";

const Home: NextPage = () => {
  return (
    <Flex direction="column" flexGrow={1} minHeight="100vh">
      <WithSubnavigation />
      <Flex direction="column" flexGrow={1}>
        <Hero />
      </Flex>
      <Footer />
    </Flex>
  );
};

export default Home;
