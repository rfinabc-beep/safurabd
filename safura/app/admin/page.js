'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

const TABS = ['অর্ডার', 'পণ্য', 'গ্রাহক']
const STATUS_OPTIONS = ['pending', 'confirmed', 'delivered', 'cancelled']
const STATUS_LABELS = { pending: 'অপেক্ষমাণ', confirmed: 'কনফার্ম', delivered: 'ডেলিভারি', cancelled: 'বাতিল' }
const CATEGORIES = ['সবজি', 'ফল', 'দুগ্ধ', 'চাল-ডাল', 'মাছ-মাংস', 'তেল-মশলা', 'স্ন্যাকস', 'গৃহস্থালি']

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState('অর্ডার')
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [newProduct, setNewProduct] = useState({ name: '', price: '', unit: '', category: '', stock: '', image_url: '' })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const u = localStorage.getItem('safura_user')
    if (!u) { router.push('/login'); return }
    const user = JSON.parse(u)
    if (user.role !== 'admin') { router.push('/'); return }
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)
    const [{ data: o }, { data: p }, { data: u }] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('users').select('*').order('created_at', { ascending: false }),
    ])
    setOrders(o || [])
    setProducts(p || [])
    setUsers(u || [])
    setLoading(false)
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2500) }

  async function updateOrderStatus(id, status) {
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o))
    showToast('স্ট্যাটাস আপডেট হয়েছে ✓')
  }

  async function addProduct() {
    if (!newProduct.name || !newProduct.price) { alert('নাম ও দাম দিন'); return }
    setSaving(true)
    const { data, error } = await supabase.from('products').insert({
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      unit: newProduct.unit,
      category: newProduct.category,
      stock: parseInt(newProduct.stock) || 0,
      image_url: newProduct.image_url || null,
    }).select().single()
    if (!error) {
      setProducts([data, ...products])
      setNewProduct({ name: '', price: '', unit: '', category: '', stock: '', image_url: '' })
      showToast('পণ্য যোগ হয়েছে ✓')
    }
    setSaving(false)
  }

  async function deleteProduct(id) {
    if (!confirm('এই পণ্য মুছে ফেলবেন?')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts(products.filter(p => p.id !== id))
    showToast('পণ্য মুছে গেছে')
  }

  const stats = [
    { icon: '📦', label: 'মোট অর্ডার', value: orders.length },
    { icon: '⏳', label: 'পেন্ডিং', value: orders.filter(o => o.status === 'pending').length },
    { icon: '🛍️', label: 'মোট পণ্য', value: products.length },
    { icon: '👥', label: 'গ্রাহক', value: users.filter(u => u.role !== 'admin').length },
  ]

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999, background: '#16a34a', color: 'white', padding: '12px 20px', borderRadius: 8, fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>{toast}</div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span style={{ fontSize: 28 }}>⚙️</span>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>অ্যাডমিন প্যানেল</h1>
          <p style={{ color: '#6b7280', fontSize: 13 }}>সাফুরা ম্যানেজমেন্ট</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} className="card" style={{ padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#16a34a' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '2px solid #e5e7eb' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 20px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 15,
            background: 'none', fontFamily: "'Hind Siliguri', sans-serif",
            borderBottom: tab === t ? '3px solid #16a34a' : '3px solid transparent',
            color: tab === t ? '#16a34a' : '#6b7280', marginBottom: -2
          }}>{t}</button>
        ))}
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>লোড হচ্ছে...</div> : (
        <>
          {/* Orders Tab */}
          {tab === 'অর্ডার' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {orders.length === 0 ? <p style={{ color: '#6b7280', textAlign: 'center', padding: 40 }}>কোনো অর্ডার নেই</p> :
                orders.map(order => (
                  <div key={order.id} className="card" style={{ padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 15 }}>{order.customer_name} — {order.customer_phone}</p>
                        <p style={{ color: '#6b7280', fontSize: 13 }}>📍 {order.customer_address}</p>
                        <p style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>
                          {order.items?.map(i => `${i.name} ×${i.qty}`).join(', ')}
                        </p>
                        {order.note && <p style={{ color: '#9ca3af', fontSize: 12, fontStyle: 'italic' }}>💬 {order.note}</p>}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 700, color: '#16a34a', fontSize: 18 }}>৳{order.total_price}</p>
                        <p style={{ color: '#9ca3af', fontSize: 12, marginBottom: 8 }}>{new Date(order.created_at).toLocaleDateString('bn-BD')}</p>
                        <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value)}
                          style={{ fontSize: 13, padding: '5px 10px', width: 'auto', borderRadius: 6, borderColor: '#d1d5db' }}>
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}

          {/* Products Tab */}
          {tab === 'পণ্য' && (
            <div>
              {/* Add Product Form */}
              <div className="card" style={{ padding: 20, marginBottom: 20 }}>
                <h3 style={{ fontWeight: 600, marginBottom: 14, fontSize: 16 }}>➕ নতুন পণ্য যোগ করুন</h3>
                <div className="grid-2" style={{ gap: 12, marginBottom: 12 }}>
                  <input placeholder="পণ্যের নাম *" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                  <input placeholder="দাম (৳) *" type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                  <input placeholder="একক (যেমন: ১ কেজি, ১ লিটার)" value={newProduct.unit} onChange={e => setNewProduct({...newProduct, unit: e.target.value})} />
                  <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                    <option value="">ক্যাটাগরি বেছে নিন</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input placeholder="স্টক" type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                  <input placeholder="ছবির URL (ঐচ্ছিক)" value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} />
                </div>
                <button onClick={addProduct} disabled={saving} className="btn btn-primary" style={{ opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'যোগ হচ্ছে...' : '✅ পণ্য যোগ করুন'}
                </button>
              </div>

              <div className="grid-4">
                {products.map(p => (
                  <div key={p.id} className="card" style={{ overflow: 'hidden' }}>
                    <div style={{ height: 100, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>
                      {p.image_url ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🛒'}
                    </div>
                    <div style={{ padding: '12px 10px' }}>
                      <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{p.name}</p>
                      {p.unit && <p style={{ fontSize: 12, color: '#9ca3af' }}>{p.unit}</p>}
                      <p style={{ color: '#16a34a', fontWeight: 700, marginTop: 4 }}>৳{p.price}</p>
                      <button onClick={() => deleteProduct(p.id)} style={{ marginTop: 8, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer', fontFamily: "'Hind Siliguri', sans-serif" }}>
                        🗑️ মুছুন
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {tab === 'গ্রাহক' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {users.filter(u => u.role !== 'admin').map(u => (
                <div key={u.id} className="card" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 600 }}>{u.name}</p>
                    <p style={{ color: '#6b7280', fontSize: 13 }}>📞 {u.phone}</p>
                    {u.address && <p style={{ color: '#9ca3af', fontSize: 12 }}>📍 {u.address}</p>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-green">গ্রাহক</span>
                    <p style={{ color: '#9ca3af', fontSize: 12, marginTop: 4 }}>{new Date(u.created_at).toLocaleDateString('bn-BD')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
