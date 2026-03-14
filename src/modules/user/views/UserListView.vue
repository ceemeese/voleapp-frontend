<script setup lang="ts">
import { useUser } from '@/composables/useUser';
import { onMounted } from 'vue';
import { ref } from 'vue';
import type { User } from '../interfaces';
import { useUserStore } from '@/stores/userStore';

const { getUsers } = useUser();
const userStore = useUserStore()
const users = ref<User[]>([]);

onMounted(async () => {
    if (userStore.isSuperadmin) {
        users.value = await getUsers();
        console.log('Datos', users.value);
    }
})


</script>

<template>
    <div>

    </div>
</template>