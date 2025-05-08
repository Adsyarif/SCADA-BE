-- CreateTable
CREATE TABLE "RtuConfiguration" (
    "id" TEXT NOT NULL,
    "rtuName" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_by" TEXT,

    CONSTRAINT "RtuConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rtuId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_by" TEXT,

    CONSTRAINT "UserSite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RtuConfiguration_rtuName_key" ON "RtuConfiguration"("rtuName");

-- CreateIndex
CREATE UNIQUE INDEX "UserSite_userId_rtuId_key" ON "UserSite"("userId", "rtuId");

-- AddForeignKey
ALTER TABLE "UserSite" ADD CONSTRAINT "UserSite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSite" ADD CONSTRAINT "UserSite_rtuId_fkey" FOREIGN KEY ("rtuId") REFERENCES "RtuConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
