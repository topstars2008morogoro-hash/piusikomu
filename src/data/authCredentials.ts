import { AuthUser } from '../types';

export const AUTH_USERS: AuthUser[] = [
  // 1. Headteacher / Mkuu wa Shule (ADMIN)
  {
    id: 'usr-admin-01',
    username: 'admin',
    password_plain: 'admin@topstars2026',
    phone_number: '+255754112233',
    full_name: 'Mwl. Josephat Kavishe',
    role: 'admin',
    role_display_en: 'Headteacher & Owner (Admin)',
    role_display_sw: 'Mkuu wa Shule & Uongozi (Admin)',
    associated_id: 'stf-01',
    associated_info_en: 'Office of the Headteacher • Full School Authority',
    associated_info_sw: 'Ofisi ya Mkuu wa Shule • Mamlaka Kamili ya Utawala',
    email: 'headteacher@topstarsschool.ac.tz',
    avatar_emoji: '👑',
  },

  // 2. Primary Class Teacher (TEACHER)
  {
    id: 'usr-teacher-01',
    username: 'mwl.msangi',
    password_plain: 'teacher@topstars2026',
    phone_number: '+255768334455',
    full_name: 'Mwl. Rehema Msangi',
    role: 'teacher',
    role_display_en: 'Class Teacher (Standard IV)',
    role_display_sw: 'Mwalimu wa Darasa (Darasa la IV)',
    associated_id: 'stf-03',
    associated_info_en: 'Class Patron STD 4A • Subject: Social Studies & English',
    associated_info_sw: 'Mwalimu wa Darasa la 4A • Masomo: Maarifa ya Jamii & Kiingereza',
    email: 'rehema.msangi@topstarsschool.ac.tz',
    avatar_emoji: '👩‍🏫',
  },

  // 3. Nursery Lead Teacher (TEACHER)
  {
    id: 'usr-teacher-02',
    username: 'madam.fatuma',
    password_plain: 'fatuma@topstars2026',
    phone_number: '+255715445566',
    full_name: 'Madam Fatuma Ally',
    role: 'teacher',
    role_display_en: 'Nursery Lead Teacher (Baby & Middle)',
    role_display_sw: 'Mwalimu Mkuu wa Awali (Chekechea)',
    associated_id: 'stf-04',
    associated_info_en: 'Early Childhood Development • KKK Specialist',
    associated_info_sw: 'Elimu ya Awali • Mtaalamu wa KKK',
    email: 'fatuma.ally@topstarsschool.ac.tz',
    avatar_emoji: '🌸',
  },

  // 4. Parent 1 (PARENT - Mzee Juma Mohamed)
  {
    id: 'usr-parent-01',
    username: 'mzazi.juma',
    password_plain: 'parent@topstars2026',
    phone_number: '+255754998877',
    full_name: 'Mzee Juma Mohamed',
    role: 'parent',
    role_display_en: 'Parent / Guardian',
    role_display_sw: 'Mzazi / Mlezi',
    associated_id: 'par-001',
    associated_info_en: 'Child: Baraka Juma (Standard IV A)',
    associated_info_sw: 'Mwanafunzi: Baraka Juma (Darasa la IV A)',
    email: 'juma.mohamed@gmail.com',
    avatar_emoji: '👨‍👧',
  },

  // 5. Parent 2 (PARENT - Bi. Aisha Ramadhani)
  {
    id: 'usr-parent-02',
    username: 'mzazi.aisha',
    password_plain: 'aisha@topstars2026',
    phone_number: '+255784332211',
    full_name: 'Bi. Aisha Ramadhani',
    role: 'parent',
    role_display_en: 'Parent / Guardian',
    role_display_sw: 'Mzazi / Mlezi',
    associated_id: 'par-002',
    associated_info_en: 'Child: Neema Hassan (Standard IV A)',
    associated_info_sw: 'Mwanafunzi: Neema Hassan (Darasa la IV A)',
    email: 'aisha.ramadhani@gmail.com',
    avatar_emoji: '🧕',
  },
];

/**
 * Helper to authenticate user by username or phone number and password
 */
export function authenticateUser(identifier: string, passwordAttempt: string): AuthUser | null {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = passwordAttempt.trim();

  // Normalize phone number (allow with or without country code or leading 0)
  const user = AUTH_USERS.find((u) => {
    const matchUsername = u.username.toLowerCase() === cleanId;
    const matchPhone =
      u.phone_number.replace(/\s+/g, '') === cleanId ||
      u.phone_number.replace(/^\+255/, '0').replace(/\s+/g, '') === cleanId ||
      u.phone_number.includes(cleanId);
    const matchEmail = u.email?.toLowerCase() === cleanId;

    return (matchUsername || matchPhone || matchEmail) && u.password_plain === cleanPass;
  });

  return user || null;
}
