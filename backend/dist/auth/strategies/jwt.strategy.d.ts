import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    organizationId: string;
}
export interface JwtUser {
    _id: string;
    email: string;
    role: string;
    organizationId: string;
}
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(config: ConfigService);
    validate(payload: JwtPayload): JwtUser;
}
export {};
