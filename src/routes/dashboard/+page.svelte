<script lang="ts">
	import { Button, ListGroup, ListGroupItem } from 'sveltestrap';
	import { userStore } from '../../stores/userStore';
	import {
		faCheckToSlot,
		faRankingStar,
		faSquarePollVertical
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { onDestroy, onMount } from 'svelte';
	import { ElectionState, type ElectionDto, ElectionType } from '../../types/api/electionDto';
	import { ElectionApi } from '../../services/electionApi';
	import EditElectionModal from '../../components/editElectionModal.svelte';
	import type { User } from '../../types/userState';

	let loading = false;
	let elections = [] as ElectionDto[];
	let electionToEdit = undefined as ElectionDto | undefined;
	let currentUser = undefined as User | undefined | null;
	let isNewElection = false;
	const electionApi = new ElectionApi();

	const unsubscribeUser = userStore.subscribe(
		(val) => (currentUser = val.isLoggedIn ? val.user : undefined)
	);

	onMount(refresh);

	onDestroy(unsubscribeUser);

	async function refresh() {
		loading = true;
		try {
			elections = await electionApi.getAll();
			elections = elections.sort((a, b) => b.dateCreated.getDate() - a.dateCreated.getDate());
		} finally {
			loading = false;
		}
	}

	function createNewElection() {
		isNewElection = true;
		electionToEdit = {
			title: '',
			enforceGenderParity: true,
			description: '',
			createUserId: 0,
			dateCreated: new Date(),
			electionState: ElectionState.Creating,
			electionType: ElectionType.StandardSingleTransferableVote,
			id: 0
		};
	}

	function editElection(election: ElectionDto) {
		isNewElection = false;
		electionToEdit = election;
	}

	async function saveElection(event: CustomEvent<ElectionDto>): Promise<void> {
		electionToEdit = undefined;
		loading = true;
		let hasError = false;
		try {
			const election = event.detail;
			if (isNewElection) {
				await electionApi.createElection(election);
			}
		} catch {
			electionToEdit = event.detail;
			hasError = true;
		} finally {
			loading = false;
		}
	}
</script>

<template>
	<div class="d-flex">
		<h1 class="mt-5 flex-fill"><Fa icon={faRankingStar} class="me-3" />Wahlen</h1>
		<Button class="align-self-center" size="lg" on:click={createNewElection}>Neue Wahl</Button>
	</div>
	{#each elections as election}
		<hr class="mt-5 mb-3" />
		<div class="d-flex mt-3">
			<h2 class="flex-fill mb-0">{election.title}</h2>
			<div class="d-flex justify-content-end align-self-start">
				<Button color="primary" on:click={() => editElection(election)} class="mx-2"
					><Fa icon={faCheckToSlot} class="me-2" />Einstellungen</Button
				>
				<Button color="info" on:click={createNewElection}
					><Fa icon={faSquarePollVertical} class="me-2" />Kandidat*innen</Button
				>
			</div>
		</div>
		<small>Erstellt am {election.dateCreated.toLocaleDateString()}</small>
		{#if election.description}
		<p class="mt-3">{election.description}</p>
		{/if}
	{/each}
	<EditElectionModal
		election={electionToEdit}
		{isNewElection}
		on:cancel={() => (electionToEdit = undefined)}
		on:save={saveElection}
	/>
</template>
