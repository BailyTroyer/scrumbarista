import { FC } from "react";

import { Divider, HStack, Text } from "@chakra-ui/react";

interface Props {
  label: string;
}

const Separator: FC<Props> = ({ label }: Props) => (
  <HStack w="full" my={10}>
    <Divider w="full" />
    <Text>{label}</Text>
    <Divider w="full" />
  </HStack>
);

export default Separator;
