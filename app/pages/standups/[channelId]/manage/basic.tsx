import { useState } from "react";

import { QuestionIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/layout";
import {
  VStack,
  HStack,
  Input,
  Text,
  Tooltip,
  Flex,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import type { NextLayoutComponentType } from "next";
import { useRouter } from "next/router";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

import useSWR from "swr";

import StandupLayout from "components/StandupLayout";

const InputGroup = ({
  label,
  tooltip,
  placeholder = "",
  value,
  onChange,
}: {
  label: string;
  tooltip: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
}) => (
  <Box w="full">
    <HStack w="full" mb={2}>
      <Text
        color={useColorModeValue("gray.800", "gray.200")}
        fontWeight="medium"
      >
        {label}
      </Text>
      <Tooltip
        hasArrow
        label={tooltip}
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
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      size="md"
      borderRadius={"md"}
    />
  </Box>
);

// https://codesandbox.io/s/648uv?file=/chakra-react-select.js

interface StandupResponse {
  name: string;
  channelId: string;
  questions: string;
  days: string[];
  users: { name: string; email: string; image: string }[];
  startTime: string;
  active: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const slackAuthFetcher = (url: string) => fetch(url).then((res) => res.json());

const Basic: NextLayoutComponentType = () => {
  const router = useRouter();

  const { channelId } = router.query;

  const { data } = useSWR<StandupResponse>(
    channelId ? `${API_URL}/standups/${channelId}` : null,
    channelId ? slackAuthFetcher : null
  );

  const [name, setName] = useState(data?.name || "");

  return (
    <VStack w="full" h="full" padding={10} spacing={5}>
      <InputGroup
        label="Name"
        tooltip="Enter a name that signifies the nature of the standup."
        placeholder="Enter a name for the standup ..."
        value={name}
        onChange={setName}
      />
    </VStack>
  );
};

Basic.getLayout = StandupLayout;

export default Basic;
