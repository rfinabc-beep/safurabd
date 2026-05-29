'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', phone: '', address: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRegister() {
    if (!form.name || !form.phone || !form.password) { setError('সব তথ্য পূরণ করুন'); return }
    if (form.password.length < 6) { setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'); return }
    setLoading(true); setError('')

    const { data: existing } = await supabase.from('users').select('id').eq('phone', form.phone).single()
    if (existing) { setError('এই ফোন নম্বরে আগেই অ্যাকাউন্ট আছে'); setLoading(false); return }

    const { data, error: err } = await supabase.from('users').insert({
      name: form.name, phone: form.phone,
      address: form.address, password: form.password, role: 'customer'
    }).select().single()

    if (err) {
      setError('নিবন্ধনে সমস্যা হয়েছে: ' + err.message)
    } else {
      localStorage.setItem('safura_user', JSON.stringify(data))
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="card" style={{ width: '100%', maxWidth: 420, padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>✨</div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>নিবন্ধন করুন</h1>
          <p style={{ color: '#6b7280', marginTop: 4, fontSize: 14 }}>নতুন অ্যাকাউন্ট তৈরি করুন</p>
        </div>

        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{error}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input placeholder="আপনার নাম *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input placeholder="ফোন নম্বর * (01XXXXXXXXX)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <input placeholder="ঠিকানা" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
          <input type="password" placeholder="পাসওয়ার্ড * (কমপক্ষে ৬ অক্ষর)" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          <button onClick={handleRegister} disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 16, marginTop: 4, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'নিবন্ধন হচ্ছে...' : 'নিবন্ধন করুন'}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
          আগেই অ্যাকাউন্ট আছে? <Link href="/login" style={{ color: '#16a34a', fontWeight: 600 }}>লগইন করুন</Link>
        </p>
      </div>
    </div>
  )
}
