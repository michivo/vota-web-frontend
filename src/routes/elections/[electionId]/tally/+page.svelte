<script lang="ts">
  import { onMount } from 'svelte';
  import { ElectionApi } from '../../../../services/electionApi';
  import type { VotingResultsDto } from '../../../../types/api/votingResultsDto';
  import { Button, Table } from 'sveltestrap';
  import { faDownload, faFileCsv, faListOl, faSquarePollVertical } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';

  /** @type {import('./$types').PageData} */
  export let data: { electionId: number };

  const electionApi = new ElectionApi();
  let results = [] as VotingResultsDto[];
  let loading = false;
  let hasError = false;

  onMount(refresh);

  async function refresh() {
    loading = true;
    hasError = false;
    try {
      results = await electionApi.getResults(data.electionId);
      results = results.sort((a, b) => a.id - b.id);
    } catch {
      hasError = true;
    } finally {
      loading = false;
    }
  }

  function confirmStartCount() {}


    function showResults(result: VotingResultsDto): void {
        throw new Error('Function not implemented.');
    }


    function showLogs(result: VotingResultsDto): void {
        throw new Error('Function not implemented.');
    }
</script>

<template>
  <h1 class="my-3">Ergebnisse {results?.length ? results[0].electionName : ''}</h1>
  <Button color="secondary" on:click={() => confirmStartCount()}>
    <Fa icon={faListOl} class="me-2" />Auswertung mit VOTA starten</Button>

  <Table>
    <thead>
      <tr>
        <th>#</th>
        <th>Datum</th>
        <th>Status</th>
        <th>Protokolle</th>
        <th>CSV-Daten</th>
      </tr>
    </thead>
    <tbody>
      {#each results as result}
        <tr>
          <td>{result.id}</td>
          <td>{result.dateCreatedUtc.toLocaleString()}</td>
          <td
            >{result.success === false
              ? 'Fehler bei der Auswertung'
              : result.isTestRun
              ? 'Testlauf'
              : 'Gültige Auswertung'}</td>
          <td>
            <div class="buttons">
              <Button size="sm" color="secondary" on:click={() => showResults(result)}>
                <Fa icon={faSquarePollVertical} class="me-2" />Ergebnisse</Button>
              <Button size="sm" color="secondary" on:click={() => showLogs(result)}>
                <Fa icon={faSquarePollVertical} class="me-2" />Logs</Button>
            </div></td>
          <td>
            <div class="buttons">
              <a class="button btn btn-sm btn-primary" download="candidates.csv" href={`data:text/plain;charset=utf-8,${encodeURIComponent(result.voterListCsv)}`}>
                <Fa icon={faFileCsv} class="me-2" />CSV mit Kandidat*innen<Fa icon={faDownload} class="ms-2" /></a>
              <a class="button btn btn-sm btn-primary" download="votes.csv" href={`data:text/plain;charset=utf-8,${encodeURIComponent(result.votesCsv)}`}>
                <Fa icon={faFileCsv} class="me-2" />CSV mit Stimmen <Fa icon={faDownload} class="ms-2" /></a>                
            </div>            
          </td>
        </tr>
      {/each}
      <tr />
    </tbody>
  </Table>
</template>

<style>
  div.buttons {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
