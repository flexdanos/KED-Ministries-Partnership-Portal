import React, { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2, 
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

  const config = {
    reference: (new Date()).getTime().toString(),
    email: email,
    amount: parseInt(amount), // Paystack expects lowest unit (pesewas/kobo)
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
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
    // @ts-ignore
    initializePayment(onSuccess, () => setLoading(false));
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="glass-card w-full max-w-2xl relative overflow-hidden p-8 sm:p-12 z-10"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header */}
              <div className="flex items-center gap-6 mb-10">
                <div className="p-4 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
                  <Heart className="w-8 h-8 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tighter mb-1">Partner with KED</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Globe className="w-3 h-3" /> Secure Payment • GHS
                  </p>
                </div>
              </div>

              <form onSubmit={handlePayment} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-500 ml-1">Your Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="partner@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-500 ml-1">Contribution Amount (GHS)</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-black text-indigo-400/50">₵</span>
                    <input
                      type="number"
                      className="form-input pl-12"
                      value={parseInt(amount) / 100}
                      onChange={(e) => setAmount((parseFloat(e.target.value) * 100).toString())}
                      required
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 px-8 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="animate-spin w-6 h-6" /> : (
                      <>
                        Authorize Contribution <ArrowRight className="w-5 h-5 opacity-50 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-3 pt-4 opacity-40">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-white">Bank-Grade Security via Paystack</span>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="success" 
              className="text-center py-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                <CheckCircle2 className="relative w-24 h-24 text-emerald-400 mx-auto" />
              </div>
              <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Contribution Received</h2>
              <p className="text-gray-400 text-lg mb-10 max-w-sm mx-auto">
                Thank you for your partnership! <br /> ₵{parseInt(amount) / 100} has been processed successfully.
              </p>
              <button 
                onClick={onClose}
                className="px-10 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl transition-all"
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
