import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, Zap } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { DemoBanner } from '@/components/shared/DemoBanner'

const DEMO_LOGINS = [
  { label: 'Owner', email: 'owner@gbccircle.ng', role: 'Full backoffice access' },
  { label: 'Staff – Chioma', email: 'chioma@gbccircle.ng', role: 'Staff POS access' },
  { label: 'Staff – Tunde', email: 'tunde@gbccircle.ng', role: 'Staff POS access' },
]

export function LoginPage() {
  const { login, isOwner } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    const ok = login(email, password)
    setLoading(false)
    if (!ok) {
      setError('Invalid email or account is inactive. Use a demo login below.')
      return
    }
    // route based on role — check user after login
    const user = DEMO_LOGINS.find((d) => d.email === email)
    if (user?.label === 'Owner') {
      navigate('/backoffice/dashboard')
    } else {
      navigate('/staff/pos')
    }
  }

  function quickLogin(email: string) {
    const ok = login(email, 'demo')
    if (ok) {
      if (email === 'owner@gbccircle.ng') navigate('/backoffice/dashboard')
      else navigate('/staff/pos')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink-900 via-ink-800 to-teal-900 flex flex-col">
      <DemoBanner />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Brand */}
          <div className="text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500 mb-4 shadow-lg">
              <span className="text-white font-bold text-2xl">G</span>
            </div>
            <h1 className="text-2xl font-bold text-white">GBCcircle</h1>
            <p className="text-sm text-white/60 mt-1">Inventory & Sales Management</p>
          </div>

          <Card className="shadow-2xl border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Sign in</CardTitle>
              <CardDescription>Enter your credentials to access the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@gbccircle.ng"
                      className="pl-9"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPw ? 'text' : 'password'}
                      placeholder="Any value for demo"
                      className="pl-9 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && <p className="text-sm text-red-500 bg-red-50 rounded-md px-3 py-2">{error}</p>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign in'}
                </Button>
              </form>

              {/* Demo quick logins */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Demo Quick Login
                </p>
                <div className="space-y-1.5">
                  {DEMO_LOGINS.map((d) => (
                    <button
                      key={d.email}
                      type="button"
                      onClick={() => quickLogin(d.email)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 text-sm hover:bg-slate-50 hover:border-teal-300 transition-colors text-left"
                    >
                      <span className="font-medium text-ink-800">{d.label}</span>
                      <span className="text-xs text-muted-foreground">{d.role}</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-white/40">
            08139009923 · GBCcircle
          </p>
        </div>
      </div>
    </div>
  )
}
