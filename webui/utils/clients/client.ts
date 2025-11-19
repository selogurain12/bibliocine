import { initTsrReactQuery } from "@ts-rest/react-query/v5";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { localStorageBasePrefixVariable } from "../local-storage-base-prefix-variable";
import { biblioCineContract } from "../../../packages/src/contracts/index.contract";

const apiUrl = "http://10.0.2.1:3000";
console.log("API URL:", apiUrl);

async function getIdTokenAsync(): Promise<string | null> {
  try {
    const raw = await AsyncStorage.getItem(localStorageBasePrefixVariable("idToken"));
    return raw;
  } catch (error) {
    console.error("Erreur lors de la récupération du token :", error);
    return null;
  }
}
export const clientPromise = initTsrReactQuery(
  biblioCineContract,
  {
    baseUrl: apiUrl,
    headers: {
      "x-app-source": "ts-rest",
      "x-access-token": async () => await getIdTokenAsync(),
    },
  }
);

export const client = clientPromise;
