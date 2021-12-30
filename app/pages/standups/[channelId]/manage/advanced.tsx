import { useCallback, useState } from "react";

import { WarningIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/layout";
import {
  VStack,
  Heading,
  Button,
  Grid,
  Text,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Center,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { NextLayoutComponentType } from "next";
import { useRouter } from "next/dist/client/router";

import StandupLayout from "components/StandupLayout";

const Advanced: NextLayoutComponentType = () => {
  const router = useRouter();
  const { channelId } = router.query;

  const [deleteType, setDeleteType] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [pausing, setPausing] = useState(false);
  const [paused, setPaused] = useState(false);

  return (
    <VStack w="full" h="full" padding={10}>
      <Grid templateColumns="repeat(2, 1fr)" gap={10}>
        <Flex alignItems={"flex-start"} flexDirection={"column"}>
          <Heading as="h4" size="md">
            {paused ? "Resume" : "Pause"} this Standup
          </Heading>
          <Text fontSize="md" color="gray.500" mt={2} mb={5}>
            {paused
              ? "Daily Standup has been paused. Press the resume button below to activate it again."
              : "Pausing a standup will stop Scrumbarista from sending DM's to participants. All data will be retained."}
          </Text>
          <Button
            onClick={() => {
              setPausing(true);
              setTimeout(() => {
                setPausing(false);
                setPaused((p) => !p);
              }, 2000);
            }}
            isLoading={pausing}
            colorScheme={paused ? "blue" : "yellow"}
            loadingText={paused ? "Resuming" : "Pausing"}
            variant="outline"
            size="lg"
          >
            {paused ? "Resume" : "Pause"}
          </Button>
        </Flex>
        <Flex alignItems={"flex-start"} flexDirection={"column"}>
          <Heading as="h4" size="md">
            Delete this Standup
          </Heading>
          <Text fontSize="md" color="gray.500" mt={2} mb={5}>
            Deleting a standup is permanent and non reversible. All data will be
            erased!
          </Text>
          <Button
            onClick={() => {
              onOpen();
              setDeleteType("Delete");
            }}
            colorScheme="red"
            variant="solid"
            size="lg"
          >
            Delete
          </Button>
        </Flex>
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <Center m={5}>
            <WarningIcon w="40" h="40" color="red" />
          </Center>

          <ModalHeader>Delete this standup?</ModalHeader>

          <ModalBody>
            If you proceed all the data from this standup will be lost.
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Continue
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

Advanced.getLayout = StandupLayout;

export default Advanced;
