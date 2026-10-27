import { FormEvent, useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

type Order = {
  id: number
  customer: string
  product: string
  amount: number
  status: string
  created_at: string
}

type Stats = {
  orders: number
  revenue: number
  paid: number
}

const api = axios.create({ baseURL: '/api' })
const statuses = ['new', 'paid', 'shipped', 'cancelled'] as const
const statusLabel: Record<string, string> = {
  new: 'NEW',
  paid: 'PAID',
  shipped: 'SHIPPED',
  cancelled: 'CANCEL',
}

function App() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [customer, setCustomer] = useState('')
  const [product, setProduct] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState('new')

  async function load() {
    const [o, s] = await Promise.all([
      api.get<Order[]>('/orders'),
      api.get<Stats>('/stats'),
    ])
    setOrders(o.data)
    setStats(s.data)
  }

  useEffect(() => {
    load().catch(console.error)
  }, [])

  async function onCreate(e: FormEvent) {
    e.preventDefault()
    await api.post('/orders', {
      customer,
      product,
      amount: Number(amount),
      status,
    })
    setCustomer('')
    setProduct('')
    setAmount('')
    setStatus('new')
    await load()
  }

  async function setOrderStatus(id: number, next: string) {
    await api.patch(`/orders/${id}`, { status: next })
    await load()
  }

  async function removeOrder(id: number) {
    await api.delete(`/orders/${id}`)
    await load()
  }

  return (
    <div className="yard">
      <div className="hazard" aria-hidden />
      <header className="mast">
        <div>
          <p className="stamp">warehouse control</p>
          <h1>ORDERDESK</h1>
        </div>
        <p className="tag">Приём · оплата · отгрузка</p>
      </header>

      <section className="meters">
        <div>
          <span>ORDERS</span>
          <strong>{stats?.orders ?? 0}</strong>
        </div>
        <div>
          <span>REVENUE</span>
          <strong>{stats ? stats.revenue.toFixed(0) : 0}</strong>
        </div>
        <div className="hot">
          <span>PAID</span>
          <strong>{stats?.paid ?? 0}</strong>
        </div>
      </section>

      <form className="dock" onSubmit={onCreate}>
        <h2>Новый заказ</h2>
        <div className="fields">
          <label>
            Клиент
            <input value={customer} onChange={(e) => setCustomer(e.target.value)} required />
          </label>
          <label>
            Товар
            <input value={product} onChange={(e) => setProduct(e.target.value)} required />
          </label>
          <label>
            Сумма
            <input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </label>
          <label>
            Статус
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {statuses.map((s) => (
                <option key={s} value={s}>{statusLabel[s]}</option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit">CREATE ORDER</button>
      </form>

      <section className="manifest">
        <h2>Манифест заказов</h2>
        <div className="list">
          {orders.map((o) => (
            <article key={o.id} className={`row status-${o.status}`}>
              <div className="id">#{o.id}</div>
              <div>
                <strong>{o.customer}</strong>
                <p>{o.product}</p>
              </div>
              <div className="amt">{Number(o.amount).toFixed(2)}</div>
              <select value={o.status} onChange={(e) => setOrderStatus(o.id, e.target.value)}>
                {statuses.map((s) => (
                  <option key={s} value={s}>{statusLabel[s]}</option>
                ))}
              </select>
              <button type="button" onClick={() => removeOrder(o.id)}>SCRAP</button>
            </article>
          ))}
          {orders.length === 0 && <p className="empty">Склад пуст — создай первый заказ.</p>}
        </div>
      </section>
    </div>
  )
}

export default App
