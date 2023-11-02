<script lang="ts">
	import type { Candidate } from '../../types/candidate';

    const candidates: Candidate[] = [
        {
            name: 'Maria Musterfrau',
            gender: 'female'
        },
        {
            name: 'John Doe',
            gender: 'male',
        },
        {
            name: 'Jane Doe',
            gender: 'female',
        },
        {
            name: 'Max Mustermann',
            gender: 'male',
        },
        {
            name: 'Frau Österreicher',
            gender: 'female',
        },
        {
            name: 'Herr Österreicher',
            gender: 'male'
        }
    ]
</script>

<div>
    <h1>Kandidat*innenauswahl</h1>
<div class="selection-panel">
    <div class="candidates">
        <h2>Kandidat*innen</h2>
        {#each candidates as candidate}
            <div class="candidate" draggable={true}>
                { candidate.name }
            </div>
        {/each}
    </div>
    <div class="selections">
        <h2>Reihung</h2>
    </div>
</div>
</div>

<style>
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