import { FC, useMemo } from "react";

import {
  HStack,
  VStack,
  Heading,
  Text,
  Image,
  Circle,
  useColorModeValue,
  Flex,
  Checkbox,
  Box,
} from "@chakra-ui/react";

import { CheckinResponse, StandupResponse } from "src/hooks/swr";
import { stringToColour } from "src/utils";

interface Props {
  standup: StandupResponse | null;
  checkins: CheckinResponse[];
}

const CheckinFilterBox: FC<Props> = ({ standup, checkins }: Props) => {
  const checkinUsers = useMemo(() => {
    return checkins
      .map((s) => s.userId)
      .filter((value, index, self) => self.indexOf(value) === index);
  }, [checkins]);

  return (
    <Box
      w="full"
      sx={{
        position: "sticky",
        top: "13em",
      }}
      zIndex={10}
    >
      <VStack
        w="full"
        bg={useColorModeValue("white", "gray.700")}
        // bg="white"
        borderRadius="2xl"
        shadow={"base"}
        p={5}
        alignItems={"flex-start"}
        spacing={8}
      >
        <Flex
          direction={"column"}
          alignItems={"center"}
          justifyContent={"space-between"}
          w="full"
        >
          <Flex
            w="full"
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            mb={5}
          >
            <Heading fontSize="lg">Participants</Heading>
            <HStack>
              <Text fontSize="xs">All</Text>
              <Checkbox defaultIsChecked />
            </HStack>
          </Flex>
          <VStack spacing={2} w="full">
            {standup?.users
              .filter((u) => checkinUsers.includes(u.id))
              .map((user) => (
                <Flex
                  w="full"
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <HStack>
                    <Image
                      boxSize={"25"}
                      objectFit="cover"
                      src={user.image}
                      borderRadius="full"
                    />
                    <Text>{user.name}</Text>
                  </HStack>
                  <Checkbox defaultIsChecked />
                </Flex>
              ))}
          </VStack>
        </Flex>

        <Flex
          direction={"column"}
          alignItems={"center"}
          justifyContent={"space-between"}
          w="full"
        >
          <Flex
            w="full"
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            mb={5}
          >
            <Heading fontSize="lg">Questions</Heading>
            <HStack>
              <Text fontSize="xs">All</Text>
              <Checkbox defaultIsChecked />
            </HStack>
          </Flex>
          <VStack spacing={2} w="full">
            {standup?.questions.map((question) => (
              <Flex
                w="full"
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <HStack>
                  <Circle size={2} bg={stringToColour(question)} />
                  <Text fontSize="sm">{question}</Text>
                </HStack>
                <Checkbox defaultIsChecked />
              </Flex>
            ))}
          </VStack>
        </Flex>
      </VStack>
    </Box>
  );
};

export default CheckinFilterBox;
