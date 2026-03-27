declare module "react-simple-captcha" {
  import type { Component } from "react";

  export function loadCaptchaEnginge(
    numberOfCharacters: number,
    backgroundColor?: string,
    fontColor?: string,
    charMap?: string,
  ): void;
  export function validateCaptcha(userValue: string, reload?: boolean): boolean;
  export class LoadCanvasTemplate extends Component<{
    reloadText?: string;
    reloadColor?: string;
  }> {}
  export class LoadCanvasTemplateNoReload extends Component<Record<string, never>> {}
}
