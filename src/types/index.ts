export type Language = 'sw' | 'en';
export type UserRole = 'admin' | 'teacher' | 'parent';
export type DeviceView = 'mobile' | 'tablet' | 'desktop';
export type ActiveTab = 'app-simulator' | 'db-schema' | 'sql-scripts' | 'android-architecture' | 'roles-auth';

export interface AuthUser {
  id: string;
  username: string;
  password_plain: string; // Provided for demonstration reference
  phone_number: string;
  full_name: string;
  role: UserRole;
  role_display_en: string;
  role_display_sw: string;
  associated_id?: string;
  associated_info_en: string;
  associated_info_sw: string;
  email?: string;
  avatar_emoji: string;
}

export interface Student {
  id: string;
  admission_number: string; // e.g. "TS-2023-0142"
  first_name: string;
  last_name: string;
  gender: 'M' | 'F';
  date_of_birth: string;
  class_id: string;
  class_name: string;
  level: 'nursery' | 'primary';
  parent_id: string;
  parent_name: string;
  parent_phone: string;
  residence_area: string; // Morogoro ward: Kihonda, Mazimbu, Msamvu, Forest Hill, etc.
  photo_url?: string;
  status: 'active' | 'graduated' | 'transferred';
}

export interface Staff {
  id: string;
  employee_id: string;
  full_name: string;
  role: 'headteacher' | 'academic_master' | 'bursar' | 'teacher' | 'support_staff';
  title_display: string;
  phone_number: string;
  email: string;
  specialization: string;
  qualification: string;
  assigned_class?: string;
  status: 'active' | 'on_leave';
}

export interface SchoolClass {
  id: string;
  class_code: string;
  class_name: string; // e.g. "Standard IV", "Baby Class"
  level: 'nursery' | 'primary';
  stream: 'A' | 'B' | 'Single';
  class_teacher_id: string;
  class_teacher_name: string;
  total_students: number;
  capacity: number;
}

export interface Subject {
  id: string;
  subject_code: string;
  subject_name_en: string;
  subject_name_sw: string;
  level: 'nursery' | 'primary';
  is_core: boolean;
}

export type AttendanceStatus = 'present' | 'absent' | 'excused' | 'sick';

export interface AttendanceRecord {
  id: string;
  date: string;
  student_id: string;
  student_name: string;
  class_id: string;
  status: AttendanceStatus;
  remarks?: string;
  synced: boolean;
}

export type NectaGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface ExamResult {
  id: string;
  exam_name: string;
  term: 'Term 1' | 'Term 2';
  academic_year: string;
  student_id: string;
  student_name: string;
  class_id: string;
  subject_id: string;
  subject_name: string;
  marks: number;
  grade: NectaGrade;
  remarks_en: string;
  remarks_sw: string;
  position?: number;
}

export interface ResultTeacherComment {
  id: string;
  student_id: string;
  student_name: string;
  class_name: string;
  parent_id: string;
  parent_name: string;
  parent_phone: string;
  teacher_id: string;
  teacher_name: string;
  teacher_role_title?: string;
  subject_name: string; // e.g. "Hisabati", "Ripoti Kamili ya Mtihani (General)"
  exam_name: string; // e.g. "Mid-Term Examination 2026"
  comment_text: string;
  created_at: string;
  reply_text?: string;
  reply_at?: string;
  status: 'pending_reply' | 'replied';
}

export interface FeePayment {
  id: string;
  receipt_number: string;
  student_id: string;
  student_name: string;
  class_name: string;
  fee_type: 'Tuition' | 'Transport' | 'Uniform' | 'Meals' | 'Development';
  amount_paid_tzs: number;
  total_due_tzs: number;
  balance_tzs: number;
  payment_date: string;
  payment_method: 'M-Pesa' | 'Airtel Money' | 'Tigo Pesa' | 'CRDB Bank' | 'NMB Bank' | 'Cash';
  control_number: string;
  status: 'verified' | 'pending' | 'rejected';
  reference_number: string;
}

export interface SchoolNotice {
  id: string;
  title_en: string;
  title_sw: string;
  message_en: string;
  message_sw: string;
  date: string;
  target: 'all' | 'parents' | 'teachers';
  urgent: boolean;
  author: string;
}

export interface SyncQueueItem {
  id: string;
  entity: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  timestamp: string;
  status: 'pending' | 'synced' | 'conflict';
  details: string;
}

export type DocumentCategory =
  | 'exam_paper'
  | 'marking_scheme'
  | 'lesson_plan'
  | 'scheme_of_work'
  | 'circular_notice'
  | 'curriculum_doc';

export interface AcademicDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  sender_id: string;
  sender_name: string;
  sender_role: 'teacher' | 'admin';
  recipient_id: string;
  recipient_name: string;
  recipient_role: 'teacher' | 'admin' | 'all_teachers';
  class_name: string;
  subject_name: string;
  term: string;
  academic_year: string;
  status: 'submitted' | 'under_review' | 'approved' | 'revision_requested' | 'distributed';
  file_name: string;
  file_size: string;
  file_type: 'pdf' | 'docx' | 'xlsx';
  description: string;
  created_at: string;
  reviewed_at?: string;
  admin_feedback?: string;
}

// ==================== THEME & APPEARANCE TYPES ====================
export type ThemeMode = 'dark-gold' | 'light-modern' | 'royal-navy' | 'emerald-school' | 'sunset-amber';
export type FontSizeMode = 'normal' | 'large' | 'compact';
export type CardStyleMode = 'rounded' | 'classic' | 'minimal';

export interface ThemeSettings {
  theme: ThemeMode;
  fontSize: FontSizeMode;
  cardStyle: CardStyleMode;
}

