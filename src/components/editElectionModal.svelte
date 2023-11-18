<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
  } from 'sveltestrap';
  import type { ElectionDto } from '../types/api/electionDto';

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
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="description">Beschreibung</Label>
            <Input
              type="text"
              id="description"
              bind:value={election.description}
              placeholder="Optionale ausführliche Beschreibung der Wahl"
            />
          </FormGroup>
          <FormGroup>
            <Input
              type="switch"
              bind:checked={election.enforceGenderParity}
              label="Geschlechterparität berücksichtigen"
            />
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
