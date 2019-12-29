const People = artifacts.require("People");
const truffleAssert = require("truffle-assertions");

contract("People", async (accounts) => {

  let instance;

  before(async () => {
    instance = await People.deployed();
  });

  it("shouldn't create a person older than 150 years", async () => {
    await truffleAssert.fails(
      instance.createPerson(
        "Bob",
        200,
        190,
        {value: web3.utils.toWei("1", "ether")}),
        truffleAssert.ErrorType.REVERT);
  });
  it("shouldn't create a person without payment", async () => {
    await truffleAssert.fails(
      instance.createPerson(
        "Bob",
        50,
        190,
        {value: 1000}),
        truffleAssert.ErrorType.REVERT);
  });
  it("should set senior status correctly", async () => {
    await instance.createPerson(
      "Bob",
      65,
      190,
      {value: web3.utils.toWei("1", "ether")});
    let result = await instance.getPerson();
    assert(result.senior === true, "Senior property not set");
  });
  it("should set age correctly", async () => {
    let result = await instance.getPerson();
    assert(result.age.toNumber() === 65, "Age not set correctly");
  });
  it("should confirm the contract owner", async () => {
    let owner = await instance.owner();
    assert(owner === accounts[0], "Owner is not set correctly");
  });
  it("should not allow non-owner to delete people", async () => {
    await instance.createPerson(
      "Lisa",
      45,
      155,
      {from: accounts[1],
       value: web3.utils.toWei("1", "ether")});
    await truffleAssert.fails(
      instance.deletePerson(
        accounts[1],
        {from: accounts[1]}),
        truffleAssert.ErrorType.REVERT);
  });
  it("should allow the owner to delete people", async () => {
    let instance = await People.new();
    await instance.createPerson(
      "Lisa",
      45,
      155,
      {from: accounts[1],
       value: web3.utils.toWei("1", "ether")});
    await truffleAssert.passes(
      instance.deletePerson(
        accounts[1],
        {from: accounts[0]}),
        truffleAssert.ErrorType.REVERT);
  });

  // IoT Value Assignment

  it("should match the balance on the contract with the balance on the blockchain", async () => {
    let contractBalance = parseInt(await instance.balance());
    let onChainBalance = parseInt(await web3.eth.getBalance(instance.address));
    assert(contractBalance === onChainBalance);
  });
  it("should allow owner to withdraw", async () => {
    let instance = await People.new();
    await instance.createPerson("Joey", 35, 180, {from: accounts[2], value: web3.utils.toWei("1", "ether")});
    await truffleAssert.passes(instance.withdrawAll({from: accounts[0]}));
  });
  it("should not allow non-owner to withdraw", async () => {
    let instance = await People.new();
    await instance.createPerson("Joey", 35, 180, {from: accounts[2], value: web3.utils.toWei("1", "ether")});
    await truffleAssert.fails(instance.withdrawAll({from: accounts[1]}));
  });
  it("should reduce balance after withdrawal", async () => {
    let instance = await People.new();
    await instance.createPerson("Joey", 35, 180, {from: accounts[2], value: web3.utils.toWei("1", "ether")});
    let balance = await instance.balance();
    await instance.withdrawAll({from: accounts[0]});
    let newBalance = parseInt(await instance.balance());
    assert(newBalance == web3.utils.toWei("0", "ether")); // Could just use 0
  });
  it("should increase the owner's balance", async () => {
    let instance = await People.new();
    await instance.createPerson("Joey", 35, 180, {from: accounts[2], value: web3.utils.toWei("1", "ether")});
    let ownerBalance = parseInt(await web3.eth.getBalance(accounts[0]));
    await instance.withdrawAll({from: accounts[0]});
    assert(ownerBalance += parseInt(web3.utils.toWei("1", "ether")));
  });
  it("should increase the balance when a new person is created", async () => {
    let instance = await People.new();
    await instance.createPerson("Joey", 35, 180, {from: accounts[2], value: web3.utils.toWei("1", "ether")});
    let balance = await instance.balance();
    assert(parseInt(balance) === parseInt(web3.utils.toWei('1', 'ether')));
  });
});
