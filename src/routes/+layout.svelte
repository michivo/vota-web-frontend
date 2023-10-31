<script lang="ts">
import { browser } from "$app/environment";
import { goto } from "$app/navigation";
	import { Button } from "sveltestrap";
	import { firebaseAuth } from "../services/firebase";
import { userStore } from "../stores/userStore";
import type { UserState } from "../types/userState";
import Fa from 'svelte-fa';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

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
            <small>
            Angemeldet als { userState?.user?.displayName ?? userState.user?.email}
            </small>
            <Button color="link" on:click={() => firebaseAuth.signOut()} title="Abmelden"><Fa icon={faRightFromBracket}></Fa></Button>
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