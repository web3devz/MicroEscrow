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
  const [aiPending, setAiPending] = useState(false)
  const [aiError, setAiError] = useState('')

  const extractText = (payload: unknown): string => {
    if (!payload || typeof payload !== 'object') return ''
    const data = payload as {
      output_text?: unknown
      output?: Array<{ content?: Array<{ text?: unknown }> }>
    }
    if (typeof data.output_text === 'string' && data.output_text.trim()) return data.output_text.trim()
    const chunks = data.output ?? []
    const lines: string[] = []
    for (const chunk of chunks) {
      for (const item of chunk?.content ?? []) {
        if (typeof item?.text === 'string' && item.text.trim()) lines.push(item.text.trim())
      }
    }
    return lines.join('\n').trim()
  }

  const rewriteDescription = async () => {
    const key = import.meta.env.VITE_OPENAI_KEY as string | undefined
    if (!key?.trim()) {
      setAiError('Missing VITE_OPENAI_KEY in .env')
      return
    }
    if (!desc.trim()) {
      setAiError('Enter a description first, then click rewrite.')
      return
    }

    setAiPending(true)
    setAiError('')
    try {
      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          input: [
            {
              role: 'system',
              content:
                'You rewrite escrow agreement descriptions for clarity and enforceability. Keep language concise, specific, and neutral.',
            },
            {
              role: 'user',
              content: [
                `Current description: ${desc}`,
                `Recipient: ${recipient || 'N/A'}`,
                `Amount: ${amount || 'N/A'}`,
                'Rewrite in plain text only. No markdown, no bullet points. Maximum 220 characters.',
              ].join('\n'),
            },
          ],
          temperature: 0.3,
          max_output_tokens: 160,
        }),
      })

      if (!response.ok) {
        const details = await response.text()
        throw new Error(`OpenAI request failed (${response.status}): ${details.slice(0, 180)}`)
      }

      const data = (await response.json()) as unknown
      const rewritten = extractText(data)
      if (!rewritten) throw new Error('No rewrite returned from API.')
      setDesc(rewritten.slice(0, 220))
    } catch (e) {
      setAiError(e instanceof Error ? e.message : 'Unable to rewrite description right now.')
    } finally {
      setAiPending(false)
    }
  }

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
        <div className="ai-tools-row">
          <button type="button" className="btn-secondary" onClick={rewriteDescription} disabled={aiPending}>
            {aiPending ? 'Rewriting...' : '✨ Rewrite Description'}
          </button>
          <span className="char-hint">{desc.length}/220</span>
        </div>
        {aiError && <p className="error">⚠ {aiError}</p>}
        {error && <p className="error">⚠ {error}</p>}
        <button type="submit" className="btn-primary" disabled={isPending}>{isPending ? 'Creating...' : '🔒 Create Escrow'}</button>
      </form>
      {txDigest && <div className="tx-success"><span>✅ Escrow created</span><a href={txUrl(txDigest)} target="_blank" rel="noreferrer">View tx ↗</a></div>}
    </div>
  )
}
