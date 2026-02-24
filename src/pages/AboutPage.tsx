import { Card } from "../shared/ui";

const AboutPage = () => {

  return (
    <Card className="p-6">
      <h1 className="text-3xl font-bold mb-4">Sobre o Dourados+</h1>
      <p className="mb-4">
        O Dourados+ é um projeto inovador desenvolvido por alunos do Senac-MS,
        com o objetivo de criar um catálogo digital de eventos, pontos
        turísticos e informações sobre as cidades da região de Dourados. Este
        projeto visa promover a cultura local, incentivar o turismo e facilitar
        o acesso às informações para moradores e visitantes.
      </p>
      <p className="mb-4">
        A plataforma oferece uma interface amigável e intuitiva, permitindo que
        os usuários explorem uma variedade de eventos culturais, festivais,
        exposições e atividades recreativas. Além disso, o Dourados+ destaca os
        pontos turísticos mais importantes da região, proporcionando uma
        experiência enriquecedora para aqueles que desejam conhecer melhor a
        cidade.
      </p>
      <p>
        O Dourados+ é mais do que um simples catálogo; é uma ferramenta de
        conexão entre a comunidade local e os visitantes, promovendo o
        desenvolvimento cultural e econômico da região. Através deste projeto,
        esperamos contribuir para o fortalecimento da identidade local e para o
        crescimento do turismo em Dourados.
      </p>
    </Card>
  );
};

export default AboutPage;
