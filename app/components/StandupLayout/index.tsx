import { useMemo, ReactElement } from "react";

import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  VStack,
  Text,
  useColorModeValue,
  Center,
  chakra,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useStyles,
  useTab,
} from "@chakra-ui/react";
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

const tabs = ["Basic", "Questions", "Members", "Schedule", "Advanced"];

export default function StandupLayout(page: ReactElement) {
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
    <VStack padding={8} bg={useColorModeValue("white", "gray.700")} spacing={4}>
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

      <Tabs
        variant="unstyled"
        onChange={(index) =>
          router.push(
            `/standups/${channelId}/manage/${tabs[index].toLowerCase()}`
          )
        }
      >
        <TabList>
          {tabs.map((tab: string) => (
            <StandupSettingsTab isSelected={tabName.toLowerCase() === tab}>
              {tab}
            </StandupSettingsTab>
          ))}
        </TabList>
      </Tabs>

      {page}
    </VStack>
  );
}
