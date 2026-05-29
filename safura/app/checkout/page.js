'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' })
  const [user, setUser] = useState(null)

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('safura_cart') || '[]'))
    const u = localStorage.getItem('safura_user')
    if (u) {
      const parsed = JSON.parse(u)
      setUser(parsed)
      setForm(f => ({ ...f, name: parsed.name || '', phone: parsed.phone || '' }))
    }
  }, [])

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)

  async function handleSubmit() {
    if (!form.name || !form.phone || !form.address) {
      alert('নাম, ফোন নম্বর এবং ঠিকানা দিন')
      return
    }
    if (cart.length === 0) return
    setLoading(true)
    const { error } = await supabase.from('orders').insert({
      customer_name: form.name,
      customer_phone: form.phone,
      customer_address: form.address,
      note: form.note,
      items: cart,
      total_price: total,
      status: 'pending',
      user_id: user?.id || null,
    })
    if (error) {
      alert('অর্ডার দিতে সমস্যা হয়েছে: ' + error.message)
    } else {
      localStorage.removeItem('safura_cart')
      window.dispatchEvent(new Event('cartUpdate'))
      router.push('/orders?success=true')
    }
    setLoading(false)
  }

  return (
    <div className="container" style={{ padding: '28px 16px', maxWidth: 680 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 24 }}>চেকআউট</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Delivery Info */}
        <div className="card" style={{ padding: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: '#16a34a' }}>🚚 ডেলিভারি তথ্য</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input placeholder="আপনার নাম *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <input placeholder="ফোন নম্বর * (01XXXXXXXXX)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            <textarea placeholder="সম্পূর্ণ ঠিকানা * (বাড়ি, রাস্তা, এলাকা, জেলা)" value={form.address} onChange={e => setForm({...form, address: e.target.value})} rows={3} />
            <textarea placeholder="বিশেষ নির্দেশনা (ঐচ্ছিক)" value={form.note} onChange={e => setForm({...form, note: e.target.value})} rows={2} />
          </div>
        </div>

        {/* Order Summary */}
        <div className="card" style={{ padding: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>📋 অর্ডার সারসংক্ষেপ</h2>
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
              <span>{item.name} × {item.qty}</span>
              <span style={{ fontWeight: 600 }}>৳{item.price * item.qty}</span>
            </div>
          ))}
          <hr style={{ margin: '12px 0', borderColor: '#e5e7eb' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
            <span>মোট</span>
            <span style={{ color: '#16a34a' }}>৳{total}</span>
          </div>
          <div style={{ marginTop: 12, padding: '10px 14px', background: '#f0fdf4', borderRadius: 8, fontSize: 14, color: '#15803d', fontWeight: 500 }}>
            💵 পেমেন্ট পদ্ধতি: ক্যাশ অন ডেলিভারি
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || cart.length === 0}
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', fontSize: 17, padding: '15px', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'অর্ডার দেওয়া হচ্ছে...' : '✅ অর্ডার কনফার্ম করুন'}
        </button>
      </div>
    </div>
  )
}
