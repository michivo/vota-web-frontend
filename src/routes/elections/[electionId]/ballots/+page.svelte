<script lang="ts">
  import { onMount } from 'svelte';
  import { BallotApi } from '../../../../services/ballotApi';
  import type { BallotInfoDto } from '../../../../types/api/ballotDto';

  /** @type {import('./$types').PageData} */
  export let data: { electionId: number };

  const ballotApi = new BallotApi();
  let loading = false;
  let ballots = [] as BallotInfoDto[];

  onMount(refresh);

  async function refresh() {
    loading = true;
    try {
      ballots = await ballotApi.getAllBallots(data.electionId);
      ballots = ballots.sort((a, b) => b.ballotIdentifier.localeCompare(a.ballotIdentifier));
    } finally {
      loading = false;
    }
  }
</script>

<template>
  {JSON.stringify(ballots)}
</template>
