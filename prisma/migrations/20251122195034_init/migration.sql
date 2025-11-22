-- CreateTable
CREATE TABLE "pacientes" (
    "id" TEXT NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "nome" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "telefone" TEXT,
    "endereco" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atendimentos" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "tipoAtendimento" TEXT NOT NULL DEFAULT 'emergencia',
    "senha" TEXT NOT NULL,
    "temperatura" DOUBLE PRECISION NOT NULL,
    "pressaoSistolica" INTEGER NOT NULL,
    "pressaoDiastolica" INTEGER NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "nivelPrioridade" INTEGER NOT NULL,
    "corPulseira" TEXT NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'aguardando',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "atendimentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pacientes_cpf_key" ON "pacientes"("cpf");

-- CreateIndex
CREATE INDEX "pacientes_cpf_idx" ON "pacientes"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "atendimentos_senha_key" ON "atendimentos"("senha");

-- CreateIndex
CREATE INDEX "atendimentos_pacienteId_idx" ON "atendimentos"("pacienteId");

-- CreateIndex
CREATE INDEX "atendimentos_dataHora_idx" ON "atendimentos"("dataHora");

-- AddForeignKey
ALTER TABLE "atendimentos" ADD CONSTRAINT "atendimentos_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
