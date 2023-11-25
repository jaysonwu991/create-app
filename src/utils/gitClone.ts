import { spawn } from 'node:child_process';

type Options = {
  cmd: string;
  git?: string;
  args: string[];
  shallow?: boolean;
  checkout?: string;
};

function git(opts: Options): string {
  return opts.git || 'git';
}

function buildCloneCommand(repo: string, targetPath: string, opts: Options): [string, string[]] {
  let args = ['clone'];
  const userArgs = opts.args || [];

  if (opts.shallow) {
    if (userArgs.includes('--depth')) {
      throw Error('`--depth` cannot be specified when shallow is set to `true`');
    }
    args.push('--depth', '1');
  }

  args = args.concat(userArgs);
  args.push('--', repo, targetPath);

  return [git(opts), args];
}

function buildCheckoutCommand(ref: string, opts: Options): [string, string[]] {
  return [git(opts), ['checkout', ref]];
}

function clone(
  repo: string,
  targetPath: string,
  opts: Options,
  onSuccess: Function,
  onError: Function
) {
  const [cmd, args] = buildCloneCommand(repo, targetPath, opts);
  const process = spawn(cmd, args);

  process.on('close', (status) => {
    if (status == 0) {
      if (opts.checkout) {
        _checkout();
      } else {
        onSuccess();
      }
    } else {
      onError(new Error('`git clone` failed with status ' + status));
    }
  });

  function _checkout() {
    const [cmd, args] = buildCheckoutCommand(opts.checkout || '', opts);
    const process = spawn(cmd, args, { cwd: targetPath });
    process.on('close', function (status) {
      if (status == 0) {
        onSuccess();
      } else {
        onError(new Error('`git checkout` failed with status ' + status));
      }
    });
  }
}

export default function (repo: string, targetPath: string, opts: Options) {
  return new Promise((yes, no) => {
    clone(repo, targetPath, opts || {}, yes, no);
  });
}
