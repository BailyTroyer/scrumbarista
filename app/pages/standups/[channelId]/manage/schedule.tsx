import { useState } from "react";

import { QuestionIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/layout";
import {
  VStack,
  Tooltip,
  HStack,
  Text,
  Button,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import type { NextLayoutComponentType } from "next";
import { useRouter } from "next/dist/client/router";

import StandupLayout from "components/StandupLayout";

const Schedule: NextLayoutComponentType = () => {
  const router = useRouter();
  const { channelId } = router.query;

  const [days, setDays] = useState<string[]>([]);
  const times = ["9:00", "9:30", "10:00"];
  const [time, setTime] = useState("9:30");

  return (
    <VStack w="full" h="full" padding={10}>
      <HStack>
        <Box w="full">
          <HStack w="full" mb={2}>
            <Text
              color={useColorModeValue("gray.800", "gray.200")}
              fontWeight="medium"
            >
              Time
            </Text>
            <Tooltip
              hasArrow
              label={"The daily time to ping members for the standup"}
              bg="white"
              color="black"
              placement="right-end"
              borderRadius={"md"}
              p={3}
            >
              <QuestionIcon color="gray.400" />
            </Tooltip>
          </HStack>

          <Select
            size="md"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            {times.map((t) => (
              <option value={t}>{t}</option>
            ))}
          </Select>
        </Box>

        <Box w="full">
          <HStack w="full" mb={2}>
            <Text
              color={useColorModeValue("gray.800", "gray.200")}
              fontWeight="medium"
            >
              Time
            </Text>
            <Tooltip
              hasArrow
              label={"The daily time to ping members for the standup"}
              bg="white"
              color="black"
              placement="right-end"
              borderRadius={"md"}
              p={3}
            >
              <QuestionIcon color="gray.400" />
            </Tooltip>
          </HStack>

          <HStack>
            {[
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "staurday",
              "sunday",
            ].map((d) => (
              <Button
                borderRadius={"full"}
                w={14}
                h={14}
                borderColor={"blue.500"}
                borderWidth={days.includes(d) ? 0 : 2}
                // bg={days.includes(d) ? "blue.800" : ""}
                colorScheme="blue"
                // color={days.includes(d) ? "white" : ""}
                variant={days.includes(d) ? "solid" : "ghost"}
                onClick={() =>
                  setDays((days) => {
                    if (days.includes(d)) {
                      return days.filter((day) => day !== d);
                    } else {
                      return [...days, d];
                    }
                  })
                }
              >
                {d.substring(0, 1).toUpperCase()}
              </Button>
            ))}
          </HStack>
        </Box>
      </HStack>
    </VStack>
  );
};

Schedule.getLayout = StandupLayout;

export default Schedule;
