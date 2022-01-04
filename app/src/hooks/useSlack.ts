import { useMemo, useState } from "react";

declare let process: {
  env: {
    NEXT_PUBLIC_SLACK_BOT_TOKEN: string;
  };
};

const token = process.env.NEXT_PUBLIC_SLACK_BOT_TOKEN;

interface Channel {
  id?: string;
  name?: string;
}

interface ChannelListResponse {
  ok: string;
  channels?: {
    id: string;
    name: string;
  }[];
}

const useSlack = () => {
  const [channels, setChannels] = useState<Channel[]>([]);

  const listChannels = async (): Promise<Channel[]> => {
    const response = await fetch(`https://slack.com/api/conversations.list`, {
      method: "POST",
      body: JSON.stringify({ token }),
    });

    console.log("RESPONSE");

    console.log("RSPO: ", await response.json());

    const responseJson: ChannelListResponse = await response.json();

    setChannels(responseJson.channels || []);

    return responseJson.channels || [];
  };

  return {
    listChannels,
    channels,
  };
};

export default useSlack;
