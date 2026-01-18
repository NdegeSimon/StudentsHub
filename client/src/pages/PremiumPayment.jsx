import { useState } from 'react';
import { CreditCard, Smartphone, Building2, CheckCircle2, ArrowLeft, Crown } from 'lucide-react';

export default function PremiumPaymentPage() {
  const [selectedMethod, setSelectedMethod] = useState('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const paymentMethods = [
    { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, description: 'Pay via M-Pesa mobile money' },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, Amex' },
    { id: 'bank', name: 'Bank Transfer', icon: Building2, description: 'Direct bank transfer' }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 2500);
  };

  const handleCardInput = (field, value) => {
    if (field === 'number') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.replace(/\s/g, '').length > 16) return;
    }
    if (field === 'expiry') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length > 5) return;
    }
    if (field === 'cvv' && value.length > 3) return;
    
    setCardDetails({ ...cardDetails, [field]: value });
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-700">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mb-4 border border-green-700">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
            <p className="text-gray-400">Your premium subscription is now active</p>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-xl p-6 mb-6 border border-yellow-700/30">
            <Crown className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-white">Welcome to Premium!</h3>
            <p className="text-sm text-gray-300">You now have access to all exclusive features</p>
          </div>
          
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button className="flex items-center text-gray-300 mb-6 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="grid md:grid-cols-5 gap-0">
            {/* Left Panel - Order Summary */}
            <div className="md:col-span-2 bg-gradient-to-br from-blue-900 to-indigo-900 p-8 text-white border-r border-gray-700">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="bg-white/5 backdrop-blur rounded-xl p-6 mb-6 border border-white/10">
                <div className="flex items-start mb-4">
                  <Crown className="w-8 h-8 text-yellow-400 mr-3" />
                  <div>
                    <h3 className="font-bold text-lg">Premium Plan</h3>
                    <p className="text-sm text-blue-200">Monthly subscription</p>
                  </div>
                </div>
                
                <ul className="space-y-2 text-sm text-blue-100 mb-4">
                  <li>✓ 3x more visibility</li>
                  <li>✓ Exclusive features</li>
                  <li>✓ Priority support</li>
                  <li>✓ Advanced analytics</li>
                  <li>✓ Ad-free experience</li>
                </ul>
              </div>

              <div className="border-t border-white/20 pt-4">
                <div className="flex justify-between mb-2 text-gray-200">
                  <span>Subtotal</span>
                  <span>KES 999.00</span>
                </div>
                <div className="flex justify-between mb-4 text-gray-200">
                  <span>Tax</span>
                  <span>KES 0.00</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t border-white/20 pt-4">
                  <span>Total</span>
                  <span>KES 999.00</span>
                </div>
              </div>
            </div>

            {/* Right Panel - Payment Form */}
            <div className="md:col-span-3 p-8 bg-gray-800">
              <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>
              
              {/* Payment Method Selection */}
              <div className="space-y-3 mb-8">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full flex items-center p-4 rounded-xl border-2 transition-all ${
                        selectedMethod === method.id
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-gray-700 hover:border-gray-600 bg-gray-900/30'
                      }`}
                    >
                      <div className={`p-3 rounded-lg mr-4 ${
                        selectedMethod === method.id ? 'bg-blue-600' : 'bg-gray-700'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          selectedMethod === method.id ? 'text-white' : 'text-gray-300'
                        }`} />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-white">{method.name}</div>
                        <div className="text-sm text-gray-400">{method.description}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedMethod === method.id ? 'border-blue-500' : 'border-gray-600'
                      }`}>
                        {selectedMethod === method.id && (
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Payment Form */}
              <div>
                {selectedMethod === 'mpesa' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        M-Pesa Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="0712 345 678"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none bg-gray-900 text-white placeholder-gray-500"
                      />
                      <p className="text-sm text-gray-400 mt-2">
                        You'll receive an STK push notification on your phone
                      </p>
                    </div>
                  </div>
                )}

                {selectedMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => handleCardInput('number', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none bg-gray-900 text-white placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="JOHN DOE"
                        value={cardDetails.name}
                        onChange={(e) => handleCardInput('name', e.target.value.toUpperCase())}
                        className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none bg-gray-900 text-white placeholder-gray-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => handleCardInput('expiry', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none bg-gray-900 text-white placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={(e) => handleCardInput('cvv', e.target.value.replace(/\D/g, ''))}
                          className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none bg-gray-900 text-white placeholder-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === 'bank' && (
                  <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-6">
                    <h3 className="font-semibold text-white mb-3">Bank Transfer Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bank Name:</span>
                        <span className="font-medium text-gray-200">Equity Bank Kenya</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Account Name:</span>
                        <span className="font-medium text-gray-200">Your Company Ltd</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Account Number:</span>
                        <span className="font-medium text-gray-200">0123456789</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Amount:</span>
                        <span className="font-medium text-gray-200">KES 999.00</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-4">
                      After transfer, email proof to support@yoursite.com
                    </p>
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Pay KES 999.00`
                  )}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  🔒 Secure payment powered by SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}