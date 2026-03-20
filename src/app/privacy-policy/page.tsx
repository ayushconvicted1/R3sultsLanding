import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LegalPageHero, LegalSection } from "@/components/legal/LegalDocument";

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-linear-to-b from-[#FFF5F8] via-white to-slate-50">
      <Header />
      <main className="pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <LegalPageHero
            badge="Trust, safety, transparency"
            title="R3sults Privacy Policy"
            subtitle="Your privacy matters to us. This policy explains exactly how R3sults collects, uses, protects, and shares information across our life-safety services."
          />

          <article className="relative mt-10 overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.15)] sm:p-8 md:p-10">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-[#BF0637] to-transparent opacity-90"
              aria-hidden
            />
            <div className="relative space-y-2">
            <LegalSection title="Introduction">
              <p>
                R3sults Group Inc., operating under the brand name "R3sults", is
                dedicated to protecting the privacy and security of your personal
                information. This Privacy Policy outlines how we collect, use,
                disclose, and protect your information when you use our website,
                mobile application, smart wearable devices, and related services
                (collectively, the "Services"). Our platform provides real-time
                disaster alerts, family location tracking, emergency SOS services,
                and AI-powered emergency response tools. Due to the sensitive
                nature of our Services, we prioritize data privacy and security.
              </p>
              <p>
                By accessing or using our Services, you consent to the collection
                and use of your information as described in this Privacy Policy.
                If you disagree with any part of this policy, please refrain from
                using our Services.
              </p>
            </LegalSection>

            <LegalSection title="Information We Collect">
              <h3>
                Information You Provide Directly
              </h3>
              <p>
                We collect information you voluntarily provide when interacting
                with our Services, such as:
              </p>
              <ul>
                <li>
                  <strong>Account Registration Data:</strong> Full name, email
                  address, phone number, username, and password.
                </li>
                <li>
                  <strong>Profile Information:</strong> Home address, emergency
                  contacts, household members, and health-related details you
                  choose to provide.
                </li>
                <li>
                  <strong>Payment Information:</strong> Credit/debit card details,
                  billing address, and transaction history processed via secure
                  third-party payment processors.
                </li>
                <li>
                  <strong>Communications:</strong> Messages, support inquiries,
                  feedback, and survey responses.
                </li>
                <li>
                  <strong>SMS Opt-In Consent:</strong> We record your consent,
                  phone number, opt-in date/time, and source when you opt in to
                  receive SMS messages.
                </li>
              </ul>

              <h3>
                Information Collected Automatically
              </h3>
              <p>
                When you use our Services, we automatically gather certain
                details, including:
              </p>
              <ul>
                <li>
                  <strong>Device Information:</strong> Type, operating system,
                  unique identifiers, hardware model, and mobile network
                  information.
                </li>
                <li>
                  <strong>Location Data:</strong> GPS coordinates, cell tower
                  data, and Wi-Fi access point information, with your permission.
                </li>
                <li>
                  <strong>Usage Data:</strong> Pages visited, features used, time
                  spent, click patterns, search queries, and interaction logs.
                </li>
                <li>
                  <strong>Log Data:</strong> IP addresses, browser type, referring
                  URLs, and crash reports.
                </li>
                <li>
                  <strong>Sensor Data:</strong> From our smart wearable devices-heart
                  rate, body temperature, step counts, fall detection events, and
                  emergency SOS activations.
                </li>
              </ul>

              <h3>
                Information from Third Parties
              </h3>
              <p>
                We may obtain information about you from third parties, such as:
              </p>
              <ul>
                <li>Government emergency alert systems and FEMA data feeds.</li>
                <li>Weather and geospatial data providers.</li>
                <li>Social media platforms if you connect your accounts.</li>
                <li>
                  Insurance partners and relief organizations with your consent.
                </li>
              </ul>
            </LegalSection>

            <LegalSection title="How We Use Your Information">
              <h3>
                Core Service Delivery
              </h3>
              <ul>
                <li>
                  Providing real-time disaster alerts and emergency notifications.
                </li>
                <li>
                  Enabling Family Finder GPS tracking and safety check-ins.
                </li>
                <li>
                  Processing emergency SOS activations and coordinating rescue
                  responses.
                </li>
                <li>
                  Operating smart wearable device features, including live
                  tracking and fall detection.
                </li>
                <li>
                  Sending evacuation routes, shelter locations, and emergency
                  resources.
                </li>
              </ul>

              <h3>
                Account and Platform Management
              </h3>
              <ul>
                <li>Creating and managing your account.</li>
                <li>Processing payments and subscriptions.</li>
                <li>
                  Providing customer support and responding to inquiries.
                </li>
                <li>
                  Sending transactional messages, including account confirmations,
                  security alerts, and 2FA verification codes.
                </li>
              </ul>

              <h3>
                SMS Communications
              </h3>
              <p>
                With your explicit consent, we use your phone number to send:
              </p>
              <ul>
                <li>
                  <strong>Two-Factor Authentication (2FA):</strong> One-time
                  passcodes for identity verification during login.
                </li>
                <li>
                  <strong>Emergency Alerts:</strong> Time-sensitive disaster
                  alerts and evacuation notifications based on your location.
                </li>
                <li>
                  <strong>Platform Notifications:</strong> Account updates,
                  subscription confirmations, and service announcements.
                </li>
                <li>
                  <strong>Marketing Messages:</strong> Launch updates, product
                  news, and promotional offers-only if you have opted in.
                </li>
              </ul>
              <p>
                You may opt out of non-essential SMS communications at any time by
                replying STOP to any message or updating your notification
                preferences in the app.
              </p>

              <h3>
                Safety, Security, and Compliance
              </h3>
              <ul>
                <li>
                  Detecting, preventing, and responding to fraud, abuse, and
                  security threats.
                </li>
                <li>Complying with applicable laws and regulations.</li>
                <li>Enforcing our Terms of Service.</li>
                <li>
                  Protecting the rights, property, and safety of R3sults, our
                  users, and the public.
                </li>
              </ul>

              <h3>
                Research and Improvement
              </h3>
              <ul>
                <li>Analyzing usage patterns to improve our Services.</li>
                <li>
                  Developing new features, products, and AI models for disaster
                  prediction.
                </li>
                <li>
                  Conducting research to advance emergency response
                  effectiveness.
                </li>
              </ul>
            </LegalSection>

            <LegalSection title="Legal Basis for Processing">
              <p>
                We process your personal information for the following reasons:
              </p>
              <ul>
                <li>
                  <strong>Contractual Necessity:</strong> To provide the Services
                  you have requested.
                </li>
                <li>
                  <strong>Consent:</strong> Based on your explicit consent, which
                  you may withdraw at any time.
                </li>
                <li>
                  <strong>Legitimate Interests:</strong> Necessary for our
                  legitimate business interests, like improving our Services and
                  preventing fraud.
                </li>
                <li>
                  <strong>Legal Obligation:</strong> To comply with applicable
                  laws and regulations.
                </li>
                <li>
                  <strong>Vital Interests:</strong> To protect your vital
                  interests or those of another person, particularly relevant
                  given the life-safety nature of our Services.
                </li>
              </ul>
            </LegalSection>

            <LegalSection title="How We Share Your Information">
              <p>
                R3sults does not sell, rent, or trade your personal information
                to third parties for their marketing purposes. We may share your
                information in the following limited circumstances:
              </p>

              <h3>
                Service Providers
              </h3>
              <p>
                We share information with trusted third-party vendors who assist
                us in operating our Services, including cloud infrastructure and
                hosting providers, SMS and telecommunications providers for
                message delivery, payment processors for subscription billing,
                analytics providers, and emergency response coordination services.
                All service providers are contractually required to handle your
                information securely and only for the specified purposes.
              </p>

              <h3>
                Emergency Situations
              </h3>
              <p>
                In genuine emergencies, we may share your location data, health
                data, or contact information with emergency responders, rescue
                services, government agencies, or your designated emergency
                contacts to protect your life or the lives of others.
              </p>

              <h3>
                Legal Requirements
              </h3>
              <p>
                We may disclose your information if required by law, subpoena,
                court order, or governmental authority, or if we believe in good
                faith that disclosure is necessary to protect our rights, your
                safety, or the safety of others.
              </p>

              <h3>
                Business Transfers
              </h3>
              <p>
                If R3sults Group Inc. is involved in a merger, acquisition, asset
                sale, or bankruptcy, your information may be transferred to the
                successor entity. We will provide notice before your information
                is transferred and becomes subject to a different privacy policy.
              </p>

              <h3>
                Aggregated and De-identified Data
              </h3>
              <p>
                We may share aggregated, anonymized, or de-identified information
                - which cannot reasonably be used to identify you - with research
                institutions, government agencies, and the public to advance
                disaster preparedness and emergency response.
              </p>
            </LegalSection>

            <LegalSection title="Data Retention">
              <p>
                We retain your personal information for as long as necessary to:
              </p>
              <ul>
                <li>Provide the Services and maintain your account.</li>
                <li>Comply with our legal obligations and resolve disputes.</li>
                <li>Enforce our agreements.</li>
                <li>Meet regulatory retention requirements.</li>
              </ul>
              <p>
                Location data from emergency events may be retained for longer
                periods to assist with post-disaster recovery coordination and
                research. Account data is generally retained for the duration of
                your subscription plus three years. You may request deletion of
                your data at any time, subject to legal retention requirements.
              </p>
            </LegalSection>

            <LegalSection title="Your Privacy Rights">
              <h3>
                Rights for All Users
              </h3>
              <ul>
                <li>
                  <strong>Right to Access:</strong> Request a copy of the personal
                  information we hold about you.
                </li>
                <li>
                  <strong>Right to Correction:</strong> Request that we correct
                  inaccurate or incomplete information.
                </li>
                <li>
                  <strong>Right to Deletion:</strong> Request deletion of your
                  personal information, subject to legal exceptions.
                </li>
                <li>
                  <strong>Right to Opt Out of SMS:</strong> Reply STOP to any
                  R3sults SMS or update preferences in your account settings.
                </li>
                <li>
                  <strong>Right to Withdraw Consent:</strong> Withdraw consent for
                  any processing based on consent, without affecting prior
                  processing.
                </li>
              </ul>

              <h3>
                California Residents (CCPA / CPRA)
              </h3>
              <p>
                California residents have additional rights under the California
                Consumer Privacy Act (CCPA) and California Privacy Rights Act
                (CPRA):
              </p>
              <ul>
                <li>
                  Right to know what personal information is collected, used,
                  shared, or sold.
                </li>
                <li>Right to delete personal information collected from you.</li>
                <li>
                  Right to opt out of the sale or sharing of personal information.
                </li>
                <li>
                  Right to non-discrimination for exercising your privacy rights.
                </li>
                <li>Right to correct inaccurate personal information.</li>
                <li>Right to limit use of sensitive personal information.</li>
              </ul>
              <p>
                To exercise your California privacy rights, contact us at
                info@r3sults.com.
              </p>

              <h3>
                GDPR (EEA, UK, and Switzerland)
              </h3>
              <p>
                If you are located in the European Economic Area, United Kingdom,
                or Switzerland, you have rights under the General Data Protection
                Regulation (GDPR), including the right to data portability, the
                right to object to processing, and the right to lodge a complaint
                with your local supervisory authority. Contact us at
                info@r3sults.com to exercise these rights.
              </p>
            </LegalSection>

            <LegalSection title="Location Data and GPS Tracking">
              <p>
                Location data is central to R3sults' life-safety Services. We
                want to be transparent about how we handle it:
              </p>
              <ul>
                <li>
                  We collect precise GPS location only when you grant permission
                  or when you activate emergency features.
                </li>
                <li>
                  Family Finder location sharing is controlled by you - you choose
                  who can see your location and when.
                </li>
                <li>
                  Location data from emergency SOS activations may be shared with
                  emergency responders without prior consent when necessary to
                  protect life.
                </li>
                <li>
                  You can disable background location tracking at any time through
                  your device settings, though this may limit certain emergency
                  features.
                </li>
                <li>
                  Location history is retained for 30 days for standard users and
                  longer for emergency event records.
                </li>
              </ul>
            </LegalSection>

            <LegalSection title="Children's Privacy">
              <p>
                R3sults' Services are not directed to children under the age of
                13. We do not knowingly collect personal information from children
                under 13. Our family tracking features for minors require consent
                from a parent or legal guardian who creates and controls the
                child's account.
              </p>
              <p>
                If we learn that we have inadvertently collected personal
                information from a child under 13 without parental consent, we
                will take immediate steps to delete that information. If you
                believe we have collected information from a child under 13,
                please contact us immediately at info@r3sults.com.
              </p>
            </LegalSection>

            <LegalSection title="Data Security">
              <p>
                We implement industry-standard technical, administrative, and
                physical safeguards to protect your personal information,
                including:
              </p>
              <ul>
                <li>
                  End-to-end encryption for sensitive data in transit and at rest.
                </li>
                <li>Secure Socket Layer (SSL/TLS) for all data transmissions.</li>
                <li>Multi-factor authentication for account access.</li>
                <li>
                  Regular security audits and vulnerability assessments.
                </li>
                <li>
                  Access controls limiting employee access to personal data on a
                  need-to-know basis.
                </li>
                <li>
                  SOC 2 aligned security practices for cloud infrastructure.
                </li>
              </ul>
              <p>
                Despite these measures, no security system is impenetrable. In
                the event of a data breach that affects your personal information,
                we will notify you as required by applicable law.
              </p>
            </LegalSection>

            <LegalSection title="Cookies and Tracking Technologies">
              <p>
                We use cookies, web beacons, pixels, and similar tracking
                technologies to operate our website and improve your experience.
                These technologies help us keep you logged in, remember your
                preferences, analyze website traffic and usage patterns, deliver
                relevant content and emergency alerts, and measure the
                effectiveness of our communications.
              </p>
              <p>
                You can control cookies through your browser settings. Disabling
                certain cookies may impact the functionality of our Services. We
                honor Do Not Track signals where required by applicable law.
              </p>
            </LegalSection>

            <LegalSection title="Third-Party Links and Services">
              <p>
                Our Services may contain links to third-party websites,
                applications, or services, including partner organizations,
                insurance providers, and emergency resource platforms. This
                Privacy Policy does not apply to those third parties. We encourage
                you to review the privacy policies of any third-party services you
                access through our platform.
              </p>
            </LegalSection>

            <LegalSection title="International Data Transfers">
              <p>
                R3sults Group Inc. is based in the United States. If you access
                our Services from outside the United States, your information may
                be transferred to, stored, and processed in the United States
                where our servers are located. For users in the EEA or UK, we
                rely on Standard Contractual Clauses (SCCs) approved by the
                European Commission as the legal mechanism for international data
                transfers.
              </p>
            </LegalSection>

            <LegalSection title="SMS Messaging - Specific Disclosures">
              <p>
                In accordance with TCPA and carrier requirements, we disclose the
                following regarding our SMS communications:
              </p>
              <ul>
                <li>
                  <strong>Consent is not a condition of purchase:</strong> You are
                  not required to consent to receive marketing SMS messages as a
                  condition of purchasing or using our Services.
                </li>
                <li>
                  <strong>Opt-Out:</strong> Reply STOP to any R3sults message to
                  unsubscribe. You will receive a confirmation and no further
                  messages of that type will be sent.
                </li>
                <li>
                  <strong>HELP:</strong> Reply HELP to any R3sults message for
                  support information.
                </li>
                <li>
                  <strong>Message Frequency:</strong> Varies by feature - 2FA
                  messages are sent only at login; emergency alerts depend on
                  disaster activity in your area.
                </li>
                <li>
                  <strong>Message and Data Rates:</strong> Standard message and
                  data rates from your mobile carrier may apply.
                </li>
                <li>
                  <strong>Supported Carriers:</strong> AT&amp;T, T-Mobile,
                  Verizon, and most major US carriers.
                </li>
                <li>
                  <strong>SMS Short Codes &amp; Toll-Free Numbers:</strong>
                  R3sults sends SMS messages for account verification (2FA),
                  emergency alerts, and platform notifications. Consent to receive
                  SMS is not a condition of any purchase. Reply STOP to opt out,
                  HELP for support. Msg &amp; data rates may apply.
                </li>
              </ul>
            </LegalSection>

            <LegalSection title="Changes to This Privacy Policy">
              <p>
                We may update this Privacy Policy from time to time to reflect
                changes in our practices, technology, or legal requirements. We
                will notify you of material changes by posting the updated policy
                on our website with a new effective date and sending an email
                notification to your registered email address. Your continued use
                of our Services after the effective date constitutes your
                acceptance of the updated Privacy Policy.
              </p>
            </LegalSection>
{/* 
            <LegalSection title="Contact Us">
              <p>
                If you have questions, concerns, or requests regarding this
                Privacy Policy or our data practices, please contact us:
              </p>
              <ul>
                <li>
                  <strong>Company:</strong> R3sults Group Inc.
                </li>
                <li>
                  <strong>Attn:</strong> Privacy Officer
                </li>
                <li>
                  <strong>Address:</strong> 2120 SW 60th Ter, Miramar, FL 33023
                </li>
                <li>
                  <strong>Email:</strong> info@r3sults.com
                </li>
                <li>
                  <strong>Phone:</strong> +1 954-231-1750
                </li>
                <li>
                  <strong>Website:</strong> www.r3sults.com
                </li>
                <li>
                  <strong>California:</strong> info@r3sults.com
                </li>
                <li>
                  <strong>GDPR / EEA:</strong> info@r3sults.com
                </li>
              </ul>
              <p>
                We will respond to all privacy requests within 30 days of
                receipt. For complex requests, we may extend this period by an
                additional 60 days with prior notice.
              </p>
              <p>
                Copyright © 2026 R3sults Group Inc. All rights reserved.
              </p>
              <p>www.r3sults.com · info@r3sults.com</p>
            </LegalSection> */}
            </div>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}
