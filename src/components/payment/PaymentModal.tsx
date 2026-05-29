import React, { useState, useEffect, useRef } from 'react';
import KedLoader from '../KedLoader';
import { supabase } from '../../lib/supabase';
import { openHubtelModal } from '../../lib/hubtel';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Heart,
  Globe,
  AlertCircle,
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAmount?: string;
  userEmail?: string;
  userPhone?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  defaultAmount = '5000',
  userEmail = '',
  userPhone = '',
}) => {
  const [email, setEmail] = useState(userEmail);
  const [phone, setPhone] = useState(userPhone);
  const [amount, setAmount] = useState(defaultAmount); // USD cents internally
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState(15.5);
  const [isFetchingRate, setIsFetchingRate] = useState(false);
  const [isLaptop, setIsLaptop] = useState(false);
  const checkoutRef = useRef<any>(null);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsLaptop(w >= 1024 && w <= 1440);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const fetchExchangeRate = async () => {
    setIsFetchingRate(true);
    try {
      const apis = [
        'https://api.exchangerate-api.com/v4/latest/USD',
        'https://open.er-api.com/v6/latest/USD',
      ];
      for (const api of apis) {
        try {
          const res = await fetch(api);
          const data = await res.json();
          const rate = data?.rates?.GHS;
          if (rate) {
            setExchangeRate(rate);
            return;
          }
        } catch {
          continue;
        }
      }
    } finally {
      setIsFetchingRate(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setEmail(userEmail || '');
      setPhone(userPhone || '');
      setAmount(defaultAmount || '5000');
      setError(null);
      setSuccess(false);
      fetchExchangeRate();
      const interval = setInterval(fetchExchangeRate, 5 * 60 * 1000);
      return () => {
        clearInterval(interval);
        checkoutRef.current?.destroy?.();
      };
    }
  }, [isOpen, userEmail, userPhone, defaultAmount]);

  const amountUSD = (parseInt(amount) || 0) / 100;
  const amountGHS = parseFloat((amountUSD * exchangeRate).toFixed(2));

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone || !amount) return;

    setLoading(true);
    setError(null);

    const reference = Date.now().toString();

    try {
      // Save pending record before checkout opens
      await supabase.from('payments').insert([{
        email,
        amount: amountUSD,
        reference,
        currency: 'USD',
        status: 'pending',
        created_at: new Date(),
      }]);

      checkoutRef.current = openHubtelModal(
        {
          amount: amountGHS,
          purchaseDescription: `KED Ministries Partnership – $${amountUSD.toFixed(2)} USD`,
          customerPhoneNumber: phone,
          clientReference: reference,
        },
        {
          onPaymentSuccess: async (data) => {
            // Update record to success
            await supabase
              .from('payments')
              .update({ status: 'success' })
              .eq('reference', reference);
            checkoutRef.current?.closePopUp?.();
            setSuccess(true);
            setLoading(false);
          },
          onPaymentFailure: async (data) => {
            await supabase
              .from('payments')
              .update({ status: 'failed' })
              .eq('reference', reference);
            checkoutRef.current?.closePopUp?.();
            setError(data.message || 'Payment failed. Please try again.');
            setLoading(false);
          },
          onClose: () => {
            setLoading(false);
          },
        }
      );
    } catch (err: any) {
      console.error('Hubtel checkout error:', err);
      setError(err.message || 'Could not open checkout. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 backdrop-blur-md"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`w-full max-w-sm sm:max-w-md lg:max-w-xl bg-white rounded-2xl shadow-2xl relative z-10 border border-xtra-border ${isLaptop ? 'overflow-y-auto' : 'overflow-hidden'} max-h-[90vh] lg:max-h-[80vh]`}
      >
        {/* Header */}
        <div className="bg-xtra-primary px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold text-lg sm:text-xl lg:text-2xl">Secure Payment</h3>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1">
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Title */}
              <div className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10">
                <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8 mb-6 lg:mb-10">
                  <div className="p-3 lg:p-4 bg-xtra-primary/10 rounded-xl lg:rounded-2xl border border-xtra-primary/20">
                    <Heart className="w-6 h-6 lg:w-8 lg:h-8 text-xtra-primary" />
                  </div>
                  <div className="text-center lg:text-left">
                    <h2 className="text-xl lg:text-2xl font-bold text-xtra-dark mb-1">Partner with KED</h2>
                    <p className="text-xs sm:text-sm text-xtra-primary font-semibold uppercase tracking-wide flex items-center justify-center lg:justify-start gap-2">
                      <Globe className="w-3 h-3 sm:w-4 sm:h-4" /> Secure Checkout via Hubtel • GHS
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePayment} className="space-y-5 lg:space-y-6 px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 lg:pb-10">
                {/* Error */}
                {error && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-xtra-dark uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-xtra-border rounded-lg focus:ring-2 focus:ring-xtra-primary focus:border-transparent text-xtra-dark placeholder-gray-400"
                    placeholder="partner@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-xtra-dark uppercase tracking-wide">Mobile Number</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-xtra-border rounded-lg focus:ring-2 focus:ring-xtra-primary focus:border-transparent text-xtra-dark placeholder-gray-400"
                    placeholder="0551234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-xtra-dark uppercase tracking-wide">Contribution Amount (GHS)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg sm:text-xl font-bold text-xtra-primary">₵</span>
                    <input
                      type="number"
                      className="w-full pl-10 sm:pl-12 pr-4 py-3 border border-xtra-border rounded-lg focus:ring-2 focus:ring-xtra-primary focus:border-transparent text-xtra-dark placeholder-gray-400"
                      value={amountGHS}
                      onChange={(e) => {
                        const ghs = parseFloat(e.target.value) || 0;
                        setAmount(Math.round((ghs / exchangeRate) * 100).toString());
                      }}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      {isFetchingRate ? (
                        <>
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                          <span>Updating rate…</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>1 USD = {exchangeRate.toFixed(2)} GHS</span>
                        </>
                      )}
                    </div>
                    <span className="text-gray-400">≈ ${amountUSD.toFixed(2)} USD</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3 pt-1">
                  <button
                    type="submit"
                    className="w-full bg-xtra-primary hover:bg-xtra-primary/90 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 sm:gap-3 group disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    disabled={loading}
                  >
                    {loading ? <KedLoader size="small" /> : (
                      <>
                        Proceed to Hubtel Checkout
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-50 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full bg-white hover:bg-gray-50 text-xtra-dark font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg border-2 border-xtra-border hover:border-xtra-primary transition-all active:scale-[0.98] text-sm sm:text-base"
                  >
                    Pay Later
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 pt-1">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-xtra-primary" />
                  <span className="text-xs sm:text-sm font-semibold text-xtra-dark">Bank-Grade Security via Hubtel</span>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              className="text-center py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="relative inline-block mb-6 sm:mb-8">
                <div className="absolute inset-0 bg-xtra-primary/20 blur-2xl sm:blur-3xl rounded-full scale-150 animate-pulse" />
                <CheckCircle2 className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-xtra-primary mx-auto" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-xtra-dark mb-3 sm:mb-4">Contribution Received</h2>
              <p className="text-gray-600 text-base sm:text-lg mb-8 sm:mb-10 max-w-sm mx-auto">
                Thank you for your partnership!<br />
                ₵{amountGHS} GHS (≈ ${amountUSD.toFixed(2)} USD) has been processed successfully.
              </p>
              <button
                onClick={onClose}
                className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-xtra-primary hover:bg-xtra-primary/90 text-white font-bold rounded-lg transition-all text-sm sm:text-base"
              >
                Return to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PaymentModal;
