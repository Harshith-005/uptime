// Type definitions for UptimeGuard

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  created_at: string;
}

export interface Website {
  id: string;
  user_id: string;
  name: string;
  url: string;
  slug: string;
  status: "UP" | "DOWN" | "PENDING";
  consecutive_failures: number;
  last_checked_at: string | null;
  uptime_percentage: number;
  created_at: string;
}

export interface MonitoringLog {
  id: string;
  website_id: string;
  status: "UP" | "DOWN";
  response_time: number | null;
  error_message: string | null;
  checked_at: string;
}

export interface Incident {
  id: string;
  website_id: string;
  started_at: string;
  resolved_at: string | null;
  duration: number | null;
  status: "OPEN" | "RESOLVED";
  notified: boolean;
}

export interface Notification {
  id: string;
  website_id: string;
  email: string;
  type: "DOWN" | "RECOVERY";
  sent_at: string;
}

export interface SmtpSettings {
  id: string;
  user_id: string;
  host: string;
  port: number;
  username: string;
  password: string;
  from_name: string;
  from_email: string;
  created_at: string;
}

export interface WebsiteWithStats extends Website {
  recent_logs: MonitoringLog[];
  open_incident: Incident | null;
}
