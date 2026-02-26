const DetailsPage: React.FC = () => {
    return (
        <section
            aria-label="Detalhes do evento"
            className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
            <h1 className="text-2xl font-extrabold mb-4">Nome do Ponto Turistico</h1>
            <img
                src="https://picsum.photos/800/450?blur=2"
                alt="Imagem do evento"
                className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <div className="flex flex-wrap gap-4 mb-4">
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 font-semibold">
                    Categoria
                </span>
                <span className="text-[#9fb0c8]">Cidade/UF</span>
            </div>
            <p className="text-sm text-[#9fb0c8] mb-4">
                Horário de funcionamento: 6:00 - 20:00 | Local: Ex.: Rua tau bairro talco
            </p>
            <p className="text-base text-gray-300">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec  euismod, nisl eget consectetur sagittis, nisl nunc consectetur nisi, euismod nisl nunc euismod nisi, euismod nisl nunc euismod nisi. Donec euismod, nisl eget consectetur sagittis, nisl nunc consectetur nisi, euismod nisl nunc euismod nisi, euismod nisl nunc euismod nisi.
            </p>
        </section>
    );
};

export default DetailsPage;