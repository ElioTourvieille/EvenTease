import { HydratedDocument, Types } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
export type UserRole = 'owner' | 'admin' | 'member';
export declare class User {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    organizationId: Types.ObjectId;
    role: UserRole;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, import("mongoose").Document<unknown, any, User, any, {}> & User & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<User> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
