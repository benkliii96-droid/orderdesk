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

const statuses = ['new', 'paid', 'shipped', 'cancelled']

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
    <div className="shell">
      <header>
        <div>
          <h1>OrderDesk</h1>
          <p className="muted">Мини-админка заказов · React + PHP API</p>
        </div>
      </header>

      <section className="stats">
        <div className="stat">
          <span>Заказы</span>
          <strong>{stats?.orders ?? '—'}</strong>
        </div>
        <div className="stat">
          <span>Выручка</span>
          <strong>{stats ? stats.revenue.toFixed(2) : '—'}</strong>
        </div>
        <div className="stat accent">
          <span>Оплачено</span>
          <strong>{stats?.paid ?? '—'}</strong>
        </div>
      </section>

      <form className="card" onSubmit={onCreate}>
        <h2>Новый заказ</h2>
        <div className="row">
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
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
          <label>
            Статус
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit">Создать</button>
      </form>

      <section className="card">
        <h2>Список заказов</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Клиент</th>
              <th>Товар</th>
              <th>Сумма</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.customer}</td>
                <td>{o.product}</td>
                <td>{Number(o.amount).toFixed(2)}</td>
                <td>
                  <select
                    value={o.status}
                    onChange={(e) => setOrderStatus(o.id, e.target.value)}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button type="button" className="danger" onClick={() => removeOrder(o.id)}>
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default App
