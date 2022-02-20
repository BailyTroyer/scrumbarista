import {
  Flex,
  useTab,
  useMultiStyleConfig,
  TabProps,
  Box,
} from "@chakra-ui/react";

export default function StandupSettingsTab(props: TabProps) {
  const tabProps = useTab(props);
  const isSelected = !!tabProps["aria-selected"];
  const styles = useMultiStyleConfig("Tabs", tabProps);

  return (
    <Flex
      __css={{
        ...styles.tab,
        border: "none",
        cursor: "pointer",
        fontWeight: 700,
      }}
      {...tabProps}
      _focus={{ boxShadow: "none", outline: "none" }}
      _active={{ color: "none" }}
      _selected={{ color: "purple.500" }}
    >
      {props.children}
      <Box
        mt={1}
        height={1}
        bgColor={isSelected ? "purple.500" : ""}
        borderRadius={"lg"}
      />
    </Flex>
  );
}
