<script lang="ts">
import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { userStore } from "../stores/userStore";

export const prerender = true;

if(browser) {
    userStore.subscribe((state) => {
        console.error('new user state: ');
        console.error(state);
        if(!state.isLoggedIn && state.initialized) {
            goto('/');
        }
    });
}
</script>

<div class="container vota-main">
    <slot></slot>
</div>

<style>
    .vota-main {
        height: 100lvh;
        width: 100vw;
    }
</style>