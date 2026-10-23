'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Sparkles, Shield, Zap, ArrowRight, CheckCircle2, HeartHandshake } from 'lucide-react';
import { useApp } from '@/lib/store';
import { SUBSCRIPTION_PLANS } from '@/lib/mockData';

export default function SubscriptionPage() {
  const router = useRouter();
  const { subscription, subscribeToPlan } = useApp();
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleSelectPlan = (planId: 'basic' | 'standard' | 'premium', planName: string) => {
    subscribeToPlan(planId);
    setSuccessToast(`Subscribed to ${planName}! 30-day membership activated.`);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3500);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Toast */}
      {successToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#10B981] text-white text-xs px-4 py-2.5 rounded-full shadow-xl font-bold flex items-center space-x-2 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center space-x-1 bg-[#FFEADF] text-[#FF6B35] px-3 py-0.5 rounded-full text-xs font-bold">
          <span>👑</span>
          <span>Monthly Care Packages</span>
        </div>
        <h1 className="text-xl font-black text-[#2D2D2D]">Peace of Mind for Working Dog Parents</h1>
        <p className="text-xs text-brand-muted">
          Save up to 40% per walk, get priority pal matching, and scheduled daily exercise
        </p>
      </div>

      {/* Active Plan Banner if active */}
      {subscription && (
        <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF885B] p-4 rounded-3xl text-white shadow-warm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded-full inline-block">
                Active Subscription
              </div>
              <h3 className="text-base font-black mt-1">{subscription.plan_name}</h3>
              <p className="text-xs text-white/90 mt-0.5">
                {subscription.walks_remaining} of {subscription.walks_total} walks remaining • Valid until {subscription.active_until}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black">
              ⭐
            </div>
          </div>
        </div>
      )}

      {/* 3 Plan Cards Stacked Vertically */}
      <div className="space-y-4">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrent = subscription?.plan_id === plan.id;
          const isPopular = plan.is_popular;

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl p-5 border-2 transition-all relative shadow-sm ${
                isPopular
                  ? 'border-[#FF6B35] ring-2 ring-[#FF6B35]/20'
                  : 'border-[#F0E4D7] hover:border-gray-300'
              }`}
            >
              {/* Most Popular Badge */}
              {isPopular && (
                <div className="absolute -top-3 right-5 bg-[#FF6B35] text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Most Popular</span>
                </div>
              )}

              {/* Plan Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-extrabold text-[#2D2D2D]">{plan.name}</h3>
                  <p className="text-xs text-brand-muted mt-0.5">
                    {plan.walks_count} walks / month • {plan.duration_per_walk} min each
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-[#2D2D2D]">₹{plan.price_inr}</div>
                  <div className="text-[10px] text-gray-400">/ month</div>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2 pt-3 pb-4 border-t border-gray-100 mt-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-gray-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleSelectPlan(plan.id, plan.name)}
                className={`w-full py-3 rounded-full text-xs font-extrabold flex items-center justify-center space-x-2 active:scale-98 transition-all ${
                  isCurrent
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : isPopular
                    ? 'bg-[#FF6B35] hover:bg-[#E85924] text-white shadow-warm'
                    : 'bg-[#2D2D2D] hover:bg-black text-white'
                }`}
              >
                {isCurrent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Current Active Plan ✓</span>
                  </>
                ) : (
                  <>
                    <span>Choose Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Society Assurance */}
      <div className="bg-[#FFF9F5] p-4 rounded-3xl border border-[#F0E4D7] text-center space-y-1 text-xs text-gray-600">
        <div className="font-bold text-[#2D2D2D] flex items-center justify-center space-x-1">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>100% Refund Guarantee</span>
        </div>
        <p className="text-[11px] text-brand-muted">
          Unused walks roll over to next month if renewed. Cancel anytime in one click.
        </p>
      </div>
    </div>
  );
}
