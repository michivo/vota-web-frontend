import { writable } from "svelte/store";
import type { UserState } from "../types/userState";

export const userStore = writable<UserState>({
  isLoggedIn: false,
  user: null,
  initialized: false,
});
