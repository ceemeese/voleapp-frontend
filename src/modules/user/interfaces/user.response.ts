export interface UserResponse {
    id: string;
    dni: string;
    name: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    isActive: boolean;
    createdAt: Date;
}