import React, { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import KedLoader from '../KedLoader';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
 
  ArrowRight,
  Heart,
  Globe
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAmount?: string;
  userEmail?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, defaultAmount = '5000', userEmail = '' }) => {
  const [email, setEmail] = useState(userEmail);
  const [amount, setAmount] = useState(defaultAmount); // Amount in Pesewas (5000 = 50.00 GHS)
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // The config needs to recalculate automatically when email or amount state changes
  const config = {
    reference: (new Date()).getTime().toString(),
    email: email,
    amount: parseInt(amount), // Paystack requires lowest unit (pesewas/kobo)
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
    currency: 'GHS',
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = async (reference: any) => {
    setLoading(true);
    // Record payment in Supabase
    const { error } = await supabase
      .from('payments')
      .insert([{ 
          email: email, 
          amount: parseInt(amount) / 100, 
          reference: reference.reference,
          currency: 'GHS',
          status: 'success',
          created_at: new Date()
      }]);

    if (error) {
      console.error('Error logging payment:', error);
    }

    setLoading(false);
    setSuccess(true);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !amount) return;
    
    setLoading(true);

    // Call the Paystack pop up directly with fresh config.
    initializePayment({
      config: {
        ...config,
        amount: parseInt(amount), // ensure fresh state 
        email: email,
      },
      onSuccess: onSuccess,
      onClose: () => setLoading(false)
    });
  };

  // Sync incoming props to state if they change while modal is unmounted/mounting
  React.useEffect(() => {
    if (isOpen) {
      setEmail(userEmail || '');
      setAmount(defaultAmount || '5000');
    }
  }, [isOpen, userEmail, defaultAmount]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0  backdrop-blur-md"
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-md sm:max-w-lg lg:max-w-2xl bg-white rounded-2xl shadow-2xl relative overflow-hidden z-10 border border-xtra-border"
      >
        {/* Header Bar */}
        <div className="bg-xtra-primary px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold text-lg sm:text-xl lg:text-2xl">Secure Payment</h3>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header */}
              <div className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="p-3 sm:p-4 bg-xtra-primary/10 rounded-xl sm:rounded-2xl border border-xtra-primary/20">
                    <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-xtra-primary" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-xtra-dark mb-1">Partner with KED</h2>
                    <p className="text-xs sm:text-sm text-xtra-primary font-semibold uppercase tracking-wide flex items-center justify-center sm:justify-start gap-2">
                      <Globe className="w-3 h-3 sm:w-4 sm:h-4" /> Secure Payment • GHS
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePayment} className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 lg:pb-10">
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-xs sm:text-sm font-bold text-xtra-dark uppercase tracking-wide">Your Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-xtra-border rounded-lg focus:ring-2 focus:ring-xtra-primary focus:border-transparent text-xtra-dark placeholder-gray-400"
                    placeholder="partner@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <label className="text-xs sm:text-sm font-bold text-xtra-dark uppercase tracking-wide">Contribution Amount (GHS)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg sm:text-xl font-bold text-xtra-primary">¢</span>
                    <input
                      type="number"
                      className="w-full pl-10 sm:pl-12 pr-4 py-3 border border-xtra-border rounded-lg focus:ring-2 focus:ring-xtra-primary focus:border-transparent text-xtra-dark placeholder-gray-400"
                      value={parseInt(amount) / 100}
                      onChange={(e) => setAmount((parseFloat(e.target.value) * 100).toString())}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <button 
                    type="submit" 
                    className="w-full bg-xtra-primary hover:bg-xtra-primary/90 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 sm:gap-3 group disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    disabled={loading}
                  >
                    {loading ? <KedLoader size="small" /> : (
                      <>
                        Authorize Contribution <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-50 group-hover:translate-x-1 transition-transform" />
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

                <div className="flex items-center justify-center gap-2 sm:gap-3 pt-2 sm:pt-4">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-xtra-primary" />
                  <span className="text-xs sm:text-sm font-semibold text-xtra-dark">Bank-Grade Security via Paystack</span>
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
                Thank you for your partnership! <br /> ₵{parseInt(amount) / 100} has been processed successfully.
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