// ==================== PARENT REGISTRATION & DIRECT SMS TYPES ====================
export type CarrierType = 'Vodacom' | 'Airtel' | 'Tigo' | 'Halotel' | 'Other';

export interface LinkedChild {
  id?: string;
  student_name: string;
  student_admission?: string;
  class_name: string; // e.g. "Standard II (Darasa la 2)"
  class_id?: string;
  academic_year?: string;
}

export interface LinkedParent {
  id: string;
  parent_name: string;
  phone_number: string;
  student_name: string; // Primary child for backwards compatibility
  student_admission?: string;
  class_name: string; // Primary child class for backwards compatibility
  residence_area: string;
  linked_at: string;
  status: 'linked' | 'pending';
  carrier: CarrierType;
  total_messages_received: number;
  last_message_at?: string;
  academic_year?: string; // e.g. "2026"
  children?: LinkedChild[]; // All children linked to this parent across classes
}

export type DirectMessageType = 'sms' | 'attendance' | 'fee_reminder' | 'academic' | 'general';

export interface DirectParentMessage {
  id: string;
  sender_role: 'admin' | 'parent';
  sender_name: string;
  recipient_phone: string;
  recipient_name: string;
  parent_id?: string;
  message: string;
  message_type: DirectMessageType;
  timestamp: string;
  status: 'sent' | 'delivered' | 'acknowledged';
  is_read_by_parent: boolean;
  channel: 'SMS' | 'In-App';
}

// ==================== EXAM TIMETABLE & DISPATCH TYPES ====================
export type TimetableTargetAudience = 'teachers_only' | 'parents_only' | 'both';

export interface ExamScheduleSlot {
  id: string;
  day_label_sw: string; // e.g. "Jumatatu, 22 Septemba 2026"
  day_label_en: string; // e.g. "Monday, 22 September 2026"
  date: string; // e.g. "2026-09-22"
  time_slot: string; // e.g. "08:00 AM - 10:00 AM"
  subject_name: string; // e.g. "Hisabati (Mathematics)"
  class_name: string; // e.g. "Madarasa Yote (All Classes)" or "Standard IV"
  supervisor_name?: string; // e.g. "Mwl. Rehema Msangi & Mwl. Kavishe"
  room_or_hall?: string; // e.g. "Ukumbi Mkuu / Hall A"
  special_requirements?: string; // e.g. "Kalamu ya bluu, rula, na vifaa vya hesabu"
}

export interface ExamTimetable {
  id: string;
  title: string;
  exam_type: 'mid_term' | 'terminal' | 'mock' | 'annual' | 'monthly';
  term: string;
  academic_year: string;
  target_audience: TimetableTargetAudience; // 'teachers_only' | 'parents_only' | 'both'
  target_classes: string[]; // ["all"] or ["Standard IV", "Standard VII"]
  start_date: string;
  end_date: string;
  instructions_sw: string;
  instructions_en: string;
  slots: ExamScheduleSlot[];
  created_at: string;
  dispatched_by: string;
  status: 'dispatched' | 'draft';
  sms_message_preview?: string;
  stats?: {
    teachers_notified: number;
    parents_notified_sms: number;
  };
}

// ==================== DIGITAL ADMISSIONS & ENROLLMENT TYPES ====================
export type AdmissionStatus = 'submitted' | 'under_review' | 'payment_verified' | 'approved' | 'rejected';
export type AdmissionLevel = 'nursery' | 'primary';
export type PaymentChannel = 'M-Pesa' | 'Airtel Money' | 'Tigo Pesa' | 'Halopesa' | 'CRDB Bank' | 'NMB Bank';

export interface AdmissionChildBiodata {
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: 'M' | 'F';
  date_of_birth: string;
  age_display: string;
  birth_certificate_no?: string;
  previous_school?: string;
  health_medical_notes?: string;
  has_allergies?: boolean;
  photo_url?: string;
}

export interface AdmissionParentBiodata {
  parent_name: string;
  relationship: 'baba' | 'mama' | 'mlezi';
  phone_number: string;
  alt_phone_number?: string;
  nida_number?: string;
  occupation: string;
  residence_ward: string; // Ward in Morogoro e.g. Kihonda, Mazimbu, Msamvu, Forest Hill
  emergency_contact_name: string;
  emergency_contact_phone: string;
  needs_school_bus: boolean;
  bus_route?: string;
}

export interface AdmissionFeeItem {
  id: string;
  name_sw: string;
  name_en: string;
  amount_tzs: number;
  is_mandatory: boolean;
}

export interface AdmissionPaymentRecord {
  total_required_tzs: number;
  amount_paid_tzs: number;
  balance_tzs: number;
  payment_method: PaymentChannel;
  control_number: string;
  transaction_reference: string;
  payment_date: string;
  payment_status: 'verified' | 'pending' | 'rejected';
  receipt_number: string;
  breakdown: AdmissionFeeItem[];
  slip_attachment_name?: string;
}

export interface AdmissionApplication {
  id: string;
  reference_number: string; // e.g. "TS-ADM-2026-0042"
  application_date: string;
  academic_year: string; // e.g. "2026/2027"
  level: AdmissionLevel;
  applying_for_class: string; // e.g. "Baby Class" or "Standard I (Darasa la 1)"
  child: AdmissionChildBiodata;
  parent: AdmissionParentBiodata;
  payment: AdmissionPaymentRecord;
  status: AdmissionStatus;
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  approved_class_stream?: string; // e.g. "Baby Class Stream A"
  assigned_student_admission?: string; // e.g. "TS-2026-0315"
  reporting_date?: string; // e.g. "05 Januari 2027"
}

