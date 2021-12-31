import { useEffect, useState } from "react";

import { ChevronRightIcon, SettingsIcon } from "@chakra-ui/icons";
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
  Flex,
  Skeleton,
  Button,
  Checkbox,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import NextImage from "next/image";
import { useRouter } from "next/router";

import CheckinCard from "components/CheckinCard";
import Link from "components/Link";
import StandupDetailCard from "components/StandupDetailCard";
import { useCheckins, useStandup } from "hooks/swr";
import useDaysToString, { toRegularTime } from "hooks/useDaysString";
import { stringToColour } from "utils";
import { colors } from "utils/constants";

const EmptyCheckinsDisplay = () => (
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
    <Text fontSize="md" color="gray.900" textAlign={"center"} mt={2} w="60%">
      There's no data to display yet — but your Timeline board will light up as
      soon as one of the participants reports!
    </Text>
  </Flex>
);

const Standup: NextPage = () => {
  const router = useRouter();
  const { channelId } = router.query;

  const { standup, isLoading: standupLoading } = useStandup(channelId);
  const { checkins } = useCheckins(channelId);

  const daysString = useDaysToString(standup?.days || []);

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
          <Skeleton width={"xl"} isLoaded={!standupLoading}>
            <Text fontSize="md" color="gray.500">
              Weekly {daysString} at {toRegularTime(standup?.startTime || "")},
              in user's local timezone
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
            {standupLoading &&
              [0, 1, 2, 3].map((index) => (
                <Skeleton key={index} w="xs" h={4} my={5} />
              ))}

            {standup?.questions
              ?.split("\n")
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
            {standupLoading &&
              [0, 1].map((index) => (
                <Skeleton key={index} boxSize={"75"} borderRadius={"full"} />
              ))}

            {standup?.users?.map((user) => (
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
          <Skeleton isLoaded={!standupLoading} borderRadius="2xl">
            <Box
              borderRadius="2xl"
              border="1px"
              borderColor="gray.200"
              paddingX={4}
              paddingY={1}
            >
              #{standup?.channelName}
            </Box>
          </Skeleton>
        </StandupDetailCard>
      </GridItem>
    </Grid>
  );

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    window.onscroll = () => {
      setOffset(window.pageYOffset);
    };
  }, []);

  const Header = () => (
    <HStack
      w="full"
      sx={{
        position: "sticky",
        top: "0",
      }}
      zIndex={1}
      // bg="white"
      // boxShadow={offset > 0 ? "md" : ""}
    >
      <VStack align="flex-start" w="full">
        <Breadcrumb separator={<ChevronRightIcon color="gray.500" />}>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} href="/home">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Text>{standup?.name} Standup</Text>
          </BreadcrumbItem>
        </Breadcrumb>
        <Skeleton width={"xs"} isLoaded={!standupLoading}>
          <Heading>{standup?.name} Standup</Heading>
        </Skeleton>
      </VStack>

      <Button
        leftIcon={<SettingsIcon />}
        colorScheme="pink"
        variant="solid"
        onClick={() => router.push(`/standups/${channelId}/manage`)}
      >
        Manage
      </Button>
    </HStack>
  );

  return (
    <Flex flex={1} bg={useColorModeValue("gray.50", "gray.700")}>
      <VStack w="full" h="full" padding={8} spacing={4} maxW="5xl" mx="auto">
        <Header />
        <VStack w="full" spacing={10}>
          <MetaGrid />
          <Flex flexDir={"column"} alignItems={"center"} w="full">
            <HStack w="full">
              <Heading as="h4" size="md">
                Timeline
              </Heading>
            </HStack>

            {checkins.length === 0 ? (
              <EmptyCheckinsDisplay />
            ) : (
              <Grid w="full" templateColumns="repeat(3, 1fr)" gap={4}>
                <GridItem w="full" colSpan={2}>
                  {checkins.map((c) => (
                    <CheckinCard
                      standup={standup}
                      userInfo={standup?.users.find((u) => u.id === c.userId)}
                      checkin={c}
                      key={c.id}
                    />
                  ))}
                </GridItem>
                <GridItem w="full" colSpan={1}>
                  <Box
                    w="full"
                    sx={{
                      position: "sticky",
                      top: "10",
                    }}
                    zIndex={1}
                    // bg="white"
                    // boxShadow={offset > 0 ? "md" : ""}
                  >
                    <VStack
                      w="full"
                      bg="white"
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
                          {standup?.users.map((user) => (
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
                          {standup?.questions.split("\n").map((question) => (
                            <Flex
                              w="full"
                              direction={"row"}
                              alignItems={"center"}
                              justifyContent={"space-between"}
                            >
                              <HStack>
                                <Circle
                                  size={2}
                                  bg={stringToColour(question)}
                                />
                                <Text fontSize="sm">{question}</Text>
                              </HStack>
                              <Checkbox defaultIsChecked />
                            </Flex>
                          ))}
                        </VStack>
                      </Flex>
                    </VStack>
                  </Box>
                </GridItem>
              </Grid>
            )}
          </Flex>
        </VStack>
      </VStack>
    </Flex>
  );
};

export default Standup;
