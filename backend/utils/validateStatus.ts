import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { Status } from "./status.enum";

@ValidatorConstraint({ name: "Status", async: false })
export class ValidateStatus implements ValidatorConstraintInterface {
  validate(status: string, args: ValidationArguments) {
    return Object.values<string>(Status).includes(status);
  }

  defaultMessage(args: ValidationArguments) {
    return "This status does not exist";
  }
}
