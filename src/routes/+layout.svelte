<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { Button } from 'sveltestrap';
	import { userStore } from '../stores/userStore';
	import { UserRole, type UserState } from '../types/userState';
	import Fa from 'svelte-fa';
	import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
	import { UserService } from '../services/userService';
	import { page } from '$app/stores';

	let userState: UserState | null = null;
	const userService = new UserService();

	$: homeLink = userState?.isLoggedIn ? '/dashboard' : '/';

	if (browser) {
		userStore.subscribe((state) => {
			userState = state;
			if (!state.isLoggedIn) {
				goto('/');
			}
		});
	}
</script>

<nav class="navbar bg-light navbar-expand-lg">
	<div class="container-fluid">
		<a class="navbar-brand me-4" href={homeLink}
			><img src="/faviconxl.png" height="192" width="192" alt="" class="logo me-3" />VOTA Web</a
		>
		{#if userState?.isLoggedIn}
		<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		  </button>	  
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<ul class="navbar-nav ms-4 me-auto">
					<li class="nav-item">
						<a class="nav-link" href="/dashboard" class:active={$page.url.pathname.includes('/dashboard')}>Wahlen</a>
					</li>
					{#if userState?.user?.role === UserRole.Admin}
					<li class="nav-item">
						<a class="nav-link" href="/users" class:active={$page.url.pathname.includes('/user')}>Benutzer*innenverwaltung</a>
					</li>
					{/if}
				</ul>
				<div class="user-info">
					<small>
						Angemeldet als {userState?.user?.displayName ??
							userState.user?.email ??
							userState?.user?.name}
					</small>
					<Button color="link" on:click={() => userService.signOut()} title="Abmelden"
						><Fa icon={faRightFromBracket} /></Button
					>
				</div>
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
	$btn-border-radius: 1.25rem;
	$btn-border-radius-lg: 2rem;
	$btn-font-weight: 900;
	$btn-color: #fff;
	$navbar-active-color: rgb(115, 163, 3);

	@import '../node_modules/bootstrap/scss/bootstrap';
	.vota-main {
		height: 100lvh;
		width: 100vw;
	}

	.btn {
		text-transform: uppercase;
		font-style: italic;
	}

	.btn-primary {
		color: #fff;
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

	a.nav-link { 
		text-transform: uppercase;
		padding-bottom: 0.7rem;
		font-weight: 900;
		font-style: italic;
		font-size: 1.25rem;
		color: var(--bs-primary);
	}

	a.nav-link.active {
		border-top: 1px solid var(--bs-primary);
		color: var(--bs-primary);
	}

	a.nav-link:hover {
		color: var(--bs-secondary);
	}
</style>
