# MicroEscrow 💰

Decentralized escrow system on OneChain. Lock agreements on-chain — release funds on completion or refund if work isn't done. No intermediaries.

## Deployed Contract

- **Package:** [`0x26a7e13cf0c32bd5c0b5556ec0d6ec1b470756d07b10c5162fa3f9063b489d67`](https://onescan.cc/testnet/packageDetail?packageId=0x26a7e13cf0c32bd5c0b5556ec0d6ec1b470756d07b10c5162fa3f9063b489d67)
- **Network:** OneChain Testnet

## Features
- Create escrow agreements with recipient, amount, and description
- Release funds to recipient when work is complete
- Refund depositor if agreement falls through
- Full status tracking: Pending → Released / Refunded

## Contract API
```move
public fun create(recipient: address, amount: u64, description: vector<u8>, ctx: &mut TxContext)
public fun release(escrow: &mut Escrow, ctx: &mut TxContext)
public fun refund(escrow: &mut Escrow, ctx: &mut TxContext)
```

## Setup
```bash
cd frontend && npm install && npm run dev
```
`frontend/.env`: `VITE_PACKAGE_ID=<package_id>`

## License
MIT
