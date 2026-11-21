# Valença & Prado — v5 (quiet luxury, faixa Estratégico)

Projeto conceitual de portfólio. O escritório, os profissionais, os números de OAB, o telefone, o e-mail e o endereço exibidos são fictícios.

Site estático: `index.html`, `styles.css`, `script.js` e imagens em `assets/`. Não há build.

## Conceito
O site é tratado como um documento bem redigido: papel, tinta verde-escura e um único acento bordô. Cada seção é numerada na margem, como num parecer (§, I, II, III…). Tipografia: Libre Caslon Display e Libre Caslon Text nos títulos e Geist no texto. As fotos recebem um tratamento monocromático esverdeado para ficarem coesas.

## Estrutura da página
1. Abertura
2. § Princípio
3. I. Atuação (quatro áreas)
4. II. Pré-atendimento: tema, momento e forma de retorno (WhatsApp, ligação ou e-mail) + nome opcional, gerando um resumo e a mensagem para o escritório
5. § Método
6. III. Escritório (`#escritorio`)
7. IV. Sócios (`#socios`)
8. V. Dúvidas
9. Contato e rodapé com os dados de registro

As âncoras `#escritorio` e `#socios` foram mantidas para os prints do portfólio.

## Cuidados com a publicidade da advocacia
O texto foi revisado tendo como referência o Código de Ética e Disciplina da OAB (arts. 39 a 47) e o Provimento 205/2021 do CFOAB:
- tom informativo e sóbrio, sem promessa de resultado, sem comparação com outros escritórios e sem menção a valores;
- nenhum depoimento, caso, cliente ou número de resultado;
- o pré-atendimento informa a área relacionada, deixa claro que não é diagnóstico nem orientação jurídica e pede que não sejam enviados documentos, valores ou detalhes sigilosos;
- o rodapé traz o nome da sociedade, o campo de registro na OAB e o aviso de caráter informativo;
- as imagens mostram apenas ambientes neutros, sem ostentação.

## Antes de usar para um escritório real
Todos os campos marcados com `data-placeholder` no `index.html` precisam de dados reais:
- `oab`: nome completo e número de inscrição de cada sócio;
- `registro-sociedade`: razão social e número de registro da sociedade na OAB/MT;
- `endereco`, `telefone`, `email`;
- retratos dos sócios (hoje são placas com as iniciais e o aviso "Retrato a definir");
- `WHATSAPP_NUMBER` e `CONTACT_EMAIL` em `script.js` (vazios = modo demonstração; preenchidos, o botão abre o WhatsApp ou o e-mail com a mensagem);
- política de privacidade (LGPD), já que o pré-atendimento pede o nome;
- domínio no `canonical`, no Open Graph, no `sitemap.xml` e no `robots.txt`;
- remover o aviso de projeto conceitual e as notas de dados fictícios;
- confirmar com o escritório as áreas, os temas listados em cada área, o atendimento fora de Cuiabá e o "com hora marcada";
- só então trocar o JSON-LD `CreativeWork` por `LegalService`.

## Imagens
Fotos de ambientes vindas da versão publicada anterior (originalmente do Unsplash), convertidas para WebP e servidas localmente.
