'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ phone: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    if (!form.phone || !form.password) { setError('সব তথ্য দিন'); return }
    setLoading(true); setError('')
    const { data, error: err } = await supabase
      .from('users')
      .select('*')
      .eq('phone', form.phone)
      .eq('password', form.password)
      .single()
    if (err || !data) {
      setError('ফোন নম্বর বা পাসওয়ার্ড ভুল')
    } else {
      localStorage.setItem('safura_user', JSON.stringify(data))
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="card" style={{ width: '100%', maxWidth: 400, padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🔐</div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>লগইন করুন</h1>
          <p style={{ color: '#6b7280', marginTop: 4, fontSize: 14 }}>সাফুরায় স্বাগতম</p>
        </div>

        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{error}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input placeholder="ফোন নম্বর (01XXXXXXXXX)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <input type="password" placeholder="পাসওয়ার্ড" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          <button onClick={handleLogin} disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 16, marginTop: 4, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'লগইন হচ্ছে...' : 'লগইন'}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
          অ্যাকাউন্ট নেই? <Link href="/register" style={{ color: '#16a34a', fontWeight: 600 }}>নিবন্ধন করুন</Link>
        </p>
      </div>
    </div>
  )
}
