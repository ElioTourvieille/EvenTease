import { IsEmail, IsString, MinLength } from 'class-validator'

export class RegisterMemberDto {
  @IsString()
  first_name!: string

  @IsString()
  last_name!: string

  @IsEmail()
  email!: string

  @IsString()
  @MinLength(8)
  password!: string

  @IsString()
  inviteCode!: string
}
