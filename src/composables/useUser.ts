import { getUserByEmailAction, getUserByIdAction, getUsersAction, deactivateUserAction, updateUserAction, activateUserAction } from "@/modules/user/actions";
import type { PutUser, User } from "@/modules/user/interfaces";

export const useUser = () => {

    const getUsers = (): Promise<User[]> => {
        return getUsersAction();
    }


    const getUserById = (id: string): Promise<User> => {
        return getUserByIdAction(id)
    }


    const getUserByEmail = (id: string): Promise<User> => {
        return getUserByEmailAction(id)
    }


    const deactivateUser = (id: string): Promise<void> => {
        return deactivateUserAction(id);
    }

    const activateUser = (id: string): Promise<void> => {
        return activateUserAction(id);
    }


    const updateUser = (id: string, dataForm: PutUser): Promise<User> => {
        return updateUserAction(id, dataForm);
    }
    
    return {
        getUsers,
        getUserById,
        getUserByEmail,
        deactivateUser,
        activateUser,
        updateUser,
    }
}