-- AlterTable
ALTER TABLE "UserBook" ADD COLUMN     "customTags" INTEGER[];

-- CreateTable
CREATE TABLE "customTags" (
    "id" SERIAL NOT NULL,
    "tagName" TEXT NOT NULL,

    CONSTRAINT "customTags_pkey" PRIMARY KEY ("id")
);
