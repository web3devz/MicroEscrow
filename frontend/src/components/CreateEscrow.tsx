import { useState } from 'react'
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { PACKAGE_ID, txUrl } from '../config/network'

const enc = (s: string) => Array.from(new TextEncoder().encode(s))
interface Props { onSuccess?: () => void }

export default function CreateEscrow({ onSuccess }: Props) {
  const account = useCurrentAccount()
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [desc, setDesc] = useState('')
  const [txDigest, setTxDigest] = useState('')
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!account || !recipient || !amount) return
    setError(''); setTxDigest('')
    const tx = new Transaction()
    tx.moveCall({
      target: `${PACKAGE_ID}::escrow::create`,
      arguments: [
        tx.pure.address(recipient),
        tx.pure.u64(BigInt(amount)),
        tx.pure.vector('u8', enc(desc)),
      ],
    })
    signAndExecute({ transaction: tx }, {
      onSuccess: (r) => { setTxDigest(r.digest); setRecipient(''); setAmount(''); setDesc(''); onSuccess?.() },
      onError: (e) => setError(e.message),
    })
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Create Escrow</h2>
        <p className="card-desc">Lock an agreement on-chain. Release or refund when ready.</p>
      </div>
      <form onSubmit={submit} className="form">
        <div className="form-row">
          <label>Recipient Address *<input value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="0x..." required /></label>
          <label>Amount (units) *<input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="100" min="1" required /></label>
        </div>
        <label>Description<textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="What is this escrow for?" rows={2} /></label>
        {error && <p className="error">⚠ {error}</p>}
        <button type="submit" className="btn-primary" disabled={isPending}>{isPending ? 'Creating...' : '🔒 Create Escrow'}</button>
      </form>
      {txDigest && <div className="tx-success"><span>✅ Escrow created</span><a href={txUrl(txDigest)} target="_blank" rel="noreferrer">View tx ↗</a></div>}
    </div>
  )
}
