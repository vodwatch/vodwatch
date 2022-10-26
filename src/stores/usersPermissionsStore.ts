import { defineStore } from "pinia";
import { UserPermissions } from "../modules/interfaces/interfaces";

export const useUsersPermissionsStore = defineStore("usersPermissions", {
    state: () => {
        return {
            usersPermissions: [] as UserPermissions[],
        };
    },
});
