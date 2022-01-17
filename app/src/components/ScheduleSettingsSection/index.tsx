import { Button, HStack, Select as ChakraSelect, Grid } from "@chakra-ui/react";
// import Select from "react-select/base";

import SettingGroup from "src/components/SettingGroup";
import { weekDays } from "src/utils/constants";

const times = ["09:00", "09:30", "10:00"];

// const timezones = [
//   "GMT",
//   "UTC",
//   "ECT",
//   "EET",
//   "ART",
//   "EAT",
//   "MET",
//   "NET",
//   "PLT",
//   "IST",
//   "BST",
//   "VST",
//   "CTT",
//   "JST",
//   "ACT",
//   "AET",
//   "SST",
//   "NST",
//   "MIT",
//   "HST",
//   "AST",
//   "PST",
//   "PNT",
//   "MST",
//   "CST",
//   "EST",
//   "IET",
//   "PRT",
//   "CNT",
//   "AGT",
//   "BET",
//   "CAT",
// ];

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
      <ChakraSelect
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
      </ChakraSelect>
    </SettingGroup>

    {/* <SettingGroup
      label="Timezone"
      tooltip="Select the main timezone for your team"
    >
      <Select
        options={timezones.map((t) => ({ name: t, value: t }))}
        onChange={() => {
          return;
        }}
        value={{ name: "", value: "" }}
      />
    </SettingGroup> */}

    <SettingGroup
      label="Days"
      tooltip="The days to ping members for the standup"
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
