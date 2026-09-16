export interface SchemaTableDef {
  tableName: string;
  category: string;
  description_en: string;
  description_sw: string;
  columns: {
    name: string;
    type: string;
    isPrimary?: boolean;
    isForeign?: boolean;
    references?: string;
    isNullable?: boolean;
    isUnique?: boolean;
    description: string;
  }[];
}

export const SCHEMA_TABLES: SchemaTableDef[] = [
  {
    tableName: 'users',
    category: 'Authentication & RBAC',
    description_en: 'Central user authentication table for Admins, Teachers, and Parents with password hashing and status.',
    description_sw: 'Jedwali kuu la utambulisho na ulinzi wa watumiaji (Wakuu wa shule, Walimu, na Wazazi).',
    columns: [
      { name: 'id', type: 'UUID / VARCHAR(36)', isPrimary: true, description: 'Unique identifier (UUID v4)' },
      { name: 'username', type: 'VARCHAR(50)', isUnique: true, description: 'Unique login username or phone' },
      { name: 'email', type: 'VARCHAR(100)', isUnique: true, isNullable: true, description: 'Optional email for notifications' },
      { name: 'phone_number', type: 'VARCHAR(20)', isUnique: true, description: 'Primary phone (used for SMS alerts in TZ)' },
      { name: 'password_hash', type: 'VARCHAR(255)', description: 'Argon2id or bcrypt salted password hash' },
      { name: 'role', type: 'ENUM (admin, teacher, parent, bursar)', description: 'User security access role' },
      { name: 'is_active', type: 'BOOLEAN DEFAULT TRUE', description: 'Account activation status flag' },
      { name: 'created_at', type: 'TIMESTAMP DEFAULT NOW()', description: 'Account creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMP DEFAULT NOW()', description: 'Last profile update timestamp' },
    ],
  },
  {
    tableName: 'parents',
    category: 'Student Management',
    description_en: 'Profiles of parents and guardians with National ID (NIDA) and residence within Morogoro.',
    description_sw: 'Taarifa za wazazi na walezi, namba za NIDA, na maeneo ya makazi Manispaa ya Morogoro.',
    columns: [
      { name: 'id', type: 'UUID / VARCHAR(36)', isPrimary: true, description: 'Primary key' },
      { name: 'user_id', type: 'UUID', isForeign: true, references: 'users(id)', description: 'Linked login credentials' },
      { name: 'full_name', type: 'VARCHAR(120)', description: 'Father, Mother, or Guardian legal name' },
      { name: 'nida_number', type: 'VARCHAR(24)', isNullable: true, description: 'Tanzania National ID (NIDA)' },
      { name: 'occupation', type: 'VARCHAR(100)', isNullable: true, description: 'Parent profession/business' },
      { name: 'residence_ward', type: 'VARCHAR(80)', description: 'Morogoro ward (e.g., Kihonda, Mazimbu, Msamvu)' },
      { name: 'emergency_phone', type: 'VARCHAR(20)', description: 'Secondary emergency contact phone' },
    ],
  },
  {
    tableName: 'classes',
    category: 'Classes & Curriculum',
    description_en: 'Academic classes spanning Nursery (Baby, Middle, Pre-Unit) and Primary (Standard I to VII).',
    description_sw: 'Madarasa kuanzia Awali (Baby, Middle, Pre-Unit) hadi Msingi (Darasa I hadi VII).',
    columns: [
      { name: 'id', type: 'UUID / VARCHAR(36)', isPrimary: true, description: 'Class unique ID' },
      { name: 'class_code', type: 'VARCHAR(20)', isUnique: true, description: 'Standard code (e.g. STD-1, STD-4, NUR-B)' },
      { name: 'class_name', type: 'VARCHAR(50)', description: 'Display name (e.g. Standard IV)' },
      { name: 'level', type: 'ENUM (nursery, primary)', description: 'Curriculum level' },
      { name: 'stream', type: 'VARCHAR(10)', description: 'Stream designation (A, B, or Single)' },
      { name: 'class_teacher_id', type: 'UUID', isForeign: true, references: 'staff(id)', isNullable: true, description: 'Assigned patron/matron teacher' },
      { name: 'academic_year', type: 'VARCHAR(9)', description: 'e.g., 2026' },
      { name: 'capacity', type: 'INT DEFAULT 45', description: 'Classroom desk capacity limit' },
    ],
  },
  {
    tableName: 'students',
    category: 'Student Management',
    description_en: 'Pupils registered at Top Stars with admission number, class placement, parent links, and photo.',
    description_sw: 'Taarifa za wanafunzi, namba ya udahili, darasa, mzazi, na picha ya mwanafunzi.',
    columns: [
      { name: 'id', type: 'UUID / VARCHAR(36)', isPrimary: true, description: 'Unique student UUID' },
      { name: 'admission_number', type: 'VARCHAR(30)', isUnique: true, description: 'Unique school admission no (e.g. TS-2022-0045)' },
      { name: 'first_name', type: 'VARCHAR(50)', description: 'Given name' },
      { name: 'middle_name', type: 'VARCHAR(50)', isNullable: true, description: 'Middle / Father name' },
      { name: 'last_name', type: 'VARCHAR(50)', description: 'Family surname' },
      { name: 'gender', type: 'CHAR(1) CHECK (gender IN (\'M\', \'F\'))', description: 'Gender: M = Mvulana, F = Msichana' },
      { name: 'date_of_birth', type: 'DATE', description: 'Birth date for ECD/Primary eligibility' },
      { name: 'class_id', type: 'UUID', isForeign: true, references: 'classes(id)', description: 'Enrolled class' },
      { name: 'parent_id', type: 'UUID', isForeign: true, references: 'parents(id)', description: 'Primary parent/guardian' },
      { name: 'residence_area', type: 'VARCHAR(100)', description: 'Morogoro pickup address / zone' },
      { name: 'photo_url', type: 'VARCHAR(255)', isNullable: true, description: 'Passport photo storage path / CDN' },
      { name: 'medical_notes', type: 'TEXT', isNullable: true, description: 'Allergies, chronic conditions, emergency info' },
      { name: 'status', type: 'ENUM (active, graduated, transferred, suspended)', description: 'Enrollment state' },
    ],
  },
  {
    tableName: 'staff',
    category: 'Staff Management',
    description_en: 'Academic and administrative staff details, qualifications, and system roles.',
    description_sw: 'Taarifa za walimu na wafanyakazi wa shule, taaluma zao, na majukumu yao ya kazi.',
    columns: [
      { name: 'id', type: 'UUID / VARCHAR(36)', isPrimary: true, description: 'Staff UUID' },
      { name: 'user_id', type: 'UUID', isForeign: true, references: 'users(id)', description: 'Authentication credentials link' },
      { name: 'employee_id', type: 'VARCHAR(30)', isUnique: true, description: 'Internal staff payroll/record code' },
      { name: 'full_name', type: 'VARCHAR(120)', description: 'Full official name' },
      { name: 'role', type: 'ENUM (headteacher, academic_master, teacher, bursar, support)', description: 'Staff designation' },
      { name: 'specialization', type: 'VARCHAR(100)', description: 'Subject domain (e.g. Mathematics, Early Childhood)' },
      { name: 'qualification', type: 'VARCHAR(100)', description: 'Degree, Diploma, or Certificate level' },
      { name: 'hire_date', type: 'DATE', description: 'Date of contract start' },
      { name: 'is_active', type: 'BOOLEAN DEFAULT TRUE', description: 'Employment active status' },
    ],
  },
  {
    tableName: 'subjects',
    category: 'Classes & Curriculum',
    description_en: 'Tanzanian curriculum subjects for Nursery (KKK, Arts, English) and Primary (NECTA 7 subjects).',
    description_sw: 'Mtaala wa masomo ya Tanzania: KKK kwa Chekechea na Masomo 7 ya Msingi kwa NECTA.',
    columns: [
      { name: 'id', type: 'UUID / VARCHAR(36)', isPrimary: true, description: 'Subject UUID' },
      { name: 'subject_code', type: 'VARCHAR(20)', isUnique: true, description: 'e.g. HIS-01, KIS-01, KKK-01' },
      { name: 'subject_name_en', type: 'VARCHAR(80)', description: 'English name (e.g. Mathematics)' },
      { name: 'subject_name_sw', type: 'VARCHAR(80)', description: 'Swahili name (e.g. Hisabati)' },
      { name: 'level', type: 'ENUM (nursery, primary)', description: 'Target school division' },
      { name: 'is_core', type: 'BOOLEAN DEFAULT TRUE', description: 'Mandatory vs elective status' },
    ],
  },
  {
    tableName: 'class_subject_teachers',
    category: 'Classes & Curriculum',
    description_en: 'Maps which teacher teaches which subject in which class stream.',
    description_sw: 'Mgawanyo wa masomo: Mwalimu gani anafundisha somo gani kwenye darasa gani.',
    columns: [
      { name: 'id', type: 'UUID / VARCHAR(36)', isPrimary: true, description: 'Mapping ID' },
      { name: 'class_id', type: 'UUID', isForeign: true, references: 'classes(id)', description: 'Assigned class' },
      { name: 'subject_id', type: 'UUID', isForeign: true, references: 'subjects(id)', description: 'Assigned subject' },
      { name: 'teacher_id', type: 'UUID', isForeign: true, references: 'staff(id)', description: 'Subject instructor' },
    ],
  },
  {
    tableName: 'attendances',
    category: 'Attendance Tracking',
    description_en: 'Daily roll call records for pupils with offline syncing timestamps and SMS alert trigger.',
    description_sw: 'Rekodi za mahudhurio ya kila siku, alama ya ulandanishaji wa simu (Sync), na ujumbe wa SMS kwa mzazi.',
    columns: [
      { name: 'id', type: 'UUID / VARCHAR(36)', isPrimary: true, description: 'Attendance UUID' },
      { name: 'student_id', type: 'UUID', isForeign: true, references: 'students(id)', description: 'Target pupil' },
      { name: 'class_id', type: 'UUID', isForeign: true, references: 'classes(id)', description: 'Class enrolled' },
      { name: 'attendance_date', type: 'DATE', description: 'Roll call date' },
      { name: 'status', type: 'ENUM (present, absent, excused, sick)', description: 'Daily attendance mark' },
      { name: 'recorded_by', type: 'UUID', isForeign: true, references: 'staff(id)', description: 'Teacher submitting roll call' },
      { name: 'remarks', type: 'VARCHAR(255)', isNullable: true, description: 'Reason for absence or illness notes' },
      { name: 'is_synced', type: 'BOOLEAN DEFAULT FALSE', description: 'True if synced from mobile Room DB to Cloud' },
      { name: 'synced_at', type: 'TIMESTAMP', isNullable: true, description: 'Timestamp of cloud acknowledgment' },
    ],
  },
  {
    tableName: 'exams',
    category: 'Examinations & Grading',
    description_en: 'Official exam sessions (Weekly Test, Monthly, Mid-Term, Terminal, Annual, NECTA Mock).',
    description_sw: 'Vikao vya mitihani rasmi ya shule (Mazoezi, Mitihani ya Nusu Muhula, Muhula, na Mock).',
    columns: [
      { name: 'id', type: 'UUID / VARCHAR(36)', isPrimary: true, description: 'Exam UUID' },
      { name: 'exam_name', type: 'VARCHAR(100)', description: 'e.g. Mid-Term Examination 2026' },
      { name: 'term', type: 'ENUM (Term 1, Term 2)', description: 'Academic term' },
      { name: 'academic_year', type: 'VARCHAR(9)', description: 'e.g. 2026' },
      { name: 'exam_type', type: 'ENUM (weekly_test, monthly_test, midterm, terminal, annual, mock)', description: 'Assessment category' },
      { name: 'start_date', type: 'DATE', description: 'Exam start date' },
      { name: 'end_date', type: 'DATE', description: 'Exam finish date' },
    ],
  },
  {
    tableName: 'exam_results',
    category: 'Examinations & Grading',
    description_en: 'Subject-wise marks with automated NECTA primary grading (A: 81-100, B: 61-80, C: 41-60, D: 21-40, F: 0-20).',
    description_sw: 'Matokeo ya masomo yenye alama za asilimia na madaraja ya NECTA kwa shule za msingi.',
    columns: [
      { name: 'id', type: 'UUID / VARCHAR(36)', isPrimary: true, description: 'Result UUID' },
      { name: 'exam_id', type: 'UUID', isForeign: true, references: 'exams(id)', description: 'Linked examination' },
      { name: 'student_id', type: 'UUID', isForeign: true, references: 'students(id)', description: 'Student evaluated' },
      { name: 'subject_id', type: 'UUID', isForeign: true, references: 'subjects(id)', description: 'Subject examined' },
      { name: 'marks', type: 'DECIMAL(5,2) CHECK (marks >= 0 AND marks <= 100)', description: 'Score out of 100' },
      { name: 'grade', type: 'CHAR(1) CHECK (grade IN (\'A\',\'B\',\'C\',\'D\',\'F\'))', description: 'NECTA Grade computed' },
      { name: 'teacher_remarks', type: 'VARCHAR(255)', isNullable: true, description: 'Qualitative assessment notes' },
      { name: 'recorded_by', type: 'UUID', isForeign: true, references: 'staff(id)', description: 'Teacher who submitted score' },
    ],
  },
  {
    tableName: 'fee_structures',
    category: 'Fee & Financial Management',
    description_en: 'Approved fee items (Tuition, Bus Transport, Uniform, Lunch Meals, Building contribution).',
    description_sw: 'Mchanganuo wa ada (Ada ya Masomo, Usafiri wa Mabasi, Sare za Shule, Chakula, Mchango wa Ujenzi).',
    columns: [
      { name: 'id', type: 'UUID / VARCHAR(36)', isPrimary: true, description: 'Fee item UUID' },
      { name: 'category_name', type: 'VARCHAR(80)', description: 'e.g. Tuition Fee, Transport Kihonda-Mazimbu' },
      { name: 'level', type: 'ENUM (nursery, primary, all)', description: 'Applicable student bracket' },
      { name: 'term', type: 'ENUM (Term 1, Term 2, Annual)', description: 'Applicable installment period' },
      { name: 'academic_year', type: 'VARCHAR(9)', description: 'e.g. 2026' },
      { name: 'amount_tzs', type: 'DECIMAL(12,2) CHECK (amount_tzs > 0)', description: 'Amount in Tanzanian Shillings' },
      { name: 'is_compulsory', type: 'BOOLEAN DEFAULT TRUE', description: 'Compulsory vs optional fee' },
    ],
  },
  {
    tableName: 'fee_payments',
    category: 'Fee & Financial Management',
    description_en: 'Transactions with Control Numbers, Mobile Money references (M-Pesa, Tigo Pesa, Airtel Money, Bank).',
    description_sw: 'Malipo ya ada yenye Namba ya Udhibiti (Control Number), Risiti, na Miamala ya Simu/Benki.',
    columns: [
      { name: 'id', type: 'UUID / VARCHAR(36)', isPrimary: true, description: 'Payment UUID' },
      { name: 'receipt_number', type: 'VARCHAR(40)', isUnique: true, description: 'Official receipt code (REC-2026-XXXX)' },
      { name: 'student_id', type: 'UUID', isForeign: true, references: 'students(id)', description: 'Pupil credited' },
      { name: 'fee_structure_id', type: 'UUID', isForeign: true, references: 'fee_structures(id)', description: 'Fee item paid' },
      { name: 'amount_paid_tzs', type: 'DECIMAL(12,2) CHECK (amount_paid_tzs > 0)', description: 'Paid sum in TZS' },
      { name: 'payment_date', type: 'DATE', description: 'Date transaction was executed' },
      { name: 'payment_method', type: 'ENUM (M-Pesa, Airtel Money, Tigo Pesa, CRDB Bank, NMB Bank, Cash)', description: 'Payment channel' },
      { name: 'control_number', type: 'VARCHAR(20)', description: 'Gov/School 12-digit payment reference' },
      { name: 'transaction_reference', type: 'VARCHAR(50)', isUnique: true, description: 'Bank / Telco MPESA confirmation code' },
      { name: 'status', type: 'ENUM (verified, pending, rejected)', description: 'Bursar verification status' },
      { name: 'recorded_by', type: 'UUID', isForeign: true, references: 'users(id)', description: 'Staff who posted receipt' },
    ],
  },
  {
    tableName: 'offline_sync_logs',
    category: 'Offline Sync & Synchronization',
    description_en: 'Tracks changes made on Android devices while offline in Morogoro, handling two-way syncing.',
    description_sw: 'Ufuatiliaji wa taarifa zilizojazwa simuni bila intaneti na kulandanishwa na seva kuu pindi mtandao ukipatikana.',
    columns: [
      { name: 'id', type: 'UUID / VARCHAR(36)', isPrimary: true, description: 'Log UUID' },
      { name: 'device_id', type: 'VARCHAR(80)', description: 'Unique Android Hardware/Install ID' },
      { name: 'user_id', type: 'UUID', isForeign: true, references: 'users(id)', description: 'Authenticated user syncing' },
      { name: 'table_name', type: 'VARCHAR(50)', description: 'Target entity (e.g. attendances, exam_results)' },
      { name: 'record_id', type: 'UUID', description: 'Affected record ID' },
      { name: 'operation', type: 'ENUM (INSERT, UPDATE, DELETE)', description: 'Database action performed' },
      { name: 'device_timestamp', type: 'TIMESTAMP', description: 'Time action occurred on device' },
      { name: 'server_timestamp', type: 'TIMESTAMP DEFAULT NOW()', description: 'Time received on cloud backend' },
      { name: 'sync_status', type: 'ENUM (applied, conflict, rejected)', description: 'Conflict resolution outcome' },
    ],
  },
];

