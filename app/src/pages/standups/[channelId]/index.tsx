import { useEffect, useMemo, useState } from "react";

import { ChevronRightIcon, SettingsIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/layout";
import {
  Grid,
  GridItem,
  Center,
  HStack,
  VStack,
  Heading,
  Text,
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
  Divider,
  Tabs,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import NextImage from "next/image";
import { useRouter } from "next/router";

import authenticatedRoute from "src/components/AuthenticatedRoute";
import CheckinCard from "src/components/CheckinCard";
import CheckinFilterBox, {
  CheckinsFilterFormValues,
} from "src/components/CheckinFilterBox";
import Link from "src/components/Link";
import StandupDetailCard from "src/components/StandupDetailCard";
import StandupMetrics from "src/components/StandupMetrics";
import StandupSettingsTab from "src/components/StandupSettingsTab";
import {
  CheckinResponse,
  StandupResponse,
  useCheckins,
  useStandup,
} from "src/hooks/swr";
import useDaysToString, { toRegularTime } from "src/hooks/useDaysString";
import { colors } from "src/utils/constants";

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

const CheckinsList = ({
  checkins,
  standup,
}: {
  checkins: CheckinResponse[];
  standup: StandupResponse | null;
}) => {
  if (checkins.length === 0) return <EmptyCheckinsDisplay />;

  const days = useMemo(() => {
    return checkins
      .map((s) => new Date(s.createdDate).toDateString())
      .filter((value, index, self) => self.indexOf(value) === index);
  }, [checkins]);

  const [filter, setFilter] = useState<CheckinsFilterFormValues | null>(null);

  return (
    <Grid w="full" templateColumns="repeat(3, 1fr)" gap={4} minH="60vh">
      <GridItem w="full" colSpan={2}>
        {filter?.questions.length === 0 || filter?.participants.length === 0 ? (
          <Box>
            <Text fontSize="18px" mt={3} mb={2}>
              No matches found
            </Text>
            <Text color="gray.500" mb={6}>
              There's no data to display for your selected filters. Please edit
              your selection, and Srumbarista will look again.
            </Text>
          </Box>
        ) : (
          days.map((d) => (
            <VStack spacing={5}>
              <HStack width="100%">
                <Divider />
                <Flex w="full" justifyContent={"center"}>
                  <Text
                    textAlign={"center"}
                    mx={4}
                    fontSize="md"
                    fontWeight={"semibold"}
                    noOfLines={1}
                  >
                    {d}
                  </Text>
                </Flex>
                <Divider />
              </HStack>
              {checkins
                .filter((c) => new Date(c.createdDate).toDateString() === d)
                .filter((c) => {
                  if (!filter) return true;

                  return (
                    (filter?.participants || [])
                      .map((p) => p.id)
                      .indexOf(c.userId || "") >= 0
                  );
                })
                .map((c) => (
                  <CheckinCard
                    standup={standup}
                    userInfo={standup?.users.find((u) => u.id === c.userId)}
                    checkin={c}
                    key={c.id}
                    filter={filter}
                  />
                ))}
            </VStack>
          ))
        )}
      </GridItem>
      <GridItem w="full" colSpan={1}>
        <Box
          w="full"
          sx={{
            position: "sticky",
            top: "13em",
          }}
          zIndex={10}
        >
          <CheckinFilterBox
            standup={standup}
            checkins={checkins}
            onFilterChange={setFilter}
          />
        </Box>
      </GridItem>
    </Grid>
  );
};

const Standup: NextPage = () => {
  const router = useRouter();
  const { channelId } = router.query;

  const { standup, isLoading: standupLoading } = useStandup(channelId);
  const { checkins } = useCheckins(channelId);

  const daysString = useDaysToString(standup?.days || []);

  const [tab, setTab] = useState(0);

  const MetaGrid = () => (
    <Grid
      w="full"
      h="400"
      templateRows="repeat(3, 1fr)"
      templateColumns="repeat(4, 1fr)"
      gap={4}
    >
      <GridItem rowSpan={1} colSpan={4}>
        <StandupDetailCard title="Schedule">
          <Skeleton width={"xl"} isLoaded={!standupLoading}>
            <Text fontSize="md" color="gray.500">
              Weekly {daysString} at {toRegularTime(standup?.startTime || "")},
              in user's local timezone
            </Text>
          </Skeleton>
        </StandupDetailCard>
      </GridItem>
      <GridItem rowSpan={2} colSpan={2}>
        <StandupDetailCard title="Questions">
          <Text fontSize="md" color="gray.500">
            {standupLoading &&
              [0, 1, 2, 3].map((index) => (
                <Skeleton key={index} w="xs" h={4} my={5} />
              ))}

            {standup?.questions.map((question: string, index: number) => (
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
        <StandupDetailCard title="Participants">
          <HStack>
            {standupLoading &&
              [0, 1].map((index) => (
                <Skeleton key={index} boxSize={"75"} borderRadius={"full"} />
              ))}

            {standup?.users?.map((user) => (
              <Tooltip label={user.name}>
                <Image
                  boxSize="60px"
                  objectFit="cover"
                  src={user.image}
                  borderRadius="full"
                />
              </Tooltip>
            ))}
          </HStack>
        </StandupDetailCard>
      </GridItem>
      <GridItem rowSpan={1} colSpan={2}>
        <StandupDetailCard title="Broadcast Channels">
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

  return (
    <Flex flexDirection="column" w="full">
      <Box
        bg={useColorModeValue("white", offset > 0 ? "gray.700" : "gray.800")}
        sx={{
          position: "sticky",
          top: "16",
        }}
        boxShadow={offset > 0 ? "md" : ""}
        zIndex={2}
      >
        <Flex
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          px={6}
          py={4}
          maxW="5xl"
          mx="auto"
        >
          <VStack align="flex-start">
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
        </Flex>
      </Box>

      <VStack w="full" h="full" px={8} spacing={4} maxW="5xl" mx="auto">
        <VStack w="full" spacing={10}>
          <MetaGrid />
          <Flex flexDir={"column"} alignItems={"center"} w="full">
            <Tabs
              w="full"
              defaultIndex={0}
              onChange={setTab}
              mb={8}
              // index={Object.keys(router.query).includes("timeline") ? 0 : 1}
            >
              <HStack w="full">
                <StandupSettingsTab
                  isSelected={Object.keys(router.query).includes("timeline")}
                >
                  <Heading as="h4" size="md">
                    Timeline
                  </Heading>
                </StandupSettingsTab>
                <StandupSettingsTab
                  isSelected={Object.keys(router.query).includes("insights")}
                >
                  <Heading as="h4" size="md">
                    Insights
                  </Heading>
                </StandupSettingsTab>
              </HStack>
            </Tabs>

            {tab === 0 ? (
              <CheckinsList standup={standup} checkins={checkins} />
            ) : (
              <StandupMetrics />
            )}
          </Flex>
        </VStack>
      </VStack>
    </Flex>
  );
};

export default authenticatedRoute(Standup);
