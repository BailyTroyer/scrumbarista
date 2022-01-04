import { FC, ReactNode } from "react";

import { Link as ChakraLink, LinkProps } from "@chakra-ui/react";
import NextLink from "next/link";

interface Props {
  children: ReactNode;
  href: string;
}

const Link: FC<Props & LinkProps> = ({
  children,
  href,
  ...linkProps
}: Props & LinkProps) => {
  return (
    <NextLink href={href} passHref>
      <ChakraLink
        _hover={{ textDecoration: "none", outline: "none" }}
        _active={{ textDecoration: "none", outline: "none" }}
        {...linkProps}
      >
        {children}
      </ChakraLink>
    </NextLink>
  );
};

export default Link;
