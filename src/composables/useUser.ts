import { getUserByEmailAction, getUserByIdAction, getUsersAction, deactivateUserAction, updateUserAction } from "@/modules/user/actions";
import { activateUserAction } from "@/modules/user/actions/activate-user.action";
import type { PutUser, User } from "@/modules/user/interfaces";
import { ref } from "vue";

export const useUser = () => {
    const isLoading = ref<boolean>(false);

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


    const deactivateUser = async (id: string): Promise<void> => {
        isLoading.value = true;

        try {
            await deactivateUserAction(id);
        } finally {
            isLoading.value = false;
        }
    }

    const activateUser = async (id: string): Promise<void> => {
        isLoading.value = true;

        try {
            await activateUserAction(id);
        } finally {
            isLoading.value = false;
        }
    }


    const updateUser = async (id: string, dataForm: PutUser): Promise<User> => {
        isLoading.value = true;

        try {
            const data: User = await updateUserAction(id, dataForm);
            return data;
        } finally {
            isLoading.value = false;
        }
    }
    
    return {
        isLoading,
        getUsers,
        getUserById,
        getUserByEmail,
        deactivateUser,
        activateUser,
        updateUser,
    }
}