export interface CalcBtn {
  txt: string;
  ids: string[];
  fn: (s: string) => string,
  isPressed?: boolean;
  isOp?: boolean; // used to identify operands which could be inside operators
}