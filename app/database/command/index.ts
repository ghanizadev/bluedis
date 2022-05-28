import Redis from "ioredis";

import availableCommands from "../availableCommands.json";

export class CommandManager {
  constructor(public redis = new Redis({ lazyConnect: true })) {}

  public async call(command: string) {
    const c = (availableCommands as string[]).find((str) =>
      command.toLowerCase().startsWith(str)
    );

    if (!c) throw new Error("Command not found");

    const response = await this.redis.call(
      c,
      ...command
        .slice(c.length)
        .trim()
        .split(" ")
        .filter((i) => i !== "")
    );

    if (typeof response !== "string")
      return ["Response could not be displayed"];
    return response.split("\n");
  }
}