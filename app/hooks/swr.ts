import useSWR from "swr";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export interface StandupsResponse {
  name: string;
  channelId: string;
  questions: string;
  days: string[];
  users: { name: string; id: string; image: string }[];
  startTime: string;
  active: string;
  channelName: string;
}

export interface StandupsErrorResponse {
  error: string;
}

export const useStandups = () => {
  const { data, error } = useSWR<StandupsResponse[], StandupsErrorResponse>(
    `${API_URL}/standups`,
    fetcher
  );

  return {
    standups: data || [],
    isLoading: !error && !data,
    error: error || null,
  };
};

export interface StandupResponse {
  name: string;
  channelId: string;
  questions: string;
  days: string[];
  introMessage: string;
  channelName: string;
  users: { name: string; id: string; image: string }[];
  startTime: string;
  active: boolean;
}

export const useStandup = (channelId: string | string[] | undefined) => {
  const { data, error } = useSWR<StandupResponse>(
    channelId ? `${API_URL}/standups/${channelId}` : null,
    channelId ? fetcher : null
  );

  return {
    standup: data || null,
    isLoading: !error && !data,
    error: error || null,
  };
};

export interface CheckinResponse {
  id: string;
  createdDate: string;
  answers: string;
  userId: string;
  channelId: string;
}

export const useCheckins = (channelId: string | string[] | undefined) => {
  const { data, error } = useSWR<CheckinResponse[]>(
    channelId ? `${API_URL}/standups/${channelId}/checkins` : null,
    channelId ? fetcher : null
  );

  return {
    checkins: data || [],
    isLoading: !error && !data,
    error: error || null,
  };
};
