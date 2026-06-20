import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'
import { G } from '@/lib/gradients'
import { Card, Btn, Badge } from '@/components/ui'

/* ─── INVENTORY PAGE ─────────────────────────────────────────── */
export function InventoryPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")
  const [allInv, setAllInv] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [newItem, setNewItem] = useState({ name: "", stock: "", price: "", expiry: "" })

  function load() {
    api.inventory().then(({ items }) => setAllInv(items)).catch(() => {})
  }
  useEffect(() => { load() }, [])

  async function updateItem(item) {
    const stock = window.prompt(`New stock count for ${item.name}:`, item.stock)
    if (stock === null) return
    const n = Number(stock)
    const status = n <= 0 ? "Out of Stock" : n < 20 ? "Low Stock" : "In Stock"
    await api.updateInventoryItem(item.id, { stock: n, status })
    load()
  }

  async function addMedicine() {
    if (!newItem.name.trim()) return
    await api.addInventoryItem({ ...newItem, stock: Number(newItem.stock) || 0 })
    setNewItem({ name: "", stock: "", price: "", expiry: "" })
    setShowAdd(false)
    load()
  }

  const shown = allInv.filter(i => (filter==="All"||i.status===filter) && i.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold mb-1">Inventory Management</h1>
          <p className="text-muted text-sm">Manage your medicine stock and availability</p>
        </div>
        <Btn gradient={G.green} onClick={() => setShowAdd(v => !v)}>+ Add Medicine</Btn>
      </div>
      {showAdd && (
        <Card className="mb-5 !p-4 sm:!p-5">
          <p className="text-xs font-bold text-muted mb-3">ADD NEW MEDICINE</p>
          <div className="flex flex-col gap-3">
            <input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="Medicine name (e.g. Paracetamol 500mg)"
              className="w-full border-[1.5px] border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-brand transition-colors"/>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <input value={newItem.stock} onChange={e => setNewItem({ ...newItem, stock: e.target.value })} placeholder="Stock qty" type="number"
                className="border-[1.5px] border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-brand transition-colors"/>
              <input value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} placeholder="Price (e.g. ₦500)"
                className="border-[1.5px] border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-brand transition-colors"/>
              <input value={newItem.expiry} onChange={e => setNewItem({ ...newItem, expiry: e.target.value })} placeholder="Expiry (e.g. Dec 2026)"
                className="border-[1.5px] border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-brand transition-colors col-span-2 sm:col-span-1"/>
            </div>
            <div className="flex gap-2">
              <Btn gradient={G.green} onClick={addMedicine} className="flex-1">Save Medicine</Btn>
              <Btn variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Btn>
            </div>
          </div>
        </Card>
      )}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search medicines..."
            className="w-full border-[1.5px] border-border rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-blue-brand transition-colors"/>
        </div>
        {["All","In Stock","Low Stock","Out of Stock"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2.5 rounded-xl border-[1.5px] font-semibold text-[13px] cursor-pointer transition-colors',
              filter===f ? 'border-green-brand bg-green-light text-green-brand' : 'border-border bg-white text-muted hover:border-green-brand/50'
            )}>
            {f}
          </button>
        ))}
      </div>
      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-background">
              {["Medicine Name","Stock","Status","Price","Expiry","Action"].map(h => (
                <th key={h} className="text-left px-[18px] py-3.5 text-muted text-xs font-bold border-b border-border">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map(item => (
              <tr key={item.id} className="border-b border-border hover:bg-background transition-colors">
                <td className="px-[18px] py-3.5 font-semibold text-sm">{item.name}</td>
                <td className="px-[18px] py-3.5 text-muted">{item.stock}</td>
                <td className="px-[18px] py-3.5"><Badge status={item.status}/></td>
                <td className="px-[18px] py-3.5 text-green-mid font-semibold">{item.price}</td>
                <td className="px-[18px] py-3.5 text-muted text-[13px]">{item.expiry}</td>
                <td className="px-[18px] py-3.5"><Btn variant="ghost" size="sm" onClick={() => updateItem(item)}>Update</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  )
}
