<script lang="ts">
  import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Spinner
  } from 'sveltestrap';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { userStore } from '../stores/userStore';
  import { UserService } from '../services/userService';

  let username = '';
  let password = '';
  let status = '';
  let resetPasswordUsername = undefined as undefined | string;
  let hasError = false;
  let loggingIn = false;
  let signedIn = false;
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
    loggingIn = true;
    signedIn = false;

    hasError = false;
    status = '';
    try {
      await userService.signIn(username, password);
      signedIn = true;
      goto('/dashboard');
    } catch (err: any) {
      hasError = true;
      status = getErrorMessage(err, 'bei der Anmeldung');
    } finally {
      loggingIn = false;
    }
  }

  function getErrorMessage(err: any, activity: string): string {
    if (err && err.message) {
      return err.message;
    }
    return 'Unerwarteter Fehler ' + activity;
  }

  function showResetPasswordModal() {
    resetPasswordUsername = username;
  }

  async function resetPassword() {
    try {
      await userService.resetPassword(username);
      hasError = false;
      status = 'E-Mail wurde verschickt.';
    } catch (err: any) {
      hasError = true;
      status = getErrorMessage(err, 'beim Zurücksetzen.');
    } finally {
      loggingIn = false;
      resetPasswordUsername = undefined;
    }
  }
</script>

<div class="container main-content">
  <div class="login-form">
    {#if loggingIn || signedIn}
      <Spinner />
    {:else}
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
          {#if hasError && !!username}
            <div class="reset-button-container mb-2">
            <Button size="sm" color="secondary" outline on:click={showResetPasswordModal}
              >Passwort vergessen?</Button>
            </div>
          {/if}          
        {/if}
        <div class="buttons">
          <Button
            class="flex-grow-1"
            color="primary"
            bind:disabled={detailsMissing}
            on:click={signIn}>Anmelden</Button>
        </div>
      </Form>
    {/if}
  </div>
  <Modal
    isOpen={!!resetPasswordUsername}
    toggle={() => (resetPasswordUsername = undefined)}
    size="xl">
    <ModalHeader toggle={() => (resetPasswordUsername = undefined)}
      >Passwort zurücksetzen</ModalHeader>
    <ModalBody>
      Drücken Sie Ja, um das Passwort für <b>{resetPasswordUsername}</b> zurückzusetzen. Ihnen wird ein
      Link zugeschickt, über den Sie Ihr Passwort zurücksetzen können.
    </ModalBody>
    <ModalFooter>
      <Button
        color="secondary"
        on:click={() => (resetPasswordUsername = undefined)}
        bind:disabled={loggingIn}>Nein</Button>
      <Button color="primary" on:click={resetPassword} bind:disabled={loggingIn}>Ja</Button>
    </ModalFooter>
  </Modal>
</div>

<style>
  .main-content {
    display: flex;
    height: 100%;
    width: 100svh;
    justify-content: center;
    align-items: center;
  }

  .reset-button-container {
    display: flex;
    justify-content: end;
    width: 100%;
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
