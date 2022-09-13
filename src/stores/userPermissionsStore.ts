import { defineStore } from "pinia";
import { UsersPermissions } from "../modules/interfaces/interfaces";

export const useUserPermissionsStore = defineStore("userPermissions", {
    state: () => ({
        userPermissions: [] as UsersPermissions[],
    }),
    actions: {
        setUserPermissions(newUserPermissions) {
            console.log("pinia", newUserPermissions);
            this.userPermissions = newUserPermissions;
        }
    }
});


