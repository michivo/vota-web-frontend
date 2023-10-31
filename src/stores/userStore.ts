import { writable } from "svelte/store";
import { firebaseAuth } from "../services/firebase";
import type { UserState } from "../types/userState";

export const userStore = writable<UserState>({
  isLoggedIn: !!firebaseAuth.currentUser,
  user: firebaseAuth.currentUser,
  initialized: !!firebaseAuth.currentUser,
});
