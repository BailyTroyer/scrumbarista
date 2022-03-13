import { FC, ReactNode } from "react";

import { VStack, useColorModeValue, Flex, Heading } from "@chakra-ui/react";

interface Props {
  children: ReactNode;
  title: string;
}

const StandupDetailCard: FC<Props> = ({ children, title }: Props) => {
  const colorCardBg = useColorModeValue("white", "gray.700");

  return (
    <VStack
      align="flex-start"
      shadow="base"
      borderRadius="2xl"
      padding={4}
      height="100%"
      bg={colorCardBg}
      _hover={{
        textDecoration: "none",
      }}
    >
      <Flex
        flexDir="row"
        w="full"
        alignItems="center"
        justifyContent="space-between"
      >
        <Heading as="h4" fontSize={{ sm: "sm", md: "lg" }}>
          {title}
        </Heading>
      </Flex>

      {children}
    </VStack>
  );
};

export default StandupDetailCard;
