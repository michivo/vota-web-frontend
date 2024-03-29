<script lang="ts">
  import { flip } from 'svelte/animate';
  import { dndzone } from 'svelte-dnd-action';
  import type { CandidateList } from '../../types/candidate';
  import {
    Accordion,
    AccordionItem,
    Button,
    Col,
    FormGroup,
    Input,
    InputGroup,
    InputGroupText,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Toast,
    ToastHeader
  } from 'sveltestrap';
  import { userStore } from '../../stores/userStore';
  import {
    faArrowDown,
    faArrowRight,
    faArrowUp,
    faCheck,
    faX
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import { onDestroy, onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { ElectionApi } from '../../services/electionApi';
  import type { CandidateDto } from '../../types/api/electionDto';
  import type { BallotWithVotesDto } from '../../types/api/ballotDto';
  import type { User } from '../../types/userState';
  import { BallotApi } from '../../services/ballotApi';
  import type { ApiError } from '../../types/api/apiError';
  import { goto } from '$app/navigation';

  const flipDurationMs = 200;
  const localStorageKey = 'vote-count-settings';

  let showConfirmation = false;
  let ballotStationName = '';
  let additionalPeople = '';
  let currentUser = undefined as User | null | undefined;
  let ballotIdentifier = '1';
  let electionId = 0;
  let infoMessage = '';
  let errorMessage = '';
  let stationSettingsOpen = true;
  let ballotValid = true;
  let confirmClose = false;
  let ballotNotes = '';

  const unsubscribeUser = userStore.subscribe(
    (val) => (currentUser = val.isLoggedIn ? val.user : undefined)
  );

  onDestroy(unsubscribeUser);

  onMount(async () => {
    if (browser) {
      const urlParams = new URLSearchParams(window.location.search);
      electionId = parseInt(urlParams.get('electionId') ?? '0');
      tryLoadPreviousSettings();
      if (electionId) {
        await loadCandidates(electionId);
      }
    }
  });

  function tryLoadPreviousSettings() {
    const previousSettings = localStorage.getItem(localStorageKey);
    if (previousSettings) {
      try {
        const settings: {
          electionId: number;
          ballotIdentifier: string;
          ballotStationName: string;
          additionalPeople: string;
        } = JSON.parse(previousSettings);
        if (settings.electionId === electionId) {
          ballotIdentifier = settings.ballotIdentifier;
          ballotStationName = settings.ballotStationName;
          additionalPeople = settings.additionalPeople;
        } else {
          localStorage.removeItem(localStorageKey);
        }
      } catch (err) {
        console.error('Error loading previous settings');
        console.error(err);
        localStorage.removeItem(localStorageKey);
      }
    }
  }

  function updateStoredSettings() {
    const settings = {
      electionId,
      ballotStationName,
      ballotIdentifier,
      additionalPeople
    };
    localStorage.setItem(localStorageKey, JSON.stringify(settings));
  }

  let board: CandidateList[] = [
    {
      id: 1,
      name: 'candidates',
      items: [] as CandidateDto[],
      title: 'Kandidat*innen'
    },
    {
      id: 2,
      name: 'selection',
      items: [] as CandidateDto[],
      title: 'Reihung'
    }
  ];

  $: selected = board[1].items;
  $: submitDisabled = !ballotStationName;

  let originalList = [] as CandidateDto[];

  async function loadCandidates(electionId: number) {
    try {
      const electionApi = new ElectionApi();
      const election = await electionApi.getElectionWithCandidates(electionId);
      const electionCandidates = election.candidates;
      electionCandidates.sort((a, b) => a.ballotOrder - b.ballotOrder);
      board[0].items = electionCandidates;
      originalList = [...electionCandidates];
    } catch (error) {
      console.log(error);
    }
  }

  function handleDndConsiderCards(cid: number, e: any) {
    const colIdx = board!.findIndex((c) => c.id === cid);
    board[colIdx].items = e.detail.items;
    board = [...board];
  }

  function handleDndFinalizeCards(cid: number, e: any) {
    const colIdx = board.findIndex((c) => c.id === cid);
    board[colIdx].items = e.detail.items;
    board = [...board];
  }

  function showConfirmationModal() {
    showConfirmation = true;
  }

  function pushCandidate(candidate: CandidateDto) {
    const index = board[0].items.indexOf(candidate);
    board[0].items.splice(index, 1);
    board[1].items.push(candidate);
    board = [...board];
  }

  function popCandidate(candidate: CandidateDto) {
    const index = board[1].items.indexOf(candidate);
    board[1].items.splice(index, 1);
    board[0].items.push(candidate);
    board[0].items.sort((a, b) => a.ballotOrder - b.ballotOrder);
    board = [...board];
  }

  function moveCandidateUp(index: number) {
    const temp = board[1].items[index];
    board[1].items[index] = board[1].items[index - 1];
    board[1].items[index - 1] = temp;
    board = [...board];
  }

  function moveCandidateDown(index: number) {
    const temp = board[1].items[index];
    board[1].items[index] = board[1].items[index + 1];
    board[1].items[index + 1] = temp;
    board = [...board];
  }

  function getFullBallotIdentifier() {
    if (!ballotStationName?.trim()) {
      return ballotIdentifier;
    }
    return `${ballotStationName.trim()}-${ballotIdentifier.trim()}`;
  }

  async function submitVote() {
    const fullIdentifier = getFullBallotIdentifier();
    try {
      const ballot: BallotWithVotesDto = {
        additionalPeople: additionalPeople,
        ballotIdentifier: fullIdentifier,
        ballotStation: ballotStationName,
        countingUserId: currentUser!.id,
        electionId: electionId,
        countingUserName: currentUser!.displayName || currentUser?.name || '',
        notes: ballotNotes,
        isValid: ballotValid && selected.length > 0,
        dateCreated: new Date(),
        id: 0,
        isDeleted: false,
        votes: selected.map((c, index) => ({
          id: 0,
          ballotId: 0,
          candidateId: c.id,
          candidateName: c.name,
          ballotOrder: index + 1,
          order: index + 1
        })),
        canDelete: true
      };
      const ballotApi = new BallotApi();
      await ballotApi.addBallot(ballot);
      if (fullIdentifier) {
        infoMessage = `Wahlzettel mit Nummer ${
          ballotStationName ? ballotStationName + '-' : ''
        }${ballotIdentifier} wurde erfolgreich erfasst`;
      } else {
        infoMessage = 'Wahlzettel wurde erfolgreich erfasst';
      }
      board[0].items = [...originalList];
      board[1].items = [];
      ballotIdentifier = getNextIdentifier();
      ballotNotes = '';
      updateStoredSettings();
      ballotValid = true;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      errorMessage = apiError.message;
    } finally {
      showConfirmation = false;
    }
  }

  function getNextIdentifier() {
    if (isNaN(+ballotIdentifier)) {
      return '';
    }

    return (parseInt(ballotIdentifier) + 1).toLocaleString();
  }

  function cancel() {
    showConfirmation = false;
  }

  function formatStationInfo() {
    const trimmedPeople = additionalPeople.trim();
    const trimmedStation = ballotStationName.trim();
    const currentUserName = currentUser?.displayName || currentUser?.name;
    if (!trimmedPeople && !trimmedStation) {
      return `Zählstelle mit ${currentUserName}`;
    }
    if (!trimmedPeople) {
      return `Zählstelle ${trimmedStation}`;
    }
    if (!trimmedStation) {
      return `Unbenannte Zählstelle mit ${currentUserName}, ${additionalPeople}`;
    }
    return `Zählstelle ${trimmedStation} mit ${currentUserName}, ${additionalPeople}`;
  }

  function closeCounting() {
    if (board[1].items.length) {
      confirmClose = true;
    } else {
      goto('/dashboard');
    }
  }
</script>

<div>
  <h1>Kandidat*innenauswahl</h1>
  <Accordion stayOpen>
    <AccordionItem
      bind:active={stationSettingsOpen}
      header={stationSettingsOpen ? 'Zählstelle' : formatStationInfo()}>
      <FormGroup>
        <label for="additionalPeopleInput" class="form-label"
          >Personen an der Zählstelle (zusätzlich zu {currentUser?.displayName ||
            currentUser?.name ||
            ''})</label>
        <input
          type="text"
          class="form-control form-control-lg"
          bind:value={additionalPeople}
          id="votingStationInput" />
      </FormGroup>
      <Row class="align-items-end">
        <Col xs="11">
          <FormGroup>
            <label for="ballotStationInput" class="form-label">Zählstelle</label>
            <input
              type="text"
              class="form-control form-control-lg"
              bind:value={ballotStationName}
              id="ballotStationInput" />
          </FormGroup>
        </Col>
        <Col xs="1">
          <Button color="primary" class="mb-4" on:click={() => (stationSettingsOpen = false)}
            ><Fa icon={faCheck} /></Button>
        </Col>
      </Row>
    </AccordionItem>
  </Accordion>

  <div class="row mt-2 mx-3">
    <div class="col-8">
      <FormGroup>
        <label for="ballotIdentifier" class="form-label">Stimmzettel-Nummer</label>
        <InputGroup>
          {#if ballotStationName}
            <InputGroupText>{ballotStationName}-</InputGroupText>
          {/if}
          <input
            type="text"
            class="form-control form-control-lg"
            bind:value={ballotIdentifier}
            id="ballotIdentifier" />
        </InputGroup>
      </FormGroup>
      <FormGroup class="mt-3 ps-4">
        <Input type="checkbox" bind:checked={ballotValid} label="Stimmzettel ist gültig" />
      </FormGroup>
    </div>
    <div class="col-4 pt-2">
      <Button color="secondary" class="mt-4 w-100" on:click={closeCounting}
        >Erfassung abschließen</Button>
      <div>
        <small
          >Die Erfassung kann später fortgesetzt werden, solange die Auszählung nicht von der
          Wahlleitung beendet wurde</small>
      </div>
    </div>
  </div>
  {#if ballotValid}
    <div class="selection-panel">
      {#each board as column (column.id)}
        <div
          class={`candidates pb-3 candidates-${column.name}`}
          animate:flip={{ duration: flipDurationMs }}>
          <h2>{column.title}</h2>
          <div
            class="column-content h-100"
            use:dndzone={{ items: column.items, flipDurationMs, dropTargetStyle: {} }}
            on:consider={(e) => handleDndConsiderCards(column.id, e)}
            on:finalize={(e) => handleDndFinalizeCards(column.id, e)}>
            {#each column.items as item, index (item.id)}
              <div
                class="candidate d-flex justify-content-between"
                animate:flip={{ duration: flipDurationMs }}>
                <span>
                  {#if column.id === 2}
                    <span>{index + 1}.</span>
                  {/if}
                  {item.name}
                </span>
                {#if column.id === 1}
                  <button
                    class="btn-sm btn-primary btn m-0 me-2 pt-0 vote-button"
                    on:click={() => pushCandidate(item)}><Fa icon={faArrowRight} /></button>
                {:else}
                  <div>
                    <button
                      class="btn-sm btn-secondary btn m-0 me-2 pt-0 vote-button"
                      disabled={index === 0}
                      on:click={() => moveCandidateUp(index)}><Fa icon={faArrowUp} /></button>
                    <button
                      class="btn-sm btn-secondary btn m-0 me-2 pt-0 vote-button"
                      disabled={index === column.items.length - 1}
                      on:click={() => moveCandidateDown(index)}><Fa icon={faArrowDown} /></button>
                    <button
                      class="btn-sm btn-warning btn m-0 me-2 pt-0 vote-button"
                      on:click={() => popCandidate(item)}><Fa icon={faX} /></button>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
  <FormGroup>
    <input
      type="text"
      class="form-control form-control-lg"
      bind:value={ballotNotes}
      placeholder="Notizen/Anmerkungen zum Stimmzettel (optional)"
      aria-label="Notizen/Anmerkungen zum Stimmzettel"
      id="ballotNotes" />
  </FormGroup>
  <Button
    color="primary"
    size="lg"
    class="w-100"
    bind:disabled={submitDisabled}
    on:click={showConfirmationModal}>
    Stimmzettel erfassen
  </Button>
  {#if submitDisabled}
    <p class="w-100 text-center">
      Um Stimmzettel erfassen zu können, muss ein Name für die Zählstelle angegeben werden
    </p>
  {/if}
  <Modal isOpen={showConfirmation} toggle={cancel}>
    <ModalHeader toggle={cancel}>Stimme überprüfen</ModalHeader>
    <ModalBody>
      Bitte überprüfen Sie die Stimme sorgfältig:<br />
      {#if !!ballotIdentifier}
        Stimmzettel-Nummer: <b>{`${ballotStationName}-${ballotIdentifier}`}</b>
      {:else}
        Sie haben <b>keine</b> Stimmzettel-Nummer angegeben!
      {/if}

      {#if !ballotValid}
        <p>
          Dieser Stimmzettel ist <b>ungültig</b>.
        </p>
      {:else if selected.length > 0}
        <ol>
          {#each selected as item (item.id)}
            <li>{item.name}</li>
          {/each}
        </ol>
      {:else}
        <p>
          Sie haben keine Reihung eingegeben - der Stimmzettel wird als <b>ungültige Stimme</b> erfasst.
        </p>
      {/if}
      {#if ballotNotes?.trim()}
        <p>
          Notizen: {ballotNotes}
        </p>
      {/if}
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={submitVote}>Bestätigen</Button>
      <Button color="secondary" on:click={cancel}>Abbrechen</Button>
    </ModalFooter>
  </Modal>

  <Modal isOpen={!!confirmClose} toggle={() => (confirmClose = false)}>
    <ModalHeader toggle={() => (confirmClose = false)}>Erfassung abschließen?</ModalHeader>
    <ModalBody>
      Der aktuelle Stimmzettel wurde noch nicht erfasst. Sind Sie sicher, dass Sie die Erfassung
      abschließen wollen?
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={() => (confirmClose = false)}>Nein</Button>
      <Button color="danger" on:click={() => goto('/dashboard')}>Ja</Button>
    </ModalFooter>
  </Modal>

  <Modal isOpen={!!errorMessage} toggle={() => (errorMessage = '')}>
    <ModalHeader toggle={() => (errorMessage = '')}>Fehler beim Erfassen der Stimme</ModalHeader>
    <ModalBody>
      {errorMessage}
    </ModalBody>
    <ModalFooter>
      <Button color="danger" on:click={() => (errorMessage = '')}>OK</Button>
    </ModalFooter>
  </Modal>
  <div class="fixed-bottom mb-4 me-3">
    <div class="d-flex justify-content-center">
      <Toast autohide isOpen={!!infoMessage} on:close={() => (infoMessage = '')}>
        <ToastHeader icon="success">{infoMessage}</ToastHeader>
      </Toast>
    </div>
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

  h2 {
    font-weight: 900;
  }

  .selection-panel {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    gap: 2rem;
    padding: 1rem;
  }

  .candidates {
    height: 100%;
    width: 100%;
    border-radius: 1rem;
    padding: 1rem;
  }

  .candidates-candidates {
    border: 2px solid var(--bs-primary);
    border-radius: 0.5rem;
  }

  .candidates-selection {
    border: 2px solid var(--bs-secondary);
    border-radius: 0.5rem;
  }

  .candidate {
    margin: 0.25rem;
    height: 2.5rem;
    border-radius: 1rem;
    border: 1px solid #000;
    vertical-align: middle;
    padding: 0.1rem 0 0 1rem;
    height: 2rem;
    background-color: #fff;
  }

  .vote-button {
    height: 1.6rem;
  }
</style>
