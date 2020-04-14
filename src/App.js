import React from 'react'
import logo from './logo.svg'
import './App.css'

import TransportU2F from '@ledgerhq/hw-transport-u2f'
import CosmosApp from 'ledger-cosmos-js'

const getTransport = async () => {
  let transport = null

  console.log(`Trying to connect via U2F...`)

  try {
    transport = await TransportU2F.create(10000)
  } catch (e) {
    console.log(e)
  }

  return transport
}

const getVersion = async () => {
  // Given a transport (U2F/HIF/WebUSB) it is possible instantiate the app
  const transport = await getTransport()
  console.log('WTF', transport)
  const app = new CosmosApp(transport)

  // now it is possible to access all commands in the app
  const response = await app.getVersion()
  if (response.return_code !== 0x9000) {
    console.log(`Error [${response.return_code}] ${response.error_message}`)
    return
  }

  console.log('Response received!')
  console.log(
    `App Version ${response.major}.${response.minor}.${response.patch}`,
  )
  console.log(`Device Locked: ${response.device_locked}`)
  console.log(`Test mode: ${response.test_mode}`)
  console.log('Full response:')
  console.log(response)
}

const showAddress = async () => {
  // Given a transport (U2F/HIF/WebUSB) it is possible instantiate the app
  const transport = await getTransport()
  const app = new CosmosApp(transport)

  // now it is possible to access all commands in the app
  console.log('Please click in the device')
  const path = [44, 118, 5, 0, 3]
  const response = await app.getAddressAndPubKey(path, 'cosmos')
  if (response.return_code !== 0x9000) {
    console.log(`Error [${response.return_code}] ${response.error_message}`)
    return
  }

  console.log('Response received!')
  console.log(
    `App Version ${response.major}.${response.minor}.${response.patch}`,
  )
  console.log(`Device Locked: ${response.device_locked}`)
  console.log(`Test mode: ${response.test_mode}`)
  console.log('Full response:')
  console.log(response)
}

const signExampleTx = async () => {
  // Given a transport (U2F/HIF/WebUSB) it is possible instantiate the app
  const transport = await getTransport()
  const app = new CosmosApp(transport)

  // now it is possible to access all commands in the app
  const path = [44, 118, 0, 0, 0]
  const message =
    '{"account_number":"6571","chain_id":"cosmoshub-2","fee":{"amount":[{"amount":"5000","denom":"uatom"}],"gas":"200000"},"memo":"Delegated with Ledger from union.market","msgs":[{"type":"cosmos-sdk/MsgDelegate","value":{"amount":{"amount":"1000000","denom":"uatom"},"delegator_address":"cosmos102hty0jv2s29lyc4u0tv97z9v298e24t3vwtpl","validator_address":"cosmosvaloper1grgelyng2v6v3t8z87wu3sxgt9m5s03xfytvz7"}}],"sequence":"0"}'
  const response = await app.sign(path, message)

  console.log('Response received!')
  console.log(
    `App Version ${response.major}.${response.minor}.${response.patch}`,
  )
  console.log(`Device Locked: ${response.device_locked}`)
  console.log(`Test mode: ${response.test_mode}`)
  console.log('Full response:')
  console.log(response)
}

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={getVersion}>Get Version</button>
        <button onClick={showAddress}>Show Address</button>
        <button onClick={signExampleTx}>Sign Example Tx</button>
      </header>
    </div>
  )
}

export default App
