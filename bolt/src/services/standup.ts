import { sectionBlock, sectionWithSelect } from "../blocks";
import { updateCheckin } from "../services/api";

export const onOutOfOffice = async (
  client,
  say,
  user,
  standup,
  preExistingCheckin
) => {
  // check for checkin with user ID
  const date = new Date().toLocaleDateString();

  const answers = preExistingCheckin.answers;

  const userInfo = await client.users.info({
    user,
    include_locale: true,
  });
  // respond with END of checkin & post checkin
  const postedMessage = await client.chat.postMessage({
    channel: preExistingCheckin.channelId,
    attachments: [
      {
        color: "#41BC88",
        blocks: [sectionBlock(`*${standup.name}*\n${date}`)],
      },
      {
        color: "E4E4E4",
        blocks: [sectionBlock(`*out of office*`)],
      },
    ],
    username: userInfo.user.profile.real_name,
    icon_url: userInfo.user.profile.image_192,
  });

  await updateCheckin(
    preExistingCheckin.channelId,
    {
      answers,
      postMessageTs: postedMessage.ts,
      outOfOffice: true,
    },
    preExistingCheckin.id
  );
  say("all done; thanks. We'll see you when you get back!");
  return;
};

export const onSkip = async (
  client,
  say,
  user,
  standup,
  preExistingCheckin,
  ts
) => {
  // check for next question or end

  const answers = preExistingCheckin.answers;
  const questions = standup.questions;

  // check for checkin with user ID
  const date = new Date().toLocaleDateString();

  // add empty answer
  answers.push("");

  await updateCheckin(
    preExistingCheckin.channelId,
    {
      answers,
      postMessageTs: ts,
    },
    preExistingCheckin.id
  );

  console.log("SKIP: ", answers);

  // send empty as answer
  if (answers.length !== questions.length) {
    // Post message with block to (skip, use last answer, if 1st question I'm OOO today)
    await client.chat.postMessage({
      channel: user,
      blocks: [
        sectionWithSelect(
          "Quick Action",
          questions[answers.length],
          [
            { text: "Use previous response", value: "prev" },
            { text: "I'm OOO today", value: "ooo" },
            { text: "Skip", value: "skip" },
          ],
          "checkinMessageDmQuickResponse"
        ),
      ],
      text: questions[answers.length],
    });
  } else {
    // if answers length == questions length then say standup is done
    const userInfo = await client.users.info({
      user,
      include_locale: true,
    });

    console.log();

    const postedMessage = await client.chat.postMessage({
      channel: preExistingCheckin.channelId,
      attachments: [
        {
          color: "#41BC88",
          blocks: [sectionBlock(`*${standup.name}*\n${date}`)],
        },
        ...questions
          .map((question: string, index: number) => {
            // if user skipped don't post in channel
            if (answers[index].length === 0) return;

            return {
              color: "E4E4E4",
              blocks: [sectionBlock(`*${question}*\n${answers[index]}`)],
            };
          })
          .filter((x) => {
            console.log("X IS: ", x);
            return x !== null && x !== undefined;
          }),
      ],
      username: userInfo.user.profile.real_name,
      icon_url: userInfo.user.profile.image_192,
    });

    const checkin = {
      answers,
      postMessageTs: postedMessage.ts,
    };

    // update ts for message here
    await updateCheckin(
      preExistingCheckin.channelId,
      checkin,
      preExistingCheckin.id
    );

    say("all done. Thanks!");
    return;
  }
};
