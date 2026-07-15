import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';
import { Leaf, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  mobile_number: z.string().min(10, 'Mobile number must be at least 10 digits'),
  consent_given: z.boolean().refine(val => val === true, {
    message: 'You must agree to be contacted.',
  }),
});

export default function Register() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      mobile_number: '',
      consent_given: false,
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // If email is empty string, convert to null for the backend
      const payload = { ...data };
      if (!payload.email) payload.email = null;

      await axios.post(`${API_BASE_URL}/api/v1/leads/`, payload);
      setIsSuccess(true);
      toast.success('Consultation requested successfully!');
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 409) {
        toast.error('A request with this mobile number already exists.');
      } else {
        toast.error('Failed to submit request. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 text-[#006400] rounded-full flex items-center justify-center mb-6">
          <Leaf size={40} />
        </div>
        <h2 className="text-3xl font-bold mb-4">Request Received</h2>
        <p className="text-[#4a4a4a] mb-8 max-w-md mx-auto leading-relaxed">
          Thank you for reaching out. One of our expert wellness coaches will contact you shortly to schedule your free consultation.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="text-[#006400] font-semibold flex items-center gap-2 hover:underline"
        >
          Return to Home <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-md mx-auto">
      <Helmet>
        <title>Book Consultation - Jivhala</title>
      </Helmet>

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-3 tracking-tight">Begin Your Journey</h1>
        <p className="text-[#4a4a4a] text-sm">
          Fill out the form below to book a free holistic wellness consultation.
        </p>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit(onSubmit)} 
        className="flex flex-col gap-5"
      >
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-800">Full Name</label>
          <input 
            {...register('name')} 
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#006400]/20 focus:border-[#006400] transition-all"
            placeholder="Jane Doe"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-800">Mobile Number</label>
          <input 
            {...register('mobile_number')} 
            type="tel"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#006400]/20 focus:border-[#006400] transition-all"
            placeholder="+1 234 567 8900"
          />
          {errors.mobile_number && <p className="text-red-500 text-xs mt-1">{errors.mobile_number.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-800">Email (Optional)</label>
          <input 
            {...register('email')} 
            type="email"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#006400]/20 focus:border-[#006400] transition-all"
            placeholder="jane@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="flex items-start gap-3 mt-2">
          <input 
            type="checkbox" 
            {...register('consent_given')} 
            id="consent"
            className="mt-1 w-4 h-4 text-[#006400] rounded border-gray-300 focus:ring-[#006400]"
          />
          <label htmlFor="consent" className="text-xs text-gray-600 leading-relaxed">
            I agree to be contacted by Jivhala Wellness Center via phone or email regarding my consultation. I understand that individual results vary.
          </label>
        </div>
        {errors.consent_given && <p className="text-red-500 text-xs">{errors.consent_given.message}</p>}

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="mt-4 bg-[#006400] hover:bg-[#004d00] text-white w-full py-4 rounded-full font-semibold flex items-center justify-center transition-colors disabled:opacity-70"
        >
          {isSubmitting ? 'Submitting...' : 'Request Consultation'}
        </button>
      </motion.form>
    </div>
  );
}
