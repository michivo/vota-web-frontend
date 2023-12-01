<script lang="ts">
  import { Button, Form, FormGroup, Input, Label } from 'sveltestrap';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { userStore } from '../stores/userStore';
  import { UserService } from '../services/userService';

  let username = '';
  let password = '';
  let status = '';
  let hasError = false;
  const userService = new UserService();

  $: detailsMissing = !username || !password;

  if (browser) {
    userStore.subscribe((state) => {
      if (state.isLoggedIn) {
        goto('/dashboard');
      }
    });
  }

  async function signIn() {
    hasError = false;
    try {
      await userService.signIn(username, password);
      goto('/dashboard');
    } catch (err: any) {
      hasError = true;
      status = getErrorMessage(err, 'bei der Anmeldung');
    }
  }

  function getErrorMessage(err: any, activity: string): string {
    if(err && err.message) {
      return err.message;
    }
    return 'Unerwarteter Fehler ' + activity;
  }
</script>

<div class="container main-content">
  <div class="login-form">
    <Form>
      <FormGroup>
        <Label for="username">Benutzer*innenname</Label>
        <Input id="username" type="text" bind:value={username} />
      </FormGroup>
      <FormGroup>
        <Label for="password">Passwort</Label>
        <Input id="password" type="password" bind:value={password} />
      </FormGroup>
      {#if !!status}
        <div
          class="status text-small mb-3"
          class:text-danger={hasError}
          class:text-success={!hasError}>
          <small>{status} </small>
        </div>
      {/if}
      <div class="buttons">
        <Button class="flex-grow-1" color="primary" bind:disabled={detailsMissing} on:click={signIn}
          >Anmelden</Button>
      </div>
    </Form>
  </div>
</div>

<style>
  .main-content {
    display: flex;
    height: 100%;
    width: 100svh;
    justify-content: center;
    align-items: center;
  }

  .login-form {
    border: 1px solid #eee;
    border-radius: 0.25rem;
    padding: 2rem;
    width: 25%;
    min-width: 25rem;
  }

  .buttons {
    width: 100%;
    display: flex;
    gap: 1rem;
  }
</style>
