'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ username: '', password: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.id]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', {
      username: form.username,
      password: form.password,
      redirect: false,
    })
    if (result?.error) {
      setError('Invalid username or password.')
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    await signIn('google', { callbackUrl: '/' })
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #d8d6c1 0%, #c8c5ae 100%)' }}
    >
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ backgroundColor: '#00250c' }}
          >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#6ba513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#001c1f' }}>
            Strategy<span style={{ color: '#6ba513' }}>Invest</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: '#4a5e4d' }}>Admin Panel</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border shadow-sm p-8 space-y-5" style={{ backgroundColor: '#e0decb', borderColor: '#b8b5a0' }}>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold" style={{ color: '#001c1f' }}>Welcome back</h2>
            <p className="text-sm" style={{ color: '#4a5e4d' }}>Sign in to access your dashboard</p>
          </div>

          {message && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="username" className="text-sm font-medium" style={{ color: '#001c1f' }}>Username</label>
              <input
                id="username"
                type="text"
                required
                autoComplete="username"
                value={form.username}
                onChange={handleChange}
                disabled={loading}
                placeholder="your username"
                className="w-full h-11 rounded-lg border px-3 text-sm outline-none transition focus:ring-2 disabled:opacity-50"
                style={{ borderColor: '#b8b5a0', backgroundColor: 'rgba(255,255,255,0.6)', color: '#001c1f' }}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium" style={{ color: '#001c1f' }}>Password</label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                placeholder="••••••••"
                className="w-full h-11 rounded-lg border px-3 text-sm outline-none transition focus:ring-2 disabled:opacity-50"
                style={{ borderColor: '#b8b5a0', backgroundColor: 'rgba(255,255,255,0.6)', color: '#001c1f' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#6ba513' }}
            >
              {loading && !form.username ? 'Redirecting…' : loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" style={{ borderColor: '#b8b5a0' }} />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 text-xs" style={{ backgroundColor: '#e0decb', color: '#6a7e6d' }}>or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 h-11 rounded-lg border text-sm font-medium transition hover:bg-white/60 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderColor: '#b8b5a0', color: '#001c1f', backgroundColor: 'rgba(255,255,255,0.3)' }}
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continue with Google
          </button>

          <p className="text-xs text-center" style={{ color: '#4a5e4d' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium hover:underline" style={{ color: '#6ba513' }}>Sign up</Link>
          </p>
        </div>

      </div>
    </div>
  )
}
