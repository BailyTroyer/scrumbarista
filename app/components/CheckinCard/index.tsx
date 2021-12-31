import { FC } from "react";

import {
  Box,
  Divider,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";

import { CheckinResponse, StandupResponse } from "hooks/swr";

interface Props {
  checkin: CheckinResponse;
  standup: StandupResponse | null;
  userInfo?: {
    name: string;
    id: string;
    image: string;
  };
}

const CheckinCard: FC<Props> = ({ standup, checkin, userInfo }: Props) => (
  <VStack width={"100%"}>
    <HStack width="100%">
      <Divider />
      <Flex>
        <Text
          mx={4}
          fontSize="md"
          fontWeight={"semibold"}
          color="gray.700"
          noOfLines={1}
        >
          10/10/10
        </Text>
      </Flex>
      <Divider />
    </HStack>

    <Flex direction={"column"} w="100%">
      <Flex direction={"row"} alignItems={"center"} mb={2}>
        <Image
          boxSize={"55"}
          objectFit="cover"
          src={userInfo?.image}
          borderRadius="full"
          mr={4}
        />

        <Text fontWeight={"semibold"} color="gray.900">
          {userInfo?.name}
        </Text>
        <Text mx={1}>-</Text>
        <Text>
          {new Date(checkin.createdDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </Flex>

      {checkin.answers.split("\n").map((a, i) => (
        <Flex direction={"row"} w="100%" h="100%" my={2}>
          <Box mr={2} width={"5px"} bgColor={"blue.500"} borderRadius={"xl"} />

          <Flex direction={"column"}>
            <Text fontWeight={"bold"} color="gray.700">
              {standup?.questions.split("\n")[i]}
            </Text>
            <Text>{a}</Text>
          </Flex>
        </Flex>
      ))}
    </Flex>
  </VStack>
);

export default CheckinCard;
