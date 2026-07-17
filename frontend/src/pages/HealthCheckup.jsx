import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, ArrowRight, ArrowLeft, Activity, Scale, Ruler,
  User, Calendar, Zap, AlertTriangle, CheckCircle, Brain,
  Droplets, Moon, Wind, Utensils, ChevronRight, Sparkles
} from 'lucide-react';

const STEPS = ['basics', 'body', 'lifestyle', 'symptoms', 'results'];

const SYMPTOM_KEYS = [
  { id: 'fatigue', key: 'symptomFatigue', icon: <Moon size={18} /> },
  { id: 'digestion', key: 'symptomDigestion', icon: <Utensils size={18} /> },
  { id: 'stress', key: 'symptomStress', icon: <Brain size={18} /> },
  { id: 'sleep', key: 'symptomSleep', icon: <Moon size={18} /> },
  { id: 'joint_pain', key: 'symptomJointPain', icon: <Activity size={18} /> },
  { id: 'skin', key: 'symptomSkin', icon: <Droplets size={18} /> },
  { id: 'breathing', key: 'symptomBreathing', icon: <Wind size={18} /> },
  { id: 'headache', key: 'symptomHeadache', icon: <Brain size={18} /> },
  { id: 'weight_gain', key: 'symptomWeightGain', icon: <Scale size={18} /> },
  { id: 'hormonal', key: 'symptomHormonal', icon: <Zap size={18} /> },
  { id: 'diabetes', key: 'symptomDiabetes', icon: <Droplets size={18} /> },
  { id: 'bp', key: 'symptomBP', icon: <Heart size={18} /> },
];

function calculateBMI(weight, heightCm) {
  const heightM = heightCm / 100;
  return (weight / (heightM * heightM)).toFixed(1);
}

function getBMICategoryKey(bmi) {
  if (bmi < 18.5) return { key: 'underweight', color: '#3b82f6', bg: '#eff6ff', gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)' };
  if (bmi < 25) return { key: 'normal', color: '#16a34a', bg: '#f0fdf4', gradient: 'linear-gradient(135deg, #16a34a, #4ade80)' };
  if (bmi < 30) return { key: 'overweight', color: '#ea580c', bg: '#fff7ed', gradient: 'linear-gradient(135deg, #ea580c, #fb923c)' };
  return { key: 'obese', color: '#dc2626', bg: '#fef2f2', gradient: 'linear-gradient(135deg, #dc2626, #f87171)' };
}

function calculateBMR(weight, heightCm, age, gender) {
  if (gender === 'male') return Math.round(88.362 + (13.397 * weight) + (4.799 * heightCm) - (5.677 * age));
  return Math.round(447.593 + (9.247 * weight) + (3.098 * heightCm) - (4.330 * age));
}

function getIdealWeight(heightCm, gender) {
  const heightInches = heightCm / 2.54;
  const base = gender === 'male' ? 50 : 45.5;
  const ideal = base + 2.3 * (heightInches - 60);
  return { min: Math.round(ideal * 0.9), max: Math.round(ideal * 1.1), ideal: Math.round(ideal) };
}

function calculateHealthScore(bmi, symptoms, activityLevel, sleepHours, waterIntake) {
  let score = 100;
  const bmiVal = parseFloat(bmi);
  if (bmiVal < 18.5 || bmiVal >= 30) score -= 25;
  else if (bmiVal >= 25) score -= 15;
  else if (bmiVal < 20) score -= 5;
  score -= symptoms.length * 3;
  if (activityLevel === 'sedentary') score -= 15;
  else if (activityLevel === 'light') score -= 8;
  if (sleepHours < 6) score -= 10;
  else if (sleepHours < 7) score -= 5;
  if (waterIntake < 4) score -= 10;
  else if (waterIntake < 6) score -= 5;
  return Math.max(0, Math.min(100, score));
}

