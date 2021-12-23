import { ChevronRightIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/layout";
import {
  Center,
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
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";

import Link from "../../../components/Link";

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

  const { data, error } = useSWR<StandupResponse>(
    channelId ? `${API_URL}/standups/${channelId}` : null,
    channelId ? slackAuthFetcher : null
  );

  const { data: checkins, error: checkinsError } = useSWR<CheckinResponse[]>(
    channelId ? `${API_URL}/standups/${channelId}/checkins` : null,
    channelId ? slackAuthFetcher : null
  );

  const colorCardBg = useColorModeValue("white", "gray.800");

  const MetaGrid = () => (
    <Grid
      width={[200, 500, 600, 900]}
      templateRows="repeat(4, 1fr)"
      templateColumns="repeat(4, 1fr)"
      gap={4}
    >
      <GridItem rowSpan={1} colSpan={4}>
        <Link href={`/standups/${channelId}/manage/schedule`}>
          <VStack
            spacing={4}
            align={"flex-start"}
            shadow={"base"}
            borderRadius="2xl"
            padding={4}
            bg={colorCardBg}
            height="100%"
            _hover={{
              textDecoration: "none",
              shadow: "lg",
            }}
          >
            <Heading as="h4" size="md">
              Schedule
            </Heading>
            <Text fontSize="md" color="gray.500">
              Weekly from Monday to Friday, at 15:08 PM, in user's local
              timezone
            </Text>
          </VStack>
        </Link>
      </GridItem>
      <GridItem rowSpan={3} colSpan={2}>
        <Link href={`/standups/${channelId}/manage/questions`}>
          <VStack
            align={"flex-start"}
            shadow={"base"}
            borderRadius="2xl"
            padding={4}
            height="100%"
            bg={colorCardBg}
            _hover={{
              textDecoration: "none",
              shadow: "lg",
            }}
          >
            <Heading as="h4" size="md">
              Questions
            </Heading>
            <Text fontSize="md" color="gray.500">
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
          </VStack>
        </Link>
      </GridItem>
      <GridItem colSpan={2} rowSpan={2}>
        <Link href={`/standups/${channelId}/manage/members`}>
          <VStack
            spacing={4}
            align={"flex-start"}
            shadow={"base"}
            borderRadius="2xl"
            padding={4}
            height="100%"
            bg={colorCardBg}
            _hover={{
              textDecoration: "none",
              shadow: "lg",
            }}
          >
            <Heading as="h4" size="md">
              Participants
            </Heading>
            <HStack>
              {["Baily Troyer", "John Doe", "Connor Prussin"].map((name) => (
                <WrapItem>
                  <Tooltip label={name} openDelay={500}>
                    <Image
                      boxSize={"75"}
                      objectFit="cover"
                      src={`https://avatars.dicebear.com/api/miniavs/${name}-${data?.name}.svg`}
                    />
                  </Tooltip>
                </WrapItem>
              ))}
            </HStack>
          </VStack>
        </Link>
      </GridItem>
      <GridItem colSpan={2} rowSpan={1}>
        <Link href={`/standups/${channelId}/manage/basic`}>
          <VStack
            spacing={4}
            align={"flex-start"}
            shadow={"base"}
            borderRadius="2xl"
            padding={4}
            bg={colorCardBg}
            height="100%"
            _hover={{
              textDecoration: "none",
              shadow: "lg",
            }}
          >
            <Heading as="h4" size="md">
              Broadcast channels
            </Heading>
            <Box
              borderRadius="2xl"
              border="1px"
              borderColor="gray.200"
              paddingX={4}
              paddingY={1}
            >
              #general
            </Box>
          </VStack>
        </Link>
      </GridItem>
    </Grid>
  );

  return (
    <VStack
      padding={8}
      bg={useColorModeValue("gray.50", "gray.700")}
      spacing={4}
    >
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

      <VStack spacing={8}>
        {/*  */}
        <Skeleton height="20px" width={"xs"} isLoaded={data !== undefined}>
          <Heading textAlign={"center"}>{data?.name} Standup</Heading>
        </Skeleton>

        <Center>
          <MetaGrid />
        </Center>

        <VStack>
          <HStack width={[200, 500, 600, 900]}>
            <Heading as="h4" size="md">
              Timeline
            </Heading>
          </HStack>

          {checkins?.map((checkin) => (
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

              <Flex direction={"row"} alignItems={"center"} mb={2}></Flex>

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
          ))}
        </VStack>
      </VStack>
    </VStack>
  );
};

export default Standup;
