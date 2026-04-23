import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LegalPageHero, LegalSection } from "@/components/legal/LegalDocument";

export default function TermsAndConditionPage() {
  return (
    <div className="w-full bg-linear-to-b from-[#FFF5F8] via-white to-slate-50">
      <Header />
      <main className="pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <LegalPageHero
            badge="R3sults"
            title="Terms & Conditions"
            subtitle="Please read these terms carefully. They govern your use of our website, mobile app, wearables, and related services."
          >
         
          </LegalPageHero>

          <article className="relative mt-10 overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.15)] sm:p-8 md:p-10">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-[#BF0637] to-transparent opacity-90"
              aria-hidden
            />
            <div className="relative space-y-2">
              <div className="rounded-2xl border border-[#BF0637]/20 bg-[#FFF5F8]/80 p-5 sm:p-6">
                <p className="text-[15px] font-semibold uppercase tracking-wide text-slate-900 sm:text-base">
                  PLEASE READ THESE TERMS CAREFULLY.
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-700 sm:text-base">
                  By accessing or using R3sults&apos; website, mobile application,
                  wearable devices, or any related services, you agree to be bound
                  by these Terms and Conditions. If you do not agree, do not use
                  our Services.
                </p>
              </div>

              <LegalSection title="1. Agreement to Terms" id="agreement">
                <p>
                  These Terms and Conditions (&quot;Terms&quot;) constitute a
                  legally binding agreement between you (&quot;User,&quot;
                  &quot;you,&quot; or &quot;your&quot;) and R3sults Group Inc.
                  (&quot;R3sults,&quot; &quot;we,&quot; &quot;us,&quot; or
                  &quot;our&quot;), governing your access to and use of the
                  R3sults website located at www.r3sults.com, our mobile
                  application, smart wearable devices, and all associated
                  content, features, and services (collectively, the
                  &quot;Services&quot;).
                </p>
                <p>
                  By creating an account, downloading our application,
                  purchasing a subscription or device, or otherwise accessing our
                  Services, you acknowledge that you have read, understood, and
                  agree to be bound by these Terms and our Privacy Policy, which
                  is incorporated herein by reference.
                </p>
                <p>
                  If you are using the Services on behalf of a business,
                  organization, or other entity, you represent and warrant that
                  you have the authority to bind that entity to these Terms, and
                  the terms &quot;you&quot; and &quot;your&quot; will refer to
                  that entity.
                </p>
              </LegalSection>

              <LegalSection title="2. Description of Services" id="services">
                <p>
                  R3sults provides an end-to-end disaster management technology
                  platform that includes the following components:
                </p>
                <h3>2.1 Consumer Mobile Application</h3>
                <ul>
                  <li>Real-time AI-powered disaster alerts and emergency notifications</li>
                  <li>Preparedness checklists and safety protocols</li>
                  <li>Shelter and evacuation mapping</li>
                  <li>Insurance guidance and emergency supply locators</li>
                  <li>Medical and first-aid support resources</li>
                </ul>
                <h3>2.2 Family Finder System</h3>
                <ul>
                  <li>Real-time GPS location tracking of family members</li>
                  <li>Status sharing and safety check-ins</li>
                  <li>Offline and low-network functionality</li>
                  <li>Rescue coordination support</li>
                </ul>
                <h3>2.3 Smart Safety Wearable Device</h3>
                <ul>
                  <li>GPS-enabled live tracking and emergency SOS activation</li>
                  <li>Heart rate, temperature, and step monitoring</li>
                  <li>Fall detection, including for seniors</li>
                  <li>Waterproof design with up to 7-day battery life</li>
                </ul>
                <h3>2.4 Platform Features</h3>
                <ul>
                  <li>
                    Damage reporting, recovery tracking, and community rebuilding
                    resources
                  </li>
                  <li>Insurance and relief program access</li>
                  <li>AI-powered emergency coordination tools</li>
                </ul>
                <p>
                  R3sults reserves the right to modify, suspend, or discontinue
                  any aspect of the Services at any time with or without notice.
                </p>
              </LegalSection>

              <LegalSection title="3. Eligibility" id="eligibility">
                <p>To use the Services, you must:</p>
                <ul>
                  <li>
                    Be at least 18 years of age, or 13 years of age with
                    verifiable parental or guardian consent
                  </li>
                  <li>Have the legal capacity to enter into a binding agreement</li>
                  <li>Not be barred from using the Services under applicable law</li>
                  <li>
                    Not have had a previous account terminated by R3sults for
                    violation of these Terms
                  </li>
                </ul>
                <p>
                  Users under the age of 18 may only use the Services through an
                  account created and managed by a parent or legal guardian.
                </p>
              </LegalSection>

              <LegalSection title="4. Account Registration and Security" id="account">
                <h3>4.1 Account Creation</h3>
                <p>
                  When creating your account, you agree to provide accurate
                  information, keep your password confidential, notify us
                  immediately of any unauthorized use of your account, and be
                  responsible for all activity that occurs under your account.
                </p>
                <h3>4.2 Two-Factor Authentication (2FA)</h3>
                <p>
                  When 2FA is enabled, you consent to receive one-time passcodes
                  (OTP) via SMS to your registered mobile number for account login
                  verification. Message and data rates may apply. Reply STOP to
                  opt out of 2FA SMS.
                </p>
                <h3>4.3 Account Responsibility</h3>
                <p>
                  You are solely responsible for all activities conducted through
                  your account. R3sults will not be liable for any loss or damage
                  arising from unauthorized use of your account credentials.
                </p>
              </LegalSection>

              <LegalSection title="5. Subscriptions, Payments, and Refunds" id="payments">
                <h3>5.1 Subscription Plans</h3>
                <p>
                  R3sults offers various subscription plans. By subscribing, you
                  authorize us to charge your payment method on a recurring basis
                  for the selected plan.
                </p>
                <h3>5.2 Payment Terms</h3>
                <ul>
                  <li>
                    All fees are quoted and charged in US Dollars (USD) unless
                    otherwise stated
                  </li>
                  <li>
                    Subscription fees are billed in advance on a monthly or
                    annual basis
                  </li>
                  <li>
                    We reserve the right to change pricing with 30 days&apos;
                    advance notice to subscribers
                  </li>
                </ul>
                <h3>5.3 Cancellation</h3>
                <p>
                  You may cancel your subscription at any time through your
                  account settings or by contacting us at info@r3sults.com. You
                  will retain access through the end of the paid period.
                </p>
                <h3>5.4 Refund Policy</h3>
                <p>
                  Subscription fees are generally non-refundable. Exceptions may
                  be made at our sole discretion for billing errors or duplicate
                  charges.
                </p>
              </LegalSection>

              <LegalSection title="6. Acceptable Use Policy" id="acceptable-use">
                <p>You agree not to:</p>
                <ul>
                  <li>Use the Services in any way that violates applicable law or regulation</li>
                  <li>
                    Transmit false, misleading, or fraudulent information,
                    including false emergency alerts
                  </li>
                  <li>Abuse, misuse, or make false emergency SOS activations</li>
                  <li>Impersonate any person or entity</li>
                  <li>Attempt to gain unauthorized access to any portion of the Services</li>
                  <li>
                    Reverse engineer, decompile, or disassemble the Services
                  </li>
                  <li>
                    Use automated means (bots, scrapers) to access the Services
                    without permission
                  </li>
                  <li>
                    Use the Services to stalk, harass, threaten, or harm any person
                  </li>
                  <li>
                    Resell or commercialize the Services without written authorization
                  </li>
                </ul>
                <p className="uppercase">
                  FALSE EMERGENCY ACTIVATIONS: Deliberately triggering false
                  emergency SOS signals is a serious misuse of R3sults. It wastes
                  emergency response resources and may expose you to civil or
                  criminal liability. R3sults will cooperate with law enforcement
                  and may immediately terminate your account.
                </p>
              </LegalSection>

              <LegalSection title="7. Emergency Services Disclaimer" id="emergency">
                <h3>7.1 Not a Replacement for 911</h3>
                <p>
                  R3sults is not an emergency service provider and is not a
                  substitute for calling 911 or your local emergency number. In
                  any life-threatening emergency, always contact official
                  emergency services immediately.
                </p>
                <h3>7.2 Service Availability</h3>
                <p>
                  Our Services depend on internet connectivity, GPS signals,
                  cellular network availability, and device battery life. During
                  major disaster events, these dependencies may be unavailable or
                  degraded. R3sults makes no guarantee that the Services will be
                  available or functional during any specific emergency event.
                </p>
                <h3>7.3 Accuracy of Information</h3>
                <p>
                  Disaster alerts, shelter locations, and evacuation routes are
                  sourced from government agencies, third-party data providers,
                  and AI systems. R3sults does not guarantee the accuracy,
                  completeness, or timeliness of any emergency information.
                  Always verify critical safety information through official
                  government channels.
                </p>
                <h3>7.4 GPS Limitations</h3>
                <p>
                  GPS tracking accuracy may vary depending on device,
                  environment, and network conditions. Location information should
                  not be relied upon as the sole means of locating a person in an
                  emergency.
                </p>
                <p className="uppercase">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, R3SULTS DISCLAIMS ALL
                  LIABILITY FOR ANY FAILURE TO PREVENT INJURY, LOSS OF LIFE,
                  PROPERTY DAMAGE, OR OTHER HARM THAT OCCURS DESPITE THE USE OF
                  OUR SERVICES.
                </p>
              </LegalSection>

              <LegalSection title="8. SMS Communications and Messaging" id="sms">
                <h3>8.1 SMS Consent</h3>
                <p>
                  By providing your mobile phone number and opting in, you
                  consent to receive:
                </p>
                <ul>
                  <li>
                    <strong>2FA:</strong> One-time passcodes for account login
                    verification
                  </li>
                  <li>
                    <strong>Emergency Alerts:</strong> Real-time disaster and
                    evacuation notifications
                  </li>
                  <li>
                    <strong>Platform Notifications:</strong> Account updates and
                    service announcements
                  </li>
                  <li>
                    <strong>Marketing Messages:</strong> Launch updates and offers
                    (only with separate explicit consent)
                  </li>
                </ul>
                <h3>8.2 Opt-Out</h3>
                <p>
                  Reply STOP to any R3sults message to opt out. Reply START to
                  re-subscribe. Reply HELP for support. Msg &amp; data rates may
                  apply.
                </p>
                <h3>8.3 Consent Not Required for Purchase</h3>
                <p>
                  Consent to receive marketing SMS is not a condition of
                  purchasing or using our Services.
                </p>
              </LegalSection>

              <LegalSection title="9. Intellectual Property" id="ip">
                <p>
                  All content, features, and functionality of the Services are
                  owned by R3sults Group Inc. and protected by applicable
                  intellectual property laws. We grant you a limited,
                  non-exclusive, non-transferable, revocable license to access
                  and use the Services for personal, non-commercial purposes. You
                  may not copy, modify, distribute, or commercially exploit any
                  part of the Services without our written consent.
                </p>
              </LegalSection>

              <LegalSection title="10. Privacy" id="privacy">
                <p>
                  Your use of the Services is governed by our Privacy Policy,
                  available at{" "}
                  <Link
                    href="/privacy-policy"
                    className="font-semibold text-[#BF0637] underline-offset-2 hover:underline"
                  >
                    www.r3sults.com/privacy-policy
                  </Link>
                  , which is incorporated into these Terms by reference. By using
                  the Services, you consent to the collection, use, and
                  disclosure of your information as described in our Privacy
                  Policy.
                </p>
              </LegalSection>

              <LegalSection title="11. Third-Party Services and Links" id="third-party">
                <p>
                  Our Services may integrate with third-party services including
                  government emergency systems, weather providers, insurance
                  partners, mapping services, and payment processors. These
                  services are governed by their own terms. R3sults does not
                  endorse or assume responsibility for any third-party content or
                  services.
                </p>
              </LegalSection>

              <LegalSection title="12. Disclaimers of Warranties" id="disclaimers">
                <p className="uppercase">
                  THE SERVICES ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS
                  AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER
                  EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY
                  APPLICABLE LAW, R3SULTS EXPRESSLY DISCLAIMS ALL WARRANTIES,
                  INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
                  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND
                  NON-INFRINGEMENT.
                </p>
                <p className="mt-2 text-right text-sm text-slate-500">
                  Date: April 23, 2026
                </p>
              </LegalSection>

              <LegalSection title="13. Limitation of Liability" id="liability">
                <p className="uppercase">
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
                  SHALL R3SULTS GROUP INC., ITS OFFICERS, DIRECTORS, EMPLOYEES,
                  AGENTS, PARTNERS, OR LICENSORS BE LIABLE FOR ANY INDIRECT,
                  INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY
                  DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF LIFE, PERSONAL
                  INJURY, PROPERTY DAMAGE, LOSS OF PROFITS, OR BUSINESS
                  INTERRUPTION, EVEN IF R3SULTS HAS BEEN ADVISED OF THE
                  POSSIBILITY OF SUCH DAMAGES.
                </p>
                <p>
                  R3sults&apos; total cumulative liability to you for all claims
                  shall not exceed the greater of (a) the total amount paid by
                  you to R3sults in the preceding 12 months, or (b) one hundred
                  US dollars ($100).
                </p>
              </LegalSection>

              <LegalSection title="14. Indemnification" id="indemnification">
                <p>
                  You agree to defend, indemnify, and hold harmless R3sults Group
                  Inc. and its officers, directors, employees, contractors, and
                  agents from any claims, damages, liabilities, and expenses
                  (including attorneys&apos; fees) arising from your use of the
                  Services, violation of these Terms, violation of any third
                  party&apos;s rights, or any false emergency SOS activation.
                </p>
              </LegalSection>

              <LegalSection title="15. Dispute Resolution and Arbitration" id="disputes">
                <h3>15.1 Informal Resolution</h3>
                <p>
                  Before initiating any formal dispute, contact us at
                  info@r3sults.com and attempt to resolve the dispute informally
                  within 30 days.
                </p>
                <h3>15.2 Binding Arbitration</h3>
                <p>
                  Unresolved disputes shall be resolved by binding arbitration
                  administered by the AAA under its Consumer Arbitration Rules in
                  Broward County, Florida, rather than in court.
                </p>
                <h3>15.3 Class Action Waiver</h3>
                <p>
                  You waive your right to participate in a class action lawsuit
                  or class-wide arbitration against R3sults.
                </p>
                <h3>15.4 Time Limitation</h3>
                <p>
                  Any claim must be filed within one (1) year after the cause of
                  action arises. Claims filed after this period are permanently
                  barred.
                </p>
              </LegalSection>

              <LegalSection title="16. Governing Law" id="governing-law">
                <p>
                  These Terms shall be governed by the laws of the State of
                  Florida, United States, without regard to its conflict of law
                  provisions. Subject to the arbitration clause, you consent to
                  the exclusive jurisdiction of courts in Broward County, Florida.
                </p>
              </LegalSection>

              <LegalSection title="17. Termination" id="termination">
                <p>
                  We reserve the right to suspend or terminate your account at
                  any time for violation of these Terms, non-payment, false
                  emergency activations, or other harmful conduct. Upon
                  termination, your right to use the Services will immediately
                  cease. Provisions which by their nature should survive
                  termination shall survive.
                </p>
              </LegalSection>

              <LegalSection title="18. Changes to These Terms" id="changes">
                <p>
                  We reserve the right to modify these Terms at any time. We will
                  notify you of material changes by posting updated Terms on our
                  website. Your continued use of the Services after the effective
                  date constitutes acceptance. The current version is always
                  available at{" "}
                  <Link
                    href="/terms-and-condition"
                    className="font-semibold text-[#BF0637] underline-offset-2 hover:underline"
                  >
                    www.r3sults.com/terms-and-condition
                  </Link>
                  .
                </p>
              </LegalSection>

              <p className="text-slate-700">
                The terms and condition are subject to change without notice.
              </p>

            </div>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}
