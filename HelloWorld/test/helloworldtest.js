const Helloworld = artifacts.require("Helloworld");

contract("Helloworld", async () => {
  it("should initialize correctly", async () => {
    let contract = await Helloworld.deployed();
    let message = await contract.getMessage();
    assert(message === "Hello Again!"
    , "Message does not equal Hello Again!");
  });
  it("should set the message", async () => {
    let contract = await Helloworld.deployed();
    await contract.setMessage("Test Message");
    let message = await contract.getMessage();
    assert(message === "Test Message"
    , "Message does not equal newly set message");
  });
});
