<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import {
    Button,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row
  } from 'sveltestrap';
  import { ElectionType, type ElectionDto } from '../types/api/electionDto';
  import Fa from 'svelte-fa';
  import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons';

  export let election: ElectionDto | undefined;
  export let isNewElection = false;

  let saveClicked = false;

  const dispatch = createEventDispatcher();

  function onSave() {
    dispatch('save', election);
  }

  function onCancel() {
    dispatch('cancel');
  }
</script>

<div>
  <Modal isOpen={!!election} toggle={onCancel} size="lg" on:open={() => (saveClicked = false)}>
    <ModalHeader toggle={onCancel}>Wahl {isNewElection ? 'anlegen' : 'bearbeiten'}</ModalHeader>
    {#if election}
      <Form>
        <ModalBody>
          <FormGroup>
            <Label for="title">Bezeichnung</Label>
            <Input
              feedback="Geben Sie eine Bezeichnung an"
              type="text"
              id="title"
              bind:value={election.title}
              placeholder="Listenwahl EU-Wahl Platz 3-5"
              required />
          </FormGroup>
          <FormGroup>
            <Label for="description">Beschreibung</Label>
            <Input
              type="text"
              id="description"
              bind:value={election.description}
              placeholder="Optionale ausführliche Beschreibung der Wahl" />
          </FormGroup>
          <FormGroup>
            <Label for="electedMale"
              >Anzahl bereits gewählter Kandidat*innen</Label>
            <Input
              type="number"
              id="electedMale"
              min="1"
              bind:value={election.numberOfPositionsToElect} />
          </FormGroup>
          <FormGroup>
            <Label for="electedMale"
              >Anzahl bereits gewählter für Quotenregel relevanter Kandidatinnen</Label>
            <Input type="number" id="electedFemale" bind:value={election.alreadyElectedFemale} />
          </FormGroup>
          <FormGroup>
            <Label for="electedMale"
              >Anzahl bereits gewählter <b>nicht</b> für Quotenregel relevanter Kandidaten</Label>
            <Input type="number" id="electedMale" bind:value={election.alreadyElectedMale} />
          </FormGroup>
          <FormGroup>
            <Input
              type="switch"
              bind:checked={election.enforceGenderParity}
              label="Geschlechterparität berücksichtigen" />
          </FormGroup>
          <FormGroup>
            <Label for="roleSelect">Typ</Label>
            <select class="form-select" id="roleSelect" bind:value={election.electionType}>
              <option value={ElectionType.OrderedSingleTransferableVote}>Mit Reihung</option>
              <option value={ElectionType.UnorderedSingleTransferableVote}>Ohne Reihung</option>
            </select>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="primary" on:click={onSave}>Speichern</Button>
          <Button color="secondary" on:click={onCancel}>Abbrechen</Button>
        </ModalFooter>
      </Form>
    {/if}
  </Modal>
</div>
