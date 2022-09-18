export interface Message {
    from: String,
    content: String
}

// single user permissions
export interface UserPermissions {
    username: string,
    permissions: Permissions,
} 

/* export interface UsersPermissions {
    roomId: string, 
    allUsersPermissions: UserPermissions[],
} */

export interface Permissions {
    vodControl: boolean,
    chat: boolean;
    kick: boolean;
}