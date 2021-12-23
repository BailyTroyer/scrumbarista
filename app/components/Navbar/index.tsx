import { FC, ReactNode } from "react";

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
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  HStack,
  Heading,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import NextLink from "next/link";

interface Props {
  children: ReactNode;
}

const Navbar: FC<Props> = ({ children }: Props) => {
  const { data } = useSession();

  const defaultImage = `https://avatars.dicebear.com/api/miniavs/${data?.name}.svg`;

  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
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
                  <MenuItem>Account Settings</MenuItem>
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
      {children}
    </>
  );
};

export default Navbar;
