import detectEthereumProvider from '@metamask/detect-provider';


const Web3 = require('web3')

// connect to local blockchain
const web3 = new Web3('http://localhost:7545')

// import the abi
const contractAbi = require('./build/contracts/MkulimaConnectplatform.json')
const contractAddress = ""//cobntract address here


// get blockchain ID
const networkId = async() => {
    const netId = await web3.eth.net.getId()
    console.log(netId)
    return netId
}
//detect metamask
// This function detects most providers injected at window.ethereum.


// This returns the provider, or null if it wasn't detected.
const provider = await detectEthereumProvider();

if (provider) {
  // From now on, this should always be true:
  // provider === window.ethereum
  startApp(provider); // initialize your app
} else {
  console.log('Please install MetaMask!');
}

function startApp(provider) {
  // If the provider returned by detectEthereumProvider isn't the same as
  // window.ethereum, something is overwriting it – perhaps another wallet.
  if (provider !== window.ethereum) {
    console.error('Do you have multiple wallets installed?');
  }
  // Access the decentralized web!
}

// networkId()

// get accounts
const getWallets = async() => {
    const accounts = await web3.eth.getAccounts()
    console.log(accounts)
}

// getWallets()

// get balance
const getBalance = async() => {
    const accounts = await web3.eth.getAccounts()
    const balance = await web3.eth.getBalance(accounts[0])

    // convert from wei to ether
    const etherBalance = web3.utils.fromWei(balance, 'ether')
    console.log(etherBalance)
}

getBalance()

// transfer ether from one account to another
const transferEther = async(sender, recepient, amount) => {
    // const accounts = await web3.eth.getAccounts()
    const balance = await web3.eth.getBalance(sender)
    const etherBalance = web3.utils.fromWei(balance, 'ether')
    console.log(etherBalance)

    // transfer ether
    const tx = await web3.eth.sendTransaction({
        from: sender,
        to: recepient,
        value: web3.utils.toWei(amount, 'ether')
    })

    console.log(tx)
}

transferEther("","", '2')



