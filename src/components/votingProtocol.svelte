<script lang="ts">
  import type { VotaProtocol } from '../types/api/votingResultsDto';

  export let protocol: VotaProtocol;
  export let indentation = 0;
</script>

<template>
  <div style={`margin-left: ${indentation + 1}rem`}>
    <ul>
      <li><em>{protocol.Title}</em></li>
      {#each protocol.Messages as message}
        {#if typeof message === 'string' || message instanceof String}
          <li>{message}</li>
        {:else if !!message}
          <svelte:self protocol={message} indentation={indentation + 1} />
        {/if}
      {/each}
      <li class={`result-${indentation + 1}`}><b>Ergebnis:</b> {protocol.Result}</li>
    </ul>
  </div>
</template>

<style>
    .result-1 {
        font-size: 1.5rem;
    }

    .result-2 {
        font-size: 1.2rem;
    }

    .result-3 {
        font-size: 1.1rem;
    }
</style>