# Valença & Prado — v6 (quiet luxury, faixa Estratégico)

Projeto conceitual de portfólio. O escritório, os profissionais, os números de OAB, o telefone, o e-mail e o endereço exibidos são fictícios.

Site estático: `index.html`, `styles.css`, `script.js` e imagens em `assets/`. Não há build.

## Conceito
Advocacia organizada pelas fases de uma empresa e de uma família: **I Fundar, II Crescer, III Organizar, IV Suceder, V Resolver**. Quem chega encontra primeiro o momento em que está, e só depois a área do direito.

Gênero `quiet-luxury` do pacote design-taste, com a paleta fixa da skill: marfim `#F7F2EA`, painel `#EFE8DC`, tinta `#17130F` e um único acento latão `#9A7B4F`. Tipografia: Instrument Serif nos títulos e Instrument Sans no texto.

## Estrutura da página
1. Abertura: composição da versão anterior ("Antes da decisão, o contexto."), com texto à esquerda e foto vertical à direita
2. Atuação (`#atuacao`): as cinco fases, com um mostrador fixo que acompanha a leitura
3. Princípio do escritório
4. Agendar uma conversa (`#conversa`): fase, prazo e forma de retorno + nome opcional montam a mensagem
5. Compromissos (`#compromissos`): sigilo, honorários por escrito e nenhuma promessa de resultado
6. Sócios (`#socios`)
7. Escritório (`#escritorio`): endereço, contatos e dúvidas antes da visita
8. Fechamento e rodapé com os dados de registro

## Movimento (faixa Estratégico)
Feito com `taste-motion` e `taste-gsap` (GSAP 3.12 + ScrollTrigger, servidos de `assets/vendor/`), com `cinematic-motion` só como tempero, e revisado com `animate` e `review-animations`:
- tudo num `gsap.context` + `gsap.matchMedia`: com movimento reduzido, sem JS ou sem GSAP, a página já está completa;
- abertura numa timeline `expo.out` de 1,4s: as duas linhas do título sobem de trás da máscara e a foto abre de baixo para cima;
- blocos entram uma vez, em lote (`ScrollTrigger.batch`), e as linhas finas se desenham como traço de caneta;
- mostrador das fases com numeral que acompanha a leitura e linha preenchida pela rolagem;
- desktop: fotos deslizam dentro da moldura e o princípio do escritório fica fixo enquanto as palavras assentam (o único pin da página);
- linha de progresso de leitura em latão no cabeçalho;
- interface em CSS: hovers só com ponteiro fino, toque com `scale(.98)`, diálogo 240ms na entrada e 160ms na saída.

Ficaram de fora, de propósito, os efeitos de `cinematic-motion` que brigam com o quiet luxury de um escritório de advocacia: rolagem suave (Lenis), cursor personalizado, botão magnético, carrossel arrastável e preloader.

## Desempenho (`taste-web-performance`)
- Orçamento: LCP < 2,5s, CLS < 0,1, INP < 200ms e página abaixo de 500KB.
- Medido no Chromium: ~300KB no total, CLS 0, LCP de 0,5s no desktop e 1,7s no celular com CPU 4x mais lenta.
- Fontes servidas do próprio site (woff2, `font-display: swap`, as duas principais com `preload`), sem a folha de estilos externa do Google Fonts.
- Imagens WebP com `width`/`height`, `srcset` e recorte certo para cada tela (vertical no desktop, horizontal no celular). A foto de abertura tem `fetchpriority="high"`; a do escritório, `loading="lazy"`.
- Scripts com `defer`.

## Cuidados com a publicidade da advocacia
Texto revisado tendo como referência o Código de Ética e Disciplina da OAB (arts. 39 a 47) e o Provimento 205/2021 do CFOAB:
- tom informativo e sóbrio, sem promessa de resultado, sem comparação e sem valores;
- nenhum depoimento, caso, cliente ou número de resultado;
- a seção de compromissos explica que a advocacia é obrigação de meio;
- o agendamento avisa para não enviar documentos ou detalhes sigilosos e que a mensagem não é consulta;
- o rodapé traz o nome da sociedade, o campo de registro na OAB e o aviso de caráter informativo;
- as imagens são marcadas como ilustrativas.

## Antes de usar para um escritório real
Todos os campos marcados com `data-placeholder` no `index.html` precisam de dados reais:
- `oab`: nome completo e número de inscrição de cada sócio, e a divisão das fases entre eles;
- `registro-sociedade`: razão social e número de registro da sociedade na OAB/MT;
- `endereco`, `telefone`, `email`, `horario`;
- retratos dos sócios (hoje são placas com as iniciais e o aviso "Retrato a definir");
- `WHATSAPP_NUMBER` e `CONTACT_EMAIL` em `script.js` (vazios = modo demonstração; preenchidos, o botão abre o WhatsApp ou o e-mail com a mensagem);
- política de privacidade (LGPD), já que o agendamento pede o nome;
- domínio no `canonical`, no Open Graph, no `sitemap.xml` e no `robots.txt`;
- remover o aviso de projeto conceitual e as notas de dados fictícios;
- confirmar com o escritório as fases, os serviços listados em cada uma, a referência à tabela da OAB/MT e o atendimento fora de Cuiabá;
- só então trocar o JSON-LD `CreativeWork` por `LegalService`.

## Imagens
Fotos de ambientes vindas da versão publicada anterior (originalmente do Unsplash), convertidas para WebP e servidas localmente.
