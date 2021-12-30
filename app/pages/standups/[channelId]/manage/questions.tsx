import React, { useState } from "react";

import {
  AddIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
  DragHandleIcon,
  QuestionIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import { Box } from "@chakra-ui/layout";
import {
  VStack,
  Heading,
  Textarea,
  Tooltip,
  HStack,
  Text,
  Flex,
  Center,
  useColorModeValue,
  Button,
  useDisclosure,
  MenuList,
  MenuItem,
  Menu,
  MenuButton,
  MenuDivider,
  Input,
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
import type { NextLayoutComponentType } from "next";
import { useRouter } from "next/dist/client/router";
import useSWR from "swr";

import StandupLayout from "components/StandupLayout";
import { useStandup, useStandups } from "hooks/swr";

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

interface StandupResponse {
  name: string;
  channelId: string;
  questions: string;
  days: string[];
  users: { name: string; email: string; image: string }[];
  startTime: string;
  active: string;
}

const Questions: NextLayoutComponentType = () => {
  const router = useRouter();

  const { standup, isLoading, error } = useStandup(`${router.query.channelId}`);

  const [questions, setQuestions] = useState<string[]>(
    standup?.questions.split("\n") || []
  );

  return (
    <VStack w="full" h="full" padding={10}>
      <Box w="full">
        <HStack mb={2}>
          <Text
            color={useColorModeValue("gray.800", "gray.200")}
            fontWeight="medium"
          >
            Intro Message
          </Text>
          <Tooltip
            hasArrow
            label="Personalize Scrumbaristas intro message"
            bg="white"
            color="black"
            placement="right-end"
            borderRadius={"md"}
            p={3}
          >
            <QuestionIcon color="gray.400" />
          </Tooltip>
        </HStack>

        <Textarea placeholder="Type your intro message or leave blank for default ..." />
      </Box>

      <Box w="full">
        <HStack mb={2}>
          <Text
            color={useColorModeValue("gray.800", "gray.200")}
            fontWeight="medium"
          >
            Questions
          </Text>
          <Tooltip
            hasArrow
            label="Questions asked during each checkin."
            bg="white"
            color="black"
            placement="right-end"
            borderRadius={"md"}
            p={3}
          >
            <QuestionIcon color="gray.400" />
          </Tooltip>
        </HStack>
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
      </Box>
    </VStack>
  );
};

Questions.getLayout = StandupLayout;

export default Questions;
