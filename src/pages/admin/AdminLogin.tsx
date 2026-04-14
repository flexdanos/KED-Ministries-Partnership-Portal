import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import KedLoader from '../../components/KedLoader'
import { supabase } from '../../lib/supabase'
import { Lock, Mail, Eye, EyeOff, AlertCircle, Shield } from 'lucide-react'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutTime, setLockoutTime] = useState(0)
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const emailInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    emailInputRef.current?.focus()
    testSupabaseConnection()
  }, [])

  useEffect(() => {
    if (isLocked && lockoutTime > 0) {
      const timer = setInterval(() => {
        setLockoutTime(prev => {
          if (prev <= 1) {
            setIsLocked(false)
            setLoginAttempts(0)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isLocked, lockoutTime])

  const testSupabaseConnection = async () => {
    try {
      setSupabaseStatus('checking')
      const { error } = await supabase.auth.getSession()
      if (error) {
        console.error('Supabase connection error:', error)
        setSupabaseStatus('error')
      } else {
        setSupabaseStatus('connected')
      }
    } catch (error) {
      console.error('Supabase test failed:', error)
      setSupabaseStatus('error')
    }
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = (): boolean => {
    let isValid = true
    
    if (!email.trim()) {
      setEmailError('Email is required')
      isValid = false
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      isValid = false
    } else {
      setEmailError('')
    }
    
    if (!password.trim()) {
      setPasswordError('Password is required')
      isValid = false
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      isValid = false
    } else {
      setPasswordError('')
    }
    
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Form submitted')
    e.preventDefault()
    setError('')
    
    if (!validateForm()) {
      console.log('Validation failed')
      return
    }
    
    if (isLocked) {
      console.log('Account locked')
      setError(`Account locked. Try again in ${lockoutTime} seconds`)
      return
    }
    
    setIsLoading(true)
    console.log('Loading started')

    try {
      console.log('Checking demo credentials:', email)
      if (email === 'admin@kedministries.org' && password === 'admin123') {
        console.log('Demo login successful')
        localStorage.setItem('isAdminAuthenticated', 'true')
        localStorage.setItem('adminLoginTime', new Date().toISOString())
        localStorage.setItem('adminUser', JSON.stringify({
          id: 'demo-super-admin',
          email: 'admin@kedministries.org',
          role: 'super_admin',
          name: 'Super Admin',
          isDemo: true
        }))
        setLoginAttempts(0)
        navigate('/admin/dashboard')
        return
      }

      console.log('Attempting Supabase auth...')
      console.log('Supabase client exists:', !!supabase)
      console.log('Env URL:', !!import.meta.env.VITE_SUPABASE_URL)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      console.log('Supabase response:', { data, error })

      if (error) {
        throw error
      }

      if (data.user) {
        console.log('User authenticated, checking role...')
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role, name')
          .eq('id', data.user.id)
          .single()

        console.log('User role check:', { userData, userError })

        if (userError || !userData) {
          throw new Error('User not found or not authorized as admin')
        }

        if (userData.role !== 'admin' && userData.role !== 'super_admin') {
          throw new Error('Access denied. Admin privileges required.')
        }

        const { data: sessionData } = await supabase.auth.getSession()
        if (!sessionData.session) {
          throw new Error('Session establishment failed')
        }

        console.log('Supabase session verified:', sessionData.session.user.email)

        // Save session token for proper authentication
        localStorage.setItem('isAdminAuthenticated', 'true')
        localStorage.setItem('adminLoginTime', new Date().toISOString())
        localStorage.setItem('adminUser', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          role: userData.role,
          name: userData.name || data.user.email,
          isDemo: false
        }))
        // Save Supabase session info
        if (sessionData.session?.access_token) {
          localStorage.setItem('adminAccessToken', sessionData.session.access_token)
        }
        if (sessionData.session?.refresh_token) {
          localStorage.setItem('adminRefreshToken', sessionData.session.refresh_token)
        }
        setLoginAttempts(0)
        
        console.log('All checks passed, navigating to dashboard...')
        navigate('/admin/dashboard')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      const newAttempts = loginAttempts + 1
      setLoginAttempts(newAttempts)
      
      if (newAttempts >= 3) {
        setIsLocked(true)
        setLockoutTime(30)
        setError('Too many failed attempts. Account locked for 30 seconds.')
      } else {
        if (error.message?.includes('Invalid login credentials')) {
          setError(`Invalid email or password. ${3 - newAttempts} attempts remaining.`)
        } else {
          setError(`${error.message || 'Authentication failed'}. ${3 - newAttempts} attempts remaining.`)
        }
      }
    } finally {
      console.log('Loading ended')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">KED Ministries Portal</p>
          </div>

          {supabaseStatus === 'error' && (
            <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm" role="alert">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>Supabase connection issue. Demo admin still available.</span>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  {error}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  ref={emailInputRef}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (emailError) setEmailError('')
                  }}
                  className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${emailError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="admin@kedministries.org"
                  aria-invalid={emailError ? 'true' : 'false'}
                  aria-describedby={emailError ? 'email-error' : undefined}
                />
              </div>
              {emailError && (
                <p id="email-error" className="mt-1 text-sm text-red-600">
                  {emailError}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (passwordError) setPasswordError('')
                  }}
                  className={`block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${passwordError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter your password"
                  aria-invalid={passwordError ? 'true' : 'false'}
                  aria-describedby={passwordError ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p id="password-error" className="mt-1 text-sm text-red-600">
                  {passwordError}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || isLocked}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <KedLoader size="small" className="mr-2" />
                    Signing in...
                  </span>
                ) : isLocked ? (
                  <span className="flex items-center">
                    <Lock className="mr-2 h-4 w-4" />
                    Locked ({lockoutTime}s)
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    Sign In
                  </span>
                )}
              </button>
            </div>
              
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Forgot password?
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Super Admin Demo</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Email:</span>
                <code className="text-sm text-blue-600 font-mono bg-white px-2 py-1 rounded border border-gray-300">admin@kedministries.org</code>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Password:</span>
                <code className="text-sm text-blue-600 font-mono bg-white px-2 py-1 rounded border border-gray-300">admin123</code>
              </div>
              <div className="text-xs text-gray-500 border-t border-gray-200 pt-2">
                <p className="mb-1">This is a demo super admin account</p>
                <p>Other admins can login via Supabase authentication</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-blue-600 hover:text-blue-500 inline-flex items-center font-medium"
            >
              <Shield className="w-4 h-4 mr-2" />
              Back to User Forms
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
