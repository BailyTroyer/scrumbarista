import { WarningIcon } from "@chakra-ui/icons";
import {
  Button,
  VStack,
  Text,
  Flex,
  Heading,
  useDisclosure,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Grid,
  ModalFooter,
} from "@chakra-ui/react";

const AdvancedSettingsSection = ({
  loading,
  active,
  setFieldValue,
}: {
  loading: boolean;
  active: boolean;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <VStack w="full" h="full" padding={10}>
      <Grid templateColumns="repeat(2, 1fr)" gap={10}>
        <Flex alignItems="flex-start" flexDirection="column">
          <Heading as="h4" size="md">
            {active ? "Pause" : "Resume"} this Standup
          </Heading>
          <Text fontSize="md" color="gray.500" mt={2} mb={5}>
            {active
              ? "Pausing a standup will stop Scrumbarista from sending DM's to participants. All data will be retained."
              : "Daily Standup has been paused. Press the resume button below to activate it again."}
          </Text>
          <Button
            onClick={() => {
              setFieldValue("active", !active);
            }}
            isLoading={loading}
            colorScheme={active ? "blue" : "yellow"}
            loadingText={active ? "Resuming" : "Pausing"}
            variant="outline"
            size="lg"
            type="submit"
          >
            {active ? "Pause" : "Resume"}
          </Button>
        </Flex>
        <Flex alignItems="flex-start" flexDirection="column">
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

export default AdvancedSettingsSection;
