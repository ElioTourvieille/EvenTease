import { HydratedDocument, Types } from 'mongoose';
export type EventDocument = HydratedDocument<Event>;
export type EventStatus = 'pending' | 'published' | 'cancelled';
export type EventType = 'Team Building' | 'Conférence' | 'Apéritif' | 'Autres';
export type EventAccess = 'Ouvert à tous' | 'Equipe de direction' | 'Service concerné';
export declare class Event {
    title: string;
    type: EventType;
    invitation: EventAccess;
    date: string;
    time: string;
    address: string;
    description: string;
    image?: string;
    organizationId: Types.ObjectId;
    createdBy: Types.ObjectId;
    participants: Types.ObjectId[];
    status: EventStatus;
    cancelReason?: string;
}
export declare const EventSchema: import("mongoose").Schema<Event, import("mongoose").Model<Event, any, any, any, import("mongoose").Document<unknown, any, Event, any, {}> & Event & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Event, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Event>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Event> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
