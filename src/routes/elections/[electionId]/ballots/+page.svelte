<script lang="ts">
  import { onMount } from 'svelte';
  import { BallotApi } from '../../../../services/ballotApi';
  import type { BallotInfoDto, BallotWithVotesDto } from '../../../../types/api/ballotDto';
  import {
    Button,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Spinner,
    Table
  } from 'sveltestrap';
  import Fa from 'svelte-fa';
  import {
    faCheckCircle,
    faCircleMinus,
    faCircleXmark,
    faEye,
    faTrash
  } from '@fortawesome/free-solid-svg-icons';

  /** @type {import('./$types').PageData} */
  export let data: { electionId: number };

  const ballotApi = new BallotApi();
  let loading = false;
  let hasError = false;
  let ballots = [] as BallotWithVotesDto[];
  let ballotToDelete = undefined as BallotWithVotesDto | undefined;
  let ballotToShow = undefined as BallotWithVotesDto | undefined;
  let deleteReason = '';
  let filter = '';

  onMount(refresh);

  async function refresh() {
    loading = true;
    hasError = false;
    try {
      ballots = await ballotApi.getAllBallots(data.electionId);
      ballots = ballots.sort(compareBallots);
    } catch (_: any) {
      hasError = true;
    } finally {
      loading = false;
    }
  }

  $: filteredBallots = !filter.trim().toLocaleLowerCase()
    ? ballots.sort(compareBallots)
    : ballots
        .filter((b) => b.ballotIdentifier.toLocaleLowerCase().includes(filter.trim().toLocaleLowerCase()))
        .sort(compareBallots);

  function compareBallots(a: BallotInfoDto, b: BallotInfoDto) {
    try {
      if (a.ballotIdentifier && b.ballotIdentifier) {
        if (a.ballotStation !== b.ballotStation) {
          return a.ballotStation.localeCompare(b.ballotStation);
        }

        const numberA = a.ballotIdentifier.substring(a.ballotIdentifier.indexOf('-') + 1);
        const numberB = b.ballotIdentifier.substring(b.ballotIdentifier.indexOf('-') + 1);
        const result = parseInt(numberA) - parseInt(numberB);
        return result;
      }
    } catch {}
    return a.id - b.id;
  }

  function showBallotDetails(ballot: BallotWithVotesDto): any {
    ballotToShow = ballot;
  }

  function showDeleteModal(ballot: BallotWithVotesDto): any {
    deleteReason = '';
    ballotToDelete = ballot;
  }

  async function deleteBallot() {
    if (ballotToDelete) {
      const ballotId = ballotToDelete.id;
      ballotToDelete = undefined;
      loading = true;
      try {
        await ballotApi.deleteBallot(ballotId, deleteReason);
      } finally {
        loading = false;
        await refresh();
      }
    }
  }
</script>

