<script lang="ts">
	import { flip } from 'svelte/animate';
    import { dndzone } from 'svelte-dnd-action';
	import type { Candidate, CandidateList } from '../../types/candidate';

	const flipDurationMs = 200;

	const candidates: Candidate[] = [
		{
			id: 1234,
			name: 'Maria Musterfrau',
			gender: 'female'
		},
		{
			id: 1235,
			name: 'John Doe',
			gender: 'male'
		},
		{
			id: 1236,
			name: 'Jane Doe',
			gender: 'female'
		},
		{
			id: 1237,
			name: 'Max Mustermann',
			gender: 'male'
		},
		{
			id: 1238,
			name: 'Frau Österreicher',
			gender: 'female'
		},
		{
			id: 1239,
			name: 'Herr Österreicher',
			gender: 'male'
		}
	];

	let board: CandidateList[] = [
		{
			id: 1,
			name: 'candidates',
			items: candidates,
			title: 'Kandidat*innen'
		},
		{
			id: 2,
			name: 'selection',
			items: [] as Candidate[],
			title: 'Reihung'
		}
	];

	function handleDndConsiderCards(cid: number, e: any) {
        console.error('Considering');
        console.error(cid);
        const colIdx = board!.findIndex(c => c.id === cid);
        board[colIdx].items = e.detail.items;
        board = [...board];
	}

	function handleDndFinalizeCards(cid: number, e: any) {
        console.error('Finalizing');
        console.error(cid);
        const colIdx = board.findIndex(c => c.id === cid);
        board[colIdx].items = e.detail.items;
        board = [...board];
	}
</script>

<div>
	<h1>Kandidat*innenauswahl</h1>
	<div class="selection-panel">
		{#each board as column (column.id)}
			<div class="candidates pb-5" animate:flip={{ duration: flipDurationMs }}>
				<h2>{column.title}</h2>
				<div
					class="column-content h-100"
					use:dndzone={{ items: column.items, flipDurationMs, dropTargetStyle: {} }}
					on:consider={(e) => handleDndConsiderCards(column.id, e)}
					on:finalize={(e) => handleDndFinalizeCards(column.id, e)}
				>
					{#each column.items as item, index (item.id)}
						<div class="candidate" animate:flip={{ duration: flipDurationMs }}>
                            {#if column.id === 2}
                            <span>{index + 1}.</span>
                            {/if}
                            {item.name}
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	h1 {
		font-weight: 900;
		text-transform: uppercase;
		font-style: italic;
		width: 100%;
		text-align: center;
		color: var(--bs-primary);
	}

	.selection-panel {
		display: grid;
		grid-template-columns: 1fr 1fr;
		width: 100%;
		gap: 2rem;
		padding: 1rem;
	}

	.candidates {
		background-color: #eef;
		height: 100%;
		width: 100%;
		border-radius: 1rem;
		padding: 1rem;
	}

	.candidate {
		margin: 1rem;
		height: 2.5rem;
		border-radius: 1rem;
		border: 1px solid #000;
		vertical-align: middle;
		padding-top: 0.3rem;
		padding-left: 1rem;
		background-color: #fff;
	}

	.selections {
		background-color: #efe;
		border-radius: 1rem;
		padding: 1rem;
	}
</style>
