import useSWR from "swr";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export interface StandupsResponse {
  name: string;
  channelId: string;
  questions: string;
  days: string[];
  users: { name: string; email: string; image: string }[];
  startTime: string;
  active: string;
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
}

export const useStandup = (channelId: string) => {
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
