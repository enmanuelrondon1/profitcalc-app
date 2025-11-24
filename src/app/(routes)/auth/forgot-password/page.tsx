import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            ProfitCalc
          </Link>
          <p className="mt-2 text-gray-600">Reset your password.</p>
        </div>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
