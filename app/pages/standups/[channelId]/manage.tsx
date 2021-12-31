import { useState } from "react";

import {
  AddIcon,
  CheckIcon,
  ChevronRightIcon,
  DeleteIcon,
  DragHandleIcon,
  QuestionIcon,
  SettingsIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  MenuList,
  MenuItem,
  Menu,
  MenuButton,
  MenuDivider,
  Button,
  VStack,
  HStack,
  Input,
  Text,
  Tooltip,
  Flex,
  useColorModeValue,
  Divider,
  Box,
  Heading,
  Select,
  useDisclosure,
  Center,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Grid,
  ModalFooter,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  useSortable,
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Form, Formik, FormikFormProps } from "formik";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";

import Link from "components/Link";
import SettingGroup from "components/SettingGroup";
import { API_URL, useStandup } from "hooks/swr";
import useDaysToString, { toRegularTime } from "hooks/useDaysString";
import { stringToColour } from "utils";
import { weekDays } from "utils/constants";

const Advanced = ({
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
        <Flex alignItems={"flex-start"} flexDirection={"column"}>
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

const SortContainer = ({
  questions,
  setFieldValue,
}: {
  questions: string[];
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={questions} strategy={verticalListSortingStrategy}>
        {questions.map((id, idx) => (
          <SortableItem
            key={idx}
            id={id}
            onChange={(val: string) => {
              setFieldValue(
                "questions",
                questions.map((q) => (q === id ? val : q))
              );
            }}
            onDelete={() =>
              setFieldValue(
                "questions",
                questions.filter((q) => q !== id)
              )
            }
          />
        ))}
      </SortableContext>
    </DndContext>
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      // setQuestions((q: string[]) => {
      //   const oldIndex = q.indexOf(active.id);
      //   const newIndex = q.indexOf(over.id);

      //   return arrayMove(q, oldIndex, newIndex);
      // });

      const oldIndex = questions.indexOf(active.id);
      const newIndex = questions.indexOf(over.id);

      const newQuestion = arrayMove(questions, oldIndex, newIndex);
      setFieldValue("questions", newQuestion);
    }
  }
};

export function SortableItem(props: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <HStack
      borderRadius={"lg"}
      borderWidth={1}
      style={style}
      my={2}
      p={3}
      alignItems={"center"}
      bg={useColorModeValue("white", "gray.600")}
    >
      <Center ref={setNodeRef} {...attributes} {...listeners}>
        <DragHandleIcon color={stringToColour(props.id)} />
      </Center>

      <Input
        flex={1}
        border="none"
        value={props.id}
        onChange={(e) => props.onChange(e.target.value)}
        fontSize={18}
        _focus={{ outline: "none", border: "none" }}
        h={6}
        bg="none"
        autoFocus={props.id === ""}
      />

      <Menu isOpen={isOpen}>
        <MenuButton
          variant="ghost"
          borderRadius={5}
          aria-label="Courses"
          fontWeight="normal"
          onMouseEnter={onOpen}
          onMouseLeave={onClose}
          color="gray.300"
        >
          <Center>
            <SettingsIcon onMouseEnter={onOpen} onMouseLeave={onClose} />
          </Center>
        </MenuButton>
        <MenuList onMouseEnter={onOpen} onMouseLeave={onClose}>
          <MenuItem>Pick Color</MenuItem>
          <MenuDivider />
          <MenuItem icon={<DeleteIcon />} onClick={props.onDelete}>
            Delete
          </MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  );
}

