import { Button, HStack, Select, Grid } from "@chakra-ui/react";

import SettingGroup from "components/SettingGroup";
import { weekDays } from "utils/constants";

const times = ["09:00", "09:30", "10:00"];

const ScheduleSettingsSection = ({
  startTime,
  days,
  setFieldValue,
}: {
  startTime: string;
  days: string[];
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
}) => (
  <HStack w="full">
    <SettingGroup
      label="Time"
      tooltip="The daily time to ping members for the standup"
    >
      <Select
        size="md"
        value={startTime}
        onChange={(e) => {
          console.log(e.target.value);
          setFieldValue("startTime", e.target.value);
        }}
      >
        {times.map((t) => (
          <option value={t}>{t}</option>
        ))}
      </Select>
    </SettingGroup>

    <SettingGroup
      label="Days"
      tooltip="The daily time to ping members for the standup"
    >
      <Grid templateColumns="repeat(7, 1fr)" gap={2}>
        {weekDays.map((d) => (
          <Button
            borderRadius={"2xl"}
            w={28}
            h={10}
            borderColor={"blue.500"}
            borderWidth={days.includes(d) ? 0 : 2}
            colorScheme="blue"
            variant={days.includes(d) ? "solid" : "ghost"}
            onClick={() => {
              if (days.includes(d)) {
                setFieldValue(
                  "days",
                  days.filter((day) => day !== d)
                );
              } else {
                setFieldValue("days", [...days, d]);
              }
            }}
          >
            {d.substring(0, 1).toUpperCase()}
          </Button>
        ))}
      </Grid>
    </SettingGroup>
  </HStack>
);

export default ScheduleSettingsSection;
