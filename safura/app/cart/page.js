'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CartPage() {
  const [cart, setCart] = useState([])

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('safura_cart') || '[]'))
  }, [])

  function updateCart(updated) {
    setCart(updated)
    localStorage.setItem('safura_cart', JSON.stringify(updated))
    window.dispatchEvent(new Event('cartUpdate'))
  }

  function changeQty(id, delta) {
    const updated = cart.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    updateCart(updated)
  }

  function remove(id) {
    updateCart(cart.filter(i => i.id !== id))
  }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <div className="container" style={{ padding: '28px 16px', maxWidth: 700 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 24 }}>🛒 আমার কার্ট</h1>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
          <p style={{ color: '#6b7280', marginBottom: 20, fontSize: 18 }}>কার্ট খালি আছে</p>
          <Link href="/products" className="btn btn-primary">পণ্য দেখুন</Link>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {cart.map(item => (
              <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16 }}>
                <div style={{ fontSize: 36, background: '#f0fdf4', borderRadius: 8, width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛒</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, marginBottom: 2 }}>{item.name}</p>
                  <p style={{ color: '#16a34a', fontWeight: 700 }}>৳{item.price} × {item.qty} = ৳{item.price * item.qty}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => changeQty(item.id, -1)} style={{ width: 30, height: 30, borderRadius: 6, border: '1.5px solid #d1d5db', background: 'white', cursor: 'pointer', fontWeight: 700, fontSize: 16 }}>−</button>
                  <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                  <button onClick={() => changeQty(item.id, 1)} style={{ width: 30, height: 30, borderRadius: 6, border: '1.5px solid #16a34a', background: '#f0fdf4', cursor: 'pointer', fontWeight: 700, fontSize: 16, color: '#16a34a' }}>+</button>
                </div>
                <button onClick={() => remove(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 18 }}>🗑️</button>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 15 }}>
              <span style={{ color: '#6b7280' }}>মোট পণ্য</span>
              <span>{cart.reduce((s, i) => s + i.qty, 0)} টি</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, fontSize: 20, fontWeight: 700 }}>
              <span>মোট মূল্য</span>
              <span style={{ color: '#16a34a' }}>৳{total}</span>
            </div>
            <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 16, padding: '14px' }}>
              চেকআউট করুন →
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
