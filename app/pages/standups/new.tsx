import { CheckIcon, ChevronRightIcon, QuestionIcon } from "@chakra-ui/icons";
import {
  Box,
  Text,
  Button,
  Center,
  Flex,
  useColorModeValue,
  VStack,
  HStack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  Input,
  Tooltip,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

const New: NextPage = () => {
  const router = useRouter();

  return (
    <Flex flex={1} bg={useColorModeValue("white", "gray.700")}>
      <VStack
        w="full"
        h="full"
        padding={10}
        maxW="5xl"
        mx="auto"
        alignItems={"flex-start"}
        spacing={10}
      >
        <HStack w="full" justifyContent="space-between">
          <VStack alignItems={"flex-start"} w="full">
            <Breadcrumb separator={<ChevronRightIcon color="gray.500" />}>
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} href="/home">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem>
                <Text>New</Text>
              </BreadcrumbItem>
            </Breadcrumb>

            <Input
              flex={1}
              border="none"
              borderRadius={0}
              placeholder="Enter a name for this standup"
              fontSize={30}
              fontWeight="bold"
              _focus={{ outline: "none", border: "none" }}
              p={0}
              w="full"
              autoFocus={true}
            />
          </VStack>
          <Button
            leftIcon={<CheckIcon />}
            colorScheme="pink"
            variant="solid"
            onClick={() => router.push(`/home`)}
          >
            Save
          </Button>
        </HStack>

        <VStack
          spacing={4}
          align={"flex-start"}
          shadow={"lg"}
          borderRadius="2xl"
          p={5}
          bg={useColorModeValue("white", "gray.800")}
          _hover={{
            textDecoration: "none",
            shadow: "lg",
          }}
        >
          <Heading as="h4" size="md">
            Schedule
          </Heading>
          <Text fontSize="md" color="gray.500">
            Weekly from Monday to Friday, at 15:08 PM, in user's local timezone
          </Text>
        </VStack>

        <Box w="full">
          <HStack w="full" mb={2}>
            <Text
              color={useColorModeValue("gray.800", "gray.200")}
              fontWeight="medium"
            >
              Channel
            </Text>
            <Tooltip
              hasArrow
              label="Channel where scrumbarista will post standups and ping members"
              bg="white"
              color="black"
              placement="right-end"
              borderRadius={"md"}
              p={3}
            >
              <QuestionIcon color="gray.400" />
            </Tooltip>
          </HStack>

          <Input
            value=""
            placeholder="slack channel ..."
            size="md"
            borderRadius={"md"}
          />
        </Box>
      </VStack>
    </Flex>
  );
};

export default New;
