<script lang="ts">
  import { browser } from '$app/environment';
  import { Button, Form, FormGroup, Input, Label } from 'sveltestrap';
  import { UserApi } from '../../services/userApi';
  import { goto } from '$app/navigation';

  let challenge = '';
  let password = '';
  let passwordConfirmation = '';
  let saveClicked = false;
  let status = '';
  let hasError = false;

  $: passwordsNotMatching =
    saveClicked && !!password && !!passwordConfirmation && password !== passwordConfirmation;
  $: passwordTooShort = saveClicked && password.length < 8;

  if (browser) {
    const urlParams = new URLSearchParams(window.location.search);
    challenge = urlParams.get('challenge') ?? '';
  }

  function getErrorMessage(err: any): string {
    if (err && err.message) {
      if(err.message.includes('challenge')) {
        return 'Ungültiger Link, bitte öffnen Sie den Link aus Ihrer Mail erneut.';
      }
      return err.message;
    }
    return 'Unerwarteter Fehler';
  }

  async function onSave() {
    saveClicked = true;
    hasError = false;
    status = '';
    if (!passwordTooShort && !passwordsNotMatching) {
      const userApi = new UserApi();
      try {
        await userApi.setInitialPassword(challenge, password);
        goto('/');
      } catch (err: any) {
        hasError = true;
        status = getErrorMessage(err);
      }
    }
  }
</script>

<div>
  <Form>
    <FormGroup>
      <Label for="userPassword" class="form-label">Passwort</Label>
      <Input
        type="password"
        id="userPassword"
        bind:value={password}
        bind:invalid={passwordTooShort}
        feedback="Das Passwort muss mindestens 8 Zeichen lang sein" />
    </FormGroup>
    <FormGroup>
      <Label for="userPasswordConfirm" class="form-label">Passwort bestätigen</Label>
      <Input
        type="password"
        id="userPasswordConfirm"
        bind:value={passwordConfirmation}
        bind:invalid={passwordsNotMatching}
        feedback="Passwörter stimmen nicht überein" />
    </FormGroup>
    {#if !!status}
      <div
        class="status text-small mb-3"
        class:text-danger={hasError}
        class:text-success={!hasError}>
        <small>{status} </small>
      </div>
    {/if}
    <Button type="submit" color="primary" on:click={onSave}>Speichern</Button>
  </Form>
</div>