export const POSTGRESQL_DDL = `-- =============================================================================
-- TOP STARS NURSERY & PRIMARY SCHOOL - MOROGORO, TANZANIA
-- Database Management System (DBMS) Schema DDL
-- Platform: PostgreSQL 14+ / Supabase / Cloud SQL
-- Designed for: Multi-Role Access, NECTA Grading, TZS Payments & Offline Sync
-- =============================================================================

-- Enable UUID extension for high-performance distributed keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. ENUM TYPES
-- -----------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'parent', 'bursar');
CREATE TYPE school_level AS ENUM ('nursery', 'primary');
CREATE TYPE gender_type AS ENUM ('M', 'F');
CREATE TYPE student_status AS ENUM ('active', 'graduated', 'transferred', 'suspended');
CREATE TYPE staff_role AS ENUM ('headteacher', 'academic_master', 'teacher', 'bursar', 'support');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'excused', 'sick');
CREATE TYPE necta_grade AS ENUM ('A', 'B', 'C', 'D', 'F');
CREATE TYPE exam_term AS ENUM ('Term 1', 'Term 2');
CREATE TYPE exam_type AS ENUM ('weekly_test', 'monthly_test', 'midterm', 'terminal', 'annual', 'mock');
CREATE TYPE payment_channel AS ENUM ('M-Pesa', 'Airtel Money', 'Tigo Pesa', 'CRDB Bank', 'NMB Bank', 'Cash');
CREATE TYPE payment_status AS ENUM ('verified', 'pending', 'rejected');
CREATE TYPE sync_operation AS ENUM ('INSERT', 'UPDATE', 'DELETE');
CREATE TYPE sync_result AS ENUM ('applied', 'conflict', 'rejected');

-- -----------------------------------------------------------------------------
-- 2. USERS & AUTHENTICATION (RBAC)
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'parent',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_role ON users(role);

-- -----------------------------------------------------------------------------
-- 3. PARENTS & GUARDIANS
-- -----------------------------------------------------------------------------
CREATE TABLE parents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(120) NOT NULL,
    nida_number VARCHAR(24),
    occupation VARCHAR(100),
    residence_ward VARCHAR(80) NOT NULL, -- Kihonda, Mazimbu, Msamvu, Forest Hill, etc.
    emergency_phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_parents_residence ON parents(residence_ward);

-- -----------------------------------------------------------------------------
-- 4. STAFF & TEACHERS
-- -----------------------------------------------------------------------------
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    employee_id VARCHAR(30) NOT NULL UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    role staff_role NOT NULL DEFAULT 'teacher',
    specialization VARCHAR(100) NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_staff_role ON staff(role);

-- -----------------------------------------------------------------------------
-- 5. CLASSES & STREAMS
-- -----------------------------------------------------------------------------
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_code VARCHAR(20) NOT NULL UNIQUE, -- e.g. NUR-B, STD-1, STD-4
    class_name VARCHAR(50) NOT NULL,
    level school_level NOT NULL,
    stream VARCHAR(10) NOT NULL DEFAULT 'A',
    class_teacher_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    academic_year VARCHAR(9) NOT NULL, -- e.g. '2026'
    capacity INT NOT NULL DEFAULT 45 CHECK (capacity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_classes_level ON classes(level);

-- -----------------------------------------------------------------------------
-- 6. STUDENTS
-- -----------------------------------------------------------------------------
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admission_number VARCHAR(30) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    gender gender_type NOT NULL,
    date_of_birth DATE NOT NULL,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE RESTRICT,
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE RESTRICT,
    residence_area VARCHAR(100) NOT NULL,
    photo_url VARCHAR(255),
    medical_notes TEXT,
    status student_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_students_parent ON students(parent_id);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_adm ON students(admission_number);

-- -----------------------------------------------------------------------------
-- 7. SUBJECTS (Tanzania Curriculum: Nursery KKK + Primary NECTA)
-- -----------------------------------------------------------------------------
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_code VARCHAR(20) NOT NULL UNIQUE,
    subject_name_en VARCHAR(80) NOT NULL,
    subject_name_sw VARCHAR(80) NOT NULL,
    level school_level NOT NULL,
    is_core BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subject Allocation to Class & Teacher
CREATE TABLE class_subject_teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES staff(id) ON DELETE RESTRICT,
    UNIQUE(class_id, subject_id)
);

-- -----------------------------------------------------------------------------
-- 8. ATTENDANCE TRACKING (Supports Offline Sync)
-- -----------------------------------------------------------------------------
CREATE TABLE attendances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status attendance_status NOT NULL DEFAULT 'present',
    recorded_by UUID NOT NULL REFERENCES staff(id) ON DELETE RESTRICT,
    remarks VARCHAR(255),
    is_synced BOOLEAN NOT NULL DEFAULT FALSE,
    synced_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_daily_attendance UNIQUE (student_id, attendance_date)
);

CREATE INDEX idx_att_date_class ON attendances(attendance_date, class_id);
CREATE INDEX idx_att_student ON attendances(student_id);

-- -----------------------------------------------------------------------------
-- 9. EXAMINATIONS & NECTA GRADING
-- -----------------------------------------------------------------------------
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_name VARCHAR(100) NOT NULL,
    term exam_term NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    exam_type exam_type NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exam_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
    marks NUMERIC(5,2) NOT NULL CHECK (marks >= 0 AND marks <= 100),
    grade necta_grade NOT NULL,
    teacher_remarks VARCHAR(255),
    recorded_by UUID NOT NULL REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_subject_exam UNIQUE (exam_id, student_id, subject_id)
);

CREATE INDEX idx_results_exam_student ON exam_results(exam_id, student_id);

-- Automated Trigger for NECTA Grade Assignment
CREATE OR REPLACE FUNCTION fn_assign_necta_grade()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.marks >= 81 THEN
        NEW.grade := 'A';
    ELSIF NEW.marks >= 61 THEN
        NEW.grade := 'B';
    ELSIF NEW.marks >= 41 THEN
        NEW.grade := 'C';
    ELSIF NEW.marks >= 21 THEN
        NEW.grade := 'D';
    ELSE
        NEW.grade := 'F';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_necta_grade
BEFORE INSERT OR UPDATE OF marks ON exam_results
FOR EACH ROW
EXECUTE FUNCTION fn_assign_necta_grade();

-- -----------------------------------------------------------------------------
-- 10. FEE MANAGEMENT (Tanzanian Shillings - TZS)
-- -----------------------------------------------------------------------------
CREATE TABLE fee_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(80) NOT NULL,
    level school_level NOT NULL DEFAULT 'all',
    term VARCHAR(20) NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    amount_tzs NUMERIC(12,2) NOT NULL CHECK (amount_tzs > 0),
    is_compulsory BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fee_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_number VARCHAR(40) NOT NULL UNIQUE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    fee_structure_id UUID NOT NULL REFERENCES fee_structures(id) ON DELETE RESTRICT,
    amount_paid_tzs NUMERIC(12,2) NOT NULL CHECK (amount_paid_tzs > 0),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method payment_channel NOT NULL,
    control_number VARCHAR(20) NOT NULL,
    transaction_reference VARCHAR(50) NOT NULL UNIQUE,
    status payment_status NOT NULL DEFAULT 'verified',
    recorded_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_student ON fee_payments(student_id);
CREATE INDEX idx_payments_control_no ON fee_payments(control_number);

-- -----------------------------------------------------------------------------
-- 11. OFFLINE SYNC AUDIT & QUEUE
-- -----------------------------------------------------------------------------
CREATE TABLE offline_sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(80) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    operation sync_operation NOT NULL,
    device_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    server_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sync_status sync_result NOT NULL DEFAULT 'applied'
);

CREATE INDEX idx_sync_device ON offline_sync_logs(device_id, sync_status);
`;

