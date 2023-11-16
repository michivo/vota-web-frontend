<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { UserDto, UserWithPasswordDto } from '../../types/api/usertDto';
	import { UserApi } from '../../services/userApi';
	import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from 'sveltestrap';
	import { UserRole, type User } from '../../types/userState';
	import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { userStore } from '../../stores/userStore';
	import EditUserModal from '../../components/editUserModal.svelte';

	let users: UserDto[] = [];
	let loading = false;
	let hasError = false;
	let filter = '';
	let currentUser = undefined as User | undefined | null;
	let userToDelete = undefined as UserDto | undefined;
    let userToEdit = undefined as UserDto | undefined;
	let infoMessage = '';
	let infoState = 'success' as 'success' | 'error';

	const userApi = new UserApi();

	const unsubscribeUser = userStore.subscribe(
		(val) => (currentUser = val.isLoggedIn ? val.user : undefined)
	);

	$: filteredUsers = !filter.trim().toLocaleLowerCase() ?
        users.sort((a, b) => a.username.localeCompare(b.username)) :
        users.filter((u) => {
		const filterString = filter.trim().toLocaleLowerCase();
		return (
			u.email?.toLocaleLowerCase().includes(filterString) ||
			u.fullName?.toLocaleLowerCase().includes(filterString) ||
			u.username?.toLocaleLowerCase().includes(filterString)
		);
	}).sort((a, b) => a.username.localeCompare(b.username));

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
        userToEdit = {...user};
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

	async function saveUser(event: CustomEvent<{ user: UserDto, changePassword: boolean, isNewUser: boolean, password: string}>): Promise<void> {
		userToEdit = undefined;
		loading = true;
		try {
			const user = event.detail.user;
			if(event.detail.isNewUser) {
				const newUser = {...user, password: event.detail.password } as UserWithPasswordDto;
				await userApi.createUser(newUser);
			}
			else {
				await userApi.updateUser(user);
				if(event.detail.changePassword) {
					try {
						await userApi.setPassword(user.id, event.detail.password);
					}
					catch {
						infoMessage = 'Unerwarteter Fehler beim Setzen des Passworts';
						infoState = 'error';
					}
				}
			}
		}
		catch {
			infoMessage = event.detail.isNewUser ? 'Unerwarteter Fehler beim Erstellen' : 'Unerwarteter Fehler beim Bearbeiten';
			infoState = 'error';			
		}
		finally {
			loading = false;
		}
		infoMessage = event.detail.isNewUser ? 'Benutzer*in erfolgreich erstellt' : 'Benutzerin erfolgreich bearbeitet';
		infoState = 'success';
		await refresh();
	}
</script>

<div>
	{#if loading}
		<Spinner />
	{:else if hasError}
		Fehler beim Laden der Benutzer*innendaten
	{:else}
		<div class="input-group my-3">
			<span class="input-group-text" id="filter-label">🔍</span>
			<input
				type="text"
				bind:value={filter}
				class="form-control"
				placeholder="Filter"
				aria-label="Filter"
				aria-describedby="filter-label"
			/>
		</div>

		<table class="table table-striped">
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
							{#if currentUser && currentUser.id !== user.id}
                            <div class="d-flex action-buttons">
								<button
									type="button"
									class="btn btn-sm btn-flat btn-outline-danger"
									title="Benutzer*in löschen"
									on:click={() => showDeleteModal(user)}><Fa icon={faTrash} /></button
								>
                                <button
                                    type="button"
                                    class="btn btn-sm btn-flat btn-outline-primary"
                                    title="Benutzer*in bearbeiten"
                                    on:click={() => showEditModal(user)}><Fa icon={faEdit} /></button
                                >
                            </div>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
	<Modal isOpen={!!userToDelete} toggle={() => userToDelete = undefined}>
		<ModalHeader toggle={() => userToDelete = undefined}>Benutzer löschen</ModalHeader>
		<ModalBody>
			Sind Sie sicher, dass Sie Benutzer <em>{userToDelete?.username}</em> löschen wollen?
		</ModalBody>
		<ModalFooter>
			<Button color="primary" on:click={deleteUser}>Ja</Button>
			<Button color="secondary" on:click={() => userToDelete = undefined}>Nein</Button>
		</ModalFooter>
	</Modal>
    <EditUserModal user={userToEdit} on:cancel={() => userToEdit = undefined} on:save={saveUser} />
</div>

<style>
	td {
		vertical-align: middle;
	}

    .action-buttons {
        gap: 0.5rem;
    }
</style>
