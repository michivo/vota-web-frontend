<script lang="ts">
	import { ListGroup, ListGroupItem } from 'sveltestrap';
	import { userStore } from '../../stores/userStore';
	import type { Voting } from '../../types/voting';
	import { faCheckToSlot, faRankingStar, faSquarePollVertical } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let userName = '';
	let votings: Voting[] = [
		{
			name: 'Listenwahl EU',
			description: 'Listenwahl zur Wahl zum Europaparlament',
			id: '19y83183',
			startDateUtc: new Date(),
			endDateUtc: new Date()
		},
		{
			name: 'Listenwahl LTW Wien',
			description: 'Listenwahl zur Landtagswahl in Wien',
			id: '12093hfjq2',
			startDateUtc: new Date(),
			endDateUtc: new Date()
		}
	];

	userStore.subscribe((u) => (userName = u.user?.displayName ?? ''));
</script>

<template>
	<h1 class="mt-5"><Fa icon={faRankingStar} class="me-3" />Meine Abstimmungen</h1>
	<h2 class="mt-4"><Fa icon={faCheckToSlot} class="me-3" />Aktuelle Abstimmungen</h2>
	<ListGroup>
		{#each votings as voting}
			<ListGroupItem>
				<a href={`elections?id=${voting.id}`}>{voting.name}</a>
				<small>{voting.description}</small>
			</ListGroupItem>
		{/each}
	</ListGroup>
	<h2 class="mt-4"><Fa icon={faSquarePollVertical} class="me-3" />Abgeschlossene Abstimmungen</h2>
	<p>Derzeit gibt es keine abgeschlossenen Abstimmungen, auf die Sie zugreifen können.</p>
</template>
