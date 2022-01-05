import { useState, useEffect } from "react";

import { AddIcon, CheckIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  VStack,
  HStack,
  Input,
  Text,
  Flex,
  useColorModeValue,
  Box,
  Heading,
  Center,
  Textarea,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";

import AdvancedSettingsSection from "src/components/AdvancedSettingsSection";
import authenticatedRoute from "src/components/AuthenticatedRoute";
import Link from "src/components/Link";
import QuestionsDnd from "src/components/QuestionsDnd";
import ScheduleSettingsSection from "src/components/ScheduleSettingsSection";
import Separator from "src/components/Separator";
import SettingGroup from "src/components/SettingGroup";
import { API_URL, useStandup } from "src/hooks/swr";
import useDaysToString, { toRegularTime } from "src/hooks/useDaysString";

const Manage: NextPage = () => {
  const router = useRouter();
  const { channelId } = router.query;

  const { standup, isLoading, error } = useStandup(channelId);

  const daysString = useDaysToString(standup?.days || []);

  const { mutate } = useSWRConfig();

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    window.onscroll = () => {
      setOffset(window.pageYOffset);
    };
  }, []);

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
    <Flex flexDirection="column" w="full">
      <Formik
        initialValues={{
          name: standup?.name,
          introMessage: standup?.introMessage || "",
          days: standup?.days || [],
          startTime: standup?.startTime.slice(0, -3) || "",
          questions: standup?.questions || [],
          active: standup?.active || true,
        }}
        onSubmit={async (values, { setSubmitting }) => {
          const newValues = {
            ...values,
            questions: values.questions,
          };

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
                padding={6}
                maxW="5xl"
                mx="auto"
              >
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
                    Weekly {daysString} at{" "}
                    {toRegularTime(standup?.startTime || "")}, in user's local
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
                  Save
                </Button>
              </Flex>
            </Box>

            <VStack w="full" h="full" px={8} spacing={4} maxW="5xl" mx="auto">
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

              <Separator label="Advanced" />

              <AdvancedSettingsSection
                active={values.active}
                loading={isSubmitting}
                setFieldValue={setFieldValue}
              />
            </VStack>
          </Form>
        )}
      </Formik>
    </Flex>
  );
};

export default authenticatedRoute(Manage);
