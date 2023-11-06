<script lang="ts">
    export const prerender = true;

	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { Button } from 'sveltestrap';
	import { firebaseAuth } from '../services/firebase';
	import { userStore } from '../stores/userStore';
	import type { UserState } from '../types/userState';
	import Fa from 'svelte-fa';
	import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

	let userState: UserState | null = null;

	$: homeLink = userState?.isLoggedIn ? '/dashboard' : '/';

	if (browser) {
		userStore.subscribe((state) => {
			userState = state;
			if (!state.isLoggedIn && state.initialized) {
				goto('/');
			}
		});
	}
</script>

<nav class="navbar bg-light">
	<div class="container-fluid">
		<a class="navbar-brand" href={homeLink}><img src="/faviconxl.png" height="192" width="192" alt="" class="logo me-3">VOTA Web</a>
		{#if userState?.isLoggedIn}
			<div class="user-info">
				<small>
					Angemeldet als {userState?.user?.displayName ?? userState.user?.email}
				</small>
				<Button color="link" on:click={() => firebaseAuth.signOut()} title="Abmelden"
					><Fa icon={faRightFromBracket} /></Button
				>
			</div>
		{/if}
	</div>
</nav>
<main>
	<div class="container vota-main">
		<slot />
	</div>
</main>

<style lang="scss" global>
    $primary: rgb(115, 163, 3);
    $secondary: rgb(225, 0, 120);
	$font-family: 'Metropolis', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	$header-color: rgb(115, 163, 3);

    @import "../node_modules/bootstrap/scss/bootstrap";
	.vota-main {
		height: 100lvh;
		width: 100vw;
	}

    .logo {
        height: 2.5rem;
        width: 2.5rem;
    }

	a.navbar-brand {
		font-weight: 900;
		color: var(--bs-header-color);
		font-style: italic;
		text-transform: uppercase;
	}
</style>
