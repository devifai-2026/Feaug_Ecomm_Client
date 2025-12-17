import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-sm">
            Last updated: December 2023
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-6">
          <p className="text-gray-700">
            Feauag ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website feauag.com or purchase our products.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Quick Navigation</h2>
          <div className="flex flex-wrap gap-2">
            <a href="#info-collected" className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">1. Information</a>
            <a href="#info-use" className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">2. How We Use</a>
            <a href="#info-share" className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">3. Sharing</a>
            <a href="#data-security" className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">4. Security</a>
            <a href="#your-rights" className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">5. Your Rights</a>
            <a href="#cookies" className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">6. Cookies</a>
            <a href="#contact" className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">7. Contact</a>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <section id="info-collected" className="pb-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
            <div className="space-y-3">
              <p className="text-gray-700"><strong>Personal Information:</strong> Name, email, phone, address, payment details</p>
              <p className="text-gray-700"><strong>Automatically Collected:</strong> IP address, device info, browsing data</p>
              <p className="text-gray-700"><strong>Purchase Information:</strong> Order history, preferences, interactions</p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="info-use" className="pb-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations and updates</li>
              <li>Provide customer support</li>
              <li>Personalize your shopping experience</li>
              <li>Send promotional emails (with consent)</li>
              <li>Improve our website and services</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="info-share" className="pb-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Information Sharing</h2>
            <p className="text-gray-700 mb-2">We do not sell your personal information. We may share with:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li><strong>Service Providers:</strong> Payment processors, shipping companies, email services</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect rights</li>
              <li><strong>Business Transfers:</strong> In case of merger or acquisition</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="data-security" className="pb-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Security</h2>
            <div className="bg-green-50 p-4 rounded mb-3">
              <p className="text-green-800 font-medium">We implement industry-standard security measures:</p>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>256-bit SSL encryption for data transmission</li>
              <li>Encrypted storage of sensitive information</li>
              <li>PCI DSS compliance for payment processing</li>
              <li>Regular security audits and updates</li>
            </ul>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Note:</strong> No method of online transmission is 100% secure.
            </p>
          </section>

          {/* Section 5 */}
          <section id="your-rights" className="pb-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Your Rights</h2>
            <p className="text-gray-700 mb-3">You have the right to:</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-3 bg-gray-50 rounded text-sm">
                <div className="font-medium">Access & Update</div>
                <div className="text-gray-600">View and edit your information</div>
              </div>
              <div className="p-3 bg-gray-50 rounded text-sm">
                <div className="font-medium">Data Deletion</div>
                <div className="text-gray-600">Request data removal</div>
              </div>
              <div className="p-3 bg-gray-50 rounded text-sm">
                <div className="font-medium">Opt-out</div>
                <div className="text-gray-600">Unsubscribe from marketing</div>
              </div>
              <div className="p-3 bg-gray-50 rounded text-sm">
                <div className="font-medium">Data Portability</div>
                <div className="text-gray-600">Request your data copy</div>
              </div>
            </div>
            <p className="text-gray-700">
              To exercise these rights, email: <a href="mailto:privacy@feauag.com" className="text-amber-600 hover:text-amber-700">privacy@feauag.com</a>
            </p>
          </section>

          {/* Section 6 */}
          <section id="cookies" className="pb-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Cookies</h2>
            <p className="text-gray-700 mb-3">We use cookies to:</p>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Essential</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Analytics</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Preferences</span>
            </div>
            <p className="text-gray-700">
              You can control cookies through browser settings. Disabling cookies may affect website functionality.
            </p>
          </section>

          {/* Section 7 */}
          <section id="children" className="pb-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Children's Privacy</h2>
            <p className="text-gray-700">
              Our services are not for individuals under 18. We do not knowingly collect information from children.
            </p>
          </section>

          {/* Section 8 */}
          <section id="updates" className="pb-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Policy Updates</h2>
            <p className="text-gray-700">
              We may update this policy periodically. Changes will be posted here with updated date. For significant changes, we may email you.
            </p>
          </section>

          {/* Section 9 */}
          <section id="contact" className="pb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contact Us</h2>
            <div className="space-y-3">
              <div>
                <div className="font-medium text-gray-800">Email</div>
                <a href="mailto:privacy@feauag.com" className="text-amber-600 hover:text-amber-700">privacy@feauag.com</a>
              </div>
              <div>
                <div className="font-medium text-gray-800">Address</div>
                <p className="text-gray-700">Feauag Jewelry Pvt. Ltd.<br />
                123 Jewel Street, Mumbai<br />
                Maharashtra, India 400001</p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              By using our website and services, you consent to our Privacy Policy.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              © {new Date().getFullYear()} Feauag. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;