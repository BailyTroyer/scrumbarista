import { ReactNode } from "react";

import { MoonIcon, SunIcon } from "@chakra-ui/icons";
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
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  HStack,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import NextLink from "next/link";

const Links: string[] = [];

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded="md"
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href="#"
  >
    {children}
  </Link>
);

const Navbar = () => {
  const { data } = useSession();

  const defaultImage = `https://avatars.dicebear.com/api/miniavs/${data?.name}.svg`;

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      bg={useColorModeValue("gray.100", "gray.900")}
      px={4}
      sx={{
        position: "sticky",
        top: "0",
      }}
      zIndex={3}
    >
      <Flex
        h={16}
        alignItems="center"
        justifyContent="space-between"
        maxW="5xl"
        mx="auto"
      >
        <HStack spacing={8} alignItems="center">
          <NextLink href="/home" passHref>
            <Link>☕</Link>
          </NextLink>

          <HStack as="nav" spacing={4} display={{ base: "none", md: "flex" }}>
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </HStack>
        </HStack>

        <Flex alignItems="center">
          <Stack direction="row" spacing={3}>
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>

            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
                _active={{ textDecoration: "none", outline: "none" }}
              >
                <Avatar src={data?.user?.image || defaultImage} size="sm" />
              </MenuButton>

              <MenuList alignItems="center">
                <br />
                <Center>
                  <Avatar size="2xl" src={data?.user?.image || defaultImage} />
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
