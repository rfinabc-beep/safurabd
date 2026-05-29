'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [search, category])

  async function fetchProducts() {
    setLoading(true)
    let query = supabase.from('products').select('*').order('created_at', { ascending: false })
    if (search) query = query.ilike('name', `%${search}%`)
    if (category) query = query.eq('category', category)
    const { data } = await query
    setProducts(data || [])
    setLoading(false)
  }

  function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem('safura_cart') || '[]')
    const existing = cart.find(i => i.id === product.id)
    if (existing) {
      existing.qty += 1
    } else {
      cart.push({ ...product, qty: 1 })
    }
    localStorage.setItem('safura_cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdate'))
    setToast(`${product.name} কার্টে যোগ হয়েছে ✓`)
    setTimeout(() => setToast(''), 2500)
  }

  const categories = ['সবজি', 'ফল', 'দুগ্ধ', 'চাল-ডাল', 'মাছ-মাংস', 'তেল-মশলা', 'স্ন্যাকস', 'গৃহস্থালি']

  return (
    <div>
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          background: '#16a34a', color: 'white', padding: '12px 20px',
          borderRadius: 8, fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          animation: 'fadeIn 0.3s'
        }}>{toast}</div>
      )}

      <div className="page-header">
        <div className="container">
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 16 }}>সকল পণ্য</h1>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input
              placeholder="পণ্য খুঁজুন..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ maxWidth: 300 }}
            />
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ maxWidth: 200 }}>
              <option value="">সব ক্যাটাগরি</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, fontSize: 18, color: '#6b7280' }}>লোড হচ্ছে...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ color: '#6b7280' }}>কোনো পণ্য পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="grid-4">
            {products.map(p => (
              <div key={p.id} className="card" style={{ transition: 'transform 0.2s' }}>
                <div style={{
                  height: 160, background: '#f0fdf4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 60
                }}>
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : '🛒'}
                </div>
                <div style={{ padding: '14px 12px' }}>
                  <span className="badge badge-green" style={{ marginBottom: 8 }}>{p.category || 'গ্রোসারি'}</span>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{p.name}</h3>
                  {p.unit && <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>{p.unit}</p>}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                    <div>
                      <span style={{ fontSize: 18, fontWeight: 700, color: '#16a34a' }}>৳{p.price}</span>
                    </div>
                    <button
                      onClick={() => addToCart(p)}
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: 13 }}
                    >
                      + কার্ট
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
