import { useState } from 'react'
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'
import MyEscrows from './components/MyEscrows'
import CreateEscrow from './components/CreateEscrow'
import './App.css'

type Tab = 'view' | 'create'

export default function App() {
  const account = useCurrentAccount()
  const [tab, setTab] = useState<Tab>('view')

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <span className="logo">💰</span>
          <div>
            <div className="brand-name">MicroEscrow</div>
            <div className="brand-sub">Trustless Transactions</div>
          </div>
        </div>
        <ConnectButton />
      </header>

      {!account ? (
        <>
          <section className="hero">
            <div className="hero-badge">Programmable Trust</div>
            <h1>Trustless Deals,<br />On-Chain</h1>
            <p className="hero-sub">Lock agreements on-chain. Release funds when work is done. No intermediaries, no disputes — just code.</p>
            <div className="hero-features">
              <div className="feature"><span>🔒</span><span>Locked Funds</span></div>
              <div className="feature"><span>✅</span><span>Release on Completion</span></div>
              <div className="feature"><span>↩️</span><span>Refundable</span></div>
              <div className="feature"><span>🌐</span><span>Trustless</span></div>
            </div>
          </section>
          <div className="stats-bar">
            <div className="stat-item"><div className="stat-value">0</div><div className="stat-label">Intermediaries</div></div>
            <div className="stat-item"><div className="stat-value">100%</div><div className="stat-label">Transparent</div></div>
            <div className="stat-item"><div className="stat-value">∞</div><div className="stat-label">Use Cases</div></div>
            <div className="stat-item"><div className="stat-value">&lt;1s</div><div className="stat-label">Finality</div></div>
          </div>
          <section className="how-section">
            <div className="section-title">How MicroEscrow Works</div>
            <p className="section-sub">Three steps to trustless agreements</p>
            <div className="steps-grid">
              <div className="step-card"><div className="step-num">01</div><div className="step-icon">📝</div><h3>Create Escrow</h3><p>Depositor creates an escrow with recipient address, amount, and description of the agreement.</p></div>
              <div className="step-card"><div className="step-num">02</div><div className="step-icon">⚡</div><h3>Work Completed</h3><p>Recipient completes the agreed task. Both parties can verify progress on-chain.</p></div>
              <div className="step-card"><div className="step-num">03</div><div className="step-icon">💸</div><h3>Release or Refund</h3><p>Depositor releases funds to recipient, or refunds themselves if work wasn't completed.</p></div>
            </div>
          </section>
        </>
      ) : (
        <div className="dashboard">
          <div className="dashboard-inner">
            <nav className="tabs">
              {(['view', 'create'] as Tab[]).map(t => (
                <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
                  {t === 'view' && '💰 My Escrows'}
                  {t === 'create' && '➕ Create Escrow'}
                </button>
              ))}
            </nav>
            <main>
              {tab === 'view' && <MyEscrows />}
              {tab === 'create' && <CreateEscrow onSuccess={() => setTab('view')} />}
            </main>
          </div>
        </div>
      )}

      <footer className="footer">
        <span>MicroEscrow · OneChain Testnet</span>
        <a href="https://onescan.cc/testnet" target="_blank" rel="noreferrer">Explorer ↗</a>
      </footer>
    </div>
  )
}
