import { Heading, Grid } from "@chakra-ui/layout";
import {
  Center,
  Box,
  useColorModeValue,
  Text,
  Alert,
  AlertIcon,
  Spinner,
  VStack,
  HStack,
  Image,
  Tooltip,
  WrapItem,
  Circle,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import useSWR from "swr";

import authenticatedRoute from "../components/AuthenticatedRoute";
import Link from "../components/Link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface StandupsResponse {
  name: string;
  channelId: string;
  questions: string;
  days: string[];
}

interface StandupsErrorResponse {
  error: string;
}

const Home: NextPage = () => {
  const { data, error } = useSWR<StandupsResponse[], StandupsErrorResponse>(
    `${API_URL}/standups`,
    fetcher
  );

  const colorCardBg = useColorModeValue("white", "gray.800");

  const session = useSession();

  const Standups = () => {
    if (error) {
      return (
        <Alert status="error">
          <AlertIcon />
          There was an error processing your request
        </Alert>
      );
    }
    if (!data) {
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />;
    }

    const days = ["M", "T", "W", "T", "F", "S", "S"];
    const metrics = [{ day: "Dec 19" }, { day: "Dec 19" }, { day: "Dec 19" }];

    return (
      <Grid gap={6}>
        {data?.map((standup: StandupsResponse) => (
          <Link
            href={`/standups/${standup.channelId}`}
            bg={colorCardBg}
            rounded="xl"
            padding={6}
            key={standup.channelId}
            shadow="base"
            _hover={{
              textDecoration: "none",
              shadow: "lg",
            }}
          >
            <HStack spacing={14}>
              <VStack spacing={4} align={"flex-start"}>
                <Heading as="h4" size="md">
                  {standup.name} Standup
                </Heading>
                <Text fontSize="md" color="gray.500">
                  Weekly from Monday to Friday, at 15:08 PM, in user's local
                  timezone
                </Text>

                <HStack>
                  {["Baily Troyer", "John Doe", "Connor Prussin"].map(
                    (name) => (
                      <WrapItem>
                        <Tooltip label={name} openDelay={500}>
                          <Image
                            boxSize={"75"}
                            objectFit="cover"
                            src={`https://avatars.dicebear.com/api/miniavs/${name}-${standup.name}.svg`}
                          />
                        </Tooltip>
                      </WrapItem>
                    )
                  )}
                </HStack>

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
              <Grid templateColumns="repeat(7, 1fr)">
                {days.map((day) => (
                  <Text
                    textAlign={"center"}
                    key={day}
                    color="gray.600"
                    fontWeight={"medium"}
                    mb={3}
                  >
                    {day}
                  </Text>
                ))}
                {metrics.map((metric) => {
                  return (
                    <>
                      {[...Array.from(Array(10).keys())].map(
                        (_, index: number) => (
                          <Center boxSize={"50px"}>
                            <WrapItem>
                              <Tooltip
                                label={`${index} participants`}
                                openDelay={500}
                              >
                                <Circle
                                  size={
                                    index <= 4
                                      ? `${45 * Math.random()}px`
                                      : "20px"
                                  }
                                  bg={index <= 4 ? "blue.500" : "gray.200"}
                                />
                              </Tooltip>
                            </WrapItem>
                          </Center>
                        )
                      )}
                    </>
                  );
                })}
              </Grid>
            </HStack>
          </Link>
        ))}
      </Grid>
    );
  };

  return (
    <Center
      flex="1"
      flexDir={"column"}
      padding={10}
      bg={useColorModeValue("gray.50", "gray.700")}
    >
      <Standups />
    </Center>
  );
};

export default authenticatedRoute(Home);