<template>
  <h1 class="mb-4 mt-2">Wahlzettel kontrollieren</h1>
  {#if loading}
    <Spinner />
  {:else if hasError}
    Fehler beim Laden der Wahlzettel.
  {:else}
  <div class="mb-3 row">
    <label for="filter" class="col-sm-1 col-form-label">Filter</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" id="filter" bind:value={filter}>
    </div>
  </div>
    <Table>
      <thead>
        <th>#</th>
        <th>Datum</th>
        <th>Ausgezählt von</th>
        <th>Status</th>
        <th>Aktionen</th>
      </thead>
      <tbody>
        {#each filteredBallots as ballot}
          <tr class={ballot.isDeleted ? 'deleted' : ''}>
            <th scope="row">{ballot.ballotIdentifier}</th>
            <td>
              {ballot.dateCreated.toLocaleString()}
            </td>
            <td>
              {ballot.countingUserName}
              {ballot.additionalPeople ? `, ${ballot.additionalPeople}` : ''}
            </td>
            <td>
              <Fa
                icon={ballot.isDeleted
                  ? faCircleXmark
                  : ballot.isValid
                  ? faCheckCircle
                  : faCircleMinus}
                class={ballot.isDeleted
                  ? 'text-danger me-2'
                  : ballot.isValid
                  ? 'text-primary me-2'
                  : 'text-mute me-2'} />
              {ballot.isDeleted ? ' Gelöscht ' : ballot.isValid ? 'Gültig' : 'Ungültig'}
            </td>
            <td>
              <button
                type="button"
                class="btn btn-sm btn-flat btn-outline-primary"
                title="Details ansehen"
                on:click={() => showBallotDetails(ballot)}><Fa icon={faEye} /></button>
              {#if !ballot.isDeleted}
                <button
                  type="button"
                  class="btn btn-sm btn-flat btn-outline-danger"
                  title="Wahlzettel löschen"
                  on:click={() => showDeleteModal(ballot)}><Fa icon={faTrash} /></button>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </Table>
  {/if}
  <Modal isOpen={!!ballotToDelete} toggle={() => (ballotToDelete = undefined)}>
    <ModalHeader toggle={() => (ballotToDelete = undefined)}>Wahlzettel löschen</ModalHeader>
    <ModalBody>
      Bist du sicher, dass du Wahlzettel <em
        >{ballotToDelete?.ballotIdentifier ?? ballotToDelete?.id}</em>
      löschen willst?
      <FormGroup class="mt-3">
        <Label for="title">Begründung (verpflichtend)</Label>
        <Input
          feedback="Geben Sie eine Begründung an"
          type="text"
          id="title"
          bind:value={deleteReason}
          placeholder=""
          required />
      </FormGroup>
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={deleteBallot} disabled={!deleteReason}>Ja</Button>
      <Button color="secondary" on:click={() => (ballotToDelete = undefined)}>Nein</Button>
    </ModalFooter>
  </Modal>
  <Modal isOpen={!!ballotToShow} toggle={() => (ballotToShow = undefined)}>
    <ModalHeader toggle={() => (ballotToShow = undefined)}>Wahlzettel</ModalHeader>
    <ModalBody>
      {#if ballotToShow}
        <h2>
          {ballotToShow.ballotIdentifier ?? ballotToShow.id}
          <small>
            <Fa
              icon={ballotToShow.isDeleted
                ? faCircleXmark
                : ballotToShow.isValid
                ? faCheckCircle
                : faCircleMinus}
              class={ballotToShow.isDeleted
                ? 'text-danger ms-4 me-2'
                : ballotToShow.isValid
                ? 'text-primary ms-4 me-2'
                : 'text-mute ms-4 me-2'} />
            {ballotToShow.isDeleted ? ' Gelöscht ' : ballotToShow.isValid ? 'Gültig' : 'Ungültig'}
          </small>
        </h2>
        <p>
          Ausgezählt von {ballotToShow.countingUserName}{ballotToShow.additionalPeople ? `, ${ballotToShow.additionalPeople}` : ''}.<br />
          Datum: {ballotToShow.dateCreated.toLocaleString()}
          <br />
        </p>
        {#if ballotToShow.isDeleted}
          <p>
            <b
              >Gelöscht von {ballotToShow.deleteUserName} am {ballotToShow.dateDeleted?.toLocaleString()}.<br />
              Begründung: {ballotToShow.deleteReason}</b>
          </p>
        {/if}
        <Table striped>
          <thead>
            <th>#</th>
            <th>Kandidat*in</th>
          </thead>
          <tbody>
            {#each ballotToShow.votes.sort((c1, c2) => c1.ballotOrder - c2.ballotOrder) as candidate}
              <tr>
                <td>{candidate.ballotOrder}</td>
                <td>{candidate.candidateName}</td>
              </tr>
            {/each}
          </tbody>
        </Table>
      {/if}
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={() => (ballotToShow = undefined)}>OK</Button>
    </ModalFooter>
  </Modal>
</template>

<style>
  tr.deleted > * {
    background-color: #eee;
  }
</style>
