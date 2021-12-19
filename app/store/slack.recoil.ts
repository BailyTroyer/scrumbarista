import { atom, AtomEffect } from "recoil";

export interface BoltAuthResponse {
  token: {
    ok: boolean;
  } & SlackAuth;

  user: {
    ok: boolean;
  } & SlackUser;
}

type SlackAuth = {
  accessToken: string;
  tokenType: string;
  idToken: string;
};

type SlackUser = {
  email: string;
  name: string;
  picture: string;
  httpsSlackComUserId: string;
};

type JsonParsable = Record<string, any> | number | string | boolean;
type AtomEffectParameters<T> = Parameters<AtomEffect<T>>[0];

// const localForageEffect = <T extends JsonParsable>({
//   node,
//   setSelf,
//   onSet,
//   trigger,
// }: AtomEffectParameters<T>) => {
//   const key = `recoil-${node.key}`;

//   // If there's a persisted value - set it on load
//   const loadPersisted = async () => {
//     const savedValue = await localStorage.getItem(key);

//     if (savedValue != null) {
//       setSelf(JSON.parse(savedValue));
//     }
//   };

//   // Asynchronously set the persisted data
//   if (trigger === "get") {
//     loadPersisted();
//   }

//   // Subscribe to state changes and persist them to localForage
//   onSet((newValue, _, isReset) => {
//     isReset
//       ? localStorage.removeItem(key)
//       : localStorage.setItem(key, JSON.stringify(newValue));
//   });
// };

export const slackAuth = atom({
  key: "slackAuth",
  default: {
    accessToken: "",
    tokenType: "",
    idToken: "",
  } as SlackAuth,
  // effects_UNSTABLE: [localForageEffect],
});

export const slackUser = atom({
  key: "slackUser",
  default: {
    email: "",
    name: "",
    picture: "",
    httpsSlackComUserId: "",
  } as SlackUser,
  // effects_UNSTABLE: [localForageEffect],
});
