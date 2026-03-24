import { getUserByEmailAction, getUserByIdAction, getUsersAction, deleteUserAction, updateUserAction } from "@/modules/user/actions";
import type { PutUser, User } from "@/modules/user/interfaces";
import { ref } from "vue";

export const useUser = () => {
    const isLoading = ref(false);

    const getUsers = async (): Promise<User[]> => {
        isLoading.value = true;

        try {
            const data: User[] = await getUsersAction();
            return data;
        } finally {
            isLoading.value = false;
        }
    }


    const getUserById = async (id: string): Promise<User> => {
        isLoading.value = true;
        try {
            const data: User = await getUserByIdAction(id)
            return data;
        } finally {
            isLoading.value = false;
        }
    }


    const getUserByEmail = async (id: string): Promise<User> => {
        isLoading.value = true;

        try {
            const data: User = await getUserByEmailAction(id)
            return data;
        } finally {
            isLoading.value = false;
        }
    }


    const deleteUser = async (id: string): Promise<void> => {
        isLoading.value = true;

        try {
            await deleteUserAction(id);
        } finally {
            isLoading.value = false;
        }
    }


    const updateUser = async (id: string, data: PutUser): Promise<void> => {
        isLoading.value = true;

        try {
            await updateUserAction(id, data);
        } finally {
            isLoading.value = false;
        }
    }



    return {
        isLoading,
        getUsers,
        getUserById,
        getUserByEmail,
        deleteUser,
        updateUser,
    }
}