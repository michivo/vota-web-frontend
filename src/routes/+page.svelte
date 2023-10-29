<script lang="ts">
	import { signInWithEmailAndPassword } from "firebase/auth";
	import { firebaseAuth } from "../firebase/firebase";
    import { Button, Form, FormGroup, Input, Label } from 'sveltestrap';

    let email = '';
    let password = '';

    $: detailsMissing = !email || !password;

    async function signIn() {
        const auth = firebaseAuth;
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.error(result);
        // const provider = new EmailAuthProvider();
        // await signInWith(auth, provider).then((result) => {
        //     console.error(result);
        // });
    }
</script>

<div>
    <Form>
        <FormGroup>
            <Label for="username">Email</Label>
            <Input id="username" type="text" bind:value={email} />
        </FormGroup>
        <FormGroup>
            <Label for="password">Passwort</Label>
            <Input id="password" type="password" bind:value={password} />
          </FormGroup>
        <Button bind:disabled="{ detailsMissing }" on:click={ signIn }>Anmelden</Button>
    </Form>
</div>
