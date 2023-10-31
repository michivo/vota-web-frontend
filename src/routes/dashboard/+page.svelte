<script>
	import { userStore } from "../../stores/userStore";

    let userName = '';

    userStore.subscribe(u => userName = u.user?.displayName ?? '');
</script>
<template>
    Hallo { userName }!
</template>