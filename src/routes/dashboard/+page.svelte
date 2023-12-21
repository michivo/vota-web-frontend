<script lang="ts">
  import {
    Button,
    FormGroup,
    Input,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Table
  } from 'sveltestrap';
  import { userStore } from '../../stores/userStore';
  import {
    faCheckCircle,
    faClipboardCheck,
    faGear,
    faListOl,
    faRankingStar,
    faRemove,
    faSquarePollVertical,
    faUsersGear
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import { onDestroy, onMount } from 'svelte';
  import {
    ElectionState,
    type ElectionDto,
    ElectionType,
    type CandidateDto,
    type ElectionWithCandidatesDto
  } from '../../types/api/electionDto';
  import { ElectionApi } from '../../services/electionApi';
  import EditElectionModal from '../../components/editElectionModal.svelte';
  import { UserRole, type User } from '../../types/userState';
  import EditCandidatesModal from '../../components/editCandidatesModal.svelte';

  let loading = false;
  let elections = [] as ElectionDto[];
  let electionToEdit = undefined as ElectionDto | undefined;
  let currentUser = undefined as User | undefined | null;
  let isNewElection = false;
  let showCandidatesModal = false;
  let electionToEditCandidates = undefined as ElectionDto | undefined;
  let electionToDelete = undefined as ElectionDto | undefined;
  let electionToUpdateState = undefined as ElectionDto | undefined;
  let showArchiveModal = false;
  let electionsToArchive = [] as Array<ElectionDto & { selected: boolean }>;
  const electionApi = new ElectionApi();

  $: noElectionsToArchive = !electionsToArchive.find((e) => e.selected);

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
      electionType: ElectionType.OrderedSingleTransferableVote,
      id: 0,
      alreadyElectedFemale: 0,
      alreadyElectedMale: 0,
      numberOfPositionsToElect: 1
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
      await refresh();
    }
  }

  function editCandidates(election: ElectionDto): void {
    electionToEditCandidates = election;
    showCandidatesModal = true;
  }

  function formatElectionState(state: ElectionState) {
    switch (state) {
      case ElectionState.Creating:
        return 'erstellt';
      case ElectionState.Counting:
        return 'Auszählung läuft';
      case ElectionState.CountingComplete:
        return 'Auszählung abgeschlossen';
      case ElectionState.Done:
        return 'Abgeschlossen';
      default:
        return '';
    }
  }

  async function deleteElection(): Promise<void> {
    if (electionToDelete) {
      try {
        await electionApi.deleteElection(electionToDelete?.id);
      } finally {
        electionToDelete = undefined;
      }
    }
    await refresh();
  }

  function confirmUpdateElectionState(election: ElectionDto, electionState: ElectionState) {
    electionToUpdateState = { ...election };
    electionToUpdateState.electionState = electionState;
  }

  async function updateElectionState() {
    try {
      if (electionToUpdateState) {
        await electionApi.updateElection(electionToUpdateState);
      }
    } finally {
      electionToUpdateState = undefined;
    }

    await refresh();
  }

  async function saveCandidates(e: CustomEvent<CandidateDto[]>): Promise<void> {
    const election = {
      ...electionToEditCandidates,
      candidates: e.detail
    } as ElectionWithCandidatesDto;
    try {
      await electionApi.updateElection(election);
    } finally {
      electionToEditCandidates = undefined;
      showCandidatesModal = false;
    }
    await refresh();
  }

  function showModalForArchiving() {
    showArchiveModal = true;
    electionsToArchive = elections
      .filter((e) => e.electionState === ElectionState.CountingComplete)
      .map((e) => ({ ...e, selected: false }));
  }

  function archiveElections() {
    // TODO
  }
</script>

