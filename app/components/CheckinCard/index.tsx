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

import { CheckinResponse } from "hooks/swr";

interface Props {
  checkin: CheckinResponse;
}

const CheckinCard: FC<Props> = ({ checkin }: Props) => (
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
          boxSize={"75"}
          objectFit="cover"
          src={`https://avatars.dicebear.com/api/miniavs/${checkin.userId}.svg`}
        />

        <Text fontWeight={"semibold"} color="gray.900">
          bailytroyer
        </Text>
        <Text>- 03:08 pm</Text>
      </Flex>

      {[
        "What will you do today?",
        "What will you do today?",
        "What will you do today?",
      ].map((q) => (
        <Flex direction={"row"} w="100%" h="100%" my={2}>
          <Box mr={2} width={"5px"} bgColor={"blue.500"} borderRadius={"xl"} />

          <Flex direction={"column"}>
            <Text fontWeight={"bold"} color="gray.700">
              {q}
            </Text>
            <Text>stuff</Text>
          </Flex>
        </Flex>
      ))}
    </Flex>
  </VStack>
);

export default CheckinCard;
