"use client"
export default function PrivacyPolicy() {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&display=swap');
      `}</style>
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)",
        color: "#e8e6e1",
        fontFamily: "'DM Sans', sans-serif",
        lineHeight: 1.75,
        fontSize: 16,
      }}>
        {/* Hero Header */}
        <div style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          borderBottom: "1px solid rgba(212, 175, 125, 0.15)",
          padding: "60px 24px 50px",
          textAlign: "center",
        }}>
          <div style={{
            maxWidth: 800,
            margin: "0 auto",
          }}>
            <div style={{
              display: "inline-block",
              padding: "6px 20px",
              border: "1px solid rgba(212, 175, 125, 0.3)",
              borderRadius: 50,
              fontSize: 13,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#d4af7d",
              marginBottom: 24,
            }}>
              Legal
            </div>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 400,
              color: "#ffffff",
              margin: "0 0 16px",
              letterSpacing: -0.5,
            }}>
              Privacy Policy
            </h1>
            <p style={{
              color: "#8a8a9a",
              fontSize: 15,
              margin: 0,
            }}>
              Last updated: February 13, 2026 &nbsp;·&nbsp; ChooseQup Dating
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "60px 24px 100px",
        }}>
          {/* Intro */}
          <div style={{
            background: "rgba(212, 175, 125, 0.06)",
            border: "1px solid rgba(212, 175, 125, 0.12)",
            borderRadius: 12,
            padding: "24px 28px",
            marginBottom: 48,
            fontSize: 15,
            color: "#b0afa8",
          }}>
            Your privacy matters to us. This Privacy Policy explains how ChooseQup Dating ("ChooseQup", "we", "us", or "our") collects, uses, shares, and protects your personal information when you use our mobile application and related services (collectively, the "Service"). By using ChooseQup, you agree to the practices described in this policy.
          </div>

          {/* Section 1 */}
          <Section number="01" title="Information We Collect">
            <Subsection title="Information You Provide">
              <p>When you create an account and use ChooseQup, you may provide us with the following information:</p>
              <BulletList items={[
                "Account information: Your name, email address, phone number, date of birth, and login credentials.",
                "Profile information: Photos, professional title, employer, education, bio, and other details you choose to share on your profile.",
                "Preferences: Your dating preferences, including age range, location radius, and professional interests.",
                "Communications: Messages you send and receive through our in-app messaging feature.",
                "Verification data: Information provided to verify your identity or professional status.",
                "Payment information: If you subscribe to premium features, your payment details are processed by our third-party payment provider (Apple In-App Purchase or Google Play Billing). We do not directly store your payment card information.",
              ]} />
            </Subsection>

            <Subsection title="Information from Third-Party Sign-In">
              <p>If you choose to sign in using Google, Apple, or LinkedIn, we receive basic profile information from those services, such as your name, email address, and profile picture. We only access information that you have authorized these services to share with us.</p>
            </Subsection>

            <Subsection title="Information Collected Automatically">
              <p>When you use our Service, we may automatically collect:</p>
              <BulletList items={[
                "Device information: Device type, operating system, unique device identifiers, and mobile network information.",
                "Location data: Approximate (coarse) location based on your IP address or, with your permission, your device's location services to help match you with nearby users.",
                "Usage data: How you interact with the app, including features used, profiles viewed, matches made, and time spent on the app.",
                "Log data: IP address, access times, pages viewed, app crashes, and other diagnostic data.",
              ]} />
            </Subsection>
          </Section>

          {/* Section 2 */}
          <Section number="02" title="How We Use Your Information">
            <p>We use your information for the following purposes:</p>
            <BulletList items={[
              "Provide and operate the Service: Create and maintain your account, display your profile to other users, and facilitate matches and communication.",
              "Personalization: Recommend compatible matches based on your profile, preferences, and activity.",
              "Communication: Send you service-related notifications, updates, security alerts, and support messages.",
              "Safety and security: Detect, prevent, and address fraud, abuse, security risks, and technical issues.",
              "Improvement: Analyze usage patterns to improve our features, user experience, and overall service quality.",
              "Legal compliance: Comply with applicable laws, regulations, and legal processes.",
            ]} />
          </Section>

          {/* Section 3 */}
          <Section number="03" title="How We Share Your Information">
            <Subsection title="With Other Users">
              <p>Your profile information (including name, photos, bio, and professional details) is visible to other ChooseQup users as part of the matchmaking service. Messages you send are visible to their recipients.</p>
            </Subsection>

            <Subsection title="With Service Providers">
              <p>We may share your information with trusted third-party service providers who assist us in operating the Service, including cloud hosting, analytics, customer support, and payment processing. These providers are contractually obligated to protect your data and use it only for the purposes we specify.</p>
            </Subsection>

            <Subsection title="For Legal Reasons">
              <p>We may disclose your information if required by law, regulation, legal process, or governmental request, or if we believe disclosure is necessary to protect the rights, property, or safety of ChooseQup, our users, or the public.</p>
            </Subsection>

            <Subsection title="We Do Not Sell Your Data">
              <p>We do not sell, rent, or trade your personal information to third parties for their marketing purposes. We do not share your data with data brokers or advertising networks.</p>
            </Subsection>
          </Section>

          {/* Section 4 */}
          <Section number="04" title="Data Retention">
            <p>We retain your personal information for as long as your account is active or as needed to provide you with our Service. If you delete your account, we will delete or anonymize your personal data within 30 days, except where we are required to retain it for legal or regulatory purposes. Some information, such as messages sent to other users, may persist in the recipients' accounts.</p>
          </Section>

          {/* Section 5 */}
          <Section number="05" title="Data Security">
            <p>We take the security of your personal information seriously and implement appropriate technical and organizational measures to protect it, including encryption of data in transit and at rest, secure server infrastructure, regular security assessments, and access controls. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.</p>
          </Section>

          {/* Section 6 */}
          <Section number="06" title="Your Rights and Choices">
            <p>Depending on your location, you may have the following rights regarding your personal information:</p>
            <BulletList items={[
              "Access: Request a copy of the personal data we hold about you.",
              "Correction: Request that we correct any inaccurate or incomplete personal data.",
              "Deletion: Request that we delete your personal data by deleting your account in the app settings.",
              "Data portability: Request a copy of your data in a commonly used, machine-readable format.",
              "Withdraw consent: Where processing is based on consent, you may withdraw it at any time.",
              "Opt-out of communications: Unsubscribe from marketing emails using the link in any marketing email, or adjust your notification preferences in the app.",
              "Location: You can disable location services for ChooseQup at any time through your device settings.",
            ]} />
          </Section>

          {/* Section 7 */}
          <Section number="07" title="International Data Transfers">
            <p>Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. When we transfer your data internationally, we take steps to ensure that appropriate safeguards are in place to protect your information in accordance with this Privacy Policy and applicable law.</p>
          </Section>

          {/* Section 8 */}
          <Section number="08" title="Children's Privacy">
            <p>ChooseQup is not intended for anyone under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal data from a child under 18, we will take steps to delete that information as quickly as possible. If you believe a child under 18 has provided us with personal information, please contact us immediately.</p>
          </Section>

          {/* Section 9 */}
          <Section number="09" title="Third-Party Links and Services">
            <p>Our Service may contain links to third-party websites or services that are not operated by us. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party service you access through ChooseQup.</p>
          </Section>

          {/* Section 10 */}
          <Section number="10" title="Changes to This Policy">
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by posting the updated policy within the app and updating the "Last updated" date above. Your continued use of ChooseQup after any changes constitutes your acceptance of the updated policy.</p>
          </Section>

          {/* Section 11 */}
          <Section number="11" title="Contact Us">
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:</p>
            <div style={{
              background: "rgba(212, 175, 125, 0.06)",
              border: "1px solid rgba(212, 175, 125, 0.12)",
              borderRadius: 12,
              padding: "20px 24px",
              marginTop: 16,
            }}>
              <p style={{ margin: "0 0 6px", color: "#d4af7d", fontWeight: 600 }}>ChooseQup Dating</p>
              <p style={{ margin: "0 0 4px", color: "#b0afa8" }}>Email: janstovr@gmail.com</p>
              <p style={{ margin: 0, color: "#b0afa8" }}>Website: https://qup.date</p>
            </div>
          </Section>

          {/* Footer */}
          <div style={{
            marginTop: 64,
            paddingTop: 32,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            textAlign: "center",
            color: "#5a5a6a",
            fontSize: 13,
          }}>
            © 2026 ChooseQup Dating. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}

function Section({ number, title, children }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{
        display: "flex",
        alignItems: "baseline",
        gap: 14,
        marginBottom: 20,
      }}>
        <span style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 14,
          color: "#d4af7d",
          opacity: 0.7,
        }}>
          {number}
        </span>
        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(22px, 3vw, 28px)",
          fontWeight: 400,
          color: "#ffffff",
          margin: 0,
        }}>
          {title}
        </h2>
      </div>
      <div style={{ color: "#b0afa8", fontSize: 15 }}>
        {children}
      </div>
    </div>
  );
}

function Subsection({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{
        fontSize: 16,
        fontWeight: 600,
        color: "#d4d0c8",
        margin: "0 0 10px",
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul style={{
      listStyle: "none",
      padding: 0,
      margin: "12px 0 0",
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}>
      {items.map((item, i) => (
        <li key={i} style={{
          paddingLeft: 20,
          position: "relative",
          fontSize: 15,
          lineHeight: 1.7,
        }}>
          <span style={{
            position: "absolute",
            left: 0,
            top: 10,
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#d4af7d",
            opacity: 0.5,
          }} />
          {item}
        </li>
      ))}
    </ul>
  );
}
