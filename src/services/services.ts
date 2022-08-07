const receive = window.electron?.receive ?? (() => ({}));
const send = window.electron?.send ?? (() => ({}));
const invoke = window.electron?.invoke ?? (() => ({}));
const shell = window.electron?.shell ?? { openExternal: () => ({}) };

export default {
  receive,
  send,
  invoke,
  shell,
};
