'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, ShieldCheck, CheckCircle, KeyRound, Sparkles } from 'lucide-react';
import { useApp } from '@/lib/store';
import { UserRole } from '@/lib/types';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get('role') as UserRole | null;

  const { loginWithOtp } = useApp();

  // 3-step state: 1 = Phone, 2 = OTP, 3 = Role Selection
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRoleParam || 'owner');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(2);
      setOtp('123456');
    }, 400);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const res = loginWithOtp(phone, otp, selectedRole);

      if (!res.success) {
        setErrorMsg(res.message || 'Verification failed. Please use demo OTP: 123456');
        return;
      }

      if (res.user?.is_onboarded) {
        if (res.user.role === 'pal') router.push('/dashboard/pal');
        else if (res.user.role === 'admin') router.push('/admin');
        else router.push('/dashboard/owner');
      } else {
        setStep(3);
      }
    }, 400);
  };

  // Step 3: Choose Role & Navigate
  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'owner') {
      router.push('/onboarding/owner');
    } else {
      router.push('/onboarding/pal');
    }
  };

  return (
    <div className="space-y-6 pt-2 pb-8">
      {/* Title & Progress Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FFEADF] text-[#FF6B35] text-2xl font-bold mb-2 shadow-xs">
          🐾
        </div>
        <h1 className="text-xl font-black text-[#2D2D2D]">
          {step === 1 && 'Welcome to PetPal India'}
          {step === 2 && 'Verify Your Phone'}
          {step === 3 && 'Choose Your Journey'}
        </h1>
        <p className="text-xs text-brand-muted">
          {step === 1 && 'Enter your 10-digit mobile number to get started'}
          {step === 2 && `Sent 6-digit OTP to +91 ${phone}`}
          {step === 3 && 'Tell us how you would like to experience PetPal'}
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-2 pt-2">
          <div className={`h-1.5 rounded-full transition-all ${step >= 1 ? 'w-8 bg-[#FF6B35]' : 'w-3 bg-gray-200'}`} />
          <div className={`h-1.5 rounded-full transition-all ${step >= 2 ? 'w-8 bg-[#FF6B35]' : 'w-3 bg-gray-200'}`} />
          <div className={`h-1.5 rounded-full transition-all ${step === 3 ? 'w-8 bg-[#FF6B35]' : 'w-3 bg-gray-200'}`} />
        </div>
      </div>

      {/* Demo helper banner */}
      <div className="bg-[#FFF3E6] border border-[#FFD8B5] p-3 rounded-2xl flex items-center space-x-2.5">
        <Sparkles className="w-5 h-5 text-[#FF6B35] shrink-0" />
        <div className="text-xs text-[#2D2D2D]">
          <span className="font-bold text-[#FF6B35]">Instant Demo Mode:</span> Use any 10-digit phone. OTP is always <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-[#FFB885]">123456</span>.
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* STEP 1: Phone Input */}
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4 bg-white p-5 rounded-3xl border border-[#F0E4D7] shadow-sm">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">Mobile Phone Number</label>
            <div className="flex items-center border-2 border-gray-200 focus-within:border-[#FF6B35] rounded-2xl px-3.5 py-2.5 bg-gray-50/50 transition-colors">
              <span className="text-xs font-bold text-gray-600 mr-2 flex items-center">
                <span className="mr-1">🇮🇳</span> +91
              </span>
              <span className="text-gray-300 mr-2.5">|</span>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                className="w-full bg-transparent text-sm font-semibold text-[#2D2D2D] outline-none placeholder:text-gray-400"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-brand-muted">We will send a 6-digit confirmation code via SMS</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || phone.length < 10}
            className="w-full bg-[#FF6B35] hover:bg-[#E85924] disabled:opacity-50 text-white font-bold py-3.5 rounded-full shadow-warm text-sm flex items-center justify-center space-x-2 active:scale-98 transition-all"
          >
            <span>{isSubmitting ? 'Sending Code...' : 'Send OTP'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* STEP 2: OTP Input */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4 bg-white p-5 rounded-3xl border border-[#F0E4D7] shadow-sm">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700">Enter 6-Digit OTP</label>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[11px] text-[#FF6B35] font-semibold hover:underline"
              >
                Change Number
              </button>
            </div>

            <div className="flex items-center border-2 border-[#FF6B35] rounded-2xl px-3.5 py-2.5 bg-[#FFF9F5]">
              <KeyRound className="w-4 h-4 text-[#FF6B35] mr-2 shrink-0" />
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full bg-transparent text-lg font-mono font-bold tracking-widest text-[#2D2D2D] outline-none text-center"
                autoFocus
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-brand-muted pt-1">
              <span>Demo OTP: <strong>123456</strong></span>
              <button
                type="button"
                onClick={() => setOtp('123456')}
                className="text-[#FF6B35] font-bold"
              >
                Autofill OTP
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || otp.length !== 6}
            className="w-full bg-[#FF6B35] hover:bg-[#E85924] disabled:opacity-50 text-white font-bold py-3.5 rounded-full shadow-warm text-sm flex items-center justify-center space-x-2 active:scale-98 transition-all"
          >
            <span>{isSubmitting ? 'Verifying...' : 'Verify OTP'}</span>
            <CheckCircle className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* STEP 3: Role Selection */}
      {step === 3 && (
        <div className="space-y-3">
          <div className="text-center pb-1">
            <p className="text-xs font-bold text-gray-700">Select which role best fits you:</p>
          </div>

          <button
            onClick={() => handleSelectRole('owner')}
            className="w-full p-4 rounded-3xl border-2 border-[#FFD2BE] hover:border-[#FF6B35] bg-white hover:bg-[#FFF9F5] text-left transition-all shadow-subtle group"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FFEADF] text-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                🐕
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-[#2D2D2D]">I Have a Pet</h3>
                  <span className="text-xs font-bold text-[#FF6B35] bg-[#FFEADF] px-2 py-0.5 rounded-full">
                    Pet Owner
                  </span>
                </div>
                <p className="text-xs text-brand-muted mt-1 leading-snug">
                  I live in a gated society and want trusted, verified companions to walk, play, and care for my dog.
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleSelectRole('pal')}
            className="w-full p-4 rounded-3xl border-2 border-[#E5E7EB] hover:border-[#FF6B35] bg-white hover:bg-[#FFF9F5] text-left transition-all shadow-subtle group"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF1D6] text-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                ❤️
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-[#2D2D2D]">I Want a Pet Pal</h3>
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Walker / Student
                  </span>
                </div>
                <p className="text-xs text-brand-muted mt-1 leading-snug">
                  I am a college student or young professional who loves dogs. I want to walk dogs, earn 75% per walk, and make furry friends!
                </p>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Safety & Trust Note */}
      <div className="pt-4 text-center">
        <div className="inline-flex items-center space-x-1 text-[11px] text-gray-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Government ID & Society Verification Required</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading PetPal Login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
