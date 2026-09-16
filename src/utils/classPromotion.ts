import { LinkedParent, LinkedChild } from '../types';
import { CLASSES } from '../data/mockData';

// Standardized list of class names in sequential order for Top Stars
export const CLASS_ORDER: { id: string; name: string; shortName: string; level: 'nursery' | 'primary' }[] = [
  { id: 'cls-baby', name: 'Baby Class', shortName: 'Baby Class', level: 'nursery' },
  { id: 'cls-mid', name: 'Middle Class', shortName: 'Middle Class', level: 'nursery' },
  { id: 'cls-pre', name: 'Pre-Unit (Awali)', shortName: 'Pre-Unit', level: 'nursery' },
  { id: 'cls-std1', name: 'Standard I (Darasa la 1)', shortName: 'Standard I', level: 'primary' },
  { id: 'cls-std2', name: 'Standard II (Darasa la 2)', shortName: 'Standard II', level: 'primary' },
  { id: 'cls-std3', name: 'Standard III (Darasa la 3)', shortName: 'Standard III', level: 'primary' },
  { id: 'cls-std4', name: 'Standard IV (Darasa la 4 - NECTA SFNA)', shortName: 'Standard IV', level: 'primary' },
  { id: 'cls-std5', name: 'Standard V (Darasa la 5)', shortName: 'Standard V', level: 'primary' },
  { id: 'cls-std6', name: 'Standard VI (Darasa la 6)', shortName: 'Standard VI', level: 'primary' },
  { id: 'cls-std7', name: 'Standard VII (Darasa la 7 - NECTA PSLE Candidate)', shortName: 'Standard VII', level: 'primary' },
];

export const GRADUATED_CLASS_NAME = 'Wahitimu / Alumni (Graduated)';

/**
 * Normalizes and checks whether two class strings refer to the same grade.
 * Handles variations like 'Standard II (Darasa la 2)', 'Standard II', 'Standard II A', etc.
 */
export function isMatchingClass(classA: string, classB: string): boolean {
  if (!classA || !classB) return false;
  if (classA.toLowerCase().trim() === classB.toLowerCase().trim()) return true;

  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/[\(\)\-\,\.]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const normA = normalize(classA);
  const normB = normalize(classB);

  if (normA.includes(normB) || normB.includes(normA)) return true;

  // Check key markers
  const markers = [
    { key: 'baby', matches: ['baby'] },
    { key: 'middle', matches: ['middle', 'mid'] },
    { key: 'pre-unit', matches: ['pre-unit', 'preunit', 'awali'] },
    { key: 'std1', matches: ['standard i', 'standard 1', 'darasa la 1', 'std 1', 'std i'] },
    { key: 'std2', matches: ['standard ii', 'standard 2', 'darasa la 2', 'std 2', 'std ii'] },
    { key: 'std3', matches: ['standard iii', 'standard 3', 'darasa la 3', 'std 3', 'std iii'] },
    { key: 'std4', matches: ['standard iv', 'standard 4', 'darasa la 4', 'std 4', 'std iv'] },
    { key: 'std5', matches: ['standard v', 'standard 5', 'darasa la 5', 'std 5', 'std v'] },
    { key: 'std6', matches: ['standard vi', 'standard 6', 'darasa la 6', 'std 6', 'std vi'] },
    { key: 'std7', matches: ['standard vii', 'standard 7', 'darasa la 7', 'std 7', 'std vii', 'psle'] },
    { key: 'alumni', matches: ['wahitimu', 'alumni', 'graduated'] },
  ];

  for (const item of markers) {
    const aHas = item.matches.some((m) => normA.includes(m));
    const bHas = item.matches.some((m) => normB.includes(m));
    if (aHas && bHas) return true;
  }

  return false;
}

/**
 * Returns the next class in the academic progression sequence.
 */
export function getNextClass(currentClassName: string): { nextClassName: string; isGraduated: boolean } {
  for (let i = 0; i < CLASS_ORDER.length; i++) {
    if (isMatchingClass(currentClassName, CLASS_ORDER[i].name)) {
      if (i < CLASS_ORDER.length - 1) {
        return { nextClassName: CLASS_ORDER[i + 1].name, isGraduated: false };
      } else {
        return { nextClassName: GRADUATED_CLASS_NAME, isGraduated: true };
      }
    }
  }
  // Default if not recognized: remain or graduate
  return { nextClassName: `${currentClassName} (Mwaka Ujao)`, isGraduated: false };
}

/**
 * Promotes all linked parents and their children to the next academic year.
 */
export function promoteAllParents(
  parents: LinkedParent[],
  nextYear: string
): { promotedParents: LinkedParent[]; totalPromotedStudents: number; totalGraduatedStudents: number } {
  let totalPromoted = 0;
  let totalGraduated = 0;

  const promotedParents = parents.map((parent) => {
    const rawChildren: LinkedChild[] =
      parent.children && parent.children.length > 0
        ? parent.children
        : [
            {
              student_name: parent.student_name,
              class_name: parent.class_name,
              student_admission: parent.student_admission,
              academic_year: parent.academic_year || '2026',
            },
          ];

    const updatedChildren = rawChildren.map((child) => {
      const { nextClassName, isGraduated } = getNextClass(child.class_name);
      if (isGraduated) {
        totalGraduated++;
      } else {
        totalPromoted++;
      }

      return {
        ...child,
        class_name: nextClassName,
        academic_year: nextYear,
      };
    });

    const primaryChild = updatedChildren[0];

    return {
      ...parent,
      academic_year: nextYear,
      children: updatedChildren,
      student_name: primaryChild.student_name,
      class_name: primaryChild.class_name,
      student_admission: primaryChild.student_admission,
    };
  });

  return {
    promotedParents,
    totalPromotedStudents: totalPromoted,
    totalGraduatedStudents: totalGraduated,
  };
}

/**
 * Returns all children for a parent, ensuring backward compatibility with single-child fields.
 */
export function getAllChildren(parent: LinkedParent): LinkedChild[] {
  if (parent.children && parent.children.length > 0) {
    return parent.children;
  }
  return [
    {
      student_name: parent.student_name,
      class_name: parent.class_name,
      student_admission: parent.student_admission,
      academic_year: parent.academic_year || '2026',
    },
  ];
}

/**
 * Checks if a parent has any child in the specified class.
 */
export function parentHasChildInClass(parent: LinkedParent, targetClass: string): boolean {
  const children = getAllChildren(parent);
  return children.some((c) => isMatchingClass(c.class_name, targetClass));
}

/**
 * Returns all other children for a parent except the ones in the current class.
 * Useful for the cross-class badge: "Pia ana mtoto Darasa la 3 (Asha Juma)".
 */
export function getOtherChildren(parent: LinkedParent, currentClass: string): LinkedChild[] {
  const children = getAllChildren(parent);
  return children.filter((c) => !isMatchingClass(c.class_name, currentClass));
}

/**
 * Formats Tanzanian phone numbers into uniform format for reliable matching.
 */
export function normalizePhoneNumber(phone: string): string {
  return phone.replace(/[\s\-\(\)]/g, '').replace(/^0/, '+255');
}
