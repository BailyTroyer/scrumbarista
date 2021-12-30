import { useEffect, useState } from "react";

import { ChevronRightIcon, EditIcon, SettingsIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/layout";
import {
  Grid,
  GridItem,
  HStack,
  VStack,
  Heading,
  Text,
  WrapItem,
  Tooltip,
  Image,
  Circle,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbItem,
  Divider,
  Flex,
  Skeleton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import NextImage from "next/image";
import { useRouter } from "next/router";
import useSWR from "swr";

import Link from "components/Link";
import StandupDetailCard from "components/StandupDetailCard";
import useDaysToString, { toRegularTime } from "hooks/useDaysString";

const colors = [
  "teal",
  "purple",
  "yellow",
  "red",
  "blue",
  "cyan",
  "orange",
  "pink",
];

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const slackAuthFetcher = (url: string) => fetch(url).then((res) => res.json());

interface StandupResponse {
  name: string;
  channelId: string;
  questions: string;
  days: string[];
  users: { name: string; email: string; image: string }[];
  startTime: string;
  active: string;
}

interface CheckinResponse {
  id: string;
  createdDate: string;
  answers: string;
  userId: string;
  channelId: string;
}

const Standup: NextPage = () => {
  const router = useRouter();
  const { channelId } = router.query;

  const { data } = useSWR<StandupResponse>(
    channelId ? `${API_URL}/standups/${channelId}` : null,
    channelId ? slackAuthFetcher : null
  );

  const { data: checkins, error: checkinsError } = useSWR<CheckinResponse[]>(
    channelId ? `${API_URL}/standups/${channelId}/checkins` : null,
    channelId ? slackAuthFetcher : null
  );

  const colorCardBg = useColorModeValue("white", "gray.800");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const daysString = useDaysToString(data?.days || []);

  const MetaGrid = () => (
    <Grid
      w="full"
      h="400"
      templateRows="repeat(3, 1fr)"
      templateColumns="repeat(4, 1fr)"
      gap={4}
    >
      <GridItem rowSpan={1} colSpan={4}>
        <StandupDetailCard
          href={`/standups/${channelId}/manage/schedule`}
          title="Schedule"
        >
          <Skeleton width={"xl"} isLoaded={data !== undefined}>
            <Text fontSize="md" color="gray.500">
              Weekly {daysString} at {toRegularTime(data?.startTime || "")}, in
              user's local timezone
            </Text>
          </Skeleton>
        </StandupDetailCard>
      </GridItem>
      <GridItem rowSpan={2} colSpan={2}>
        <StandupDetailCard
          href={`/standups/${channelId}/manage/questions`}
          title="Questions"
        >
          <Text fontSize="md" color="gray.500">
            {data === undefined &&
              [0, 1, 2, 3].map((index) => (
                <Skeleton key={index} w="xs" h={4} my={5} />
              ))}

            {data?.questions
              .split("\n")
              .map((question: string, index: number) => (
                <HStack my={3}>
                  <Circle size="10px" bg={`${colors[index]}.300`} />
                  <Text fontSize="md" color="gray.500">
                    {question}
                  </Text>
                </HStack>
              ))}
          </Text>
        </StandupDetailCard>
      </GridItem>
      <GridItem rowSpan={1} colSpan={2}>
        <StandupDetailCard
          href={`/standups/${channelId}/manage/members`}
          title="Participants"
        >
          <HStack>
            {data === undefined &&
              [0, 1].map((index) => (
                <Skeleton key={index} boxSize={"75"} borderRadius={"full"} />
              ))}

            {data?.users.map((user) => (
              <WrapItem>
                <Tooltip label={user.name} openDelay={500}>
                  <Image
                    boxSize={"75"}
                    objectFit="cover"
                    src={user.image}
                    borderRadius="full"
                  />
                </Tooltip>
              </WrapItem>
            ))}
          </HStack>
        </StandupDetailCard>
      </GridItem>
      <GridItem rowSpan={1} colSpan={2}>
        <StandupDetailCard
          href={`/standups/${channelId}/manage/basic`}
          title="Broadcast Channels"
        >
          <Skeleton isLoaded={data !== undefined} borderRadius="2xl">
            <Box
              borderRadius="2xl"
              border="1px"
              borderColor="gray.200"
              paddingX={4}
              paddingY={1}
            >
              #general
            </Box>
          </Skeleton>
        </StandupDetailCard>
      </GridItem>
    </Grid>
  );

  return (
    <Flex flex={1} bg={useColorModeValue("gray.50", "gray.700")}>
      <VStack w="full" h="full" padding={8} spacing={4} maxW="5xl" mx="auto">
        <HStack w="full">
          <VStack align="flex-start" w="full">
            <Breadcrumb separator={<ChevronRightIcon color="gray.500" />}>
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} href="/home">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem>
                <Text>{data?.name} Standup</Text>
              </BreadcrumbItem>
            </Breadcrumb>
            <Skeleton width={"xs"} isLoaded={data !== undefined}>
              <Heading>{data?.name} Standup</Heading>
            </Skeleton>
          </VStack>

          <HStack>
            <Button colorScheme="teal" color="white" variant="solid">
              Preferences
            </Button>
            <Button
              leftIcon={<SettingsIcon />}
              colorScheme="pink"
              variant="solid"
              onClick={() => router.push(`/standups/${channelId}/manage/basic`)}
            >
              Manage
            </Button>
          </HStack>
        </HStack>

        <VStack w="full" spacing={10}>
          <MetaGrid />
          <Flex flexDir={"column"} alignItems={"center"} w="full">
            <HStack w="full">
              <Heading as="h4" size="md">
                Timeline
              </Heading>
            </HStack>

            {checkins?.length > 0 ? (
              checkins?.map((checkin) => (
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
                        src={`https://avatars.dicebear.com/api/miniavs/${name}-${data?.name}.svg`}
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
                        <Box
                          mr={2}
                          width={"5px"}
                          bgColor={"blue.500"}
                          borderRadius={"xl"}
                        />

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
              ))
            ) : (
              <Flex
                flexDir={"column"}
                alignItems={"center"}
                justifyContent={"center"}
                mt={20}
                mb={10}
              >
                <Box>
                  <NextImage src="/empty.svg" height={250} width={250} />
                </Box>

                <Heading size="md" color="gray.700" mt={8}>
                  Let's Make Some Data
                </Heading>
                <Text
                  fontSize="md"
                  color="gray.900"
                  textAlign={"center"}
                  mt={2}
                  w="60%"
                >
                  There's no data to display yet — but your Timeline board will
                  light up as soon as one of the participants reports!
                </Text>
              </Flex>
            )}
          </Flex>
        </VStack>
      </VStack>
    </Flex>
  );
};

export default Standup;
