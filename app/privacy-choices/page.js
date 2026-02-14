"use client"
export default function PrivacyChoices() {
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
              Your Data, Your Choice
            </div>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 400,
              color: "#ffffff",
              margin: "0 0 16px",
              letterSpacing: -0.5,
            }}>
              Privacy Choices
            </h1>
            <p style={{
              color: "#8a8a9a",
              fontSize: 15,
              margin: 0,
            }}>
              Manage your data and privacy settings on ChooseQup Dating
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
            At ChooseQup, we believe you should have full control over your personal data. Below you'll find all the ways you can manage, export, or delete your information.
          </div>

          {/* Delete Account */}
          <Card
            icon="🗑"
            title="Delete Your Account"
            description="Permanently delete your account and all associated data, including your profile, photos, matches, and messages."
          >
            <h4 style={{ color: "#d4d0c8", margin: "0 0 12px", fontWeight: 600 }}>How to delete your account:</h4>
            <Steps items={[
              "Open the ChooseQup app",
              "Go to Profile → Settings",
              "Scroll down to \"Account\"",
              "Tap \"Delete Account\"",
              "Confirm your decision",
            ]} />
            <p style={{ marginTop: 16, fontSize: 14, color: "#8a8a9a" }}>
              Your data will be permanently deleted within 30 days. During this period, your account will be deactivated and not visible to other users.
            </p>
          </Card>

          {/* Manage Profile Data */}
          <Card
            icon="✏️"
            title="Edit or Update Your Data"
            description="You can modify your personal information at any time directly within the app."
          >
            <h4 style={{ color: "#d4d0c8", margin: "0 0 12px", fontWeight: 600 }}>What you can edit:</h4>
            <TagList items={[
              "Name & Bio",
              "Profile Photos",
              "Professional Details",
              "Dating Preferences",
              "Email Address",
              "Phone Number",
              "Location Settings",
            ]} />
            <p style={{ marginTop: 16, fontSize: 14, color: "#8a8a9a" }}>
              Go to Profile → Edit Profile to update any of your information.
            </p>
          </Card>

          {/* Notification Preferences */}
          <Card
            icon="🔔"
            title="Notification & Communication Preferences"
            description="Control what notifications and communications you receive from us."
          >
            <h4 style={{ color: "#d4d0c8", margin: "0 0 12px", fontWeight: 600 }}>How to manage:</h4>
            <Steps items={[
              "Open the ChooseQup app",
              "Go to Profile → Settings → Notifications",
              "Toggle on or off: push notifications, email updates, and marketing communications",
            ]} />
            <p style={{ marginTop: 16, fontSize: 14, color: "#8a8a9a" }}>
              You can also unsubscribe from marketing emails by clicking the "Unsubscribe" link at the bottom of any email we send.
            </p>
          </Card>

          {/* Location */}
          <Card
            icon="📍"
            title="Location Data"
            description="Control whether ChooseQup can access your location."
          >
            <h4 style={{ color: "#d4d0c8", margin: "0 0 12px", fontWeight: 600 }}>How to manage:</h4>
            <Steps items={[
              "Go to your device's Settings",
              "Find ChooseQup in the app list",
              "Tap \"Location\" and choose: Always, While Using, or Never",
            ]} />
            <p style={{ marginTop: 16, fontSize: 14, color: "#8a8a9a" }}>
              Note: Disabling location may affect your ability to see nearby matches.
            </p>
          </Card>

          {/* Data Export */}
          <Card
            icon="📦"
            title="Request Your Data"
            description="You have the right to request a copy of all personal data we hold about you."
          >
            <p>To request a copy of your data, email us at:</p>
            <div style={{
              background: "rgba(212, 175, 125, 0.08)",
              borderRadius: 8,
              padding: "12px 18px",
              marginTop: 8,
              display: "inline-block",
            }}>
              <a href="mailto:janstovr@gmail.com" style={{
                color: "#d4af7d",
                textDecoration: "none",
                fontWeight: 600,
              }}>
                janstovr@gmail.com
              </a>
            </div>
            <p style={{ marginTop: 16, fontSize: 14, color: "#8a8a9a" }}>
              We will provide your data in a commonly used, machine-readable format within 30 days of your request.
            </p>
          </Card>

          {/* Third-Party Sign-In */}
          <Card
            icon="🔗"
            title="Third-Party Connections"
            description="Manage connections with services you used to sign in."
          >
            <p>If you signed in with Google, Apple, or LinkedIn, you can revoke ChooseQup's access through those platforms:</p>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <LinkItem label="Google" url="https://myaccount.google.com/permissions" />
              <LinkItem label="Apple" url="https://appleid.apple.com (Sign-In & Security → Sign in with Apple)" />
              <LinkItem label="LinkedIn" url="https://www.linkedin.com/psettings/permitted-services" />
            </div>
          </Card>

          {/* Contact */}
          <div style={{
            background: "rgba(212, 175, 125, 0.06)",
            border: "1px solid rgba(212, 175, 125, 0.12)",
            borderRadius: 16,
            padding: "32px 28px",
            marginTop: 48,
            textAlign: "center",
          }}>
            <h3 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 22,
              fontWeight: 400,
              color: "#ffffff",
              margin: "0 0 12px",
            }}>
              Need Help?
            </h3>
            <p style={{ color: "#b0afa8", fontSize: 15, margin: "0 0 20px" }}>
              If you have any questions about your privacy or need assistance managing your data, we're here to help.
            </p>
            <a href="mailto:janstovr@gmail.com" style={{
              display: "inline-block",
              padding: "12px 32px",
              background: "linear-gradient(135deg, #d4af7d, #c49b6a)",
              color: "#0a0a0f",
              fontWeight: 600,
              fontSize: 14,
              borderRadius: 50,
              textDecoration: "none",
              letterSpacing: 0.5,
            }}>
              Contact Us
            </a>
          </div>

          {/* Footer Links */}
          <div style={{
            marginTop: 48,
            paddingTop: 32,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            justifyContent: "center",
            gap: 24,
            flexWrap: "wrap",
          }}>
            <a href="/privacy" style={{ color: "#5a5a6a", fontSize: 13, textDecoration: "none" }}>
              Privacy Policy
            </a>
            <a href="/terms" style={{ color: "#5a5a6a", fontSize: 13, textDecoration: "none" }}>
              Terms of Service
            </a>
          </div>

          <div style={{
            marginTop: 24,
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

function Card({ icon, title, description, children }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 16,
      padding: "28px 28px 24px",
      marginBottom: 24,
    }}>
      <div style={{
        fontSize: 28,
        marginBottom: 12,
      }}>
        {icon}
      </div>
      <h3 style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: 22,
        fontWeight: 400,
        color: "#ffffff",
        margin: "0 0 8px",
      }}>
        {title}
      </h3>
      <p style={{
        color: "#8a8a9a",
        fontSize: 14,
        margin: "0 0 20px",
      }}>
        {description}
      </p>
      <div style={{ color: "#b0afa8", fontSize: 15 }}>
        {children}
      </div>
    </div>
  );
}

function Steps({ items }) {
  return (
    <ol style={{
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "flex",
      flexDirection: "column",
      gap: 8,
    }}>
      {items.map((item, i) => (
        <li key={i} style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          fontSize: 15,
        }}>
          <span style={{
            minWidth: 24,
            height: 24,
            borderRadius: "50%",
            background: "rgba(212, 175, 125, 0.12)",
            color: "#d4af7d",
            fontSize: 12,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 2,
          }}>
            {i + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

function TagList({ items }) {
  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 4,
    }}>
      {items.map((item, i) => (
        <span key={i} style={{
          padding: "6px 14px",
          background: "rgba(212, 175, 125, 0.08)",
          border: "1px solid rgba(212, 175, 125, 0.12)",
          borderRadius: 50,
          fontSize: 13,
          color: "#d4af7d",
        }}>
          {item}
        </span>
      ))}
    </div>
  );
}

function LinkItem({ label, url }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 14px",
      background: "rgba(255,255,255,0.03)",
      borderRadius: 8,
      fontSize: 14,
    }}>
      <span style={{ color: "#d4d0c8", fontWeight: 500 }}>{label}:</span>
      <span style={{ color: "#8a8a9a", fontSize: 13 }}>{url}</span>
    </div>
  );
}
