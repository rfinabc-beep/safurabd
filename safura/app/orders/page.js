'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const STATUS = {
  pending: { label: 'অপেক্ষমাণ', badge: 'badge-orange' },
  confirmed: { label: 'কনফার্ম', badge: 'badge-green' },
  delivered: { label: 'ডেলিভারি হয়েছে', badge: 'badge-green' },
  cancelled: { label: 'বাতিল', badge: 'badge-gray' },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('success')) setSuccess(true)
      const u = localStorage.getItem('safura_user')
      if (u) setUser(JSON.parse(u))
    }
    fetchOrders()
  }, [])

  async function fetchOrders() {
    const u = JSON.parse(localStorage.getItem('safura_user') || 'null')
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (u && u.role !== 'admin') query = query.eq('user_id', u.id)
    const { data } = await query.limit(50)
    setOrders(data || [])
    setLoading(false)
  }

  return (
    <div className="container" style={{ padding: '28px 16px', maxWidth: 720 }}>
      {success && (
        <div style={{ background: '#f0fdf4', border: '2px solid #16a34a', borderRadius: 12, padding: '20px 24px', marginBottom: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
          <h2 style={{ color: '#16a34a', fontWeight: 700 }}>অর্ডার সফলভাবে দেওয়া হয়েছে!</h2>
          <p style={{ color: '#4b5563', marginTop: 4 }}>শীঘ্রই আপনার সাথে যোগাযোগ করা হবে।</p>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700 }}>আমার অর্ডার</h1>
        <Link href="/products" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 14 }}>নতুন অর্ডার</Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>লোড হচ্ছে...</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
          <p style={{ color: '#6b7280', marginBottom: 20 }}>কোনো অর্ডার নেই</p>
          <Link href="/products" className="btn btn-primary">পণ্য কিনুন</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {orders.map(order => (
            <div key={order.id} className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 16 }}>{order.customer_name}</p>
                  <p style={{ color: '#6b7280', fontSize: 13 }}>{order.customer_phone}</p>
                </div>
                <span className={`badge ${STATUS[order.status]?.badge || 'badge-gray'}`}>
                  {STATUS[order.status]?.label || order.status}
                </span>
              </div>
              <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 10 }}>📍 {order.customer_address}</p>
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#9ca3af' }}>
                  {new Date(order.created_at).toLocaleDateString('bn-BD')}
                </span>
                <span style={{ fontWeight: 700, color: '#16a34a', fontSize: 16 }}>৳{order.total_price}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
