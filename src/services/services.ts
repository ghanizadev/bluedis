const receive = window.electron?.receive ?? (() => ({}));
const send = window.electron?.send ?? (() => ({}));
const shell = window.electron?.shell ?? (() => ({}));

export default {
  receive,
  send,
  shell,
};
