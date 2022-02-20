import { FC } from "react";

import {
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

import StandupDetailCard from "../StandupDetailCard";
import PercentPie from "./Pie";

const LinearUsage = () => (
  <ResponsiveContainer>
    <LineChart
      margin={{ top: 10, bottom: 0, left: 15, right: 15 }}
      data={[
        {
          name: "A",
          uv: 10,
        },
        {
          name: "B",
          uv: 14,
        },
        { name: "C", uv: 2 },
        { name: "D", uv: 5 },
        { name: "E", uv: 7 },
      ]}
    >
      <XAxis dataKey="name" interval={0} />
      <Tooltip />
      <Line
        strokeWidth={2}
        type="monotone"
        dataKey="uv"
        stroke="rgb(128, 90, 213)"
        yAxisId={0}
      />
    </LineChart>
  </ResponsiveContainer>
);

const ReportCard = ({ percent }: { percent: number }) => (
  <HStack justifyContent={"space-between"} w="full">
    <Flex direction={"row"} alignItems={"center"} mb={2}>
      <Image
        boxSize={"55"}
        objectFit="cover"
        src={"https://avatars.dicebear.com/api/miniavs/undefined.svg"}
        borderRadius="full"
        mr={4}
      />

      <VStack alignItems={"flex-start"}>
        <Text fontWeight={"semibold"}>Name</Text>
        <HStack>
          <Text fontWeight={"black"}>123</Text>
          <Text>consecutive checkins</Text>
        </HStack>
      </VStack>
    </Flex>
    <Center p={0}>
      <Text fontSize={40 * percent} m={0}>
        🔥
      </Text>
    </Center>
  </HStack>
);

const StandupMetrics: FC = () => {
  return (
    <Flex flexDirection="column" w="full">
      <Grid
        w="full"
        templateRows="repeat(4, 1fr)"
        templateColumns="repeat(4, 1fr)"
        gap={4}
        h="800px"
      >
        <GridItem rowSpan={1} colSpan={2}>
          <StandupDetailCard title="Participation">
            <PercentPie />
            <Flex alignItems={"center"} w="full" direction={"column"}>
              <Text fontSize={"lg"}>
                Checkins: 14 out of <b>19</b>
              </Text>
              <HStack>
                <Text color="green.400" fontWeight={"bold"}>
                  +10%
                </Text>
                <Text>since Monday, Nov 4th</Text>
              </HStack>
            </Flex>
          </StandupDetailCard>
        </GridItem>
        <GridItem rowSpan={1} colSpan={2}>
          <StandupDetailCard title="Top 4 Streaks">
            <VStack w="full">
              <ReportCard percent={1} />

              <Divider />

              {[0.5, 0.5, 0.5].map((x) => (
                <ReportCard percent={x} />
              ))}
            </VStack>
          </StandupDetailCard>
        </GridItem>
        <GridItem rowSpan={2} colSpan={4}>
          <StandupDetailCard title="Participation">
            <LinearUsage />
          </StandupDetailCard>
        </GridItem>
      </Grid>
    </Flex>
  );
};

export default StandupMetrics;
