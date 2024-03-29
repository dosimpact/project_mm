import { Options } from 'python-shell';

export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';

export interface PyShellModuleOptions extends Options {
  maintainer?: string;
}

export interface ExePyInput {
  filename: string;
  args?: string[];
  inputs?: string[];
}

export interface ExePyOutput {
  ok: boolean;
  error?: string;
  result?: string[];
}
