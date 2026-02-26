import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { findPontoById } from "../bff/appBff";
import type { PontoTuristico } from "../domain";

const DetailsPontoPage: React.FC = () => {
  const { id } = useParams();
  const [pontoTuristico, setPontoTuristico] = useState<PontoTuristico | null>(
    null,
  );

  const fetchPontoTuristico = useCallback(async () => {
    const pontoTuristico = await findPontoById(id!);
    setPontoTuristico(pontoTuristico);
  }, [id]);

  useEffect(() => {
    fetchPontoTuristico();
  }, [fetchPontoTuristico]);

  return (
    <section
      aria-label="Detalhes do ponto turístico"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {pontoTuristico && (
        <>
          <h1 className="text-2xl font-extrabold mb-4">
            {pontoTuristico?.nome}
          </h1>
          <img
            src={pontoTuristico?.img || "https://picsum.photos/400/300?blur=2"}
            alt="Imagem do ponto turístico"
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <div className="flex flex-wrap gap-4 mb-4">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 font-semibold">
              {`Categoria: ${pontoTuristico?.tipo}`}
            </span>
            <span className="text-[#9fb0c8]">Cidade/UF</span>
          </div>
          <p className="text-sm text-[#9fb0c8] mb-4">
            {`Horário funcionamento: ${pontoTuristico?.horario}`}
          </p>
          <p className="text-base text-gray-800">{pontoTuristico?.desc}</p>
        </>
      )}
    </section>
  );
};

export default DetailsPontoPage;
