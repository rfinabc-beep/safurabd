'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const u = localStorage.getItem('safura_user')
    if (!u) { router.push('/login'); return }
    const parsed = JSON.parse(u)
    setUser(parsed)
    fetchOrders(parsed.id)
  }, [])

  async function fetchOrders(userId) {
    const { data } = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(10)
    setOrders(data || [])
    setLoading(false)
  }

  if (!user) return null

  const totalSpent = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total_price, 0)

  return (
    <div className="container" style={{ padding: '28px 16px', maxWidth: 800 }}>
      {/* Profile Card */}
      <div className="card" style={{ padding: 24, marginBottom: 20, background: 'linear-gradient(135deg, #16a34a, #22c55e)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700 }}>
            {user.name?.charAt(0) || '👤'}
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>{user.name}</h2>
            <p style={{ opacity: 0.9, fontSize: 14 }}>📞 {user.phone}</p>
            {user.address && <p style={{ opacity: 0.8, fontSize: 13 }}>📍 {user.address}</p>}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {[
          { icon: '📦', label: 'মোট অর্ডার', value: orders.length },
          { icon: '✅', label: 'ডেলিভারি হয়েছে', value: orders.filter(o => o.status === 'delivered').length },
          { icon: '💰', label: 'মোট ব্যয়', value: `৳${totalSpent}` },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '20px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#16a34a' }}>{s.value}</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600 }}>সাম্প্রতিক অর্ডার</h3>
          <Link href="/orders" style={{ color: '#16a34a', fontSize: 14, fontWeight: 500 }}>সব দেখুন →</Link>
        </div>
        {loading ? <p style={{ color: '#6b7280', textAlign: 'center', padding: 20 }}>লোড হচ্ছে...</p> :
          orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 32 }}>
              <p style={{ color: '#6b7280', marginBottom: 16 }}>এখনো কোনো অর্ডার নেই</p>
              <Link href="/products" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: 14 }}>প্রথম অর্ডার করুন</Link>
            </div>
          ) : orders.map(o => (
            <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div>
                <p style={{ fontWeight: 500, fontSize: 14 }}>{o.items?.length} টি পণ্য</p>
                <p style={{ color: '#9ca3af', fontSize: 12 }}>{new Date(o.created_at).toLocaleDateString('bn-BD')}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 700, color: '#16a34a' }}>৳{o.total_price}</p>
                <span className={`badge ${o.status === 'delivered' ? 'badge-green' : o.status === 'cancelled' ? 'badge-gray' : 'badge-orange'}`} style={{ fontSize: 11 }}>
                  {o.status === 'pending' ? 'অপেক্ষমাণ' : o.status === 'confirmed' ? 'কনফার্ম' : o.status === 'delivered' ? 'ডেলিভারি' : 'বাতিল'}
                </span>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
