import prisma from '../config/db';

export async function generateMemberId(): Promise<string> {
  const count = await prisma.memberProfile.count();
  const nextNum = 1000 + count + 1;
  let candidate = `IR-MEM-${nextNum}`;
  let exists = await prisma.memberProfile.findUnique({ where: { memberId: candidate } });
  let offset = 1;
  while (exists) {
    candidate = `IR-MEM-${nextNum + offset}`;
    exists = await prisma.memberProfile.findUnique({ where: { memberId: candidate } });
    offset++;
  }
  return candidate;
}

export async function generateTrainerId(): Promise<string> {
  const count = await prisma.trainerProfile.count();
  const nextNum = 100 + count + 1;
  let candidate = `IR-TRN-${nextNum}`;
  let exists = await prisma.trainerProfile.findUnique({ where: { trainerId: candidate } });
  let offset = 1;
  while (exists) {
    candidate = `IR-TRN-${nextNum + offset}`;
    exists = await prisma.trainerProfile.findUnique({ where: { trainerId: candidate } });
    offset++;
  }
  return candidate;
}

export async function generateReceiptNo(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.payment.count();
  const nextNum = String(count + 1).padStart(4, '0');
  let candidate = `REC-${year}-${nextNum}`;
  let exists = await prisma.payment.findUnique({ where: { receiptNo: candidate } });
  let offset = 1;
  while (exists) {
    candidate = `REC-${year}-${String(count + 1 + offset).padStart(4, '0')}`;
    exists = await prisma.payment.findUnique({ where: { receiptNo: candidate } });
    offset++;
  }
  return candidate;
}
