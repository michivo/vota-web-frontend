<script lang="ts">
import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { firebaseAuth } from "../firebase/firebase";

export const prerender = true;

if(browser) {
    console.error(window.location.pathname);
    console.error(firebaseAuth.currentUser);
    if(!firebaseAuth.currentUser && window.location.pathname !== '/') {
        goto('/');
    }
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