<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { UserDto } from '../types/api/usertDto';
	import { Button, Form, FormGroup, FormText, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'sveltestrap';
	import { UserRole } from '../types/userState';

	export let user: UserDto | undefined;
	export let isNewUser = false;

    let changePassword = false;
    let password = '';
    let passwordConfirmation = '';
	let saveClicked = false;

	$: userNameMissing = !user?.username && (saveClicked || !isNewUser);
	$: passwordsNotMatching = saveClicked && (isNewUser || changePassword) && !!password && !!passwordConfirmation && password !== passwordConfirmation;
	$: passwordTooShort = saveClicked && (isNewUser || changePassword) && password.length < 8;

	const dispatch = createEventDispatcher();

	function onSave() {
		saveClicked = true;
		if(userNameMissing || passwordsNotMatching || passwordTooShort) {
			return;
		}
		dispatch('save', { user, changePassword, isNewUser, password: changePassword || isNewUser ? password : ''});
	}

	function onCancel() {
		dispatch('cancel');
	}
</script>

<div>
	<Modal isOpen={!!user} toggle={onCancel} size="lg" on:open={() => saveClicked = false}>
		<ModalHeader toggle={onCancel}>Benutzer*in {isNewUser ? 'anlegen' : 'bearbeiten'}</ModalHeader>
		{#if user}
		<Form>
			<ModalBody>
                <FormGroup>
					<Label for="username">Benutzer*innennname *</Label>
					<Input feedback="Geben Sie einen Benutzer*innennamen an" type="text" id="username" bind:value={user.username} placeholder="maria.musterfrau" required bind:invalid={userNameMissing} />
				</FormGroup>
                <FormGroup>
					<Label for="fullName">Name</Label>
					<Input type="text" id="fullName" bind:value={user.fullName} placeholder="Maria Musterfrau"/>
				</FormGroup>                
				<FormGroup>
					<Label for="userEmail">Email-Adresse</Label>
					<Input type="email" id="userEmail" aria-describedby="emailHelp" bind:value={user.email} placeholder="maria.musterfrau@gruene.at"/>
					<FormText id="emailHelp">
						Die Email-Adresse ist optional und wird nur für das Zurücksetzen des Passworts benötigt.
					</FormText>
				</FormGroup>
				<FormGroup>
					<Label for="roleSelect">Rolle</Label>
					<select class="form-select" id="roleSelect" bind:value={user.role}>
					  <option value={UserRole.Standard}>Standard</option>
					  <option value={UserRole.Admin}>Admin</option>
					</select>
				  </FormGroup>
                {#if !isNewUser}
                <FormGroup>
                    <Input type="switch" bind:checked={changePassword} label="Passwort ändern" />
                </FormGroup>
                {/if}
                {#if isNewUser || changePassword}
				<FormGroup>
					<Label for="userPassword" class="form-label">Passwort</Label>
					<Input type="password" id="userPassword" bind:value={password} bind:invalid={passwordTooShort} feedback="Das Passwort muss mindestens 8 Zeichen lang sein" />
				</FormGroup>
				<FormGroup>
					<Label for="userPasswordConfirm" class="form-label">Passwort bestätigen</Label>
					<Input type="password" id="userPasswordConfirm" bind:value={passwordConfirmation} bind:invalid={passwordsNotMatching} feedback="Passwörter stimmen nicht überein" />
				</FormGroup>
                {/if}
			</ModalBody>
			<ModalFooter>
				<Button type="submit" color="primary" on:click={onSave}>Speichern</Button>
				<Button color="secondary" on:click={onCancel}>Abbrechen</Button>
			</ModalFooter>
		</Form>
		{/if}
	</Modal>
</div>
