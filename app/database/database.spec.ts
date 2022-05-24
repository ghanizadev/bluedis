import DatabaseManager from "./index";

describe("Database", () => {
  const database = new DatabaseManager();

  it("Should start", () => {
    expect(database).toBeDefined();
  });
});
