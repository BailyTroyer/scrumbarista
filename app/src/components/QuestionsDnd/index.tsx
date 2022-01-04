import { DeleteIcon, DragHandleIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  MenuList,
  MenuItem,
  Menu,
  MenuButton,
  HStack,
  Input,
  useColorModeValue,
  useDisclosure,
  Center,
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

import { stringToColour } from "src/utils";

const Question = (props: any) => {
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
          <MenuItem icon={<DeleteIcon />} onClick={props.onDelete}>
            Delete
          </MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  );
};

const QuestionsDnd = ({
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
          <Question
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
      const oldIndex = questions.indexOf(active.id);
      const newIndex = questions.indexOf(over.id);

      const newQuestion = arrayMove(questions, oldIndex, newIndex);
      setFieldValue("questions", newQuestion);
    }
  }
};

export default QuestionsDnd;
