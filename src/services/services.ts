const receive = window.electron?.receive ?? (() => ({}));
const send = window.electron?.send ?? (() => ({}));
const shell = window.electron?.shell ?? { openExternal: () => ({}) };

export default {
  receive,
  send,
  shell,
};
