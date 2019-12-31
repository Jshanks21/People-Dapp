var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(() => {
    window.ethereum.enable().then((accounts) => {
      contractInstance = new web3.eth.Contract(abi, '0x4D4c76205e2Ded2236DE756FEFDA91055C7cBf3b', {from: accounts[0]});
      console.log(contractInstance);
    });
    $('#add_data_button').click(inputData)
    $('#get_data_button').click(fetchAndDisplay)

});

function inputData(){
  var name = $('#name_input').val();
  var age = $('#age_input').val();
  var height = $('#height_input').val();

  var config = {
    value: web3.utils.toWei('1', 'ether')
  }

  contractInstance.methods.createPerson(name, age, height).send(config)
  .on('transactionHash', (hash) => {
    console.log(hash);
  })
  .on('confirmation', (confirmationNmbr) => {
    console.log(confirmationNmbr);
  })
  .on('receipt', (receipt) => {
    console.log(receipt);
  })
}

function fetchAndDisplay(){
  contractInstance.methods.getPerson().call().then((result) => {
    $('#name_output').text(result.name);
    $('#age_output').text(result.age);
    $('#height_output').text(result.height);
  })
}
