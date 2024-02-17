<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type { CreateUserRequest, UserDto, UserWithPasswordDto } from '../../types/api/usertDto';
  import { UserApi } from '../../services/userApi';
  import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Spinner,
    Toast,
    ToastHeader
  } from 'sveltestrap';
  import { UserRole, type User } from '../../types/userState';
  import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import { userStore } from '../../stores/userStore';
  import EditUserModal from '../../components/editUserModal.svelte';
  import { ApiError } from '../../types/api/apiError';

  let users: UserDto[] = [];
  let loading = false;
  let hasError = false;
  let filter = '';
  let currentUser = undefined as User | undefined | null;
  let userToDelete = undefined as UserDto | undefined;
  let userToEdit = undefined as UserDto | undefined;
  let infoMessage = '';
  let errorMessage = '';
  let isNewUser = false;

  const userApi = new UserApi();

  const unsubscribeUser = userStore.subscribe(
    (val) => (currentUser = val.isLoggedIn ? val.user : undefined)
  );

  $: filteredUsers = !filter.trim().toLocaleLowerCase()
    ? users.sort((a, b) => a.username.localeCompare(b.username))
    : users
        .filter((u) => {
          const filterString = filter.trim().toLocaleLowerCase();
          return (
            u.email?.toLocaleLowerCase().includes(filterString) ||
            u.fullName?.toLocaleLowerCase().includes(filterString) ||
            u.username?.toLocaleLowerCase().includes(filterString)
          );
        })
        .sort((a, b) => a.username.localeCompare(b.username));

  onMount(refresh);

  onDestroy(unsubscribeUser);

  async function refresh() {
    loading = true;
    try {
      users = await userApi.getAllUsers();
    } catch {
      hasError = true;
    } finally {
      loading = false;
    }
  }

  function showDeleteModal(user: UserDto) {
    userToDelete = user;
  }

  function showEditModal(user: UserDto) {
    isNewUser = false;
    userToEdit = { ...user };
  }

  async function deleteUser() {
    loading = true;
    const user = userToDelete;
    userToDelete = undefined;
    try {
      if (user) {
        await userApi.deleteUser(user);
      }
    } finally {
      loading = false;
    }
    await refresh();
  }

  async function saveUser(
    event: CustomEvent<{
      user: UserDto;
      changePassword: boolean;
      isNewUser: boolean;
      password: string;
      setInitialPassword: boolean;
    }>
  ): Promise<void> {
    userToEdit = undefined;
    loading = true;
    let hasError = false;
    try {
      const user = event.detail.user;
      if (event.detail.isNewUser) {
        const newUser = {
          ...user,
          password: event.detail.password,
          sendPasswordLink: !event.detail.setInitialPassword
        } as CreateUserRequest;
        await userApi.createUser(newUser);
      } else {
        await userApi.updateUser(user);
        if (event.detail.changePassword) {
          try {
            await userApi.setPassword(user.id, event.detail.password);
          } catch {
            showError('Unerwarteter Fehler beim Setzen des Passworts');
            userToEdit = event.detail.user;
            hasError = true;
          }
        }
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        showError(`Fehler beim ${event.detail.isNewUser ? 'Erstellen' : 'Bearbeiten'}: ${err.message}`);
      } else {
        showError(
          event.detail.isNewUser
            ? 'Unerwarteter Fehler beim Erstellen'
            : 'Unerwarteter Fehler beim Bearbeiten'
        );
      }
      userToEdit = event.detail.user;
      hasError = true;
    } finally {
      loading = false;
    }
    if (!hasError) {
      showInfo(
        event.detail.isNewUser
          ? 'Benutzer*in erfolgreich erstellt'
          : 'Benutzer*in erfolgreich bearbeitet'
      );
      await refresh();
    }
  }

  function showError(message: string) {
    errorMessage = message;
  }

  function showInfo(message: string) {
    infoMessage = message;
  }

  function createNewUser(): void {
    isNewUser = true;
    userToEdit = {
      email: '',
      fullName: '',
      id: 0,
      role: UserRole.Standard,
      username: '',
      regions: [{ id: 1, regionName: 'Wien' }]
    };
  }
</script>

<div>
  {#if loading}
    <Spinner />
  {:else if hasError}
    Fehler beim Laden der Benutzer*innendaten
  {:else}
    <div class="row my-3">
      <div class="input-group col">
        <span class="input-group-text" id="filter-label">🔍</span>
        <input
          type="text"
          bind:value={filter}
          class="form-control"
          placeholder="Filter"
          aria-label="Filter"
          aria-describedby="filter-label" />
      </div>
      <div class="col">
        <Button class="float-end" on:click={createNewUser}>Neue*r Benutzer*in</Button>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th scope="col">Benutzer*innenname</th>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Rolle</th>
          <th scope="col">Aktionen</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredUsers as user}
          <tr class:table-primary={currentUser && currentUser.id === user.id}>
            <td>{user.username}</td>
            <td>{user.fullName ?? ''}</td>
            <td>{user.email ?? ''}</td>
            <td>{user.role === UserRole.Admin ? 'Admin' : 'Standard'}</td>
            <td>
              <div class="d-flex action-buttons">
                <button
                  type="button"
                  class="btn btn-sm btn-flat btn-outline-primary"
                  title="Benutzer*in bearbeiten"
                  on:click={() => showEditModal(user)}><Fa icon={faEdit} /></button>
                {#if currentUser && currentUser.id !== user.id}
                  <button
                    type="button"
                    class="btn btn-sm btn-flat btn-outline-danger"
                    title="Benutzer*in löschen"
                    on:click={() => showDeleteModal(user)}><Fa icon={faTrash} /></button>
                {/if}
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
  <Modal isOpen={!!userToDelete} toggle={() => (userToDelete = undefined)}>
    <ModalHeader toggle={() => (userToDelete = undefined)}>Benutzer löschen</ModalHeader>
    <ModalBody>
      Sind Sie sicher, dass Sie Benutzer*in <em>{userToDelete?.username}</em> löschen wollen?
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={deleteUser}>Ja</Button>
      <Button color="secondary" on:click={() => (userToDelete = undefined)}>Nein</Button>
    </ModalFooter>
  </Modal>
  <Modal isOpen={!!errorMessage} toggle={() => (errorMessage = '')}>
    <ModalHeader toggle={() => (errorMessage = '')}>Unerwarteter Fehler</ModalHeader>
    <ModalBody>
      {errorMessage}
    </ModalBody>
    <ModalFooter>
      <Button color="danger" on:click={() => (errorMessage = '')}>OK</Button>
    </ModalFooter>
  </Modal>
  {#if !errorMessage}
    <EditUserModal
      user={userToEdit}
      {isNewUser}
      on:cancel={() => (userToEdit = undefined)}
      on:save={saveUser} />
  {/if}
  <div class="fixed-bottom mb-4 me-3">
    <div class="d-flex justify-content-end">
      <Toast autohide isOpen={!!infoMessage} on:close={() => (infoMessage = '')}>
        <ToastHeader icon="success">{infoMessage}</ToastHeader>
      </Toast>
    </div>
  </div>
</div>

<style>
  th {
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
  }

  td {
    vertical-align: middle;
  }

  .action-buttons {
    gap: 0.5rem;
  }
</style>
