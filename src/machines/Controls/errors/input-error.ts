import { InputsConfiguration } from "../../configuration/InputsConfiguration";
import { INPUT_RECEIVED } from "../controls.types";

const up = (s: string) => s.toUpperCase();

export class InputsMachineError<
  Configuration extends InputsConfiguration<string, string>
> extends Error {
  constructor(
    message: string,
    stateMachineInputEvent: INPUT_RECEIVED<string>
  ) {
    super(message);
    const { axis, source, _type, activator } = stateMachineInputEvent;
    // this.message = `${message} - [${axis} from ${source} ${mode} ${_type}]`;
    const input = `${up(source)}[${up(activator)}]`;
    const data = `${input} for ${up(_type)} "${up(axis)}`;
    this.message = `${message} ${data}`;

    this.name = "InputsMachineError"; // (different names for different built-in error classes)
  }
}
