export interface Employee {
  emp_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  dob: string; // Date of Birth (ISO string)
  gender: 'Male' | 'Female' | 'Other';
  marital_status: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  designation: string;
  department: string;
  employee_band: string;
  employee_type: 'Permanent' | 'Contract' | 'Intern';
  status: 'Active' | 'Inactive' | 'On Leave' | 'Retired' | 'Terminated';
  location: string;
  doj: string; // Date of Joining (ISO string)
  work_shift: 'Day' | 'Night' | 'Rotational';
  salary: number;
  bonus: number;
  benefits: string[]; // Array of benefits (e.g., "Health Insurance")
  stock_options: number;
  overtime_eligibility: boolean;
  annual_leave_balance: number;
  sick_leave_balance: number;
  experience: number; // Experience in years
  performance_rating: number; // Performance rating (1.0 to 5.0)
  last_promotion_date: string | null; // Date of last promotion (ISO string), or null
  years_since_last_promotion: number | null;
  performance_goal_completion: number; // Percentage completion of performance goals
  project_completion_rate: number; // Percentage of projects completed
  manager_id: number | null; // Manager's employee ID or null
  team_size: number;
  direct_reports: number;
  project_allocations: number;
  education: string; // Highest education level
  certifications: string[]; // List of certifications
  skills: string[]; // List of skills
  languages_spoken: string[]; // List of spoken languages
  training_completed: boolean;
  professional_memberships: string[]; // List of professional memberships
  office_floor: number;
  cubicle_number: string;
  parking_spot: string | null;
  remote_work: boolean;
  preferred_work_location: string;
  tax_id: string;
  bank_account_number: string;
  payroll_type: 'Monthly' | 'Bi-Weekly';
  insurance_coverage: string;
  retirement_plan: string; // E.g., "401k" or "Pension"
  monthly_deductions: number;
  employee_id_card: string; // Employee ID card number
  computer_serial_number: string;
  vpn_access: boolean;
  email_quota: string; // Storage quota for email (e.g., "31GB")
  system_access_level: 'Admin' | 'User' | 'Guest';
  last_system_login: string; // Date and time of last system login (ISO string)
  is_on_call: boolean;
}
