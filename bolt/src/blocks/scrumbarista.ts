import { sectionBlock } from ".";

export const scrumbaristaAttachments = [
  {
    color: "#2E68EC",
    blocks: [
      sectionBlock(
        '*Scrumbarista*\ninvoked with "/scrumbarista"\n"randomPerson" and "randomOrder" arguments for picking random groups'
      ),
    ],
  },
  {
    color: "#ECB22E",
    blocks: [
      sectionBlock(
        '*Manage*\ninvoked with "/standup"\nOpens a dialog to manage a stand up'
      ),
    ],
  },
  {
    color: "#41BC88",
    blocks: [
      sectionBlock(
        '*Checkin*\ninvoked with "/checkin"\nOpens a dialog to checkin and fulfull the daily stand up. Otherwise you will get a message in your DM at the alloted time'
      ),
    ],
  },
];
