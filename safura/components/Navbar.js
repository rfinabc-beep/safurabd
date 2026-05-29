'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const u = localStorage.getItem('safura_user')
    if (u) setUser(JSON.parse(u))
    const cart = JSON.parse(localStorage.getItem('safura_cart') || '[]')
    setCartCount(cart.reduce((s, i) => s + i.qty, 0))

    const onStorage = () => {
      const c = JSON.parse(localStorage.getItem('safura_cart') || '[]')
      setCartCount(c.reduce((s, i) => s + i.qty, 0))
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener('cartUpdate', onStorage)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('cartUpdate', onStorage)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('safura_user')
    setUser(null)
    window.location.href = '/'
  }

  return (
    <nav style={{
      background: 'white',
      borderBottom: '2px solid #16a34a',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 28 }}>🛒</span>
          <span style={{ fontFamily: "'Baloo Da 2', cursive", fontWeight: 800, fontSize: 22, color: '#16a34a' }}>সাফুরা</span>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }} className="desktop-nav">
          <Link href="/products" style={{ color: '#4b5563', fontWeight: 500, fontSize: 15 }}>পণ্য</Link>
          <Link href="/orders" style={{ color: '#4b5563', fontWeight: 500, fontSize: 15 }}>অর্ডার</Link>
          {user ? (
            <>
              <Link href="/dashboard" style={{ color: '#4b5563', fontWeight: 500, fontSize: 15 }}>ড্যাশবোর্ড</Link>
              {user.role === 'admin' && (
                <Link href="/admin" style={{ color: '#ea580c', fontWeight: 600, fontSize: 15 }}>অ্যাডমিন</Link>
              )}
              <button onClick={logout} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: 14 }}>লগআউট</button>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary" style={{ padding: '6px 16px', fontSize: 14 }}>লগইন</Link>
          )}
          <Link href="/cart" style={{ position: 'relative', fontSize: 22 }}>
            🛒
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -8, right: -8,
                background: '#ea580c', color: 'white',
                borderRadius: '50%', width: 18, height: 18,
                fontSize: 11, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{cartCount}</span>
            )}
          </Link>
        </div>

        {/* Mobile */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }} className="mobile-menu-btn">
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div style={{ background: 'white', borderTop: '1px solid #e5e7eb', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link href="/products" onClick={() => setMenuOpen(false)} style={{ color: '#4b5563', fontWeight: 500 }}>পণ্য</Link>
          <Link href="/orders" onClick={() => setMenuOpen(false)} style={{ color: '#4b5563', fontWeight: 500 }}>অর্ডার</Link>
          <Link href="/cart" onClick={() => setMenuOpen(false)} style={{ color: '#4b5563', fontWeight: 500 }}>কার্ট ({cartCount})</Link>
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={{ color: '#4b5563', fontWeight: 500 }}>ড্যাশবোর্ড</Link>
              {user.role === 'admin' && <Link href="/admin" style={{ color: '#ea580c', fontWeight: 600 }}>অ্যাডমিন</Link>}
              <button onClick={logout} className="btn btn-outline" style={{ textAlign: 'left' }}>লগআউট</button>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary" style={{ textAlign: 'center' }}>লগইন</Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
