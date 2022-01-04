import { useEffect, useState } from "react";

import { AddIcon, CheckIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Text,
  Button,
  Flex,
  useColorModeValue,
  VStack,
  HStack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import AsyncSelect from "react-select/async";

import authenticatedRoute from "src/components/AuthenticatedRoute";
import QuestionsDnd from "src/components/QuestionsDnd";
import ScheduleSettingsSection from "src/components/ScheduleSettingsSection";
import Separator from "src/components/Separator";
import SettingGroup from "src/components/SettingGroup";
import { API_URL, ChannelResponse } from "src/hooks/swr";
import useDaysToString, { toRegularTime } from "src/hooks/useDaysString";

const New: NextPage = () => {
  const router = useRouter();

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    window.onscroll = () => {
      setOffset(window.pageYOffset);
    };
  }, []);

  const promiseOptions = async (inputValue: string) => {
    const response: ChannelResponse[] = await (
      await fetch(`${API_URL}/slack/channels`)
    ).json();

    return response.filter((c) => c.name?.includes(inputValue));
  };

  return (
    <Flex flexDirection="column" w="full">
      <Formik
        initialValues={{
          name: "",
          introMessage: "Good morning, ready to start your checkin?",
          days: [],
          startTime: "09:00",
          questions: [
            "What did you do yesterday?",
            "What are you working on today?",
            "Any blockers?",
          ],
          channelId: "",
        }}
        onSubmit={async (values, { setSubmitting }) => {
          const newValues = {
            ...values,
            questions: values.questions.join("\n"),
          };

          console.log("POSTOING: ", values);

          const response = await fetch(`${API_URL}/standups`, {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(newValues),
          });

          const responseJson = await response.json();
          console.log(responseJson);

          setSubmitting(false);

          // if no error navigate home
          // @todo error handle this
          router.push(`/standups/${values.channelId}`);
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          isSubmitting,
          setFieldValue,
        }) => {
          const daysString = useDaysToString(values.days);

          return (
            <Form onSubmit={handleSubmit}>
              <Box
                bg={useColorModeValue(
                  "white",
                  offset > 0 ? "gray.700" : "gray.800"
                )}
                sx={{
                  position: "sticky",
                  top: "16",
                }}
                boxShadow={offset > 0 ? "md" : ""}
                zIndex={2}
              >
                <Flex
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  p={6}
                  maxW="5xl"
                  mx="auto"
                >
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
                        <Text>New</Text>
                      </BreadcrumbItem>
                    </Breadcrumb>
                    <Input
                      flex={1}
                      border="none"
                      borderRadius={0}
                      placeholder="Change Standup name ..."
                      fontSize="4xl"
                      fontWeight="bold"
                      _focus={{ outline: "none", border: "none" }}
                      onChange={handleChange}
                      p={0}
                      w="full"
                      autoFocus={true}
                      value={values.name}
                      name="name"
                    />

                    <Text fontSize="md" color="gray.500">
                      Weekly {daysString} at{" "}
                      {toRegularTime(values.startTime || "")}, in user's local
                      timezone
                    </Text>
                  </VStack>

                  <Button
                    leftIcon={<CheckIcon />}
                    colorScheme="pink"
                    variant="solid"
                    type="submit"
                    isLoading={isSubmitting}
                    loadingText="Saving"
                  >
                    Create
                  </Button>
                </Flex>
              </Box>

              <VStack w="full" h="full" px={8} spacing={4} maxW="5xl" mx="auto">
                <SettingGroup
                  label="Channel"
                  tooltip="Enter a channel to host the standup"
                >
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    loadOptions={promiseOptions}
                    onChange={(x) => {
                      setFieldValue("channelId", x?.id);
                    }}
                    getOptionLabel={(option) => `#${option.name}`}
                  />
                </SettingGroup>

                <Separator label="Schedule" />

                <ScheduleSettingsSection
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
                    <QuestionsDnd
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
              </VStack>
            </Form>
          );
        }}
      </Formik>
    </Flex>
  );
};

export default authenticatedRoute(New);
