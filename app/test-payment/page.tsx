"use client";

import React, { useState } from "react";
import CCAvenue from "@/lib/CCAvenue";

export default function TestPaymentPage() {
  const [formData, setFormData] = useState({
    amount: "100.00",
    billing_name: "Test User",
    billing_email: "test@example.com",
    billing_tel: "9999999999",
    billing_address: "Test Address",
    billing_city: "Test City",
    billing_state: "Test State",
    billing_zip: "123456",
    billing_country: "India",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const merchant_id = process.env.NEXT_PUBLIC_CAvenue_MERCHANT_ID;
      const accessCode = process.env.NEXT_PUBLIC_CCAvenue_ACCESS_CODE;

      if (!merchant_id || !accessCode) {
        alert("Missing merchant credentials. Please check your .env file.");
        setLoading(false);
        return;
      }

      const orderId = `TEST_${Date.now()}`;
      const host = window.location.origin;

      // Ensure amount is properly formatted to 2 decimal places
      const formattedAmount = parseFloat(formData.amount).toFixed(2);

      const paymentData = {
        merchant_id,
        order_id: orderId,
        currency: "INR",
        amount: formattedAmount,
        redirect_url: `${host}/api/ccavenue-handle`,
        cancel_url: `${host}/api/ccavenue-handle`,
        language: "EN",
        billing_name: formData.billing_name,
        billing_address: formData.billing_address,
        billing_city: formData.billing_city,
        billing_state: formData.billing_state,
        billing_zip: formData.billing_zip,
        billing_country: formData.billing_country,
        billing_tel: formData.billing_tel,
        billing_email: formData.billing_email,
        delivery_name: formData.billing_name,
        delivery_address: formData.billing_address,
        delivery_city: formData.billing_city,
        delivery_state: formData.billing_state,
        delivery_zip: formData.billing_zip,
        delivery_country: formData.billing_country,
        delivery_tel: formData.billing_tel,
        merchant_param1: "test_payment",
        merchant_param2: "test_mode",
      };

      const encReq = CCAvenue.getEncryptedOrder(paymentData);
      const URL = `https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&merchant_id=${merchant_id}&encRequest=${encReq}&access_code=${accessCode}`;

      window.location.href = URL;
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment. Check console for details.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">CCAvenue Payment Test</h1>
          <p className="text-purple-100">
            Test your payment gateway integration
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amount (INR)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-900 bg-white"
              placeholder="100.00"
            />
          </div>

          {/* Billing Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              name="billing_name"
              value={formData.billing_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-900 bg-white"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="billing_email"
              value={formData.billing_email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-900 bg-white"
              placeholder="john@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="billing_tel"
              value={formData.billing_tel}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-900 bg-white"
              placeholder="9999999999"
            />
          </div>

          {/* Address Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="billing_city"
                value={formData.billing_city}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-900 bg-white"
                placeholder="Mumbai"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                name="billing_state"
                value={formData.billing_state}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-900 bg-white"
                placeholder="Maharashtra"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                name="billing_zip"
                value={formData.billing_zip}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-900 bg-white"
                placeholder="400001"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                name="billing_country"
                value={formData.billing_country}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-900 bg-white"
                placeholder="India"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              name="billing_address"
              value={formData.billing_address}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-900 bg-white"
              placeholder="123 Main Street"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Proceed to Payment"
            )}
          </button>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-semibold mb-1">⚠️ Test Mode</p>
            <p>
              This is a test payment page. Make sure your environment variables
              are configured correctly.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
