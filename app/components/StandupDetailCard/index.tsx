import { FC, ReactNode } from "react";

import { EditIcon } from "@chakra-ui/icons";
import {
  VStack,
  useColorModeValue,
  useDisclosure,
  Flex,
  Heading,
  HStack,
  Text,
} from "@chakra-ui/react";

import Link from "components/Link";

interface Props {
  children: ReactNode;
  href: string;
  title: string;
}

const StandupDetailCard: FC<Props> = ({ children, href, title }: Props) => {
  const colorCardBg = useColorModeValue("white", "gray.800");
  const editCardColor = useColorModeValue("gray.500", "white");

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Link href={href}>
      <VStack
        align={"flex-start"}
        shadow={"base"}
        borderRadius="2xl"
        padding={4}
        height="100%"
        bg={colorCardBg}
        _hover={{
          textDecoration: "none",
          shadow: "lg",
        }}
        _active={{ border: "none", shadow: "none" }}
        onMouseOver={onOpen}
        onMouseOut={onClose}
      >
        <Flex
          flexDir="row"
          w="full"
          alignItems="center"
          justifyContent="space-between"
        >
          <Heading as="h4" size="md">
            {title}
          </Heading>
          {isOpen && (
            <HStack color={editCardColor}>
              <Text>Edit</Text>
              <EditIcon w={5} h={5} />
            </HStack>
          )}
        </Flex>

        {children}
      </VStack>
    </Link>
  );
};

export default StandupDetailCard;
