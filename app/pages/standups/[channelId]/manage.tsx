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
import type { NextPage } from "next";
import { useRouter } from "next/router";

import Link from "components/Link";
import SettingGroup from "components/SettingGroup";
import { useStandup } from "hooks/swr";
import { weekDays } from "utils/constants";

const Advanced = () => {
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

const stringToColour = function (str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
};

const SortContainer = ({
  questions,
  setQuestions,
}: {
  questions: string[];
  setQuestions: (value: React.SetStateAction<string[]>) => void;
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
              setQuestions((questions) =>
                questions.map((q) => (q === id ? val : q))
              );
            }}
            onDelete={() =>
              setQuestions((questions) => questions.filter((q) => q !== id))
            }
          />
        ))}
      </SortableContext>
    </DndContext>
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setQuestions((q: string[]) => {
        const oldIndex = q.indexOf(active.id);
        const newIndex = q.indexOf(over.id);

        return arrayMove(q, oldIndex, newIndex);
      });
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

  const [name, setName] = useState(standup?.name);
  const [questions, setQuestions] = useState<string[]>(
    standup?.questions.split("\n") || []
  );

  const Header = () => (
    <HStack w="full" justifyContent="space-between">
      <VStack alignItems={"flex-start"} w="full">
        <Breadcrumb separator={<ChevronRightIcon color="gray.500" />}>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} href="/home">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink as={Link} href={`/standups/${channelId}`}>
              {standup?.name} Standup
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Text>Manage</Text>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading>{standup?.name} Standup</Heading>
        <Text fontSize="md" color="gray.500">
          Weekly from Monday to Friday, at 15:08 PM, in user's local timezone
        </Text>
      </VStack>
      <Button
        leftIcon={<CheckIcon />}
        colorScheme="pink"
        variant="solid"
        onClick={() => router.push(`/standups/${channelId}/manage`)}
      >
        Save
      </Button>
    </HStack>
  );

  const Separator = ({ label }: { label: string }) => (
    <HStack w="full" my={10}>
      <Divider w="full" />
      <Text>{label}</Text>
      <Divider w="full" />
    </HStack>
  );

  const [days, setDays] = useState<string[]>([]);
  const times = ["9:00", "9:30", "10:00"];
  const [time, setTime] = useState("9:30");

  const Schedule = () => (
    <HStack w="full">
      <SettingGroup
        label="Time"
        tooltip="The daily time to ping members for the standup"
      >
        <Select
          size="md"
          value={time}
          onChange={(e) => setTime(e.target.value)}
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
              // bg={days.includes(d) ? "blue.800" : ""}
              colorScheme="blue"
              // color={days.includes(d) ? "white" : ""}
              variant={days.includes(d) ? "solid" : "ghost"}
              onClick={() =>
                setDays((days) => {
                  if (days.includes(d)) {
                    return days.filter((day) => day !== d);
                  } else {
                    return [...days, d];
                  }
                })
              }
            >
              {d.substring(0, 1).toUpperCase()}
            </Button>
          ))}
        </Grid>
      </SettingGroup>
    </HStack>
  );

  return (
    <Flex flex={1} bg={useColorModeValue("white", "gray.700")}>
      <VStack w="full" h="full" padding={8} spacing={4} maxW="5xl" mx="auto">
        <Header />

        <SettingGroup
          label="Standup Name"
          tooltip="Enter a name that signifies the nature of the standup."
        >
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name for the standup ..."
            size="md"
            borderRadius={"md"}
          />
        </SettingGroup>

        <Separator label="Schedule" />

        <Schedule />

        <Separator label="Questions" />

        <VStack w="full" h="full">
          <SettingGroup
            label="Intro Message"
            tooltip="Personalize Scrumbaristas intro message"
          >
            <Textarea placeholder="Type your intro message or leave blank for default ..." />
          </SettingGroup>

          <SettingGroup
            label="Questions"
            tooltip="Questions asked during each checkin."
          >
            <SortContainer questions={questions} setQuestions={setQuestions} />

            <HStack>
              <Button
                onClick={() => setQuestions((q) => [...q, ""])}
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

        <Advanced />
      </VStack>
    </Flex>
  );
};

export default Manage;
