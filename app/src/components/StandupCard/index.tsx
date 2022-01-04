import { FC } from "react";

import {
  Grid,
  Heading,
  HStack,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
  WrapItem,
  Image,
  Box,
  Center,
  Circle,
} from "@chakra-ui/react";

import Link from "src/components/Link";
import { StandupsResponse } from "src/hooks/swr";
import useDaysToString, { toRegularTime } from "src/hooks/useDaysString";

const days = ["M", "T", "W", "T", "F", "S", "S"];
const metrics = [{ day: "Dec 19" }, { day: "Dec 19" }, { day: "Dec 19" }];

interface Props {
  standup: StandupsResponse;
}

const StandupCard: FC<Props> = ({ standup }: Props) => {
  const colorCardBg = useColorModeValue("white", "gray.800");
  const daysString = useDaysToString(standup.days || []);

  return (
    <Link
      href={`/standups/${standup.channelId}`}
      bg={colorCardBg}
      rounded="xl"
      padding={6}
      shadow="base"
      _hover={{
        textDecoration: "none",
        shadow: "2xl",
      }}
      w="full"
    >
      <HStack spacing={14}>
        <VStack spacing={4} align="flex-start">
          <Heading as="h4" size="md">
            {standup.name}
          </Heading>
          <Text fontSize="md" color="gray.500">
            Weekly {daysString} at {toRegularTime(standup.startTime || "")}, in
            user's local timezone
          </Text>

          <HStack>
            {standup.users.map((user) => (
              <WrapItem>
                <Tooltip label={user.name} openDelay={500}>
                  <Image
                    mr={2}
                    boxSize="75"
                    objectFit="cover"
                    src={user.image}
                    borderRadius="full"
                  />
                </Tooltip>
              </WrapItem>
            ))}
          </HStack>

          <Box
            borderRadius="2xl"
            border="1px"
            borderColor="gray.200"
            paddingX={4}
            paddingY={1}
          >
            #{standup?.channelName}
          </Box>
        </VStack>
        <Grid templateColumns="repeat(7, 1fr)">
          {days.map((day) => (
            <Text
              textAlign="center"
              key={day}
              color="gray.600"
              fontWeight="medium"
              mb={3}
            >
              {day}
            </Text>
          ))}
          {metrics.map(() => {
            return (
              <>
                {[...Array.from(Array(7).keys())].map((_, index: number) => (
                  <Center boxSize={"50px"}>
                    <WrapItem>
                      <Tooltip label={`${index} participants`} openDelay={500}>
                        <Circle
                          // size={index <= 4 ? `${45 * Math.random()}px` : "20px"}
                          size="20px"
                          // bg={index <= 4 ? "blue.500" : "gray.200"}
                          bg="gray.200"
                        />
                      </Tooltip>
                    </WrapItem>
                  </Center>
                ))}
              </>
            );
          })}
        </Grid>
      </HStack>
    </Link>
  );
};

export default StandupCard;
