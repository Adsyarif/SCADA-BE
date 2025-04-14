-- CreateTable
CREATE TABLE "UserSupervisor" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "supervisorId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSupervisor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSupervisor_staffId_supervisorId_key" ON "UserSupervisor"("staffId", "supervisorId");

-- AddForeignKey
ALTER TABLE "UserSupervisor" ADD CONSTRAINT "UserSupervisor_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSupervisor" ADD CONSTRAINT "UserSupervisor_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
