import { IsEmail, IsInt, IsNotEmpty, IsString, Max, Min, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { CODES } from "src/lib/codes";

export class EmailDto {
  @IsEmail({}, {message: CODES.AUTH.INVALID_EMAIL})
  @IsNotEmpty({message: CODES.AUTH.EMPTY_EMAIL})
  email: string;
}

export class LoginDto extends EmailDto {
  @IsString({message: CODES.AUTH.INVALID_PASSWORD})
  @IsNotEmpty({message: CODES.AUTH.EMPTY_PASSWORD})
  password: string;
}

export class SignupDto extends LoginDto {
  @IsString({message: CODES.AUTH.INVALID_FULLNAME})
  @IsNotEmpty({message: CODES.AUTH.EMPTY_FULLNAME})
  username: string;
}

export class ActDto {
  @IsInt({message: CODES.AUTH.INVALID_OTP})
  @Max(999999, { message: CODES.AUTH.INVALID_OTP })
  @Min(100000, { message: CODES.AUTH.INVALID_OTP })
  @IsNotEmpty({message: CODES.AUTH.EMPTY_OTP})
  otd: number;
  
  @IsEmail({}, {message: CODES.AUTH.INVALID_EMAIL})
  @IsNotEmpty({message: CODES.AUTH.EMPTY_EMAIL})
  email: string;
}

export class OtpDto {
  @IsInt({message: CODES.AUTH.INVALID_OTP})
  @Max(999999, { message: CODES.AUTH.INVALID_OTP })
  @Min(100000, { message: CODES.AUTH.INVALID_OTP })
  @IsNotEmpty({message: CODES.AUTH.EMPTY_OTP})
  otp: number;
}

@ValidatorConstraint({ async: false })
class MatchPasswordsConstraint implements ValidatorConstraintInterface {
  validate(confirmPass: any, args: ValidationArguments) {
    const object = args.object as any;
    return object.password === confirmPass;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password and confirm password must match.';
  }
}

export class ResetPassDto extends OtpDto {
  @IsString({message: CODES.AUTH.INVALID_PASSWORD})
  @IsNotEmpty({message: CODES.AUTH.EMPTY_PASSWORD})
  password: string;

  @IsString({message: CODES.AUTH.INVALID_PASSWORD})
  @IsNotEmpty({message: CODES.AUTH.EMPTY_PASSWORD})
  @Validate(MatchPasswordsConstraint, {message: CODES.AUTH.PASSWORD_NOT_MATCH})
  confirmPass: string;
}
