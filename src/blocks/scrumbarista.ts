export const scrumbarista = [
  {
    color: "#ECB22E",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            '*Manage*\ninvoked with "/standup"\nOpens a dialog to manage a Stand-up',
        },
      },
    ],
  },
  {
    color: "#41BC88",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            '*Checkin*\ninvoked with "/checkin"\nOpens a dialog to checkin and fulfull the daily Stand-up. Otherwise you will get a message in your DM at the alloted time',
        },
      },
    ],
  },
  {
    color: "#E4E4E4",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "*need more information?*\ntoo bad :wink:, we're not at that point yet...",
        },
      },
    ],
  },
];
