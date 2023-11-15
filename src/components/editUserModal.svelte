<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { UserDto } from '../types/api/usertDto';
	import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'sveltestrap';

	export let user: UserDto | undefined;
	export let isNewUser = false;

    let changePassword = false;
    let password = '';
    let passwordConfirmation = '';

	const dispatch = createEventDispatcher();

	function onSave() {
		dispatch('save', user);
	}

	function onCancel() {
		dispatch('cancel');
	}
</script>

<div>
    {#if user}
	<Modal isOpen={!!user} toggle={onCancel} size="lg">
		<ModalHeader toggle={onCancel}>Benutzer*in {isNewUser ? 'anlegen' : 'bearbeiten'}</ModalHeader>
		<form>
			<ModalBody>
                <div class="mb-3">
					<label for="username" class="form-label">Benutzer*innennname</label>
					<input type="text" class="form-control" id="username" bind:value={user.username} placeholder="maria.musterfrau" required />
				</div>
                <div class="mb-3">
					<label for="fullName" class="form-label">Name</label>
					<input type="text" class="form-control" id="fullName" bind:value={user.fullName} placeholder="Maria Musterfrau"/>
				</div>                
				<div class="mb-3">
					<label for="userEmail" class="form-label">Email-Adresse</label>
					<input type="email" class="form-control" id="userEmail" aria-describedby="emailHelp" bind:value={user.email} placeholder="maria.musterfrau@gruene.at"/>
					<div id="emailHelp" class="form-text">
						Die Email-Adresse ist optional und wird nur für das Zurücksetzen des Passworts benötigt.
					</div>
				</div>
                {#if !isNewUser}
                <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="changePasswordCheckbox" bind:checked={changePassword}>
                    <label class="form-check-label" for="changePasswordCheckbox">Passwort ändern</label>
                </div>
                {/if}
                {#if isNewUser || changePassword}
				<div class="mb-3">
					<label for="userPassword" class="form-label">Passwort</label>
					<input type="password" class="form-control" id="userPassword" bind:value={password} />
				</div>
				<div class="mb-3">
					<label for="userPasswordConfirm" class="form-label">Passwort bestätigen</label>
					<input type="password" class="form-control" id="userPasswordConfirm" bind:value={passwordConfirmation} />
				</div>
                {/if}
			</ModalBody>
			<ModalFooter>
				<Button type="submit" color="primary" on:click={onSave}>Speichern</Button>
				<Button color="secondary" on:click={onCancel}>Abbrechen</Button>
			</ModalFooter>
		</form>
	</Modal>
    {/if}
</div>
