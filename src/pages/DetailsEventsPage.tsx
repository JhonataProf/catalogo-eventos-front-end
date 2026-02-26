import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { findEventById } from "../bff/appBff";
import type { Evento } from "../domain";

const DetailsEventsPage: React.FC = () => {
  const { id } = useParams();
  const [evento, setEvento] = useState<Evento | null>(null);

  const fetchEvento = useCallback(async () => {
    const evento = await findEventById(id!);
    setEvento(evento);
  }, [id]);

  useEffect(() => {
    fetchEvento();
  }, [fetchEvento]);

  return (
    <section
      aria-label="Detalhes do evento"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {evento && (
        <>
          <h1 className="text-2xl font-extrabold mb-4">{evento?.titulo}</h1>
          <img
            src={evento?.img || "https://picsum.photos/800/450?blur=2"}
            alt="Imagem do evento"
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <div className="flex flex-wrap gap-4 mb-4">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 font-semibold">
              {evento?.cat}
            </span>
            <span className="text-[#9fb0c8]">{evento?.local}</span>
          </div>
          <p className="text-sm text-[#9fb0c8] mb-4">
            {`Data: ${evento?.data} | Horário: ${evento?.hora} | Local: ${evento?.local}`}
          </p>
          <p className="text-base text-gray-800">{evento?.desc}</p>
        </>
      )}
    </section>
  );
};

export default DetailsEventsPage;
