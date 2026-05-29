import Link from 'next/link'

export default function HomePage() {
  const categories = [
    { icon: '🥦', name: 'সবজি' },
    { icon: '🍎', name: 'ফল' },
    { icon: '🥛', name: 'দুগ্ধ' },
    { icon: '🍚', name: 'চাল-ডাল' },
    { icon: '🐟', name: 'মাছ-মাংস' },
    { icon: '🛢️', name: 'তেল-মশলা' },
    { icon: '🍪', name: 'স্ন্যাকস' },
    { icon: '🧴', name: 'গৃহস্থালি' },
  ]

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #15803d 0%, #16a34a 50%, #22c55e 100%)',
        color: 'white',
        padding: '60px 16px',
        textAlign: 'center'
      }}>
        <div className="container">
          <div style={{ fontSize: 56, marginBottom: 16 }}>🥬🍅🥕</div>
          <h1 style={{ fontFamily: "'Baloo Da 2', cursive", fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>
            তাজা বাজার, দরজায় পৌঁছে যাবে
          </h1>
          <p style={{ fontSize: 18, opacity: 0.9, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
            সেরা মানের গ্রোসারি সরাসরি আপনার ঘরে। দ্রুত ডেলিভারি, ন্যায্য দাম।
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/products" style={{
              background: 'white', color: '#16a34a',
              padding: '12px 28px', borderRadius: 8,
              fontWeight: 700, fontSize: 16, textDecoration: 'none'
            }}>
              এখনই কিনুন →
            </Link>
            <Link href="/register" style={{
              background: 'rgba(255,255,255,0.2)', color: 'white',
              padding: '12px 28px', borderRadius: 8,
              fontWeight: 600, fontSize: 16, border: '2px solid rgba(255,255,255,0.4)'
            }}>
              নিবন্ধন করুন
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ background: 'white', padding: '20px 0', borderBottom: '1px solid #e5e7eb' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
          {[
            { icon: '🚚', text: 'দ্রুত ডেলিভারি' },
            { icon: '✅', text: 'তাজা পণ্যের নিশ্চয়তা' },
            { icon: '💳', text: 'ক্যাশ অন ডেলিভারি' },
            { icon: '📞', text: '২৪/৭ সাপোর্ট' },
          ].map(f => (
            <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: '#4b5563', fontWeight: 500 }}>
              <span style={{ fontSize: 20 }}>{f.icon}</span> {f.text}
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="container" style={{ padding: '40px 16px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, color: '#111827' }}>ক্যাটাগরি</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {categories.map(cat => (
            <Link key={cat.name} href={`/products?category=${cat.name}`} style={{
              background: 'white', borderRadius: 12, padding: '20px 12px',
              textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'all 0.2s', cursor: 'pointer', border: '1.5px solid #e5e7eb'
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{cat.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{cat.name}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="container" style={{ padding: '0 16px 40px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #fff7ed, #fef9c3)',
          border: '2px solid #fed7aa',
          borderRadius: 16, padding: '32px 24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎁</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>প্রথম অর্ডারে বিশেষ ছাড়!</h3>
          <p style={{ color: '#6b7280', marginBottom: 20 }}>আজই নিবন্ধন করুন এবং প্রথম কেনাকাটায় ১০% ছাড় পান।</p>
          <Link href="/register" className="btn btn-orange">এখনই নিবন্ধন করুন</Link>
        </div>
      </div>
    </div>
  )
}
