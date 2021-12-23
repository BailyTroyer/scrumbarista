import { Box } from "@chakra-ui/layout";
import { Heading, VStack } from "@chakra-ui/react";
import type { NextLayoutComponentType } from "next";
import { useRouter } from "next/dist/client/router";

import StandupLayout from "../../../../components/StandupLayout";

const Schedule: NextLayoutComponentType = () => {
  const router = useRouter();
  const { channelId } = router.query;

  return (
    <VStack height="100vh" p={10}>
      <Box textAlign="center">
        <Heading>Schedule: {channelId}</Heading>
      </Box>
    </VStack>
  );
};

Schedule.getLayout = StandupLayout;

export default Schedule;
