-- Student registration: photo, address, custom course name, fixed Nexvra
-- provider fields and batch dates. Email/phone become optional. Additive only:
-- existing rows keep their data and profile tokens (QR links stay valid).

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_institutionId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_programTypeOptionId_fkey";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "address" TEXT,
ADD COLUMN     "batchEndDate" DATE,
ADD COLUMN     "batchStartDate" DATE,
ADD COLUMN     "courseName" TEXT,
ADD COLUMN     "instituteName" TEXT NOT NULL DEFAULT 'Nexvra Solutions',
ADD COLUMN     "learnedFrom" TEXT NOT NULL DEFAULT 'Nexvra Solutions',
ADD COLUMN     "studentPhoto" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "programType" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_programTypeOptionId_fkey" FOREIGN KEY ("programTypeOptionId") REFERENCES "ProgramTypeOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

