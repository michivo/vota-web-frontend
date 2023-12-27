<script lang="ts">
  import { onMount } from 'svelte';
  import { ElectionApi } from '../../../../services/electionApi';
  import {
    VotingResultStatus,
    type VotingResultDto,
    type VotingResultsDto
  } from '../../../../types/api/votingResultsDto';
  import {
    Button,
    FormGroup,
    Input,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Popover,
    Spinner,
    Table
  } from 'sveltestrap';
  import {
    faChartBar,
    faDownload,
    faFileCsv,
    faInfoCircle,
    faListOl,
    faSquarePollVertical
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import VotingProtocol from '../../../../components/votingProtocol.svelte';
  import { ElectionState } from '../../../../types/api/electionDto';

  /** @type {import('./$types').PageData} */
  export let data: { electionId: number };

  const electionApi = new ElectionApi();
  let results = [] as VotingResultDto[];
  let title = '';
  let overrideReason = undefined as string | undefined;
  let state = ElectionState.None;
  let loading = false;
  let hasError = false;
  let countResults = false;
  let isTestRun = true;
  let logToShow = undefined as VotingResultDto | undefined;
  let statsToShow = undefined as VotingResultDto | undefined;
  let protocolToShow = undefined as VotingResultDto | undefined;
  let countError = '';
  let hasCountError = false;

  $: voteCountDisabled = !(
    isTestRun ||
    !results.find((v) => v.resultStatus === VotingResultStatus.Valid) ||
    !!overrideReason
  );

  onMount(refresh);

  async function refresh() {
    loading = true;
    hasError = false;
    try {
      const votingResults = await electionApi.getResults(data.electionId);
      title = votingResults.electionTitle;
      state = votingResults.electionState;
      results = votingResults.results;
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
    countError = '';
    hasCountError = false;
    try {
      loading = true;
      await electionApi.countVotes(data.electionId, isTestRun, overrideReason);
    } catch (error: any) {
      console.error(error);
      hasCountError = true;
      countError = error?.message ?? 'Unerwarteter Fehler beim Auszählen';
    } finally {
      loading = false;
      await refresh();
    }
  }

  function showResults(result: VotingResultDto): void {
    protocolToShow = result;
  }

  function showLogs(result: VotingResultDto): void {
    logToShow = result;
  }

  function showStats(result: VotingResultDto): void {
    statsToShow = result;
  }

  function getStatus(result: VotingResultDto): string {
    if (result.success === false) {
      return 'Fehler bei der Auswertung';
    }
    switch (result.resultStatus) {
      case VotingResultStatus.Valid:
        return 'Gültige Auswertung';
      case VotingResultStatus.TestRun:
        return 'Testlauf';
      case VotingResultStatus.Overridden:
        return 'Überschrieben';
      default:
        return 'Unbekannt';
    }
  }
</script>

<template>
  <h1 class="my-3">Ergebnisse {title ? `- ${title}` : ''}</h1>
  {#if !loading && state === ElectionState.CountingComplete}
    <Button color="secondary" on:click={() => confirmStartCount()}>
      <Fa icon={faListOl} class="me-2" />Auswertung mit VOTA starten</Button>
  {/if}
  {#if loading}
    <Spinner />
  {:else if hasError}
    Fehler beim Laden der Wahlzettel.
  {:else}
    {#if hasCountError} 
      <p class="text-danger">{countError}</p>
    {/if}
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
          <tr class={result.resultStatus === VotingResultStatus.Valid ? 'valid' : 'test'}>
            <td>{result.id}</td>
            <td>{result.dateCreatedUtc.toLocaleString()}</td>
            <td>{getStatus(result)}
              {#if result.resultStatus === VotingResultStatus.Overridden}
                <Button color="primary" size="sm" class="p-0" style="line-height: 1rem" id={`buttonResultDetails${result.id}`}>
                  <Fa icon={faInfoCircle} />
                </Button>
                <Popover
                target={`buttonResultDetails${result.id}`}
                placement="right"
                title="Überschrieben"
                trigger="focus"
              >
                Diese Wahl von {result.overrideUser} am {result.overrideDateUtc.toLocaleString()} mit folgender Begründung überschrieben: {result.overrideReason ?? '-'}
              </Popover>
              {/if}
            </td>
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
      Auswertung der Stimmen {results?.length ? `für ${title}` : ''} starten?
      <FormGroup class="mt-3 ps-4">
        <Input type="checkbox" bind:checked={isTestRun} label="Auswertung ist ein Testlauf" />
      </FormGroup>
      {#if results.find((r) => r.resultStatus === VotingResultStatus.Valid) && !isTestRun}
        <p>
          Die Stimmen wurden bereits einmal ausgezählt. Im Falle einer erneuten Auszählung muss ein
          Grund angegeben werden:
        </p>
        <FormGroup class="mt-3 ps-4">
          <label for="recountReason">Grund für die Neuauszählung</label>
          <Input id="recountReason" type="text" bind:value={overrideReason} />
        </FormGroup>
      {/if}
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={countVotes} bind:disabled={voteCountDisabled}>Ja</Button>
      <Button color="secondary" on:click={() => (countResults = false)}>Abbrechen</Button>
    </ModalFooter>
  </Modal>

  <Modal isOpen={!!logToShow} toggle={() => (logToShow = undefined)} size="xl">
    <ModalHeader toggle={() => (logToShow = undefined)}
      >Logs {results?.length ? `für ${title}` : ''}</ModalHeader>
    <ModalBody>
      {#if logToShow}
        <pre>{logToShow.detailedLog}</pre>
      {/if}
      {#if logToShow?.errorLog}
        <h3>Fehlerlog</h3>
        <pre>{logToShow.errorLog}</pre>
      {/if}
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={() => (logToShow = undefined)}>OK</Button>
    </ModalFooter>
  </Modal>

  <Modal isOpen={!!statsToShow} toggle={() => (statsToShow = undefined)} size="xl">
    <ModalHeader toggle={() => (statsToShow = undefined)}
      >Statistiken {results?.length ? `für ${title}` : ''}</ModalHeader>
    <ModalBody>
      {#if statsToShow}
        <pre>{statsToShow.statsData.trim()}</pre>
      {/if}
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={() => (statsToShow = undefined)}>OK</Button>
    </ModalFooter>
  </Modal>

  <Modal isOpen={!!protocolToShow} toggle={() => (protocolToShow = undefined)} size="xl">
    <ModalHeader toggle={() => (protocolToShow = undefined)}
      >Protokoll {results?.length ? `für ${title}` : ''}</ModalHeader>
    <ModalBody>
      {#if protocolToShow}
        <VotingProtocol protocol={protocolToShow.protocol} indentation={0} />
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

  tr.valid {
    font-weight: 700;
  }
</style>
