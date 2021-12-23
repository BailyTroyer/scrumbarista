import { Box } from "@chakra-ui/layout";
import { VStack, Heading } from "@chakra-ui/react";
import { NextLayoutComponentType } from "next";
import { useRouter } from "next/dist/client/router";

import StandupLayout from "../../../../components/StandupLayout";

const Advanced: NextLayoutComponentType = () => {
  const router = useRouter();
  const { channelId } = router.query;

  return (
    <VStack height="100vh" p={10}>
      <Box textAlign="center">
        <Heading>Advanced: {channelId}</Heading>
      </Box>
    </VStack>
  );
};

Advanced.getLayout = StandupLayout;

export default Advanced;
