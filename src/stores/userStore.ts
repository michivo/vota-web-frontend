import type { User } from "firebase/auth";
import { writable } from "svelte/store";
import { firebaseAuth } from "../services/firebase";

export const userStore = writable<{
  isLoggedIn: boolean;
  user: User | null;
  initialized: boolean;
}>({
  isLoggedIn: !!firebaseAuth.currentUser,
  user: firebaseAuth.currentUser,
  initialized: !!firebaseAuth.currentUser,
}, () => {
});
