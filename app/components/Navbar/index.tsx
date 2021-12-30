import { FC, ReactNode } from "react";

import {
  AddIcon,
  CheckIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  HStack,
  Heading,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Kbd,
  Text,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import NextLink from "next/link";

const Links: string[] = [];

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

const Navbar = () => {
  const { data } = useSession();

  const defaultImage = `https://avatars.dicebear.com/api/miniavs/${data?.name}.svg`;

  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <HStack spacing={8} alignItems={"center"}>
          <NextLink href="/home" passHref>
            <Link
              _hover={{
                textDecoration: "none",
              }}
            >
              <Heading>☕</Heading>
            </Link>
          </NextLink>

          <InputGroup
            mx={10}
            bg={useColorModeValue("white", "gray.700")}
            borderRadius={"lg"}
          >
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              placeholder="Search standups"
              border="none"
              w={500}
              _focus={{ shadow: "base" }}
            />
            <InputRightElement
              width="5.5rem"
              children={
                <HStack>
                  <Kbd>ctrl</Kbd>
                  <Kbd>/</Kbd>
                </HStack>
              }
            />
          </InputGroup>

          <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </HStack>
        </HStack>

        <Flex alignItems={"center"}>
          <Stack direction={"row"} spacing={3}>
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>

            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar size={"sm"} src={data?.user?.image || defaultImage} />
              </MenuButton>

              <MenuList alignItems={"center"}>
                <br />
                <Center>
                  <Avatar
                    size={"2xl"}
                    src={data?.user?.image || defaultImage}
                  />
                </Center>
                <br />
                <Center>
                  <p>{data?.user?.name}</p>
                </Center>
                <br />
                <MenuDivider />
                <MenuItem>
                  <Link href="/profile">Profile</Link>
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    signOut({
                      callbackUrl: `${window.location.origin}/`,
                    })
                  }
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
