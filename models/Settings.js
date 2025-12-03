import mongoose from "mongoose";

const SecuritySchema = new mongoose.Schema({
  twoFA: { type: Boolean, default: false },
  emailVerification: { type: Boolean, default: false },
  sessionTimeout: { type: Number, default: 30, min: 5, max: 1440 }, // minutes
});

const UsersSchema = new mongoose.Schema({
  defaultRole: {
    type: String,
    enum: ["user", "moderator", "admin"],
    default: "user",
  },
});

const ModerationSchema = new mongoose.Schema({
  autoBan: { type: Boolean, default: false },
});

const AppearanceSchema = new mongoose.Schema({
  theme: { type: String, enum: ["dark", "light"], default: "dark" },
  accentColor: { type: String, default: "pink" },
});

const NotificationsSchema = new mongoose.Schema({
  emailEnabled: { type: Boolean, default: true },
  pushEnabled: { type: Boolean, default: false },
});

const IntegrationsSchema = new mongoose.Schema({
  apiKey: { type: String, default: "" },
});

const PrivacySchema = new mongoose.Schema({
  gdprEnabled: { type: Boolean, default: true },
});

const SettingsSchema = new mongoose.Schema(
  {
    security: { type: SecuritySchema, default: () => ({}) },
    users: { type: UsersSchema, default: () => ({}) },
    moderation: { type: ModerationSchema, default: () => ({}) },
    appearance: { type: AppearanceSchema, default: () => ({}) },
    notifications: { type: NotificationsSchema, default: () => ({}) },
    integrations: { type: IntegrationsSchema, default: () => ({}) },
    privacy: { type: PrivacySchema, default: () => ({}) },
    updatedBy: { type: String }, // optional: track admin who changed settings
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
