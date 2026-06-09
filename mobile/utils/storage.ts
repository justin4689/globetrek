import * as SecureStore from "expo-secure-store";

const KEYS = {
  ACCESS_TOKEN: "globetrek_access_token",
  REFRESH_TOKEN: "globetrek_refresh_token",
} as const;

export const storage = {
  getAccessToken: () => SecureStore.getItemAsync(KEYS.ACCESS_TOKEN),
  getRefreshToken: () => SecureStore.getItemAsync(KEYS.REFRESH_TOKEN),

  setTokens: (accessToken: string, refreshToken: string) =>
    Promise.all([
      SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, accessToken),
      SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken),
    ]),

  clearTokens: () =>
    Promise.all([
      SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN),
    ]),
};
