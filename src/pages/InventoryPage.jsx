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
        <Card className="mb-5 !p-5">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 items-end">
            <input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="Medicine name"
              className="border-[1.5px] border-border rounded-xl px-3 py-2.5 text-sm outline-none"/>
            <input value={newItem.stock} onChange={e => setNewItem({ ...newItem, stock: e.target.value })} placeholder="Stock" type="number"
              className="border-[1.5px] border-border rounded-xl px-3 py-2.5 text-sm outline-none"/>
            <input value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} placeholder="Price"
              className="border-[1.5px] border-border rounded-xl px-3 py-2.5 text-sm outline-none"/>
            <input value={newItem.expiry} onChange={e => setNewItem({ ...newItem, expiry: e.target.value })} placeholder="Expiry"
              className="border-[1.5px] border-border rounded-xl px-3 py-2.5 text-sm outline-none"/>
            <Btn onClick={addMedicine}>Save</Btn>
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
        <table className="w-full border-collapse">
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
      </Card>
    </div>
  )
}
