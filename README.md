# Valença & Prado — v4 (quiet luxury)

Projeto conceitual de portfólio. O escritório, os profissionais, os números de OAB, o telefone, o e-mail e o endereço exibidos são fictícios.

Site estático: `index.html`, `styles.css`, `script.js` e imagens em `assets/`. Não há build.

## Estrutura da página
1. Abertura, com índice das quatro áreas
2. Perspectiva (atuação consultiva e preventiva)
3. Áreas de atuação
4. Por onde começar: escolha de tema + momento, que prepara a mensagem de WhatsApp
5. Como trabalhamos (método e princípios)
6. O escritório (`#escritorio`) e para quem atua
7. Sócios (`#socios`)
8. Dúvidas frequentes
9. Contato e rodapé com os dados de registro

As âncoras `#escritorio` e `#socios` foram mantidas para os prints do portfólio.

## Cuidados com a publicidade da advocacia
O texto foi revisado tendo como referência o Código de Ética e Disciplina da OAB (arts. 39 a 47) e o Provimento 205/2021 do CFOAB:
- tom informativo e sóbrio, sem promessa de resultado, sem comparação com outros escritórios e sem menção a valores;
- nenhum depoimento, caso, cliente ou número de resultado;
- o orientador "Por onde começar" informa a área relacionada e deixa claro que não é diagnóstico nem orientação jurídica;
- o rodapé traz o nome da sociedade, o campo de registro na OAB e o aviso de caráter informativo;
- as imagens mostram apenas ambientes neutros, sem ostentação.

## Antes de usar para um escritório real
Todos os campos marcados com `data-placeholder` no `index.html` precisam de dados reais:
- `oab`: nome completo e número de inscrição de cada sócio;
- `registro-sociedade`: razão social e número de registro da sociedade na OAB/MT;
- `endereco`, `telefone`, `email`;
- retratos dos sócios (hoje são placas com as iniciais e o aviso "Retrato a definir");
- `WHATSAPP_NUMBER` em `script.js` (vazio = modo demonstração; preenchido, o botão abre o WhatsApp com a mensagem);
- domínio no `canonical`, no Open Graph, no `sitemap.xml` e no `robots.txt`;
- remover o aviso de projeto conceitual e as notas de dados fictícios;
- confirmar com o escritório as áreas, os temas listados em cada área, o atendimento fora de Cuiabá e o "com hora marcada";
- só então trocar o JSON-LD `CreativeWork` por `LegalService`.

## Imagens
Fotos de ambientes vindas da versão publicada anterior (originalmente do Unsplash), convertidas para WebP e servidas localmente.
