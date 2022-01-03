import { useEffect, useState } from "react";

import { ChevronRightIcon } from "@chakra-ui/icons";
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
  Box,
  Divider,
  Center,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";

import authenticatedRoute from "components/AuthenticatedRoute";

const days = ["M", "T", "W", "T", "F", "S", "S"];
const metrics = [{ day: "Dec 19" }, { day: "Dec 19" }, { day: "Dec 19" }];

const image =
  "https://secure.gravatar.com/avatar/ff249688a8eb5a76da5e2f5548ef38d5.jpg?s=192&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0020-192.png";

const Timeline = () => {
  return (
    <VStack width="100%">
      <HStack width="100%">
        <Divider />
        <Flex>
          <Text mx={4} fontSize="md" fontWeight={"semibold"} noOfLines={1}>
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
            src={image}
            borderRadius="full"
            mr={4}
          />

          <Text fontWeight={"semibold"}>bailytroyer</Text>
          <Text mx={1}>-</Text>
          <Text>
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </Flex>

        {"answer1\nanswer2\nanswer3".split("\n").map((a, i) => (
          <Flex direction={"row"} w="100%" h="100%" my={2}>
            <Box
              mr={2}
              width={"5px"}
              bgColor={"blue.500"}
              borderRadius={"xl"}
            />

            <Flex direction={"column"}>
              <Text
                fontWeight={"bold"}
                color={useColorModeValue("gray.700", "gray.400")}
              >
                {"question1\nquestion2\nquestion3".split("\n")[i]}
              </Text>
              <Text>{a}</Text>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </VStack>
  );
};

const Profile: NextPage = () => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    window.onscroll = () => {
      setOffset(window.pageYOffset);
    };
  }, []);

  return (
    <Flex flexDirection="column" w="full">
      <Box
        bg={useColorModeValue("gray.50", offset > 0 ? "gray.700" : "gray.800")}
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
          padding={6}
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
                <Text>Profile</Text>
              </BreadcrumbItem>
            </Breadcrumb>
            <HStack>
              <Image
                boxSize={"58"}
                objectFit="cover"
                src={image}
                borderRadius="full"
              />
              <Heading
                fontSize="3xl"
                color={useColorModeValue("gray.600", "white")}
              >
                bailytroyer
              </Heading>
            </HStack>
          </VStack>
        </Flex>
      </Box>

      <Grid
        padding={6}
        w="full"
        templateColumns="repeat(2, 1fr)"
        gap={4}
        h="full"
        maxW="5xl"
        mx="auto"
      >
        <GridItem>
          <Heading fontSize="lg">Timeline</Heading>

          <VStack spacing={2} mt={8}>
            <Timeline />
            <Timeline />
            <Timeline />
          </VStack>
        </GridItem>
        <GridItem>
          <Heading fontSize="lg">Engagement</Heading>

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
                    <Center boxSize={"50px"} w="full">
                      <WrapItem>
                        <Tooltip
                          label={`${index} participants`}
                          openDelay={500}
                        >
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
        </GridItem>
      </Grid>
    </Flex>
  );
};

export default authenticatedRoute(Profile);
