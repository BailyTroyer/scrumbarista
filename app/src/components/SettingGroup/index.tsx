import { FC, ReactNode } from "react";

import { QuestionIcon } from "@chakra-ui/icons";
import {
  Box,
  HStack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";

interface Props {
  label: string;
  tooltip: string;
  children: ReactNode;
}

const SettingGroup: FC<Props> = ({ label, tooltip, children }: Props) => {
  return (
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
          borderRadius="md"
          p={3}
        >
          <QuestionIcon color="gray.400" />
        </Tooltip>
      </HStack>

      {children}
    </Box>
  );
};

export default SettingGroup;
