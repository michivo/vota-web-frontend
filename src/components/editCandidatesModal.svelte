<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'sveltestrap';
  import { Gender, type CandidateDto, type ElectionDto } from '../types/api/electionDto';
  import Fa from 'svelte-fa';
  import {
    faAngleDown,
    faAngleUp,
    faCircleMinus,
    faCirclePlus
  } from '@fortawesome/free-solid-svg-icons';
  import { ElectionApi } from '../services/electionApi';

  export let election = undefined as ElectionDto | undefined;
  export let showModal = false;
  let errorMessage = '';
  let loading = false;
  let candidates = [] as CandidateDto[];
  let saveClicked = false;
  const electionApi = new ElectionApi();
  $: errorToShow = saveClicked ? errorMessage : '';

  const dispatch = createEventDispatcher();

  function onSave() {
    saveClicked = true;
    const noNameCandidates = candidates.filter((c) => !c.name.trim());
    if (noNameCandidates.length) {
      errorMessage = 'Jede*r Kandidat*in muss einen Namen haben.';
      return;
    }
    const duplicates = candidates.filter(
      (c, i) => candidates.findIndex((c2) => c2.name === c.name) !== i
    );
    if (duplicates.length) {
      errorMessage = 'Die Namen der Kandidat*innen müssen eindeutig sein.';
      return;
    }
    dispatch('save', candidates);
  }

  function onCancel() {
    dispatch('cancel');
  }

  async function loadCandidates(): Promise<void> {
    saveClicked = false;
    if (election) {
      loading = true;
      try {
        const electionWithCandidates = await electionApi.getElectionWithCandidates(election?.id);
        candidates = electionWithCandidates.candidates;
      } finally {
        loading = false;
      }
    }
  }

  function addCandidate() {
    candidates.push({
      ballotOrder: candidates.length + 1,
      gender: Gender.Female,
      description: '',
      name: '',
      electionId: election?.id ?? 0,
      id: 0
    });
    candidates = candidates;
  }

  function removeCandidate(candidateIndex: number) {
    candidates.splice(candidateIndex, 1);
    candidates = candidates;
  }

  function moveUp(candidateIndex: number) {
    const tempCandidate = candidates[candidateIndex];
    candidates[candidateIndex] = candidates[candidateIndex - 1];
    candidates[candidateIndex - 1] = tempCandidate;
    tempCandidate.ballotOrder -= 1;
    candidates[candidateIndex].ballotOrder += 1;
    candidates = candidates;
  }

  function moveDown(candidateIndex: number) {
    const tempCandidate = candidates[candidateIndex];
    candidates[candidateIndex] = candidates[candidateIndex + 1];
    candidates[candidateIndex + 1] = tempCandidate;
    tempCandidate.ballotOrder += 1;
    candidates[candidateIndex].ballotOrder -= 1;
    candidates = candidates;
  }
</script>

<div>
  <Modal isOpen={showModal} toggle={onCancel} size="lg" on:open={loadCandidates}>
    <ModalHeader toggle={onCancel}>Kandidat*innen</ModalHeader>
    <ModalBody>
      <Table size="sm">
        <thead>
          <tr>
            <th class="order-col">#</th>
            <th>Name</th>
            <th class="gender-col">Geschlecht</th>
            <th class="actions-col">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {#each candidates as candidate, candidateIndex}
            <tr>
              <td class="order-col"
                >{candidate.ballotOrder}
                <Button
                  class="ms-2 py-0 px-1"
                  size="sm"
                  color={candidateIndex === 0 ? 'light' : 'primary'}
                  disabled={candidateIndex === 0}
                  on:click={() => moveUp(candidateIndex)}>
                  <Fa icon={faAngleUp} />
                </Button>
                <Button
                  class="py-0 px-1"
                  size="sm"
                  color={candidateIndex === candidates.length - 1 ? 'light' : 'primary'}
                  disabled={candidateIndex === candidates.length - 1}
                  on:click={() => moveDown(candidateIndex)}>
                  <Fa icon={faAngleDown} />
                </Button>
              </td>
              <td><input type="text" class="w-100 form-control" bind:value={candidate.name} /></td>
              <td class="gender-col">
                <select class="form-select" id="roleSelect" bind:value={candidate.gender}>
                  <option value={Gender.Female}>Weiblich</option>
                  <option value={Gender.Male}>Männlich</option>
                </select></td>
              <td class="actions-col">
                <Button color="danger" size="sm" on:click={() => removeCandidate(candidateIndex)}
                  ><Fa icon={faCircleMinus} /></Button>
              </td>
            </tr>
          {/each}
          <tr>
            <td class="order-col" />
            <td />
            <td class="gender-col" />
            <td class="actions-col">
              <Button color="success" size="sm" on:click={addCandidate}>
                <Fa icon={faCirclePlus} />
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
      {#if errorToShow}
        <span class="alert alert-danger" role="alert">{errorMessage}</span>
      {/if}
    </ModalBody>
    <ModalFooter>
      <Button type="submit" color="primary" on:click={onSave}>Speichern</Button>
      <Button color="secondary" on:click={onCancel}>Abbrechen</Button>
    </ModalFooter>
  </Modal>
</div>

<style>
  .gender-col {
    width: 10rem;
  }

  .order-col {
    width: 5rem;
  }

  .actions-col {
    width: 7rem;
  }
</style>