const Manage: NextPage = () => {
  const router = useRouter();
  const { channelId } = router.query;

  const { standup, isLoading, error } = useStandup(channelId);

  const Separator = ({ label }: { label: string }) => (
    <HStack w="full" my={10}>
      <Divider w="full" />
      <Text>{label}</Text>
      <Divider w="full" />
    </HStack>
  );

  const times = ["09:00", "09:30", "10:00"];

  const Schedule = ({
    startTime,
    days,
    setFieldValue,
  }: {
    startTime: string;
    days: string[];
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
    ) => void;
  }) => (
    <HStack w="full">
      <SettingGroup
        label="Time"
        tooltip="The daily time to ping members for the standup"
      >
        <Select
          size="md"
          value={startTime}
          onChange={(e) => {
            console.log(e.target.value);
            setFieldValue("startTime", e.target.value);
          }}
        >
          {times.map((t) => (
            <option value={t}>{t}</option>
          ))}
        </Select>
      </SettingGroup>

      <SettingGroup
        label="Days"
        tooltip="The daily time to ping members for the standup"
      >
        <Grid templateColumns="repeat(7, 1fr)" gap={2}>
          {weekDays.map((d) => (
            <Button
              borderRadius={"2xl"}
              w={28}
              h={10}
              borderColor={"blue.500"}
              borderWidth={days.includes(d) ? 0 : 2}
              colorScheme="blue"
              variant={days.includes(d) ? "solid" : "ghost"}
              onClick={() => {
                if (days.includes(d)) {
                  setFieldValue(
                    "days",
                    days.filter((day) => day !== d)
                  );
                } else {
                  setFieldValue("days", [...days, d]);
                }
              }}
            >
              {d.substring(0, 1).toUpperCase()}
            </Button>
          ))}
        </Grid>
      </SettingGroup>
    </HStack>
  );

  const daysString = useDaysToString(standup?.days || []);

  const { mutate } = useSWRConfig();

  if (isLoading) {
    return (
      <Center
        height="100vh"
        w="100%"
        bg={useColorModeValue("white", "gray.700")}
        flexDir={"column"}
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Flex flex={1} bg={useColorModeValue("white", "gray.700")}>
      <VStack w="full" h="full" padding={8} maxW="5xl" mx="auto">
        <Formik
          initialValues={{
            name: standup?.name,
            introMessage: standup?.introMessage || "",
            days: standup?.days || [],
            startTime: standup?.startTime.slice(0, -3) || "",
            questions: standup?.questions.split("\n") || [],
            active: standup?.active || true,
          }}
          onSubmit={async (values, { setSubmitting }) => {
            const newValues = {
              ...values,
              questions: values.questions.join("\n"),
            };

            console.log("NEW VALUES: ", newValues);

            const response = await fetch(`${API_URL}/standups/${channelId}`, {
              headers: {
                "Content-Type": "application/json",
              },
              method: "PATCH",
              body: JSON.stringify(newValues),
            });

            const responseJson = await response.json();
            console.log(responseJson);

            mutate(`${API_URL}/standups/${channelId}`);
            setSubmitting(false);
          }}
        >
          {({
            values,
            handleChange,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          }) => (
            <Form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <HStack w="full" justifyContent="space-between">
                  <VStack alignItems={"flex-start"} w="full">
                    <Breadcrumb
                      separator={<ChevronRightIcon color="gray.500" />}
                    >
                      <BreadcrumbItem>
                        <BreadcrumbLink as={Link} href="/home">
                          Home
                        </BreadcrumbLink>
                      </BreadcrumbItem>

                      <BreadcrumbItem>
                        <BreadcrumbLink
                          as={Link}
                          href={`/standups/${channelId}`}
                        >
                          {standup?.name} Standup
                        </BreadcrumbLink>
                      </BreadcrumbItem>

                      <BreadcrumbItem>
                        <Text>Manage</Text>
                      </BreadcrumbItem>
                    </Breadcrumb>
                    <Heading>{standup?.name} Standup</Heading>
                    <Text fontSize="md" color="gray.500">
                      Weekly {daysString} at{" "}
                      {toRegularTime(standup?.startTime || "")}, in user's local
                      timezone
                    </Text>
                  </VStack>

                  <Button
                    leftIcon={<CheckIcon />}
                    colorScheme="pink"
                    variant="solid"
                    // onClick={() => router.push(`/standups/${channelId}/manage`)}
                    type="submit"
                    isLoading={isSubmitting}
                    loadingText="Saving"
                  >
                    Save
                  </Button>
                </HStack>

                <SettingGroup
                  label="Standup Name"
                  tooltip="Enter a name that signifies the nature of the standup."
                >
                  <Input
                    value={values.name}
                    name="name"
                    onChange={handleChange}
                    placeholder="Enter a name for the standup ..."
                    size="md"
                    borderRadius={"md"}
                  />
                </SettingGroup>

                <Separator label="Schedule" />

                <Schedule
                  startTime={values.startTime}
                  days={values.days}
                  setFieldValue={setFieldValue}
                />

                <Separator label="Questions" />

                <VStack w="full" h="full">
                  <SettingGroup
                    label="Intro Message"
                    tooltip="Personalize Scrumbaristas intro message"
                  >
                    <Textarea
                      value={values.introMessage}
                      onChange={handleChange}
                      placeholder="Type your intro message or leave blank for default ..."
                      name="introMessage"
                    />
                  </SettingGroup>

                  <SettingGroup
                    label="Questions"
                    tooltip="Questions asked during each checkin."
                  >
                    <SortContainer
                      questions={values.questions}
                      setFieldValue={setFieldValue}
                    />

                    <HStack>
                      <Button
                        onClick={() => {
                          const newQuestions = [...values.questions, ""];
                          setFieldValue("questions", newQuestions);
                        }}
                        leftIcon={<AddIcon />}
                        variant="ghost"
                        size="sm"
                      >
                        Add question
                      </Button>
                    </HStack>
                  </SettingGroup>
                </VStack>

                <Separator label="Advanced" />

                <Advanced
                  active={values.active}
                  loading={isSubmitting}
                  setFieldValue={setFieldValue}
                />
              </VStack>
            </Form>
          )}
        </Formik>
      </VStack>
    </Flex>
  );
};

export default Manage;
