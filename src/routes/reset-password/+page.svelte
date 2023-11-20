<script lang="ts">
  import { browser } from '$app/environment';
  import { Button, Form, FormGroup, Input, Label } from 'sveltestrap';
  import { UserApi } from '../../services/userApi';
    import { redirect } from '@sveltejs/kit';
    import { goto } from '$app/navigation';

  let challenge = '';
  let password = '';
  let passwordConfirmation = '';
  let saveClicked = false;

  $: passwordsNotMatching =
    saveClicked && !!password && !!passwordConfirmation && password !== passwordConfirmation;
  $: passwordTooShort = saveClicked && password.length < 8;

  if (browser) {
    const urlParams = new URLSearchParams(window.location.search);
    challenge = urlParams.get('challenge') ?? '';
  }

  async function onSave() {
    saveClicked = true;
    if (!passwordTooShort && !passwordsNotMatching) {
      const userApi = new UserApi();
      await userApi.setInitialPassword(challenge, password);
      goto('/');
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
    <Button type="submit" color="primary" on:click={onSave}>Speichern</Button>
  </Form>
</div>
