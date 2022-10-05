export interface Message {
    from: String,
    content: String
}

export interface UserPermissions {
    username: string,
    permissions: Permissions,
} 

export interface Permissions {
    vodControl: boolean,
    chat: boolean;
    kick: boolean;
}