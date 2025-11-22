-- CreateTable
CREATE TABLE "sintomas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "nivelGravidadeBase" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sintomas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atendimentos_sintomas" (
    "id" TEXT NOT NULL,
    "atendimentoId" TEXT NOT NULL,
    "sintomaId" TEXT NOT NULL,
    "intensidade" TEXT NOT NULL,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "atendimentos_sintomas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sintomas_nome_key" ON "sintomas"("nome");

-- CreateIndex
CREATE INDEX "sintomas_categoria_idx" ON "sintomas"("categoria");

-- CreateIndex
CREATE INDEX "sintomas_nivelGravidadeBase_idx" ON "sintomas"("nivelGravidadeBase");

-- CreateIndex
CREATE INDEX "atendimentos_sintomas_atendimentoId_idx" ON "atendimentos_sintomas"("atendimentoId");

-- CreateIndex
CREATE INDEX "atendimentos_sintomas_sintomaId_idx" ON "atendimentos_sintomas"("sintomaId");

-- CreateIndex
CREATE UNIQUE INDEX "atendimentos_sintomas_atendimentoId_sintomaId_key" ON "atendimentos_sintomas"("atendimentoId", "sintomaId");

-- AddForeignKey
ALTER TABLE "atendimentos_sintomas" ADD CONSTRAINT "atendimentos_sintomas_atendimentoId_fkey" FOREIGN KEY ("atendimentoId") REFERENCES "atendimentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atendimentos_sintomas" ADD CONSTRAINT "atendimentos_sintomas_sintomaId_fkey" FOREIGN KEY ("sintomaId") REFERENCES "sintomas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
