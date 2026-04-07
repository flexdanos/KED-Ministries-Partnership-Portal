import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

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
    // Test Supabase connection on mount
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
      
      // Simple health check by trying to get the current session
      const { data, error } = await supabase.auth.getSession()
      
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
    console.log('🔐 Form submitted')
    e.preventDefault()
    setError('')
    
    if (!validateForm()) {
      console.log('❌ Validation failed')
      return
    }
    
    if (isLocked) {
      console.log('🔒 Account locked')
      setError(`Account locked. Try again in ${lockoutTime} seconds`)
      return
    }
    
    setIsLoading(true)
    console.log('⏳ Loading started')

    try {
      // Check for demo super admin credentials first
      console.log('👤 Checking demo credentials:', email)
      if (email === 'admin@kedministries.org' && password === 'admin123') {
        console.log('✅ Demo login successful')
        // Demo super admin login
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

      console.log('🌐 Attempting Supabase auth...')
      console.log('📡 Supabase client exists:', !!supabase)
      console.log('🌐 Env URL:', !!import.meta.env.VITE_SUPABASE_URL)
      
      // Try Supabase authentication for other admins
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      console.log('📥 Supabase response:', { data, error })

      if (error) {
        throw error
      }

      if (data.user) {
        console.log('✅ User authenticated, checking role...')
        // Check if user has admin role in your users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role, name')
          .eq('id', data.user.id)
          .single()

        console.log('👥 User role check:', { userData, userError })

        if (userError || !userData) {
          throw new Error('User not found or not authorized as admin')
        }

        if (userData.role !== 'admin' && userData.role !== 'super_admin') {
          throw new Error('Access denied. Admin privileges required.')
        }

        // Verify Supabase session is actually established
        const { data: sessionData } = await supabase.auth.getSession()
        if (!sessionData.session) {
          throw new Error('Session establishment failed')
        }

        console.log('✅ Supabase session verified:', sessionData.session.user.email)

        // Successful admin login
        localStorage.setItem('isAdminAuthenticated', 'true')
        localStorage.setItem('adminLoginTime', new Date().toISOString())
        localStorage.setItem('adminUser', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          role: userData.role,
          name: userData.name || data.user.email,
          isDemo: false
        }))
        setLoginAttempts(0)
        
        // Final verification before navigation
        console.log('🚀 All checks passed, navigating to dashboard...')
        navigate('/admin/dashboard')
      }
    } catch (error: any) {
      console.error('💥 Login error:', error)
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
      console.log('⏹️ Loading ended')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-xtra-navy flex items-center justify-center">
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Login Card */}
        <div className="corporate-card animate-fade-in">
          <div className="p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-xtra-primary rounded-2xl mb-6 shadow-corporate">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-xtra-navy mb-3">Admin Login</h1>
              <p className="text-gray-600">KED Ministries Portal</p>
            </div>

            {/* Connection Status */}
            {supabaseStatus === 'error' && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl text-sm animate-fade-in" role="alert">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Supabase connection issue. Demo admin still available.</span>
                </div>
              </div>
            )}
          

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-fade-in" role="alert">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-xtra-dark mb-2">
                  Email address <span className="text-red-500" aria-label="required">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
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
                    className={`form-input pl-12 ${emailError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="admin@kedministries.org"
                    aria-invalid={emailError ? 'true' : 'false'}
                    aria-describedby={emailError ? 'email-error' : undefined}
                  />
                </div>
                {emailError && (
                  <p id="email-error" className="mt-1 text-sm text-red-600 animate-fade-in">
                    {emailError}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-xtra-dark mb-2">
                  Password <span className="text-red-500" aria-label="required">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
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
                    className={`form-input pl-12 pr-12 ${passwordError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter your password"
                    aria-invalid={passwordError ? 'true' : 'false'}
                    aria-describedby={passwordError ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p id="password-error" className="mt-1 text-sm text-red-600 animate-fade-in">
                    {passwordError}
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || isLocked}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Authenticating...
                    </span>
                  ) : isLocked ? (
                    <span className="flex items-center justify-center">
                      <svg className="mr-3 h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Locked ({lockoutTime}s)
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Sign In
                    </span>
                  )}
                </button>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-xtra-dark">
                  <input
                    type="checkbox"
                    className="mr-2 rounded border-xtra-border text-xtra-primary focus:ring-xtra-primary"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-xtra-primary hover:text-xtra-textHover transition-colors duration-200 font-medium"
                >
                  Forgot password?
                </button>
              </div>
            </form>

            {/* Demo Credentials */}
            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-xtra-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-xtra-white text-gray-500 font-medium">Super Admin Demo</span>
                </div>
              </div>

              <div className="mt-6 p-6 bg-xtra-light rounded-xl border border-xtra-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-xtra-dark">Email:</span>
                  <code className="text-sm text-xtra-primary font-mono bg-xtra-light px-2 py-1 rounded border border-xtra-border">admin@kedministries.org</code>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-xtra-dark">Password:</span>
                  <code className="text-sm text-xtra-primary font-mono bg-xtra-light px-2 py-1 rounded border border-xtra-border">admin123</code>
                </div>
                <div className="text-xs text-gray-500 border-t border-xtra-border pt-3">
                  <p className="mb-1">🔐 This is a demo super admin account</p>
                  <p>📝 Other admins can login via Supabase authentication</p>
                </div>
              </div>
            </div>

            {/* Back Link */}
            <div className="mt-8 text-center">
              <a
                href="/"
                className="text-sm text-xtra-primary hover:text-xtra-textHover transition-colors duration-200 inline-flex items-center font-medium group"
              >
                <svg className="w-4 h-4 mr-2 transform transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to User Forms
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
