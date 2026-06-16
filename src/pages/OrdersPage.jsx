import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth.jsx'
import { G } from '@/lib/gradients'
import { Card, Btn } from '@/components/ui'

/* ─── ORDERS PAGE ────────────────────────────────────────────── */
export function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [showNew, setShowNew] = useState(false)
  const [newOrder, setNewOrder] = useState({ medicine: "", qty: "", value: "" })
  const sc = { "In Transit":"#3B82F6", "Confirmed":"#D97706", "Delivered":"#16A34A", "Processing":"#7C3AED" }

  function load() {
    api.orders().then(({ orders }) => setOrders(orders)).catch(() => {})
  }
  useEffect(() => { load() }, [])

  async function createOrder() {
    if (!newOrder.medicine.trim() || !newOrder.qty.trim()) return
    await api.createOrder(newOrder)
    setNewOrder({ medicine: "", qty: "", value: "" })
    setShowNew(false)
    load()
  }

  const NEXT_STATUS = { Processing: "Confirmed", Confirmed: "In Transit", "In Transit": "Delivered" }

  async function advance(o) {
    const next = NEXT_STATUS[o.status]
    if (!next) return
    await api.updateOrder(o.id, { status: next })
    load()
  }

  const isSupplier = user?.role === "supplier"

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-extrabold mb-1">Order Tracking</h1>
          <p className="text-muted">Track all medicine orders and deliveries</p>
        </div>
        {!isSupplier && <Btn gradient={G.teal} onClick={() => setShowNew(v => !v)}>+ New Order</Btn>}
      </div>
      {showNew && (
        <Card className="mb-5 !p-5">
          <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-3 items-end">
            <input value={newOrder.medicine} onChange={e => setNewOrder({ ...newOrder, medicine: e.target.value })} placeholder="Medicine"
              className="border-[1.5px] border-border rounded-xl px-3 py-2.5 text-sm outline-none"/>
            <input value={newOrder.qty} onChange={e => setNewOrder({ ...newOrder, qty: e.target.value })} placeholder="Quantity"
              className="border-[1.5px] border-border rounded-xl px-3 py-2.5 text-sm outline-none"/>
            <input value={newOrder.value} onChange={e => setNewOrder({ ...newOrder, value: e.target.value })} placeholder="Value (₦)"
              className="border-[1.5px] border-border rounded-xl px-3 py-2.5 text-sm outline-none"/>
            <Btn onClick={createOrder}>Save</Btn>
          </div>
        </Card>
      )}
      <Card className="!p-0 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-background">
              {["Order ID","Medicine","Quantity",isSupplier?"Buyer":"Supplier","Status","ETA","Value","Action"].map(h => (
                <th key={h} className="text-left px-4 py-3.5 text-muted text-xs font-bold border-b border-border">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b border-border hover:bg-background transition-colors">
                <td className="px-4 py-3.5 text-muted text-[13px] font-semibold">{o.order_code}</td>
                <td className="px-4 py-3.5 font-bold text-sm">{o.medicine}</td>
                <td className="px-4 py-3.5 text-muted">{o.qty}</td>
                <td className="px-4 py-3.5 text-muted text-[13px]">{isSupplier ? (o.buyer_org || o.buyer_name || "—") : (o.supplier_org || o.supplier_name || "Unassigned")}</td>
                <td className="px-4 py-3.5">
                  <span className="font-bold text-[13px]" style={{ color: sc[o.status]||'#64748B' }}>● {o.status}</span>
                </td>
                <td className="px-4 py-3.5 text-muted text-[13px]">{o.eta}</td>
                <td className="px-4 py-3.5 text-green-mid font-bold">{o.value}</td>
                <td className="px-4 py-3.5">{o.status!=="Delivered"&&<Btn variant="ghost" size="sm" onClick={() => advance(o)}>{isSupplier ? "Advance" : "Track"}</Btn>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
