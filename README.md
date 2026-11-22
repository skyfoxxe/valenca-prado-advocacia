# Valença & Prado — v6 (quiet luxury, faixa Estratégico)

Projeto conceitual de portfólio. O escritório, os profissionais, os números de OAB, o telefone, o e-mail e o endereço exibidos são fictícios.

Site estático: `index.html`, `styles.css`, `script.js` e imagens em `assets/`. Não há build.

## Conceito
Advocacia organizada pelas fases de uma empresa e de uma família: **I Fundar, II Crescer, III Organizar, IV Suceder, V Resolver**. Quem chega encontra primeiro o momento em que está, e só depois a área do direito.

Gênero `quiet-luxury` do pacote design-taste, com a paleta fixa da skill: marfim `#F7F2EA`, painel `#EFE8DC`, tinta `#17130F` e um único acento latão `#9A7B4F`. Tipografia: Instrument Serif nos títulos e Instrument Sans no texto.

## Estrutura da página
1. Abertura: título, chamada e índice das cinco fases
2. Atuação (`#atuacao`): as cinco fases, com um mostrador fixo que acompanha a leitura
3. Princípio do escritório
4. Agendar uma conversa (`#conversa`): fase, prazo e forma de retorno + nome opcional montam a mensagem
5. Compromissos (`#compromissos`): sigilo, honorários por escrito e nenhuma promessa de resultado
6. Sócios (`#socios`)
7. Escritório (`#escritorio`): endereço, contatos e dúvidas antes da visita
8. Fechamento e rodapé com os dados de registro

## Movimento (faixa Estratégico)
Feito com as skills `animate` e `review-animations`, nos tokens de `taste-motion`:
- abertura em sequência: cada palavra do título sobe de trás da própria máscara, o índice entra em cascata e a foto abre como uma persiana;
- blocos entram uma vez, 14px e 600ms, escalonados em 80ms quando entram juntos;
- linhas finas se desenham como traço de caneta;
- mostrador das fases troca o numeral com um leve desfoque e preenche a linha conforme a leitura;
- fotos deslizam devagar dentro da moldura com a rolagem (`animation-timeline: view()`, só onde há suporte);
- interface: hovers só com ponteiro fino, toque com `scale(.98)`, diálogo 240ms na entrada e 160ms na saída.

Com `prefers-reduced-motion` ou sem JavaScript, nada começa escondido.

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
