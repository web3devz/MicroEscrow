import { useState } from 'react'
import { useCurrentAccount, useSuiClientQuery, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { PACKAGE_ID, txUrl } from '../config/network'

interface EscrowFields { depositor: string; recipient: string; amount: string; description: string; status: number }
const STATUS = ['⏳ Pending', '✅ Released', '↩️ Refunded']
const STATUS_CLASS = ['status-pending', 'status-released', 'status-refunded']

export default function MyEscrows() {
  const account = useCurrentAccount()
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()
  const [actionId, setActionId] = useState('')
  const [txDigest, setTxDigest] = useState('')

  const { data, isPending, refetch } = useSuiClientQuery('getOwnedObjects', {
    owner: account?.address ?? '',
    filter: { StructType: `${PACKAGE_ID}::escrow::Escrow` },
    options: { showContent: true },
  })

  const act = (objId: string, fn: 'release' | 'refund') => {
    setActionId(objId)
    const tx = new Transaction()
    tx.moveCall({ target: `${PACKAGE_ID}::escrow::${fn}`, arguments: [tx.object(objId)] })
    signAndExecute({ transaction: tx }, {
      onSuccess: (r) => { setTxDigest(r.digest); refetch(); setActionId('') },
      onError: () => setActionId(''),
    })
  }

  if (isPending) return <div className="status-box">Loading escrows...</div>
  const escrows = data?.data ?? []

  if (escrows.length === 0) return (
    <div className="empty-state"><div className="empty-icon">💰</div><h3>No escrows yet</h3><p>Create your first escrow agreement.</p></div>
  )

  return (
    <div>
      <div className="card"><div className="card-header"><h2>My Escrows</h2><p className="card-desc">{escrows.length} agreement{escrows.length !== 1 ? 's' : ''}</p></div></div>
      {txDigest && <div className="tx-success" style={{ marginBottom: '1rem' }}><span>✅ Done</span><a href={txUrl(txDigest)} target="_blank" rel="noreferrer">View tx ↗</a></div>}
      <div className="escrow-list">
        {escrows.map(obj => {
          const content = obj.data?.content
          if (content?.dataType !== 'moveObject') return null
          const f = content.fields as unknown as EscrowFields
          const objId = obj.data?.objectId ?? ''
          const status = Number(f.status)
          return (
            <div key={objId} className="escrow-card">
              <div className="escrow-card-header">
                <div className="escrow-desc">{f.description || 'Escrow Agreement'}</div>
                <span className={`escrow-status ${STATUS_CLASS[status]}`}>{STATUS[status]}</span>
              </div>
              <div className="escrow-meta">
                <div className="escrow-meta-item"><div className="escrow-meta-label">Amount</div><div className="escrow-amount">{f.amount}</div></div>
                <div className="escrow-meta-item"><div className="escrow-meta-label">Recipient</div><div className="escrow-meta-value">{f.recipient.slice(0,8)}...{f.recipient.slice(-6)}</div></div>
              </div>
              {status === 0 && (
                <div className="escrow-actions">
                  <button className="btn-release" onClick={() => act(objId, 'release')} disabled={actionId === objId}>💸 Release</button>
                  <button className="btn-refund" onClick={() => act(objId, 'refund')} disabled={actionId === objId}>↩️ Refund</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
