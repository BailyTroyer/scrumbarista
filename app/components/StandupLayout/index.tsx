import { useMemo } from "react";

import { CheckIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  VStack,
  Text,
  Heading,
  TabList,
  Tabs,
  HStack,
  Button,
  Flex,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";

import Link from "../Link";
import StandupSettingsTab from "../StandupSettingsTab";

interface StandupResponse {
  name: string;
  channelId: string;
  questions: string;
  days: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const slackAuthFetcher = (url: string) => fetch(url).then((res) => res.json());

const tabs = ["basic", "questions", "schedule", "advanced"];

export default function StandupLayout(page: NextPage) {
  const router = useRouter();
  const { channelId } = router.query;

  const tabName = useMemo(
    () => router.pathname.split("/").slice(-1)[0],
    [router.pathname]
  );

  const { data, error } = useSWR<StandupResponse>(
    channelId ? `${API_URL}/standups/${channelId}` : null,
    channelId ? slackAuthFetcher : null
  );

  return (
    <VStack w="full" h="full" padding={8} maxW="5xl" mx="auto" spacing={4}>
      <HStack w="full" justifyContent="space-between" px={10}>
        <VStack alignItems={"flex-start"}>
          <Breadcrumb separator={<ChevronRightIcon color="gray.500" />}>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} href="/home">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink as={Link} href={`/standups/${channelId}`}>
                {data?.name} Standup
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <Text>Manage</Text>
            </BreadcrumbItem>
          </Breadcrumb>
          <Heading>{data?.name} Standup</Heading>
          <Text fontSize="md" color="gray.500">
            Weekly from Monday to Friday, at 15:08 PM, in user's local timezone
          </Text>
        </VStack>
        <Button
          leftIcon={<CheckIcon />}
          colorScheme="pink"
          variant="solid"
          onClick={() => router.push(`/standups/${channelId}/manage/basic`)}
        >
          Save
        </Button>
      </HStack>

      <Tabs
        variant="unstyled"
        onChange={(index) => {
          router.push(
            `/standups/${channelId}/manage/${tabs[index].toLowerCase()}`
          );
        }}
        index={tabs.indexOf(tabName.toLowerCase())}
      >
        <TabList>
          {tabs.map((tab: string) => (
            <StandupSettingsTab>{tab}</StandupSettingsTab>
          ))}
        </TabList>
      </Tabs>
      {page}
    </VStack>
  );
}
