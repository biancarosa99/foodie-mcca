import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { Role } from "./role.enum";

@ValidatorConstraint({ name: "Role", async: false })
export class ValidateRole implements ValidatorConstraintInterface {
  validate(role: string, args: ValidationArguments) {
    return Object.values<string>(Role).includes(role);
  }

  defaultMessage(args: ValidationArguments) {
    return "This role does not exist";
  }
}
