<script lang="ts">
	import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
	import { firebaseAuth } from '../services/firebase';
	import { Button, Form, FormGroup, Input, Label } from 'sveltestrap';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let passwordConfirmation = '';
    let fullName = '';
	let createNewAccount = false;
    let status = '';
    let hasError = false;

	$: detailsMissing = !email || !password;

	async function signIn() {
        hasError = false;
        try {
		    const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
            if(result.user.emailVerified === false) {
                status = 'Bitte bestätigen Sie Ihre E-Mail-Adresse.';
                await signOut(firebaseAuth);
            }
            else {
                goto('/dashboard');
            }
        }
        catch(err: any) {
            hasError = true;
            status = getErrorMessage(err, 'bei der Anmeldung');
        }
	}

    async function createUser() {
        status = '';
        hasError = false;
        try {
            const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
            await sendEmailVerification(result.user);
            updateProfile(result.user, { displayName: fullName });
            await signOut(firebaseAuth);
            onReset();
            status = 'Bitte bestätigen Sie Ihre E-Mail-Adresse';
        }
        catch(err: any) {
            console.error('Error signing you up.');
            console.log(err);
            status = getErrorMessage(err, 'beim Erstellen Ihres Accounts');
            
            hasError = true;
        }
    }

    function getErrorMessage(err: any, activity: string): string {
        if(!err?.code) {
            return 'Unerwarteter Fehler ' + activity;
        }

        switch (err.code) {
            case 'auth/email-already-in-use':
                return 'Mit dieser Adresse ist bereits ein Account verknüpft.';
            case 'auth/weak-password':
                return 'Bitte wählen Sie ein stärkeres Passwort (min. 6 Zeichen)';
            case 'auth/invalid-login-credentials':
                return 'Bitte prüfen Sie Ihren E-Mail-Adresse und Ihr Passwort'
            default:
                return 'Fehler ' + activity + ': ' + err.code;
        }
    }

    function onReset() {
        status = '';
        email = '';
        password = '';
        fullName = '';
        hasError = false;
        createNewAccount = false;
    }
</script>

<div class="container main-content">
	<div class="login-form">
		<Form>
			<FormGroup>
				<Label for="username">E-Mail</Label>
				<Input id="username" type="text" bind:value={email} />
			</FormGroup>
			<FormGroup>
				<Label for="password">Passwort</Label>
				<Input id="password" type="password" bind:value={password} />
			</FormGroup>
			{#if createNewAccount}
				<FormGroup>
					<Label for="passwordConfirm">Passwort wiederholen</Label>
					<Input id="passwordConfirm" type="password" bind:value={passwordConfirmation} />
				</FormGroup>
                <FormGroup>
                    <Label for="fullname">Vor- und Nachname</Label>
                    <Input id="fullname" type="text" bind:value={fullName} />
                </FormGroup>                
			{/if}
			{#if !!status}
				<div
					class="status text-small mb-3"
					class:text-danger={hasError}
					class:text-success={!hasError}
				>
					<small>{status} </small>
				</div>
			{/if}
			<div class="buttons">
				{#if !createNewAccount}
					<Button
						class="flex-grow-1"
						color="primary"
						bind:disabled={detailsMissing}
						on:click={signIn}>Anmelden</Button
					>
					<Button class="flex-grow-1" color="light" on:click={() => (createNewAccount = true)}
						>Registrieren</Button
					>
				{:else}
					<Button
						class="flex-grow-1"
						color="primary"
						bind:disabled={detailsMissing}
						on:click={createUser}>OK</Button
					>
					<Button class="flex-grow-1" color="light" on:click={onReset}>Abbrechen</Button>
				{/if}
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
