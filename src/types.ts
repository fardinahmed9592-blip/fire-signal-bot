export type UserStatus = "pending" | "approved" | "rejected" | "suspended" | "Active" | "Inactive";

export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  registrationDate: string;
  isAdmin: boolean;
  has_access: boolean;
}

export interface UserDBRecord extends User {
  passwordHash: string;
}

export interface SignalHistory {
  id: string;
  userId: string;
  date: string;
  time: string;
  screenshot: string; // Base64 data URL
  signal: "BUY / UP" | "SELL / DOWN";
  confidence: number;
  analysisTime: string;
}

export interface SystemNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "approval_granted" | "approval_rejected" | "account_update" | "system";
  date: string;
  read: boolean;
}

export interface UsageStats {
  totalSignalsUsed: number;
  todaysSignals: number;
  lastSignalResult: "BUY / UP" | "SELL / DOWN" | null;
  accountStatus: UserStatus;
}

export interface DashboardAnalytics {
  totalUsers: number;
  approvedUsers: number;
  pendingUsers: number;
  totalSignalRequests: number;
  dailySignalRequests: number;
  monthlySignalRequests: number;
}
