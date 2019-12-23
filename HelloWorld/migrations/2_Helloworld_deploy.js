const Helloworld = artifacts.require("Helloworld");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Helloworld).then((contract) => {
    contract.setMessage("Hello Again!", {value: 1000000, from: accounts[0]})
  });
};