function getScoreLabelKey(score) {
  if (score >= 80) return { key: 'excellent', color: '#16a34a', emoji: '💚' };
  if (score >= 60) return { key: 'good', color: '#22c55e', emoji: '🟢' };
  if (score >= 40) return { key: 'fair', color: '#ea580c', emoji: '🟠' };
  if (score >= 20) return { key: 'needsAttention', color: '#dc2626', emoji: '🔴' };
  return { key: 'critical', color: '#7f1d1d', emoji: '🚨' };
}

export default function HealthCheckup() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState({
    age: '', gender: 'male', weight: '', height: '',
    activityLevel: 'sedentary', sleepHours: '7', waterIntake: '6', symptoms: [],
  });

  const canProceed = () => {
    if (currentStep === 0) return form.age && form.gender;
    if (currentStep === 1) return form.weight && form.height;
    return true;
  };

  const next = () => { if (canProceed() && currentStep < STEPS.length - 1) setCurrentStep(c => c + 1); };
  const back = () => { if (currentStep > 0) setCurrentStep(c => c - 1); };
  const toggleSymptom = (id) => {
    setForm(f => ({ ...f, symptoms: f.symptoms.includes(id) ? f.symptoms.filter(s => s !== id) : [...f.symptoms, id] }));
  };

  const bmi = form.weight && form.height ? calculateBMI(parseFloat(form.weight), parseFloat(form.height)) : null;
  const bmiCat = bmi ? getBMICategoryKey(parseFloat(bmi)) : null;
  const bmr = form.weight && form.height && form.age ? calculateBMR(parseFloat(form.weight), parseFloat(form.height), parseInt(form.age), form.gender) : null;
  const idealWeight = form.height ? getIdealWeight(parseFloat(form.height), form.gender) : null;
  const healthScore = bmi ? calculateHealthScore(bmi, form.symptoms, form.activityLevel, parseInt(form.sleepHours), parseInt(form.waterIntake)) : 0;
  const scoreInfo = getScoreLabelKey(healthScore);
  const activityMultipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
  const dailyCalories = bmr ? Math.round(bmr * (activityMultipliers[form.activityLevel] || 1.2)) : null;
  const progressWidth = ((currentStep) / (STEPS.length - 1)) * 100;

  const h = t('healthCheckup', { returnObjects: true });

  return (
    <div style={{ minHeight: '80vh', padding: '40px 16px 80px' }}>
      <Helmet><title>{h.title} - Jivhala Wellness</title></Helmet>

      <div style={{ maxWidth: '660px', margin: '0 auto' }}>
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', color: '#006400', padding: '8px 20px', borderRadius: '99px', fontSize: '12px', fontWeight: 700, marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.06em', border: '1px solid #bbf7d0' }}>
            <Heart size={14} /> {h.badge}
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#111827', marginBottom: '10px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            {h.title}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '15px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            {h.subtitle}
          </p>
        </motion.div>

        {/* Progress */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            {STEPS.map((s, i) => (
              <button key={s} onClick={() => { if (i < currentStep) setCurrentStep(i); }}
                style={{ fontSize: '11px', fontWeight: 700, color: i <= currentStep ? '#006400' : '#c0c0c0', cursor: i < currentStep ? 'pointer' : 'default', background: 'none', border: 'none', padding: '4px 8px', borderRadius: '6px', transition: 'all 0.2s', letterSpacing: '0.03em' }}>
                {h.steps[s]}
              </button>
            ))}
          </div>
          <div style={{ width: '100%', height: '5px', background: '#e5e7eb', borderRadius: '99px', overflow: 'hidden' }}>
            <motion.div animate={{ width: `${progressWidth}%` }} transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #006400, #16a34a, #4ade80)', borderRadius: '99px' }} />
          </div>
        </div>

        {/* Card */}
        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e5e7eb', padding: '36px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', minHeight: '360px' }}>
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>

              {/* STEP 0: Basics */}
              {currentStep === 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={18} style={{ color: '#006400' }} />
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827' }}>{h.basicsTitle}</h2>
                  </div>
                  <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '28px', marginLeft: '46px' }}>{h.basicsDesc}</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h.age}</label>
                      <input type="number" min="10" max="120" placeholder={h.agePlaceholder} value={form.age} onChange={e => setForm({ ...form, age: e.target.value })}
                        className="health-input" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h.gender}</label>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {['male', 'female'].map(g => (
                          <button key={g} type="button" onClick={() => setForm({ ...form, gender: g })}
                            style={{ flex: 1, padding: '14px', borderRadius: '14px', border: `2px solid ${form.gender === g ? '#006400' : '#e5e7eb'}`, background: form.gender === g ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)' : 'white', color: form.gender === g ? '#006400' : '#6b7280', fontWeight: 700, fontSize: '14px', cursor: 'pointer', transition: 'all 0.25s', transform: form.gender === g ? 'scale(1.02)' : 'scale(1)' }}>
                            {h[g]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 1: Body */}
              {currentStep === 1 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Scale size={18} style={{ color: '#3b82f6' }} />
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827' }}>{h.bodyTitle}</h2>
                  </div>
                  <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '28px', marginLeft: '46px' }}>{h.bodyDesc}</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h.weight}</label>
                        <input type="number" step="0.1" min="20" max="300" placeholder={h.weightPlaceholder} value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} className="health-input" />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h.height}</label>
                        <input type="number" min="100" max="250" placeholder={h.heightPlaceholder} value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} className="health-input" />
                      </div>
                    </div>
                    {bmi && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ padding: '20px 24px', borderRadius: '16px', background: `linear-gradient(135deg, ${bmiCat.bg}, white)`, border: `2px solid ${bmiCat.color}22`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h.liveBMI}</span>
                          <p style={{ fontSize: '32px', fontWeight: 800, color: bmiCat.color, lineHeight: 1.1 }}>{bmi}</p>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'white', background: bmiCat.gradient, padding: '6px 16px', borderRadius: '99px', boxShadow: `0 2px 8px ${bmiCat.color}33` }}>
                          {h[bmiCat.key]}
                        </span>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: Lifestyle */}
              {currentStep === 2 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Zap size={18} style={{ color: '#d97706' }} />
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827' }}>{h.lifestyleTitle}</h2>
                  </div>
                  <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '28px', marginLeft: '46px' }}>{h.lifestyleDesc}</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h.activityLevel}</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {[
                          { id: 'sedentary', labelKey: 'sedentary', descKey: 'sedentaryDesc', emoji: '🪑' },
                          { id: 'light', labelKey: 'light', descKey: 'lightDesc', emoji: '🚶' },
                          { id: 'moderate', labelKey: 'moderate', descKey: 'moderateDesc', emoji: '🏋️' },
                          { id: 'active', labelKey: 'active', descKey: 'activeDesc', emoji: '🏃' },
                        ].map(opt => {
                          const sel = form.activityLevel === opt.id;
                          return (
                            <button key={opt.id} type="button" onClick={() => setForm({ ...form, activityLevel: opt.id })}
                              style={{ padding: '14px', borderRadius: '14px', border: `2px solid ${sel ? '#006400' : '#e5e7eb'}`, background: sel ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)' : 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.25s', transform: sel ? 'scale(1.02)' : 'scale(1)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '18px' }}>{opt.emoji}</span>
                                <p style={{ fontWeight: 700, fontSize: '13px', color: sel ? '#006400' : '#374151' }}>{h[opt.labelKey]}</p>
                              </div>
                              <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px', marginLeft: '26px' }}>{h[opt.descKey]}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h.sleepHours}</label>
                        <input type="number" min="1" max="14" value={form.sleepHours} onChange={e => setForm({ ...form, sleepHours: e.target.value })} className="health-input" />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h.waterGlasses}</label>
                        <input type="number" min="0" max="20" value={form.waterIntake} onChange={e => setForm({ ...form, waterIntake: e.target.value })} className="health-input" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Symptoms */}
              {currentStep === 3 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AlertTriangle size={18} style={{ color: '#dc2626' }} />
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827' }}>{h.symptomsTitle}</h2>
                  </div>
                  <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '24px', marginLeft: '46px' }}>{h.symptomsDesc}</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {SYMPTOM_KEYS.map(sym => {
                      const selected = form.symptoms.includes(sym.id);
                      return (
                        <button key={sym.id} type="button" onClick={() => toggleSymptom(sym.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '12px', border: `2px solid ${selected ? '#006400' : '#e5e7eb'}`, background: selected ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)' : 'white', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', transform: selected ? 'scale(1.02)' : 'scale(1)' }}>
                          <span style={{ color: selected ? '#006400' : '#9ca3af', flexShrink: 0 }}>{sym.icon}</span>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: selected ? '#006400' : '#374151' }}>{h[sym.key]}</span>
                        </button>
                      );
                    })}
                  </div>
                  {form.symptoms.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '12px', marginTop: '18px', fontStyle: 'italic' }}>{h.noConcerns}</p>
                  )}
                </div>
              )}

              {/* STEP 4: Results */}
              {currentStep === 4 && (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Sparkles size={20} style={{ color: '#006400' }} /> {h.resultsTitle}
                    </h2>
                    <p style={{ color: '#9ca3af', fontSize: '13px' }}>{h.resultsDesc}</p>
                  </div>

                  {/* Health Score */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                    <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                      <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', filter: `drop-shadow(0 4px 12px ${scoreInfo.color}33)` }}>
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f3f4f6" strokeWidth="2.5" />
                        <motion.path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={scoreInfo.color} strokeWidth="2.5"
                          initial={{ strokeDasharray: '0, 100' }} animate={{ strokeDasharray: `${healthScore}, 100` }} transition={{ duration: 1.2, ease: 'easeOut' }}
                          strokeLinecap="round" />
                      </svg>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}
                          style={{ fontSize: '36px', fontWeight: 800, color: scoreInfo.color }}>{healthScore}</motion.span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: scoreInfo.color }}>{h[scoreInfo.key]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                    {[
                      { label: h.bmi, value: bmi, sub: h[bmiCat.key], subColor: bmiCat.color, bg: bmiCat.bg },
                      { label: h.bmr, value: bmr, sub: h.calPerDay, subColor: '#6b7280', bg: '#f9fafb' },
                      { label: h.dailyNeed, value: dailyCalories, sub: h.calPerDay, subColor: '#6b7280', bg: '#f9fafb' },
                    ].map((m, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                        style={{ background: m.bg, borderRadius: '16px', padding: '18px 14px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                        <p style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.label}</p>
                        <p style={{ fontSize: '26px', fontWeight: 800, color: m.subColor !== '#6b7280' ? m.subColor : '#111827' }}>{m.value}</p>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: m.subColor, background: m.subColor !== '#6b7280' ? 'white' : 'transparent', padding: m.subColor !== '#6b7280' ? '2px 10px' : '0', borderRadius: '99px' }}>{m.sub}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Ideal Weight */}
                  {idealWeight && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                      style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: '16px', padding: '18px 24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #bbf7d0' }}>
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h.idealWeightRange}</p>
                        <p style={{ fontSize: '22px', fontWeight: 800, color: '#006400' }}>{idealWeight.min} - {idealWeight.max} <span style={{ fontSize: '13px', fontWeight: 500 }}>kg</span></p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h.current}</p>
                        <p style={{ fontSize: '22px', fontWeight: 800, color: parseFloat(form.weight) > idealWeight.max ? '#ea580c' : '#006400' }}>{form.weight} <span style={{ fontSize: '13px', fontWeight: 500 }}>kg</span></p>
                      </div>
                    </motion.div>
                  )}

                  {/* Recommendations */}
                  <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '22px', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '14px' }}>{h.recommendations}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {parseFloat(bmi) >= 25 && <RecCard icon={<Scale size={16} />} text={h.recOverweight} color="#ea580c" bg="#fff7ed" border="#fed7aa" />}
                      {parseFloat(bmi) < 18.5 && <RecCard icon={<Scale size={16} />} text={h.recUnderweight} color="#3b82f6" bg="#eff6ff" border="#bfdbfe" />}
                      {form.activityLevel === 'sedentary' && <RecCard icon={<Activity size={16} />} text={h.recSedentary} color="#d97706" bg="#fef3c7" border="#fde68a" />}
                      {parseInt(form.sleepHours) < 7 && <RecCard icon={<Moon size={16} />} text={h.recSleep} color="#7c3aed" bg="#f5f3ff" border="#ddd6fe" />}
                      {parseInt(form.waterIntake) < 6 && <RecCard icon={<Droplets size={16} />} text={h.recWater} color="#3b82f6" bg="#eff6ff" border="#bfdbfe" />}
                      {form.symptoms.length > 0 && <RecCard icon={<AlertTriangle size={16} />} text={h.recSymptoms} color="#dc2626" bg="#fef2f2" border="#fecaca" />}
                      {healthScore >= 80 && form.symptoms.length === 0 && <RecCard icon={<CheckCircle size={16} />} text={h.recHealthy} color="#16a34a" bg="#f0fdf4" border="#bbf7d0" />}
                    </div>
                  </div>

                  {/* CTA */}
                  <Link to="/register"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '16px', borderRadius: '16px', background: 'linear-gradient(135deg, #006400, #16a34a)', color: 'white', fontWeight: 700, fontSize: '15px', textDecoration: 'none', transition: 'all 0.3s', boxShadow: '0 4px 20px rgba(0,100,0,0.3)', letterSpacing: '0.02em' }}>
                    {h.bookConsultation} <ChevronRight size={18} />
                  </Link>
                  <button onClick={() => { setCurrentStep(0); setForm({ age: '', gender: 'male', weight: '', height: '', activityLevel: 'sedentary', sleepHours: '7', waterIntake: '6', symptoms: [] }); }}
                    style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: '14px', fontSize: '13px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: '8px' }}>
                    {h.retake}
                  </button>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav Buttons */}
        {currentStep < 4 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '22px', gap: '12px' }}>
            {currentStep > 0 ? (
              <button onClick={back}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '13px 24px', borderRadius: '14px', border: '2px solid #e5e7eb', background: 'white', color: '#6b7280', cursor: 'pointer', fontWeight: 600, fontSize: '14px', transition: 'all 0.2s' }}>
                <ArrowLeft size={16} /> {h.back}
              </button>
            ) : <div />}
            <button onClick={next} disabled={!canProceed()}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '13px 32px', borderRadius: '14px', border: 'none', background: canProceed() ? 'linear-gradient(135deg, #006400, #16a34a)' : '#d1d5db', color: 'white', cursor: canProceed() ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: '14px', transition: 'all 0.3s', boxShadow: canProceed() ? '0 4px 14px rgba(0,100,0,0.25)' : 'none' }}>
              {currentStep === 3 ? h.seeResults : h.next} <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        .health-input {
          width: 100%; padding: 13px 16px; border-radius: 14px; border: 2px solid #e5e7eb;
          font-size: 15px; outline: none; box-sizing: border-box; transition: all 0.25s;
          background: #f9fafb; font-family: inherit; font-weight: 500; color: #111827;
        }
        .health-input:focus {
          border-color: #006400; background: white; box-shadow: 0 0 0 4px rgba(0,100,0,0.08);
        }
        .health-input::placeholder { color: #c0c0c0; }
      `}</style>
    </div>
  );
}

function RecCard({ icon, text, color, bg, border }) {
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
      style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '14px 18px', background: bg, borderRadius: '14px', border: `1px solid ${border}` }}>
      <span style={{ color, marginTop: '2px', flexShrink: 0 }}>{icon}</span>
      <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>{text}</p>
    </motion.div>
  );
}
