<script lang="ts">
  import { onMount } from 'svelte';
  import { ElectionApi } from '../../../../services/electionApi';
  import type { VotingResultsDto } from '../../../../types/api/votingResultsDto';
  import {
    Button,
    FormGroup,
    Input,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Spinner,
    Table
  } from 'sveltestrap';
  import {
    faChartBar,
    faDownload,
    faFileCsv,
    faListOl,
    faSquarePollVertical
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
    import VotingProtocol from '../../../../components/votingProtocol.svelte';

  /** @type {import('./$types').PageData} */
  export let data: { electionId: number };

  const electionApi = new ElectionApi();
  let results = [] as VotingResultsDto[];
  let loading = false;
  let hasError = false;
  let countResults = false;
  let isTestRun = true;
  let logToShow = undefined as VotingResultsDto | undefined;
  let statsToShow = undefined as VotingResultsDto | undefined;
  let protocolToShow = undefined as VotingResultsDto | undefined;

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

  function confirmStartCount() {
    countResults = true;
  }

  async function countVotes() {
    countResults = false;
    try {
      loading = true;
      await electionApi.countVotes(data.electionId, isTestRun);
    } finally {
      loading = false;
      await refresh();
    }
  }

  function showResults(result: VotingResultsDto): void {
    protocolToShow = result;
  }

  function showLogs(result: VotingResultsDto): void {
    logToShow = result;
  }

  function showStats(result: VotingResultsDto): void {
    statsToShow = result;
  }
</script>

<template>
  <h1 class="my-3">Ergebnisse {results?.length ? results[0].electionName : ''}</h1>
  <Button color="secondary" on:click={() => confirmStartCount()}>
    <Fa icon={faListOl} class="me-2" />Auswertung mit VOTA starten</Button>
  {#if loading}
    <Spinner />
  {:else if hasError}
    Fehler beim Laden der Wahlzettel.
  {:else}
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
                {#if result.statsData}
                  <Button size="sm" color="secondary" on:click={() => showStats(result)}>
                    <Fa icon={faChartBar} class="me-2" />Statistiken</Button>
                {/if}
              </div></td>
            <td>
              <div class="buttons">
                <a
                  class="button btn btn-sm btn-primary"
                  download="candidates.csv"
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(result.voterListCsv)}`}>
                  <Fa icon={faFileCsv} class="me-2" />CSV mit Kandidat*innen<Fa
                    icon={faDownload}
                    class="ms-2" /></a>
                <a
                  class="button btn btn-sm btn-primary"
                  download="votes.csv"
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(result.votesCsv)}`}>
                  <Fa icon={faFileCsv} class="me-2" />CSV mit Stimmen <Fa
                    icon={faDownload}
                    class="ms-2" /></a>
              </div>
            </td>
          </tr>
        {/each}
        <tr />
      </tbody>
    </Table>
  {/if}
  <Modal isOpen={countResults} toggle={() => (countResults = false)}>
    <ModalHeader toggle={() => (countResults = false)}>Auswertung starten</ModalHeader>
    <ModalBody>
      Auswertung der Stimmen {results?.length ? `für ${results[0].electionName}` : ''} starten?
      <FormGroup class="mt-3 ps-4">
        <Input type="checkbox" bind:checked={isTestRun} label="Auswertung ist ein Testlauf" />
      </FormGroup>
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={countVotes}>Ja</Button>
      <Button color="secondary" on:click={() => (countResults = false)}>Abbrechen</Button>
    </ModalFooter>
  </Modal>

  <Modal isOpen={!!logToShow} toggle={() => (logToShow = undefined)} size="lg">
    <ModalHeader toggle={() => (logToShow = undefined)}
      >Logs {results?.length ? `für ${results[0].electionName}` : ''}</ModalHeader>
    <ModalBody>
      {#if logToShow}
        <pre>
          {logToShow.detailedLog}
        </pre>
      {/if}
      {#if logToShow?.errorLog}
        <h3>Fehlerlog</h3>
        <pre>
          {logToShow.errorLog}
        </pre>
      {/if}
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={() => (logToShow = undefined)}>OK</Button>
    </ModalFooter>
  </Modal>

  <Modal isOpen={!!statsToShow} toggle={() => (statsToShow = undefined)} size="lg">
    <ModalHeader toggle={() => (statsToShow = undefined)}
      >Statistiken {results?.length ? `für ${results[0].electionName}` : ''}</ModalHeader>
    <ModalBody>
      {#if statsToShow}
        <pre>
          {statsToShow.statsData}
        </pre>
      {/if}
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={() => (statsToShow = undefined)}>OK</Button>
    </ModalFooter>
  </Modal>

  <Modal isOpen={!!protocolToShow} toggle={() => (protocolToShow = undefined)} size="lg">
    <ModalHeader toggle={() => (statsToShow = undefined)}
      >Protokoll {results?.length ? `für ${results[0].electionName}` : ''}</ModalHeader>
    <ModalBody>
      {#if protocolToShow}
        <VotingProtocol protocol={protocolToShow.protocol} indentation={0}>
        </VotingProtocol>
      {/if}
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={() => (protocolToShow = undefined)}>OK</Button>
    </ModalFooter>
  </Modal>  
</template>

<style>
  div.buttons {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
