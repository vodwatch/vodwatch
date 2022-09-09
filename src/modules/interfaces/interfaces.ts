export interface Message {
    from: String,
    content: String
}

export interface UsersPermissions {
    username: string,
    permissions: Permissions,
}

export interface Permissions {
    vodControl: boolean,
    chat: boolean;
    kick: boolean;
}