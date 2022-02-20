import { FC, useMemo } from "react";

import {
  HStack,
  VStack,
  Heading,
  Text,
  Image,
  Circle,
  useColorModeValue,
  Flex,
  Checkbox,
  Box,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";

import { CheckinResponse, StandupResponse } from "src/hooks/swr";
import { stringToColour } from "src/utils";

export interface CheckinsFilterFormValues {
  participants: { name: string; id: string; image: string }[];
  questions: string[];
}

interface Props {
  standup: StandupResponse | null;
  checkins: CheckinResponse[];
  onFilterChange: (form: CheckinsFilterFormValues) => void;
}

const CheckinFilterBox: FC<Props> = ({
  standup,
  checkins,
  onFilterChange,
}: Props) => {
  const checkinUsers = useMemo(() => {
    return checkins
      .map((s) => s.userId)
      .filter((value, index, self) => self.indexOf(value) === index);
  }, [checkins]);

  const users = useMemo(() => {
    return standup?.users.filter((u) => checkinUsers.includes(u.id));
  }, [checkinUsers, standup?.users]);

  return (
    <Formik
      initialValues={
        {
          participants: users || [],
          questions: standup?.questions || [],
        } as CheckinsFilterFormValues
      }
      enableReinitialize
      onSubmit={onFilterChange}
    >
      {({ setFieldValue, values, submitForm }) => (
        <Form>
          <Box
            w="full"
            sx={{
              position: "sticky",
              top: "13em",
            }}
            zIndex={10}
          >
            <VStack
              w="full"
              bg={useColorModeValue("white", "gray.700")}
              borderRadius="2xl"
              shadow={"base"}
              p={5}
              alignItems={"flex-start"}
              spacing={8}
            >
              <Flex
                direction={"column"}
                alignItems={"center"}
                justifyContent={"space-between"}
                w="full"
              >
                <Flex
                  w="full"
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  mb={5}
                >
                  <Heading fontSize="lg">Participants</Heading>
                  <HStack>
                    <Text fontSize="xs">All</Text>
                    <Checkbox
                      isChecked={values.participants.length === users?.length}
                      onChange={() => {
                        setFieldValue(
                          "participants",
                          values.participants.length === users?.length
                            ? []
                            : users
                        );
                        submitForm();
                      }}
                    />
                  </HStack>
                </Flex>
                <VStack spacing={2} w="full">
                  {users?.map((user) => (
                    <Flex
                      w="full"
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <HStack>
                        <Image
                          boxSize={"25"}
                          objectFit="cover"
                          src={user.image}
                          borderRadius="full"
                        />
                        <Text>{user.name}</Text>
                      </HStack>
                      <Checkbox
                        isChecked={
                          values.participants.filter(
                            (p) => p.name === user.name
                          ).length > 0
                        }
                        onChange={() => {
                          const exists =
                            values.participants.filter(
                              (p) => p.name === user.name
                            ).length === 1;

                          setFieldValue(
                            "participants",
                            exists
                              ? values.participants.filter(
                                  (p) => p.name !== user.name
                                )
                              : [...values.participants, user]
                          );

                          submitForm();
                        }}
                      />
                    </Flex>
                  ))}
                </VStack>
              </Flex>

              <Flex
                direction={"column"}
                alignItems={"center"}
                justifyContent={"space-between"}
                w="full"
              >
                <Flex
                  w="full"
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  mb={5}
                >
                  <Heading fontSize="lg">Questions</Heading>
                  <HStack>
                    <Text fontSize="xs">All</Text>
                    <Checkbox
                      isChecked={
                        values.questions.length === standup?.questions.length
                      }
                      onChange={() => {
                        const alreadySelected =
                          values.questions.length ===
                            standup?.questions.length &&
                          standup?.questions.every(
                            (value, index) => value === values.questions[index]
                          );

                        setFieldValue(
                          "questions",
                          alreadySelected ? [] : standup?.questions
                        );

                        submitForm();
                      }}
                    />
                  </HStack>
                </Flex>
                <VStack spacing={2} w="full">
                  {standup?.questions.map((question) => (
                    <Flex
                      w="full"
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <HStack>
                        <Circle size={2} bg={stringToColour(question)} />
                        <Text fontSize="sm">{question}</Text>
                      </HStack>
                      <Checkbox
                        isChecked={
                          values.questions.filter((q) => q === question)
                            .length > 0
                        }
                        onChange={() => {
                          const exists =
                            values.questions.filter((q) => q === question)
                              .length === 1;

                          setFieldValue(
                            "questions",
                            exists
                              ? values.questions.filter((q) => q !== question)
                              : [...values.questions, question]
                          );

                          submitForm();
                        }}
                      />
                    </Flex>
                  ))}
                </VStack>
              </Flex>
            </VStack>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default CheckinFilterBox;
