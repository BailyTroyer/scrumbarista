import { Box } from "@chakra-ui/layout";
import { VStack, Heading } from "@chakra-ui/react";
import type { NextLayoutComponentType } from "next";
import { useRouter } from "next/dist/client/router";

import StandupLayout from "../../../../components/StandupLayout";

const Members: NextLayoutComponentType = () => {
  const router = useRouter();
  const { channelId } = router.query;

  return (
    <VStack height="100vh" p={10}>
      <Box textAlign="center">
        <Heading>Members: {channelId}</Heading>
      </Box>
    </VStack>
  );
};

Members.getLayout = StandupLayout;

export default Members;
