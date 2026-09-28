"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getReadableError = (errCode: string) => {
    switch (errCode) {
      case 'auth/email-already-in-use': return 'This email is already registered. Try logging in instead.';
      case 'auth/invalid-email': return 'Email is invalid. Please check and try again.';
      case 'auth/weak-password': return 'Password is too weak. It must be at least 6 characters.';
      default: return 'An unexpected error occurred. Please try again.';
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // AuthContext will handle redirect
    } catch (err: any) {
      setError(getReadableError(err.code));
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl card-shadow cute-border flex flex-col items-center relative">
        <Link href="/" className="absolute top-4 left-4 text-text-light hover:text-text-dark font-bold">
          &larr; Back
        </Link>
        
        <div className="w-24 h-24 relative mb-4">
          <Image src="/mascot.jpg" alt="Mascot" fill className="object-contain" />
        </div>

        <h1 className="text-3xl font-extrabold text-text-dark mb-2">Join Us! 🌟</h1>
        <p className="text-text-light mb-6 text-sm">Create an account to start organizing.</p>

        {error && (
          <div className="w-full bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-sm font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
          <Input 
            label="Email" 
            type="email" 
            placeholder="you@example.com" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input 
            label="Confirm Password" 
            type="password" 
            placeholder="••••••••" 
            required 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          
          <Button type="submit" variant="secondary" className="w-full mt-4 py-3 text-lg" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-text-light">
          Already have an account?{" "}
          <Link href="/login" className="text-pastel-blue font-bold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
