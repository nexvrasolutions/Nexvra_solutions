-- CreateEnum
CREATE TYPE "ProgramType" AS ENUM ('COURSE', 'INTERNSHIP', 'CUSTOM');

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramTypeOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" "ProgramType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramTypeOption_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "programType" "ProgramType" NOT NULL DEFAULT 'COURSE';
ALTER TABLE "Student" ADD COLUMN     "departmentId" TEXT;
ALTER TABLE "Student" ADD COLUMN     "institutionId" TEXT;
ALTER TABLE "Student" ADD COLUMN     "programTypeOptionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Institution_name_key" ON "Institution"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramTypeOption_name_key" ON "ProgramTypeOption"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramTypeOption_value_key" ON "ProgramTypeOption"("value");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL;
ALTER TABLE "Student" ADD CONSTRAINT "Student_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE SET NULL;
ALTER TABLE "Student" ADD CONSTRAINT "Student_programTypeOptionId_fkey" FOREIGN KEY ("programTypeOptionId") REFERENCES "ProgramTypeOption"("id") ON DELETE SET NULL;
