import { useState } from "react";

import { QuestionIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/layout";
import {
  VStack,
  HStack,
  Input,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import type { NextLayoutComponentType } from "next";
import { useRouter } from "next/dist/client/router";

import StandupLayout from "../../../../components/StandupLayout";

const Basic: NextLayoutComponentType = () => {
  const router = useRouter();
  const { channelId } = router.query;

  return (
    <VStack
      padding={8}
      bg={useColorModeValue("gray.50", "gray.700")}
      spacing={4}
    >
      <Box w="100%">
        <HStack w="400px" mb={2}>
          <Text color="gray.800" fontWeight="medium">
            Change Me
          </Text>
          <Tooltip
            hasArrow
            label="Enter a name that signifies the nature of the standup"
            bg="white"
            color="black"
            placement="right-end"
            borderRadius={"md"}
            p={3}
          >
            <QuestionIcon color="gray.400" />
          </Tooltip>
        </HStack>

        <Input
          value=""
          placeholder="Here is a sample placeholder"
          size="md"
          borderRadius={"md"}
        />
      </Box>
    </VStack>
  );
};

Basic.getLayout = StandupLayout;

export default Basic;
