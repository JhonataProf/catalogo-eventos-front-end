# BFF guidelines

## Objetivo
O BFF deve adaptar os dados e fluxos do backend para as necessidades reais da interface, reduzindo acoplamento e simplificando a camada de apresentação.

## Princípios
- entregar para a UI apenas o necessário
- evitar overfetching
- centralizar composição de payloads
- proteger a UI de mudanças desnecessárias em APIs internas
- manter fronteiras claras entre regra de negócio e composição de dados

## Quando usar
- múltiplas fontes de dados para uma mesma tela
- necessidade de payload otimizado para a interface
- necessidade de simplificar a camada cliente
- cenários com áreas públicas e autenticadas com necessidades diferentes