<script lang="ts">
	import { onMount } from 'svelte';
	import type { UserDto } from '../../types/api/usertDto';
	import { UserApi } from '../../services/userApi';
	import { Spinner } from 'sveltestrap';
	import { UserRole } from '../../types/userState';
	import { faTrash } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { userStore } from '../../stores/userStore';

	let users: UserDto[] = [];
	let loading = false;
	let hasError = false;
	let filter = '';
    const userApi = new UserApi();

	$: filteredUsers = users.filter((u) => {
		const filterString = filter.trim().toLocaleLowerCase();
		if (!filterString) {
			return users;
		}
		return (
			u.email?.toLocaleLowerCase().includes(filterString) ||
			u.fullName?.toLocaleLowerCase().includes(filterString) ||
			u.username?.toLocaleLowerCase().includes(filterString)
		);
	});

	onMount(refresh);

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


	async function deleteUser(user: UserDto) {
        loading = true;
		try {
            await userApi.deleteUser(user);
        }
        finally {
            loading = false;
        }
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
					<tr>
						<td>{user.username}</td>
						<td>{user.fullName ?? ''}</td>
						<td>{user.email ?? ''}</td>
						<td>{user.role === UserRole.Admin ? 'Admin' : 'Standard'}</td>
						<td> 
                            <button type="button" class="btn btn-flat" title="Benutzer*in löschen" on:click={() => deleteUser(user)}><Fa icon={faTrash} /></button> 
                        </td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
