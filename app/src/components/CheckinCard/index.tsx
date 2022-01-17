import { FC } from "react";

import {
  Box,
  Flex,
  Image,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";

import { CheckinResponse, StandupResponse } from "src/hooks/swr";

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
    <Flex direction={"column"} w="100%">
      <Flex direction={"row"} alignItems={"center"} mb={2}>
        <Image
          boxSize={"55"}
          objectFit="cover"
          src={userInfo?.image}
          borderRadius="full"
          mr={4}
        />

        <Text fontWeight={"semibold"}>{userInfo?.name}</Text>
        <Text mx={1}>-</Text>
        <Text>
          {new Date(checkin.createdDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </Flex>

      {checkin.answers.map((a, i) => (
        <Flex direction={"row"} w="100%" h="100%" my={2}>
          <Box mr={2} width={"5px"} borderRadius={"xl"} />

          <Flex direction={"column"}>
            <Text
              fontWeight={"bold"}
              color={useColorModeValue("gray.700", "gray.400")}
            >
              {standup?.questions[i]}
            </Text>
            <Text>{a}</Text>
          </Flex>
        </Flex>
      ))}
    </Flex>
  </VStack>
);

export default CheckinCard;
