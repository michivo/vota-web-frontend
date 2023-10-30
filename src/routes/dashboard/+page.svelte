<script>
	import { firebaseAuth } from "../../firebase/firebase";
</script>
<template>
    Hallo { firebaseAuth.currentUser?.displayName }
</template>