<template>
  <div class="d-flex">
    <h1 class="mt-5 flex-fill"><Fa icon={faRankingStar} class="me-3" />Wahlen</h1>
    {#if currentUser?.role === UserRole.Admin}
      <Button class="align-self-center" size="lg" on:click={createNewElection}>Neue Wahl</Button>
      <Button
        class="align-self-center ms-3"
        color="primary"
        size="lg"
        on:click={showModalForArchiving}>Wahlen archivieren</Button>
    {/if}
  </div>
  {#each elections as election}
    <hr class="mt-5 mb-3" />
    <div class="d-flex mt-3">
      <div class="flex-fill">
        <h2 class="mb-0">
          {election.title}<span class="election-state"
            >- {formatElectionState(election.electionState)}</span>
        </h2>
        <small>Erstellt am {election.dateCreated.toLocaleDateString()}</small>
        {#if election.description}
          <p class="mt-3">{election.description}</p>
        {/if}
      </div>
      <div class="d-flex justify-content-end align-self-start flex-column gap-2">
        {#if election.electionState === ElectionState.Creating && currentUser?.role === UserRole.Admin}
          <Button size="sm" color="primary" on:click={() => editElection(election)}>
            <Fa icon={faGear} class="me-2" />Einstellungen</Button>
          <Button size="sm" color="primary" on:click={() => editCandidates(election)}>
            <Fa icon={faUsersGear} class="me-2" />Kandidat*innen</Button>
          <Button
            size="sm"
            color="secondary"
            on:click={() => confirmUpdateElectionState(election, ElectionState.Counting)}>
            <Fa icon={faCheckCircle} class="me-2" />Freigeben</Button>
          <Button size="sm" color="danger" on:click={() => (electionToDelete = election)}>
            <Fa icon={faRemove} class="me-2" />Löschen</Button>
        {:else if election.electionState === ElectionState.Counting}
          <a class="button btn btn-sm btn-primary" href={`/vote-count?electionId=${election.id}`}>
            <Fa icon={faListOl} class="me-2" />Stimmen Erfassen</a>
          {#if currentUser?.role === UserRole.Admin}
            <a class="button btn btn-sm btn-primary" href={`/elections/${election.id}/ballots`}>
              <Fa icon={faClipboardCheck} class="me-2" />Kontrollieren</a>
            <Button
              size="sm"
              color="secondary"
              on:click={() => confirmUpdateElectionState(election, ElectionState.CountingComplete)}>
              <Fa icon={faCheckCircle} class="me-2" />Auswerten</Button>
          {/if}
        {:else if election.electionState === ElectionState.CountingComplete}
          {#if currentUser?.role === UserRole.Admin}
            <a class="button btn btn-sm btn-primary" href={`/vote-count?electionId=${election.id}`}>
              <Fa icon={faListOl} class="me-2" />Stimmen Nachtragen</a>
            <a class="button btn btn-sm btn-primary" href={`/elections/${election.id}/ballots`}>
              <Fa icon={faClipboardCheck} class="me-2" />Kontrollieren</a>
            <a class="button btn btn-sm btn-primary" href={`/elections/${election.id}/tally`}>
              <Fa icon={faSquarePollVertical} class="me-2" />Ergebnisse</a>
          {/if}
        {/if}
      </div>
    </div>
  {/each}
  <EditElectionModal
    election={electionToEdit}
    {isNewElection}
    on:cancel={() => (electionToEdit = undefined)}
    on:save={saveElection} />
  <EditCandidatesModal
    election={electionToEditCandidates}
    showModal={showCandidatesModal}
    on:save={saveCandidates}
    on:cancel={() => (showCandidatesModal = false)} />

  <Modal isOpen={!!electionToDelete} toggle={() => (electionToDelete = undefined)}>
    <ModalHeader toggle={() => (electionToDelete = undefined)}>Wahl löschen</ModalHeader>
    <ModalBody>
      Sind Sie sicher, dass Sie Wahl <em>{electionToDelete?.title}</em> unwiderruflich löschen wollen?
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={deleteElection}>Ja</Button>
      <Button color="secondary" on:click={() => (electionToDelete = undefined)}>Nein</Button>
    </ModalFooter>
  </Modal>

  <Modal isOpen={!!electionToUpdateState} toggle={() => (electionToUpdateState = undefined)}>
    <ModalHeader toggle={() => (electionToUpdateState = undefined)}>Wahl freigeben</ModalHeader>
    <ModalBody>
      {#if electionToUpdateState?.electionState === ElectionState.Counting}
        Sind Sie sicher, dass Sie Wahl {electionToUpdateState?.title} zur Auszählung freischalten wollen?
        Sie können die Wahl und die Kandidat*innenliste danach nicht mehr bearbeiten und die Wahl nicht
        mehr löschen!
      {:else if electionToUpdateState?.electionState === ElectionState.CountingComplete}
        Sind Sie sicher, dass Sie die Auszählung abschließen möchten? Danach können keine Stimmen
        mehr ausgezählt werden!
      {/if}
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={updateElectionState}>Ja</Button>
      <Button color="secondary" on:click={() => (electionToUpdateState = undefined)}>Nein</Button>
    </ModalFooter>
  </Modal>

  <Modal isOpen={showArchiveModal} toggle={() => (showArchiveModal = false)}>
    <ModalHeader toggle={() => (showArchiveModal = false)}>Wahlen archivieren</ModalHeader>
    <ModalBody>
      <Table>
        <thead>
          <tr><th>Archivieren</th><th>Wahl</th></tr>
        </thead>
        <tbody>
          {#each electionsToArchive as election}
            <tr>
              <td>
                <Input
                  type="checkbox"
                  bind:checked={election.selected}
                  aria-label={`Wahl ${election.title} archivieren`} />
              </td>
              <td>
                {election.title}
              </td>
            </tr>
          {/each}
        </tbody>
      </Table>
    </ModalBody>
    <ModalFooter>
      <Button color="primary" bind:disabled={noElectionsToArchive} on:click={archiveElections}
        >OK</Button>
      <Button color="secondary" on:click={() => (showArchiveModal = false)}>Abbrechen</Button>
    </ModalFooter>
  </Modal>
</template>

<style>
  .election-state {
    margin-left: 1rem;
    font-size: 0.6em;
  }
</style>