export const MYSQL_DDL = `-- =============================================================================
-- TOP STARS NURSERY & PRIMARY SCHOOL - MOROGORO, TANZANIA
-- Database Management System (DBMS) Schema DDL
-- Platform: MySQL 8.0+ / MariaDB 10.5+
-- Engine: InnoDB (Full ACID compliance & Foreign Key constraints)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS top_stars_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE top_stars_db;

-- -----------------------------------------------------------------------------
-- 1. USERS & AUTHENTICATION
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'teacher', 'parent', 'bursar') NOT NULL DEFAULT 'parent',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_phone (phone_number),
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 2. PARENTS / GUARDIANS
-- -----------------------------------------------------------------------------
CREATE TABLE parents (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    nida_number VARCHAR(24) NULL,
    occupation VARCHAR(100) NULL,
    residence_ward VARCHAR(80) NOT NULL,
    emergency_phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_parent_ward (residence_ward)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 3. STAFF & TEACHERS
-- -----------------------------------------------------------------------------
CREATE TABLE staff (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    employee_id VARCHAR(30) NOT NULL UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    role ENUM('headteacher', 'academic_master', 'teacher', 'bursar', 'support') NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    hire_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 4. CLASSES
-- -----------------------------------------------------------------------------
CREATE TABLE classes (
    id VARCHAR(36) PRIMARY KEY,
    class_code VARCHAR(20) NOT NULL UNIQUE,
    class_name VARCHAR(50) NOT NULL,
    level ENUM('nursery', 'primary') NOT NULL,
    stream VARCHAR(10) NOT NULL DEFAULT 'A',
    class_teacher_id VARCHAR(36) NULL,
    academic_year VARCHAR(9) NOT NULL,
    capacity INT NOT NULL DEFAULT 45,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_teacher_id) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 5. STUDENTS
-- -----------------------------------------------------------------------------
CREATE TABLE students (
    id VARCHAR(36) PRIMARY KEY,
    admission_number VARCHAR(30) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50) NULL,
    last_name VARCHAR(50) NOT NULL,
    gender ENUM('M', 'F') NOT NULL,
    date_of_birth DATE NOT NULL,
    class_id VARCHAR(36) NOT NULL,
    parent_id VARCHAR(36) NOT NULL,
    residence_area VARCHAR(100) NOT NULL,
    photo_url VARCHAR(255) NULL,
    medical_notes TEXT NULL,
    status ENUM('active', 'graduated', 'transferred', 'suspended') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE RESTRICT,
    FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE RESTRICT,
    INDEX idx_std_class (class_id),
    INDEX idx_std_parent (parent_id)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 6. SUBJECTS
-- -----------------------------------------------------------------------------
CREATE TABLE subjects (
    id VARCHAR(36) PRIMARY KEY,
    subject_code VARCHAR(20) NOT NULL UNIQUE,
    subject_name_en VARCHAR(80) NOT NULL,
    subject_name_sw VARCHAR(80) NOT NULL,
    level ENUM('nursery', 'primary') NOT NULL,
    is_core BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 7. ATTENDANCES (Daily Roll Call)
-- -----------------------------------------------------------------------------
CREATE TABLE attendances (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    class_id VARCHAR(36) NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('present', 'absent', 'excused', 'sick') NOT NULL DEFAULT 'present',
    recorded_by VARCHAR(36) NOT NULL,
    remarks VARCHAR(255) NULL,
    is_synced BOOLEAN NOT NULL DEFAULT FALSE,
    synced_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES staff(id) ON DELETE RESTRICT,
    UNIQUE KEY uq_daily_student_att (student_id, attendance_date),
    INDEX idx_att_date_class (attendance_date, class_id)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 8. EXAMS & NECTA RESULTS
-- -----------------------------------------------------------------------------
CREATE TABLE exams (
    id VARCHAR(36) PRIMARY KEY,
    exam_name VARCHAR(100) NOT NULL,
    term ENUM('Term 1', 'Term 2') NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    exam_type ENUM('weekly_test', 'monthly_test', 'midterm', 'terminal', 'annual', 'mock') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE exam_results (
    id VARCHAR(36) PRIMARY KEY,
    exam_id VARCHAR(36) NOT NULL,
    student_id VARCHAR(36) NOT NULL,
    subject_id VARCHAR(36) NOT NULL,
    marks DECIMAL(5,2) NOT NULL,
    grade CHAR(1) NOT NULL,
    teacher_remarks VARCHAR(255) NULL,
    recorded_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE RESTRICT,
    FOREIGN KEY (recorded_by) REFERENCES staff(id) ON DELETE RESTRICT,
    UNIQUE KEY uq_exam_std_sub (exam_id, student_id, subject_id)
) ENGINE=InnoDB;

-- MySQL Trigger for NECTA Grading
DELIMITER $$
CREATE TRIGGER trg_before_insert_result
BEFORE INSERT ON exam_results
FOR EACH ROW
BEGIN
    IF NEW.marks >= 81 THEN
        SET NEW.grade = 'A';
    ELSEIF NEW.marks >= 61 THEN
        SET NEW.grade = 'B';
    ELSEIF NEW.marks >= 41 THEN
        SET NEW.grade = 'C';
    ELSEIF NEW.marks >= 21 THEN
        SET NEW.grade = 'D';
    ELSE
        SET NEW.grade = 'F';
    END IF;
END$$
DELIMITER ;

-- -----------------------------------------------------------------------------
-- 9. FEES & RECEIPTS (TZS)
-- -----------------------------------------------------------------------------
CREATE TABLE fee_structures (
    id VARCHAR(36) PRIMARY KEY,
    category_name VARCHAR(80) NOT NULL,
    level ENUM('nursery', 'primary', 'all') NOT NULL DEFAULT 'all',
    term VARCHAR(20) NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    amount_tzs DECIMAL(12,2) NOT NULL,
    is_compulsory BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE fee_payments (
    id VARCHAR(36) PRIMARY KEY,
    receipt_number VARCHAR(40) NOT NULL UNIQUE,
    student_id VARCHAR(36) NOT NULL,
    fee_structure_id VARCHAR(36) NOT NULL,
    amount_paid_tzs DECIMAL(12,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method ENUM('M-Pesa', 'Airtel Money', 'Tigo Pesa', 'CRDB Bank', 'NMB Bank', 'Cash') NOT NULL,
    control_number VARCHAR(20) NOT NULL,
    transaction_reference VARCHAR(50) NOT NULL UNIQUE,
    status ENUM('verified', 'pending', 'rejected') NOT NULL DEFAULT 'verified',
    recorded_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
    FOREIGN KEY (fee_structure_id) REFERENCES fee_structures(id) ON DELETE RESTRICT,
    FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_fee_control (control_number),
    INDEX idx_fee_student (student_id)
) ENGINE=InnoDB;
`;
