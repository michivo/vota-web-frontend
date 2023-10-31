<script lang="ts">
import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { userStore } from "../stores/userStore";
import type { UserState } from "../types/userState";

export const prerender = true;
let userState: UserState | null = null;

$: homeLink = userState?.isLoggedIn ? '/dashboard' : '/';

if(browser) {
    userStore.subscribe((state) => {
        userState = state;
        if(!state.isLoggedIn && state.initialized) {
            goto('/');
        }
    });
}
</script>

<nav class="navbar bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href={homeLink}>VOTA Web</a>
      {#if userState?.isLoggedIn}
      <div class="user-info">
            Angemeldet als { userState?.user?.displayName ?? userState.user?.email}
      </div>
      {/if}
    </div>
  </nav>
<main>
<div class="container vota-main">
    <slot></slot>
</div>
</main>  

<style>
    .vota-main {
        height: 100lvh;
        width: 100vw;
    }
</style>