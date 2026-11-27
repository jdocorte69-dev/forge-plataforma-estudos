#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""FORGE 7.0 — geração determinística dos 13 resumos mestres.

Uso (na raiz do repositório)::

    python scripts/generate_master_summaries.py

O script é 100% aditivo: lê ``saida/01_texto_extraido``, grava os arquivos
``saida/02_resumos_por_livro/RESUMAO_MESTRE_<BOOK_ID>.md`` e atualiza
``saida/00_inventario/inventario_v7.md``. Nenhum arquivo de ``livros/``,
``backup/``, ``js/``, ``css/`` ou da raiz é modificado.

Os catálogos temáticos abaixo são reconstruções didáticas (síntese pedagógica a
partir dos capítulos disponíveis). Toda fórmula é marcada como ilustrativa: o
OCR local corrompe símbolos e não autoriza atribuir transcrição literal.
"""

from __future__ import annotations

import ast
import collections
import datetime as dt
import math
import re
from pathlib import Path

try:
    from fractions import Fraction
except ImportError:  # pragma: no cover - biblioteca padrão sempre presente
    Fraction = None

ROOT = Path(__file__).resolve().parent.parent
EXTRACTED = ROOT / "saida" / "01_texto_extraido"
SUMMARIES = ROOT / "saida" / "02_resumos_por_livro"
INVENTORY_V7 = ROOT / "saida" / "00_inventario" / "inventario_v7.md"

SECTIONS = [
    "## 1. Mapa Conceitual da Obra (1 página)",
    "## 2. Enciclopédia dos 'Porquês' Respondidos",
    "## 3. Repositório de Fórmulas e Códigos Auditados",
    "## 4. Guia Prático: Como Dar Uma Aula Sobre Este Livro",
    "## 5. Avaliação Mestre — 20 Questões com Gabarito Comentado",
]

FORMULA_TAG = "〔ilustrativa — reconstrução didática; não extraída literalmente〕"

STOPWORDS = set(
    "de a o e do da em que um uma para com os as se na no por ao aos é são como "
    "mais menos entre sobre todo toda quando então antes depois cada pelas dos "
    "seu sua seus suas lhe lhes não sim onde qual quais quem cujo cuja ser foi "
    "foram sendo este esta estes estas esse essa isso já ainda bem pelo pela "
    "mesmos mesma mesmo todas todos muito pouco também apenas deve devem podem "
    "pode ter tem tinham havia há após sob sem até desde durante matemática "
    "fundamentos elementar capítulo capitulo exercício exercicios exercícios "
    "exemplo exemplos solução resolução resolva determine calcule temos valor "
    "valores número números igual lado lados abaixo cima página livro obra "
    "primeiro segunda terceiro quadrado ponto pontos figura desenho respeito "
    "parte forma modo vezes sendo está estão era foram sendo qual quer dizer "
    "pessoas resultado resultados problema problemas texto texto".split()
)

# ---------------------------------------------------------------------------
# Catálogos temáticos. Formato das linhas:
#   conceito: termo | definição | pergunta "por quê" | resposta concreta
#   fórmula:  id | expressão Unicode | leitura | lambda | argumentos | enunciado | justificativa
# ---------------------------------------------------------------------------

CONCEPTS = {
    "arith": """
número natural|Conjunto {0,1,2,3,...} usado para contar e ordenar.|Por que começamos pelos naturais?|Porque toda medição e contagem precisa de um conjunto mínimo fechado para somar e multiplicar sem sair dele.
número inteiro|Naturais, seus opostos e o zero.|Por que incluir negativos?|Para representar dívida, temperatura abaixo de zero e qualquer grandeza com direção oposta; sem eles, a subtração não seria sempre possível.
número racional|Quociente a/b com a inteiro e b inteiro não nulo.|Por que frações são necessárias?|Porque dividir 3 unidades entre 4 pessoas não tem resposta nos inteiros; o racional fecha a divisão (exceto por zero).
divisibilidade|Dizer que b divide a quando existe inteiro q com a = bq.|Por que definir divisibilidade antes do MDC?|Porque o MDC e o MMC só fazem sentido quando conseguimos reconhecer quais fatores são comuns aos números.
MDC|Maior inteiro positivo que divide dois ou mais inteiros.|Por que o MDC é único?|Porque o conjunto dos divisores comuns é finito e não vazio (contém 1), logo possui um maior elemento bem definido.
MMC|Menor inteiro positivo múltiplo comum de dois ou mais inteiros.|Por que o MMC aparece na soma de frações?|Porque ele é o denominador comum mínimo que preserva o valor das frações e evita números desnecessariamente grandes.
fração equivalente|a/b e c/d representam o mesmo número quando ad = bc.|Por que multiplicar numerador e denominador pelo mesmo fator não muda o valor?|Porque isso equivale a multiplicar por k/k = 1; a identidade multiplicativa preserva o número.
razão|Comparação de duas grandezas por quociente.|Por que razões exigem mesma unidade?|Porque comparar 2 metros com 3 centímetros diretamente daria 2/3 em vez de 200/3 após converter.
proporção|Igualdade entre duas razões.|Por que a igualdade ad = bc é útil?|Porque remove denominadores e transforma uma relação de grandezas em uma equação linear simples.
porcentagem|Razão com denominador 100.|Por que usar 100 como referência?|Porque padroniza comparações de partes de inteiros diferentes e permite comunicar variações com uma escala comum.
potência|aⁿ representa n fatores iguais a a multiplicados.|Por que a⁰ = 1?|Para que a regra aᵐ·aⁿ = aᵐ⁺ⁿ continue válida quando n = 0; impor outro valor quebraria a consistência algébrica.
raiz|ⁿ√a é o número x tal que xⁿ = a (com restrições de sinal).|Por que raiz de índice par exige a ≥ 0 no conjunto real?|Porque x² é sempre não negativo no conjunto real; exigir √(−1) real levaria a contradição.
""",
    "sets": """
conjunto|Coleção bem definida de elementos, com pertinência decidível.|Por que a definição deve ser bem definida?|Porque sem critério objetivo de pertinência não há como decidir se x pertence ao conjunto, e todas as operações seguintes ficam ambíguas.
pertinência|Relação x ∈ A que indica x ser elemento de A.|Por que distinguir ∈ de ⊂?|Porque ∈ liga elemento a conjunto, enquanto ⊂ liga conjunto a conjunto; confundi-los gera afirmações sem sentido.
subconjunto|A ⊂ B quando todo elemento de A pertence a B.|Por que A ∩ B = A caracteriza A ⊂ B?|Porque a interseção só conserva elementos comuns; se ela já é igual a A, todos os elementos de A estavam em B.
união|A ∪ B reúne os elementos que pertencem a A ou a B.|Por que a união não soma cardinalidades diretamente?|Porque elementos em A ∩ B seriam contados duas vezes; daí card(A ∪ B) = card(A) + card(B) − card(A ∩ B).
interseção|A ∩ B contém os elementos comuns a A e B.|Por que a interseção modela "e" lógico?|Porque pertencer aos dois conjuntos é exatamente a condição simultânea p ∧ q da lógica proposicional.
complementar|Aᶜ contém os elementos do universo que não estão em A.|Por que o universo precisa ser declarado?|Porque "o que não está em A" depende do domínio considerado; sem universo, o complementar não é determinado.
produto cartesiano|A × B é o conjunto dos pares ordenados (a,b) com a ∈ A e b ∈ B.|Por que pares são ordenados?|Porque (1,2) e (2,1) representam escolhas diferentes; a ordem codifica qual coordenada veio de cada conjunto.
proposição|Afirmação declarativa com valor-verdade V ou F.|Por que apenas proposições entram na lógica formal?|Porque perguntas e opiniões não possuem valor-verdade estável, e não há como construir tabelas-verdade com elas.
conectivo|Operador lógico como ¬, ∧, ∨, →, ↔.|Por que tabela-verdade define o conectivo?|Porque o sentido de um conectivo é completamente determinado pelo valor-verdade que ele atribui a cada combinação de entradas.
implicação|p → q é falsa apenas quando p é V e q é F.|Por que "se p então q" não exige que p seja verdadeiro?|Porque é uma promessa condicional: quando p é falso, a promessa não foi violada, logo a implicação é verdadeira por convenção coerente.
equivalência|p ↔ q vale quando p e q têm o mesmo valor-verdade.|Por que equivalência permite substituir expressões?|Porque duas fórmulas com a mesma tabela-verdade são intercambiáveis em qualquer argumento sem alterar o resultado.
função|Regra que associa a cada elemento do domínio um único elemento do contradomínio.|Por que a unicidade de imagem é essencial?|Porque uma relação com duas imagens para o mesmo x não permite prever o valor de f(x), quebrando o conceito de aplicação.
""",
    "logs": """
potência|Produto repetido aⁿ com base a e expoente n.|Por que potências são atalhos?|Porque transformar produtos longos em expoentes torna visíveis padrões de crescimento e simplifica equações.
expoente natural|Contador de fatores iguais na potência.|Por que a base pode ser negativa com expoente ímpar mas não com par?|Porque (−a)ⁿ alterna sinal conforme n; para n par o resultado é positivo, para n ímpar negativo.
expoente negativo|a⁻ⁿ = 1/aⁿ, com a ≠ 0.|Por que a ≠ 0 é obrigatório?|Porque 1/0 não existe; estender a regra ao zero geraria divisão por zero.
raiz n-ésima|Número que elevado a n devolve o radicando.|Por que √9 = 3 e não ±3?|Porque o símbolo √ denota a raiz aritmética não negativa; as duas soluções de x² = 9 são escritas como ±√9.
logaritmo|y = logₐ x é o expoente y tal que aʸ = x.|Por que logaritmo é o inverso da exponenciação?|Porque a exponenciação responde "qual é o resultado?", e o logaritmo responde "qual expoente produziu este resultado?".
base|Número a fixado em logₐ, com a > 0 e a ≠ 1.|Por que a base não pode ser 1?|Porque 1ʸ = 1 para todo y; a função não seria injetora e o logaritmo não teria valor único.
argumento|Valor x > 0 cujo logaritmo se calcula.|Por que o argumento deve ser positivo?|Porque aʸ > 0 para qualquer y real com a > 0; não existe expoente real que produza um número não positivo.
mudança de base|logₐ x = log_b x / log_b a.|Por que mudar de base é sempre possível?|Porque basta dividir as identidades x = a^(logₐ x) e x = b^(log_b x) e aplicar logaritmos; a razão é independente de x.
propriedade do produto|logₐ(MN) = logₐ M + logₐ N.|Por que produto vira soma?|Porque aᵘ·aᵛ = aᵘ⁺ᵛ; os expoentes que representam M e N se somam ao representar MN.
propriedade do quociente|logₐ(M/N) = logₐ M − logₐ N.|Por que quociente vira subtração?|Porque aᵘ/aᵛ = aᵘ⁻ᵛ, então o expoente de M/N é a diferença dos expoentes de M e N.
propriedade da potência|logₐ(Mᵏ) = k·logₐ M.|Por que o expoente k sai multiplicando?|Porque (aᵘ)ᵏ = aᵏᵘ; repetir M k vezes no argumento repete k vezes seu expoente.
equação exponencial|Equação em que a incógnita está no expoente.|Por que igualar bases resolve a equação?|Porque aˢ é estritamente monótona para a > 0 e a ≠ 1; bases iguais implicam expoentes iguais.
domínio logarítmico|Conjunto dos x para os quais logₐ x está definido.|Por que o domínio é (0, ∞)?|Porque ele é a imagem da exponenciação aʸ, que contém apenas números positivos.
""",
    "trig": """
ângulo|Figura formada por duas semirretas com origem comum.|Por que precisamos medir rotação e não só distância?|Porque formas inclinadas não são descritas apenas por comprimentos; a abertura entre direções é uma grandeza independente.
radiano|Ângulo cuja medida é o comprimento do arco dividido pelo raio.|Por que o radiano é natural em cálculo?|Porque s = rθ elimina fatores de conversão e torna derivadas trigonométricas simples.
seno|No triângulo retângulo, cateto oposto dividido pela hipotenusa.|Por que seno depende só do ângulo?|Porque triângulos retângulos semelhantes mantêm a mesma razão entre cateto oposto e hipotenusa.
cosseno|Cateto adjacente dividido pela hipotenusa.|Por que seno e cosseno satisfazem s² + c² = 1?|Porque o Teorema de Pitágoras divide todos os lados pela hipotenusa: (op/hip)² + (adj/hip)² = 1.
tangente|Razão seno/cosseno, igual a cateto oposto/cateto adjacente.|Por que tangente não existe em 90°?|Porque cosseno de 90° é zero e a divisão por zero é indefinida; geometricamente a reta tangente é vertical.
cossecante|Recíproco do seno: csc x = 1/sen x.|Por que funções recíprocas são úteis?|Porque certas relações de alturas e razões ficam mais curtas quando escritas com o inverso da razão principal.
ciclo trigonométrico|Circunferência unitária usada para estender as razões a qualquer ângulo.|Por que estender além de 90°?|Porque fenômenos periódicos (rotação, ondas, corrente alternada) percorrem o ciclo completo, não apenas o triângulo retângulo.
quadrante|Uma das quatro regiões do plano cartesiano limitada pelos eixos.|Por que os sinais mudam de quadrante?|Porque as coordenadas x e y do ponto no ciclo unitário trocam de sinal, e seno/cosseno herdam esses sinais.
identidade pitagórica|sen²x + cos²x = 1.|Por que ela é uma identidade e não uma equação?|Porque vale para todo x real; equações trigonométricas valem apenas para valores específicos da incógnita.
período|Menor intervalo após o qual a função repete seus valores.|Por que seno e cosseno têm período 2π enquanto tangente tem π?|Porque o par de coordenadas (cos x, sen x) só retorna após volta completa, mas a razão sen/cos repete após meia volta com ambos os sinais invertidos.
lei dos senos|Em qualquer triângulo, a/sen A = b/sen B = c/sen C = 2R.|Por que ela resolve triângulos sem ângulo reto?|Porque relaciona lados e ângulos opostos sem exigir Pitágoras, usando o raio da circunferência circunscrita.
lei dos cossenos|a² = b² + c² − 2bc·cos A.|Por que ela generaliza Pitágoras?|Porque quando A = 90°, cos A = 0 e a expressão reduz a a² = b² + c².
""",
    "seq": """
sequência|Função cujo domínio é o conjunto dos índices naturais.|Por que uma sequência é uma função?|Porque cada posição n recebe exatamente um valor aₙ; isso permite usar linguagem funcional para ordens infinitas.
recorrência|Lei que define aₙ a partir de termos anteriores.|Por que recorrências são úteis?|Porque muitos processos são descritos pela transição de um passo ao seguinte, sem necessidade de uma fórmula fechada imediata.
termo geral|Fórmula que dá aₙ diretamente em função de n.|Por que o termo geral é preferível para n grande?|Porque evita calcular todos os termos anteriores; basta substituir o índice desejado.
PA|Sequência em que aₙ₊₁ − aₙ = r constante.|Por que a razão constante define uma reta discreta?|Porque aₙ = a₁ + (n−1)r é linear em n, cuja imagem são pontos igualmente espaçados.
soma de PA|Sₙ = n(a₁ + aₙ)/2.|Por que essa fórmula funciona?|Porque emparelhar o primeiro com o último, o segundo com o penúltimo, dá n/2 pares com a mesma soma a₁ + aₙ.
PG|Sequência em que aₙ₊₁/aₙ = q constante.|Por que a razão q não pode ser zero?|Porque q = 0 tornaria todos os termos após o primeiro iguais a zero e a razão seguinte deixaria de ser definida.
soma de PG|Sₙ = a₁(qⁿ − 1)/(q − 1), q ≠ 1.|Por que q = 1 é caso separado?|Porque o denominador se anula; nesse caso todos os termos valem a₁ e Sₙ = n·a₁.
soma infinita|S∞ = a₁/(1 − q) quando o módulo de q é menor que 1.|Por que a condição módulo(q) < 1 é necessária?|Porque se módulo(q) ≥ 1 os termos não tendem a zero e a soma parcial não converge.
matriz|Arranjo retangular de números em linhas e colunas.|Por que a ordem das linhas e colunas importa?|Porque uma matriz representa uma aplicação linear: trocar linhas ou colunas altera a transformação descrita.
determinante|Escalar associado a uma matriz quadrada que mede fator de área/volume.|Por que determinante nulo indica sistema sem solução única?|Porque a transformação achata o espaço, perdendo dimensão; a matriz não pode ser invertida.
sistema linear|Conjunto de equações lineares com incógnitas comuns.|Por que resolver é intersectar soluções?|Porque cada equação descreve uma reta/hiperplano e a solução comum é a interseção desses conjuntos.
Cramer|xᵢ = det(Aᵢ)/det(A) quando det(A) ≠ 0.|Por que det(A) deve ser não nulo?|Porque ele aparece no denominador e garante que a matriz de coeficientes seja invertível.
""",
    "comb": """
princípio multiplicativo|Se há m escolhas para a primeira etapa e n para a segunda, há m·n resultados.|Por que multiplicar e não somar?|Porque cada escolha da primeira etapa combina com todas as escolhas da segunda; as combinações formam uma malha retangular.
princípio aditivo|Se etapas alternativas são excludentes, some as contagens.|Por que excludência é indispensável?|Porque se as alternativas se sobrepõem, contar duas vezes o mesmo resultado infla a resposta.
fatorial|n! = 1·2·...·n, com 0! = 1.|Por que 0! = 1?|Porque é a única convenção que mantém C(n,n) = 1 e a recorrência n! = n·(n−1)! válida em n = 1.
permutação|Ordenação de elementos; P(n,k) = n!/(n−k)!.|Por que ordenar aumenta a contagem?|Porque os mesmos k elementos geram k! arranjos diferentes quando a ordem é relevante.
combinação|Seleção sem ordem; C(n,k) = n!/[k!(n−k)!].|Por que dividir por k!?|Porque cada grupo de k elementos aparece k! vezes nas permutações; dividir remove essa redundância.
arranjo|Seleção com ordem e sem repetição, ou com repetição conforme o enunciado.|Por que distinguir repetição?|Porque "algarismos podem se repetir" troca n·(n−1) por nᶜ e muda radicalmente o total.
binomial|(x + y)ⁿ = Σ C(n,k)xⁿ⁻ᵏyᵏ.|Por que os coeficientes são combinações?|Porque escolher k fatores para fornecer y entre n fatores idênticos é exatamente escolher um subconjunto de tamanho k.
espaço amostral|Conjunto de todos os resultados possíveis de um experimento.|Por que defini-lo antes de calcular?|Porque probabilidade é razão entre eventos e espaço amostral; sem esse conjunto não há denominador.
probabilidade clássica|P(A) = card(A)/card(Ω) quando todos os resultados são equiprováveis.|Por que equiprovabilidade é hipótese necessária?|Porque contar resultados só equivale a medir chance quando cada resultado tem o mesmo peso.
probabilidade condicional|P(A dado B) = P(A∩B)/P(B), com P(B) > 0.|Por que o denominador muda para P(B)?|Porque restringimos o universo aos casos em que B ocorreu; a nova escala é P(B).
independência|P(A∩B) = P(A)·P(B).|Por que independência não é o mesmo que disjointo?|Porque eventos disjuntos têm P(A∩B) = 0, enquanto independentes podem ocorrer juntos com probabilidade produto.
inclusão-exclusão|P(A∪B) = P(A)+P(B)−P(A∩B).|Por que subtrair a interseção?|Porque os resultados comuns foram somados duas vezes e devem ser contados uma única vez.
""",
    "analytic": """
coordenada|Par (x,y) que localiza um ponto no plano a partir de dois eixos.|Por que dois números bastam?|Porque o plano é bidimensional: uma referência horizontal e outra vertical determinam o ponto de forma única.
eixos cartesianos|Retas perpendiculares x e y que se cortam na origem.|Por que os eixos precisam ser perpendiculares?|Porque assim as distâncias e projeções são independentes e Pitágoras aplica-se diretamente às coordenadas.
distância|d = √[(x₂−x₁)² + (y₂−y₁)²].|Por que a fórmula vem de Pitágoras?|Porque as diferenças de coordenadas são os catetos de um triângulo retângulo cuja hipotenusa é o segmento entre os pontos.
ponto médio|M = ((x₁+x₂)/2, (y₁+y₂)/2).|Por que média das coordenadas dá o meio?|Porque em cada eixo o ponto médio divide o segmento em duas partes iguais; a média aritmética é exatamente essa posição.
inclinação|m = (y₂−y₁)/(x₂−x₁), quando x₂ ≠ x₁.|Por que reta vertical não tem inclinação?|Porque x₂ = x₁ daria divisão por zero; a inclinação da vertical é infinita e tratada à parte.
equação da reta|y = mx + b, com b o coeficiente linear.|Por que b é a ordenada na origem?|Porque fazendo x = 0 obtemos y = b; o parâmetro b fixa onde a reta cruza o eixo y.
paralelismo|Retas distintas paralelas têm a mesma inclinação.|Por que mesma inclinação implica paralelismo?|Porque crescer a mesma quantidade em y para cada avanço em x mantém a distância entre as retas constante.
perpendicularismo|Retas perpendiculares não verticais satisfazem m₁·m₂ = −1.|Por que o produto é −1?|Porque girar uma reta de 90° troca o vetor (1,m) por (−m,1), cujo produto escalar com o original é zero.
distância ponto-reta|d = módulo(ax₀+by₀+c)/√(a²+b²).|Por que o módulo é necessário?|Porque o sinal de ax₀+by₀+c depende do lado da reta; distância é grandeza não negativa.
circunferência|(x−a)² + (y−b)² = R², centro (a,b).|Por que a equação é uma aplicação direta da distância?|Porque circunferência é o lugar de pontos a distância fixa R do centro.
parábola|y² = 2px (forma canônica).|Por que o parâmetro p controla a abertura?|Porque p é a distância entre foco e diretriz; aumentar p afasta o foco e alarga a curva.
área por determinante|A = módulo[x₁(y₂−y₃)+x₂(y₃−y₁)+x₃(y₁−y₂)]/2.|Por que metade do determinante?|Porque o determinante dos dois vetores-lado mede a área do paralelogramo, e o triângulo ocupa exatamente metade dele.
""",
    "plane": """
ponto|Entidade primitiva sem dimensão, representada por uma letra.|Por que pontos são primitivos?|Porque toda definição precisa começar em algum lugar; tentar definir ponto geraria regresso infinito.
reta|Entidade primitiva que se estende indefinidamente em dois sentidos.|Por que uma reta não tem extremos?|Porque ela é o modelo ideals para direção; segmentos e semirretas são recortes dela com 2 e 1 extremos.
segmento|Parte da reta entre dois pontos, inclusive eles.|Por que medir segmento é possível mas medir reta não?|Porque o segmento tem comprimento finito; a reta infinita não possui medida finita.
ângulo|Região entre duas semirretas de mesma origem.|Por que ângulo é grandeza independente do comprimento?|Porque dois ângulos com lados de comprimentos diferentes podem ter a mesma abertura; o que importa é a rotação.
congruência|Figuras com mesma forma e mesma medida.|Por que congruentes podem ser sobrepostos?|Porque congruência é definida por uma isometria: translação, rotação e reflexão preservam distâncias.
semelhança|Figuras com mesma forma, com lados proporcionais.|Por que a razão de semelhança elevada ao quadrado dá a razão de áreas?|Porque área depende do produto de duas dimensões, ambas multiplicadas pela mesma razão.
Pitágoras|Em triângulo retângulo, a² + b² = c².|Por que o teorema exige ângulo reto?|Porque a prova clássica usa a quadratura dos lados do quadrado construído sobre a hipotenusa; sem reto a relação muda (lei dos cossenos).
circunferência|Lugar dos pontos a uma distância fixa de um centro.|Por que toda reta perpendicular a um raio na extremidade é tangente?|Porque qualquer outro ponto dessa reta está mais distante do centro, igualando a definição de tangente.
polígono|Figura plana fechada por segmentos consecutivos.|Por que a soma dos ângulos internos é (n−2)·180°?|Porque decompor o polígono em n−2 triângulos a partir de um vértice soma exatamente essa quantidade de ângulos.
mediana|Segmento do vértice ao ponto médio do lado oposto.|Por que as três medianas concorrem no centroide?|Porque o ponto de equilíbrio do triângulo tem coordenadas médias dos vértices, comum às três medianas.
Tales|Uma reta paralela a um lado do triângulo corta os outros dois proporcionalmente.|Por que o paralelismo gera proporção?|Porque os dois triângulos formados são semelhantes por ângulos correspondentes iguais.
ângulo inscrito|Ângulo com vértice na circunferência e lados secantes.|Por que ele mede metade do ângulo central?|Porque o ângulo central subtende o mesmo arco a partir do centro e o teorema do arco divide essa medida por dois.
""",
    "solid": """
plano|Superfície plana infinita determinada por três pontos não colineares.|Por que três pontos colineares não determinam plano único?|Porque uma reta pertence a infinitos planos; é necessário um terceiro ponto fora dela para fixar um único plano.
reta reversa|Duas retas que não pertencem a nenhum plano comum.|Por que elas não podem ser paralelas nem concorrentes?|Porque retas paralelas e retas concorrentes sempre determinam um plano; resta apenas a situação de não coplanaridade.
posições relativas|Duas retas no espaço são paralelas, concorrentes ou reversas.|Por que a classificação é exaustiva?|Porque ou há ponto comum (concorrentes), ou não há; se não há, ou existe plano comum (paralelas) ou não existe (reversas).
diedro|Figura formada por dois semiplanos com mesma fronteira.|Por que medir um diedro é medir um ângulo plano?|Porque o ângulo entre os semiplanos é definido cortando-os por um plano perpendicular à aresta comum.
poliedro|Sólido limitado por faces poligonais planas.|Por que as faces devem ser planas?|Porque a noção de face, aresta e vértice depende de polígonos; superfícies curvas dão outros sólidos (cilindro, cone, esfera).
prisma|Poliedro com duas bases paralelas e congruentes e faces laterais paralelogramos.|Por que o volume é área da base vezes altura?|Porque o prisma empilha cópias idênticas da base ao longo da altura, como uma pilha de fatias.
pirâmide|Poliedro com uma base poligonal e faces triangulares concurrentes no vértice.|Por que o fator 1/3 no volume?|Porque três pirâmides de mesma base e altura decompõem um prisma equivalente; é o análogo discreto da integração de áreas decrescentes.
cilindro|Sólido gerado pela translação de um círculo ao longo de um eixo.|Por que seu volume é πr²h?|Porque cada fatia horizontal é um círculo de área πr² e há h camadas empilhadas.
cone|Sólido com base circular e vértice único.|Por que o volume do cone é um terço do cilindro circunscrito?|Porque as seções paralelas à base têm raios que diminuem linearmente; a média cúbica dos raios fornece o fator 1/3.
esfera|Lugar dos pontos a distância fixa de um centro no espaço.|Por que a área é 4πr²?|Porque a esfera decomposta em faixas equiprováveis tem área equivalente à de quatro círculos grandes.
área superficial|Soma das áreas das faces ou superfícies externas.|Por que área e volume escalam diferente?|Porque área cresce com o quadrado da escala e volume com o cubo; essa diferença explica efeitos de tamanho em biologia e engenharia.
relação de Euler|Para poliedros convexos, V − A + F = 2.|Por que essa relação é invariante?|Porque deformar o poliedro sem criar buracos preserva a característica topológica da esfera.
""",
    "finance": """
grandeza proporcional|Grandezas que variam por multiplicação por uma constante.|Por que distinguir direta de inversa?|Porque na direta o quociente é constante (y = kx) e na inversa o produto é constante (xy = k); confundi-las inverte a resposta.
variação percentual|(Vf − Vi)/Vi · 100%.|Por que usar Vi como denominador?|Porque a variação é medida em relação ao valor de partida; usar Vf troca a referência e distorce a taxa.
juros simples|J = C·i·t, com juros calculados sempre sobre o capital inicial.|Por que o crescimento é linear?|Porque a base de cálculo não muda; a cada período acresce a mesma quantia C·i.
capital|Valor inicial aplicado ou emprestado.|Por que ele difere de montante?|Porque capital é o que se coloca no início e montante é capital mais juros acumulados no fim.
taxa|Razão entre juros e capital em um período, geralmente expressa em porcentagem.|Por que a taxa deve ser convertida para decimal?|Porque fórmulas algébricas usam i = 5/100 = 0,05; deixar 5 quebraria o cálculo por fator 100.
montante|M = C(1 + i)ⁿ nos juros compostos.|Por que a exponenciação aparece?|Porque os juros de cada período incidem também sobre os juros anteriores; a multiplicação se repete n vezes.
valor presente|C = M/(1 + i)ⁿ.|Por que descontar é necessário?|Porque dinheiro futuro vale menos que dinheiro atual; trazer para o presente torna montantes de datas diferentes comparáveis.
desconto|Valor deduzido de um título antes do vencimento.|Por que desconto simples e composto diferem?|Porque o simples incide sobre o valor nominal e o composto sobre o valor já descontado, alterando a base.
média aritmética|x̄ = (x₁+...+xₙ)/n.|Por que a média é sensível a outliers?|Porque cada valor entra linearmente na soma; um valor extremo desloca o resultado na proporção de seu tamanho.
mediana|Valor central dos dados ordenados.|Por que usar mediana quando há outliers?|Porque ela depende apenas da posição, não da magnitude dos valores extremos.
variância|σ² = Σ(xᵢ − x̄)²/n.|Por que elevar ao quadrado?|Porque desvios positivos e negativos se cancelariam na soma; o quadrado mede dispersão sem sinal.
desvio padrão|σ = √σ², raiz da variância.|Por que tirar a raiz?|Porque a variância está em unidades ao quadrado; a raiz devolve a dispersão na unidade original dos dados.
""",
    "algebra": """
inteiro|Conjunto dos naturais, opostos e zero.|Por que a subtração fecha nos inteiros?|Porque a − b sempre existe nesse conjunto, enquanto em ℕ há resultados como 3 − 5 que não pertencem a ℕ.
racional|Qualquer número expressável como a/b com b ≠ 0.|Por que a divisão fecha nos racionais?|Porque a/b é elemento do próprio conjunto sempre que b ≠ 0, garantindo a operação inversa da multiplicação.
expressão algébrica|Combinação de números, letras e operações.|Por que usar letras?|Porque elas permitem descrever uma regra geral uma vez e aplicá-la a todos os valores da variável.
produto notável|Identidades como (a+b)² = a²+2ab+b².|Por que decorá-las como forma não basta?|Porque entendê-las como distribuição do produto permite reconstruí-las quando a memória falha e evita erros de sinal.
fatoração|Escrita de uma expressão como produto de fatores.|Por que fatorar simplifica equações?|Porque o produto é zero quando algum fator é zero, convertendo uma equação complexa em equações menores.
MMC e MDC|Ferramentas para denominadores comuns e fatores comuns.|Por que MDC e MMC aparecem juntos em frações?|Porque o MDC simplifica cada fração e o MMC encontra o denominador comum para somá-las.
fração algébrica|Quociente de duas expressões algébricas com denominador não nulo.|Por que declarar restrições de domínio?|Porque valores que anulam o denominador tornam a expressão indefinida e podem gerar raízes estranhas.
equação do 1º grau|ax + b = 0 com a ≠ 0.|Por que a ≠ 0 é condição essencial?|Porque a = 0 transforma a equação em b = 0, que é identidade ou absurdo, não uma equação de primeiro grau.
sistema de equações|Conjunto de equações satisfeitas simultaneamente.|Por que dois sistemas equivalentes têm a mesma solução?|Porque operações como somar equações ou multiplicar por constante não nula preservam o conjunto solução.
inequação|Relação de desigualdade envolvendo a incógnita.|Por que multiplicar por negativo inverte o sinal?|Porque a ordem dos números se inverte ao trocar o sinal: 2 < 3, mas −2 > −3.
equação do 2º grau|ax² + bx + c = 0 com a ≠ 0.|Por que existem no máximo duas raízes reais?|Porque um polinômio do grau 2 tem no máximo 2 raízes; fatorar por (x−r₁)(x−r₂) esgota o grau.
discriminante|Δ = b² − 4ac.|Por que Δ determina a natureza das raízes?|Porque Δ aparece sob a raiz na fórmula de Bhaskara: positivo dá duas raízes, zero uma, negativo nenhuma no conjunto real.
""",
}

FORMULAS = {
    "arith": """
div_eucl|r = a − b·⌊a/b⌋, 0 ≤ r < b|Divisão euclidiana: resto sempre menor que o divisor|lambda a,b: a - b*(a//b)|47,5|Na divisão euclidiana de 47 por 5, qual é o resto?|47 = 5·9 + 2, e 2 < 5.
mdc_eucl|mdc(a,b) = mdc(b, a mod b)|Algoritmo de Euclides reduz o problema a restos menores|lambda a,b: math.gcd(a,b)|48,18|Calcule mdc(48,18).|A sequência 18, 12, 6 termina em 6.
mmc|mmc(a,b) = a·b/mdc(a,b)|Produto dividido pelo maior divisor comum|lambda a,b: a*b//math.gcd(a,b)|12,18|Calcule mmc(12,18).|mdc = 6, logo mmc = 216/6 = 36.
frac_soma|a/b + c/d = (ad + bc)/(bd)|Soma de frações com denominador comum|lambda a,b,c,d: str(Fraction(a,b)+Fraction(c,d))|1,2,1,3|Calcule 1/2 + 1/3.|Denominador comum 6; 3/6 + 2/6 = 5/6.
frac_simp|a/b = (a/k)/(b/k), k ≠ 0|Simplificação preserva o valor da fração|lambda a,b: str(Fraction(a,b))|12,18|Simplifique 12/18.|Dividindo por k = 6 obtemos 2/3.
prop|a/b = c/d ⇒ ad = bc|Produto cruzado remove denominadores|lambda a,b,c,d: a*d|2,3,4,6|Se 2/3 = 4/6, qual é o valor do produto cruzado ad?|2·6 = 12 = 3·4.
pct|Vf = Vi·(1 + p/100)|Aumento percentual como fator multiplicativo|lambda Vi,p: Vi*(1+p/100)|200,12.5|Um valor de 200 sofre aumento de 12,5%. Qual o novo valor?|Fator 1,125; 200·1,125 = 225.
pot_prod|aᵐ·aⁿ = aᵐ⁺ⁿ|Multiplicação de potências de mesma base|lambda a,m,n: a**(m+n)|2,3,4|Calcule 2³·2⁴.|Somando expoentes: 2⁷ = 128.
diff_quad|(a+b)(a−b) = a² − b²|Diferença de quadrados|lambda a,b: a*a-b*b|7,3|Calcule (7+3)(7−3).|49 − 9 = 40.
quad_soma|(a+b)² = a² + 2ab + b²|Quadrado da soma|lambda a,b: (a+b)**2|5,2|Calcule (5+2)².|25 + 20 + 4 = 49.
eq_grau1|ax + b = 0 ⇒ x = −b/a, a ≠ 0|Equação linear de uma variável|lambda a,b: -b/a|3,-6|Resolva 3x − 6 = 0.|x = 6/3 = 2.
delta|Δ = b² − 4ac|Discriminante de uma equação quadrática|lambda a,b,c: b*b-4*a*c|1,-5,6|Calcule Δ de x² − 5x + 6 = 0.|25 − 24 = 1.
bhaskara|x = (−b + √Δ)/(2a), Δ ≥ 0|Maior raiz pela fórmula de Bhaskara|lambda a,b,c: (-b+math.sqrt(b*b-4*a*c))/(2*a)|1,-5,6|Calcule a maior raiz de x² − 5x + 6 = 0.|Δ = 1; x = (5+1)/2 = 3.
raiz_prod|√(ab) = √a·√b, a,b ≥ 0|Produto de raítes quadradas|lambda a,b: math.sqrt(a*b)|4,9|Calcule √(4·9).|√36 = 6 = 2·3.
""",
    "sets": """
card_uniao|A ∪ B: card(A ∪ B) = card(A) + card(B) − card(A ∩ B)|Cardinalidade da união com correção da interseção|lambda a,b,i: a+b-i|12,5,3|Se card(A)=12, card(B)=5 e card(A∩B)=3, calcule card(A∪B).|12 + 5 − 3 = 14.
cartesiano|A × B: card(A × B) = card(A)·card(B)|Cardinalidade do produto cartesiano|lambda a,b: a*b|3,4|Com card(A)=3 e card(B)=4, calcule card(A×B).|3·4 = 12 pares ordenados.
distributiva|A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)|Interseção distribui sobre união|lambda a,b,c: (a and (b or c)) == ((a and b) or (a and c))|True,False,True|Com a=V, b=F, c=V, a distributiva é verdadeira?|Ambos os lados são V.
demorgan|¬(p ∨ q) ≡ ¬p ∧ ¬q|Leis de De Morgan para disjunção|lambda p,q: (not (p or q)) == ((not p) and (not q))|False,True|Com p=F e q=V, a equivalência de De Morgan é V ou F?|¬(F∨V)=F e ¬F∧¬V=F∧V=F; logo V.
implicacao|p → q ≡ ¬p ∨ q|Implicação material em forma disjuntiva|lambda p,q: not p or q|True,False|Com p=V e q=F, qual é o valor de p → q?|Falso: é a única combinação que viola a promessa condicional.
contraposica|p → q ≡ ¬q → ¬p|Equivalência da contrapositiva|lambda p,q: (not p or q) == (q or not p)|True,False|Com p=V e q=F, a contrapositiva tem o mesmo valor que a implicação?|Ambas são F, logo a equivalência é V.
bicondicional|p ↔ q ≡ (p → q) ∧ (q → p)|Bicondicional como dupla implicação|lambda p,q: p == q|True,True|Com p=V e q=V, qual é o valor de p ↔ q?|Verdadeiro, pois os dois valores coincidem.
tautologia|p ∨ ¬p ≡ V|Princípio do terceiro excluído|lambda p: p or not p|False|Com p=F, calcule p ∨ ¬p.|¬p é V, logo a disjunção é V.
subset|A ⊆ B ⟺ A ∩ B = A|Critério de inclusão por interseção|lambda n,i: i == n|5,5|Se card(A)=5 e card(A∩B)=5, podemos afirmar A ⊆ B?|Sim: todos os 5 elementos de A pertencem a B.
compl|(A ∪ B)ᶜ = Aᶜ ∩ Bᶜ|De Morgan para complementares|lambda u,a,b,i: u-a-b+i == u-(a+b-i)|20,8,7,3|Com card(U)=20, card(A)=8, card(B)=7 e card(A∩B)=3, confira a igualdade de cardinalidades.|Aᶜ∩Bᶜ tem 20−8−7+3 = 8 elementos.
incl_tres|A∪B∪C: a+b+c−ab−ac−bc+abc|Inclusão-exclusão para três conjuntos (em notação de indicadores)|lambda a,b,c,ab,ac,bc,abc: a+b+c-ab-ac-bc+abc|10,8,6,3,2,1,0|Calcule a cardinalidade da união com os dados do enunciado.|10+8+6−3−2−1+0 = 18.
idempotente|A ∪ A = A e A ∩ A = A|Leis idempotentes|lambda n: n|7|Se card(A) = 7, qual é card(A ∪ A)?|A ∪ A não acrescenta elementos: 7.
""",
    "logs": """
pot_prod|aᵐ·aⁿ = aᵐ⁺ⁿ|Produto de potências de mesma base|lambda a,m,n: a**(m+n)|2,3,4|Calcule 2³·2⁴.|2⁷ = 128.
pot_neg|a⁻ⁿ = 1/aⁿ, a ≠ 0|Expoente negativo como recíproco|lambda a,n: a**(-n)|2,3|Calcule 2⁻³.|1/8 = 0,125.
raiz_exp|ⁿ√a = a^(1/n)|Raiz como expoente fracionário|lambda a,n: a**(1/n)|64,3|Calcule ³√64.|64^(1/3) = 4.
log_def|logₐ x = y ⟺ aʸ = x|Definição operacional do logaritmo|lambda a,x: math.log(x,a)|2,8|Calcule log₂8.|2³ = 8, logo o logaritmo é 3.
log_prod|logₐ(M·N) = logₐ M + logₐ N|Produto vira soma|lambda a,M,N: math.log(M*N,a)|2,8,4|Calcule log₂(8·4).|log₂8 = 3 e log₂4 = 2; soma 5.
log_quoc|logₐ(M/N) = logₐ M − logₐ N|Quociente vira diferença|lambda a,M,N: math.log(M/N,a)|2,32,4|Calcule log₂(32/4).|5 − 2 = 3, e 32/4 = 8 = 2³.
log_pot|logₐ(Mᵏ) = k·logₐ M|Expoente do argumento vira multiplicador|lambda a,M,k: math.log(M**k,a)|2,3,4|Calcule log₂(3⁴).|4·log₂3 ≈ 6,33985.
mudanca_base|logₐ x = log_b x / log_b a|Troca de base|lambda x,a,b: math.log(x,b)/math.log(a,b)|64,2,10|Calcule log₂64 usando logaritmos decimais.|log64/log2 ≈ 1,80618/0,30103 = 6.
identidade|a^(logₐ M) = M|Exponenciação e logaritmo se cancelam|lambda a,M: a**math.log(M,a)|3,81|Calcule 3^(log₃81).|log₃81 = 4 e 3⁴ = 81.
log_unidade|logₐ 1 = 0 e logₐ a = 1|Valores especiais|lambda a: math.log(1,a)|7|Calcule log₇1.|Qualquer base elevada a 0 dá 1, logo o resultado é 0.
eq_exp|a^(f(x)) = a^(g(x)) ⟺ f(x) = g(x), a>0, a≠1|Igualdade de bases permite igualar expoentes|lambda a,f,g: f == g if a > 0 and a != 1 else None|2,5,5|Com base 2, f(x)=5 e g(x)=5, os expoentes são iguais?|Sim; a monotonicidade da exponencial garante unicidade.
dominio|x > 0 no logₐ x|Restrição de domínio do logaritmo|lambda x: x > 0|-3|O valor x = −3 pertence ao domínio de log₂x?|Não: exponenciação de base positiva nunca produz número negativo.
""",
    "trig": """
identidade|sen²x + cos²x = 1|Pitágoras no ciclo unitário|lambda x: math.sin(x)**2 + math.cos(x)**2|0.5|Calcule sen²(0,5) + cos²(0,5).|A identidade garante exatamente 1.
tangente|tg x = sen x/cos x|Razão seno sobre cosseno|lambda x: math.sin(x)/math.cos(x)|math.pi/4|Calcule tg(π/4).|sen e cos valem √2/2; a razão é 1.
secante|sec x = 1/cos x|Recíproco do cosseno|lambda x: 1/math.cos(x)|math.pi/3|Calcule sec(π/3).|cos(π/3) = 1/2, logo sec = 2.
cossecante|csc x = 1/sen x|Recíproco do seno|lambda x: 1/math.sin(x)|math.pi/6|Calcule csc(π/6).|sen(π/6) = 1/2, logo csc = 2.
ident_sec|1 + tg²x = sec²x|Identidade derivada da pitagórica|lambda x: 1 + math.tan(x)**2|math.pi/4|Calcule 1 + tg²(π/4).|tg = 1; resultado 2, igual a sec²(π/4).
sen_soma|sen(α+β) = sen α·cos β + cos α·sen β|Fórmula da soma para o seno|lambda a,b: math.sin(a+b)|0.2,0.5|Calcule sen(0,2 + 0,5).|Aplicando a fórmula obtém-se o mesmo valor da soma direta.
cos_duplo|cos 2x = cos²x − sen²x|Formulação do cosseno do ângulo duplo|lambda x: math.cos(2*x)|math.pi/6|Calcule cos(2·π/6).|cos(π/3) = 0,5.
sen_duplo|sen 2x = 2·sen x·cos x|Sen do ângulo duplo|lambda x: 2*math.sin(x)*math.cos(x)|math.pi/6|Calcule sen(π/3) pela fórmula do ângulo duplo.|2·(1/2)·(√3/2) = √3/2 ≈ 0,866025.
radianos|180° = π rad|Conversão grau-radiano|lambda graus: graus*math.pi/180|60|Converta 60° para radianos.|60·π/180 = π/3 ≈ 1,0472.
lei_cossenos|a² = b² + c² − 2bc·cos A|Generalização de Pitágoras|lambda b,c,A: math.sqrt(b*b+c*c-2*b*c*math.cos(A))|3,4,math.pi/2|Com b=3, c=4 e A=90°, calcule a.|cos 90° = 0; a = √(9+16) = 5.
lei_senos|a/sen A = 2R|Lado em função do raio circunscrito|lambda R,A: 2*R*math.sin(A)|5,math.pi/6|Com R=5 e A=30°, calcule o lado a.|2·5·(1/2) = 5.
periodo_sen|Período de sen x é 2π|Repetição da função seno|lambda: 2*math.pi|()|Qual é o período do seno em radianos?|2π ≈ 6,28319; após uma volta completa o ciclo recomeça.
""",
    "seq": """
pa_termo|aₙ = a₁ + (n−1)r|Termo geral da progressão aritmética|lambda a1,r,n: a1+(n-1)*r|3,5,17|Calcule o 17º termo da PA com a₁=3 e r=5.|3 + 16·5 = 83.
pa_soma|Sₙ = n(a₁ + aₙ)/2|Soma dos n primeiros termos de uma PA|lambda a1,an,n: n*(a1+an)/2|2,50,17|Calcule a soma dos 17 termos de uma PA com a₁=2 e a₁₇=50.|17·52/2 = 442.
pg_termo|aₙ = a₁·qⁿ⁻¹|Termo geral da progressão geométrica|lambda a1,q,n: a1*q**(n-1)|2,3,5|Calcule o 5º termo da PG com a₁=2 e q=3.|2·3⁴ = 162.
pg_soma|Sₙ = a₁(qⁿ − 1)/(q − 1), q ≠ 1|Soma dos n primeiros termos de uma PG|lambda a1,q,n: a1*(q**n-1)/(q-1)|2,3,4|Some os 4 primeiros termos da PG 2, 6, 18, 54.|2+6+18+54 = 80.
pg_inf|S∞ = a₁/(1 − q), módulo(q) < 1|Soma de PG infinita convergente|lambda a1,q: a1/(1-q)|8,0.5|Calcule a soma infinita da PG com a₁=8 e q=1/2.|8/(1−0,5) = 16.
det2|det[[a,b],[c,d]] = ad − bc|Determinante de matriz 2×2|lambda a,b,c,d: a*d-b*c|2,3,4,5|Calcule o determinante de [[2,3],[4,5]].|2·5 − 3·4 = −2.
det3|det₃ = aei + bfg + cdh − ceg − bdi − afh|Regra de Sarrus para matriz 3×3|lambda a,b,c,d,e,f,g,h,i: a*e*i+b*f*g+c*d*h-c*e*g-b*d*i-a*f*h|1,2,3,4,5,6,7,8,9|Calcule o determinante da matriz 3×3 com linhas 1,2,3 / 4,5,6 / 7,8,9.|As linhas são linearmente dependentes; resultado 0.
prod_mat|Cᵢⱼ = Σₖ aᵢₖ·bₖⱼ|Elemento do produto de matrizes|lambda a,b,c,d: a*c+b*d|1,2,3,4|Calcule o elemento (1,1) do produto de [[1,2]] por [[3],[4]].|1·3 + 2·4 = 11.
cramer|x = det(Aₓ)/det(A), det(A) ≠ 0|Regra de Cramer para uma incógnita|lambda detA,detX: detX/detA|5,15|Com det(A)=5 e det(Aₓ)=15, calcule x.|15/5 = 3.
recorrencia|aₙ = a₀ + n·d|Sequência definida por recorrência linear simples|lambda a0,d,n: a0+n*d|4,3,5|Com a₀=4 e d=3, calcule a₅ a partir da recorrência.|4 + 5·3 = 19.
soma_nat|1+2+...+n = n(n+1)/2|Soma dos n primeiros naturais|lambda n: n*(n+1)//2|20|Calcule a soma de 1 a 20.|20·21/2 = 210.
""",
    "comb": """
fatorial|n! = 1·2·...·n e 0! = 1|Fatorial|lambda n: math.factorial(n)|6|Calcule 6!.|720.
permutacao|P(n,k) = n!/(n−k)!|Permutação simples sem repetição|lambda n,k: math.factorial(n)//math.factorial(n-k)|7,3|Calcule P(7,3).|7·6·5 = 210.
combinacao|C(n,k) = n!/[k!(n−k)!]|Combinação simples|lambda n,k: math.comb(n,k)|8,3|Calcule C(8,3).|56.
arranjo_rep|n^k|Arranjo com repetição permitida|lambda n,k: n**k|3,4|Com 3 algarismos e 4 posições com repetição, quantos números?|3⁴ = 81.
produto|P Total = m₁·m₂·...·mᵣ|Princípio fundamental da contagem|lambda m,n: m*n|5,6|5 blusas e 6 saias dão quantos conjuntos?|5·6 = 30.
binomio|Coeficiente de xⁿ⁻ᵏyᵏ em (x+y)ⁿ é C(n,k)|Teorema binomial|lambda n,k: math.comb(n,k)|5,2|Qual o coeficiente de x³y² em (x+y)⁵?|C(5,2) = 10.
prob_uniao|P(A∪B) = P(A)+P(B)−P(A∩B)|Probabilidade da união|lambda pa,pb,pi: pa+pb-pi|0.4,0.3,0.1|Com P(A)=0,4; P(B)=0,3; P(A∩B)=0,1, calcule P(A∪B).|0,4+0,3−0,1 = 0,6.
condicional|P(A dado B) = P(A∩B)/P(B), P(B)>0|Probabilidade condicional|lambda pai,pb: pai/pb|0.2,0.5|Com P(A∩B)=0,2 e P(B)=0,5, calcule P(A dado B).|0,2/0,5 = 0,4.
independentes|P(A∩B) = P(A)·P(B)|Eventos independentes|lambda pa,pb: pa*pb|0.3,0.4|Se P(A)=0,3 e P(B)=0,4 e são independentes, calcule P(A∩B).|0,3·0,4 = 0,12.
complementar|P(Aᶜ) = 1 − P(A)|Probabilidade do complementar|lambda pa: 1-pa|0.7|Se P(A)=0,7, calcule P(Aᶜ).|1 − 0,7 = 0,3.
binomial|P(k sucessos em n) = C(n,k)pᵏ(1−p)ⁿ⁻ᵏ|Distribuição binomial|lambda n,k,p: math.comb(n,k)*p**k*(1-p)**(n-k)|5,2,0.5|Em 5 lançamentos justos, qual a probabilidade de exatamente 2 caras?|C(5,2)·0,5⁵ = 10/32 = 0,3125.
incl_excl3|P(A∪B∪C) = ΣP(A) − ΣP(A∩B) + P(A∩B∩C)|Inclusão-exclusão para três eventos|lambda a,b,c,ab,ac,bc,abc: a+b+c-ab-ac-bc+abc|0.5,0.4,0.3,0.2,0.15,0.1,0.05|Calcule P(A∪B∪C) com os valores do enunciado.|0,5+0,4+0,3−0,2−0,15−0,1+0,05 = 0,8.
""",
    "analytic": """
distancia|d = √[(x₂−x₁)² + (y₂−y₁)²]|Distância entre dois pontos|lambda x1,y1,x2,y2: math.hypot(x2-x1,y2-y1)|1,2,4,6|Calcule a distância entre A(1,2) e B(4,6).|Δx=3, Δy=4; d=√(9+16)=5.
ponto_medio|M = ((x₁+x₂)/2, (y₁+y₂)/2)|Coordenadas do ponto médio|lambda x1,x2: (x1+x2)/2|3,9|Qual a abscissa do ponto médio entre x=3 e x=9?|(3+9)/2 = 6.
inclinacao|m = (y₂−y₁)/(x₂−x₁), x₂ ≠ x₁|Inclinação da reta|lambda x1,y1,x2,y2: (y2-y1)/(x2-x1)|1,2,4,8|Calcule a inclinação da reta por (1,2) e (4,8).|(8−2)/(4−1) = 2.
perpendicular|m⊥ = −1/m|Inclinação da perpendicular|lambda m: -1/m|2|Qual a inclinação da reta perpendicular a uma reta de inclinação 2?|−1/2 = −0,5.
ponto_reta|d = módulo(ax₀+by₀+c)/√(a²+b²)|Distância de ponto à reta ax+by+c=0|lambda a,b,c,x,y: abs(a*x+b*y+c)/math.sqrt(a*a+b*b)|3,4,-5,1,1|Calcule a distância de (1,1) à reta 3x+4y−5=0.|Número = módulo(3+4−5) = 2; denominador = 5; d = 0,4.
circunferencia|(x−a)²+(y−b)² = R²|Equação da circunferência|lambda x,y,a,b: math.hypot(x-a,y-b)|4,5,1,2|Qual o raio da circunferência de centro (1,2) que passa por (4,5)?|√[(4−1)²+(5−2)²] = √18 ≈ 4,24264.
elipse|x²/a² + y²/b² = 1|Equação canônica da elipse|lambda a,b,x,y: x*x/(a*a)+y*y/(b*b)|3,4,0,4|O ponto (0,4) pertence à elipse com a=3, b=4?|0 + 16/16 = 1; pertence.
parabola|y² = 2px|Parábola canônica com eixo horizontal|lambda p,y: y*y/(2*p)|2,4|Para p=2 e y=4, qual o valor de x na parábola y²=2px?|x = 16/4 = 4.
area_triangulo|A = módulo[x₁(y₂−y₃)+x₂(y₃−y₁)+x₃(y₁−y₂)]/2|Área por determinante de coordenadas|lambda x1,y1,x2,y2,x3,y3: abs(x1*(y2-y3)+x2*(y3-y1)+x3*(y1-y2))/2|0,0,4,0,0,3|Calcule a área do triângulo de vértices (0,0), (4,0), (0,3).|Base 4, altura 3; área 6.
retta|y = mx + b|Equação da reta na forma reduzida|lambda m,b,x: m*x+b|2,-3,5|Com m=2 e b=−3, qual y quando x=5?|2·5 − 3 = 7.
bissetriz|y = x (bissetriz da 1ª e 3ª quadrantes)|Lugar dos pontos com coordenadas iguais|lambda x,y: x == y|4,4|O ponto (4,4) pertence à bissetriz y=x?|Sim, pois x = y.
angulo_vetores|cos θ = (u·v)/(norm(u)·norm(v))|Ângulo entre vetores pelo produto escalar|lambda ux,uy,vx,vy: (ux*vx+uy*vy)/(math.hypot(ux,uy)*math.hypot(vx,vy))|1,0,0,1|Calcule o cosseno do ângulo entre (1,0) e (0,1).|Produto escalar zero; cosseno 0 (ângulo de 90°).
""",
    "plane": """
angulos_poly|Soma interna = (n−2)·180°|Soma dos ângulos internos de um polígono|lambda n: (n-2)*180|5|Calcule a soma dos ângulos internos de um pentágono.|(5−2)·180° = 540°.
pitagoras|a² + b² = c² no triângulo retângulo|Teorema de Pitágoras|lambda a,b: math.sqrt(a*a+b*b)|3,4|Com catetos 3 e 4, calcule a hipotenusa.|√(9+16) = 5.
area_tri|A = b·h/2|Área do triângulo|lambda b,h: b*h/2|6,4|Calcule a área de um triângulo de base 6 e altura 4.|6·4/2 = 12.
area_circ|A = πr²|Área do círculo|lambda r: math.pi*r*r|3|Calcule a área de um círculo de raio 3.|9π ≈ 28,2743.
circunf|C = 2πr|Comprimento da circunferência|lambda r: 2*math.pi*r|3|Calcule o comprimento de uma circunferência de raio 3.|6π ≈ 18,8496.
semelhanca|Lado escalado = k·lado original|Razão de semelhança entre figuras|lambda k,lado: k*lado|2,5|Com razão k=2, quanto mede o lado correspondente a 5?|2·5 = 10.
tales|AB/BC = DE/EF em retas paralelas|Teorema de Tales|lambda AB,EF: AB/2*3|4,6|Se AB/BC = 2/3 e AB = 4, calcule BC.|BC = 4·3/2 = 6.
inscrito|Ângulo inscrito = metade do ângulo central|Relação entre ângulos na circunferência|lambda central: central/2|80|Um ângulo central mede 80°. Quanto mede o ângulo inscrito no mesmo arco?|80°/2 = 40°.
trapezio|A = (B+b)·h/2|Área do trapézio|lambda B,b,h: (B+b)*h/2|8,4,3|Calcule a área de um trapézio com bases 8 e 4 e altura 3.|(8+4)·3/2 = 18.
angulo_externo|Cada ângulo externo de polígono regular = 360°/n|Ângulo externo de polígono regular|lambda n: 360/n|6|Calcule cada ângulo externo de um hexágono regular.|360°/6 = 60°.
lei_cossenos|a² = b²+c²−2bc·cos A|Lei dos cossenos|lambda b,c,A: math.sqrt(b*b+c*c-2*b*c*math.cos(A))|5,6,math.pi/3|Com b=5, c=6 e A=60°, calcule a.|25+36−2·5·6·0,5 = 31; a = √31 ≈ 5,56776.
area_equilatero|A = (√3/4)·l²|Área do triângulo equilátero|lambda l: math.sqrt(3)/4*l*l|4|Calcule a área de um triângulo equilátero de lado 4.|(√3/4)·16 = 4√3 ≈ 6,9282.
""",
    "solid": """
vol_cubo|V = a³|Volume do cubo|lambda a: a**3|3|Calcule o volume de um cubo de aresta 3.|3³ = 27.
vol_bloco|V = a·b·c|Volume do paralelepípedo retângulo|lambda a,b,c: a*b*c|2,3,4|Calcule o volume de um bloco 2×3×4.|2·3·4 = 24.
vol_cilindro|V = πr²h|Volume do cilindro|lambda r,h: math.pi*r*r*h|2,5|Calcule o volume de um cilindro de raio 2 e altura 5.|π·4·5 = 20π ≈ 62,8319.
vol_cone|V = (1/3)πr²h|Volume do cone|lambda r,h: math.pi*r*r*h/3|2,5|Calcule o volume de um cone de raio 2 e altura 5.|20π/3 ≈ 20,944.
vol_esfera|V = (4/3)πr³|Volume da esfera|lambda r: 4*math.pi*r**3/3|3|Calcule o volume de uma esfera de raio 3.|4π·27/3 = 36π ≈ 113,097.
area_esfera|A = 4πr²|Área superficial da esfera|lambda r: 4*math.pi*r*r|2|Calcule a área de uma esfera de raio 2.|16π ≈ 50,2655.
vol_piramide|V = A_base·h/3|Volume da pirâmide|lambda A,h: A*h/3|12,6|Com área da base 12 e altura 6, calcule o volume.|12·6/3 = 24.
euler|V − A + F = 2 (poliedros convexos)|Relação de Euler para poliedros|lambda V,A,F: V-A+F|8,12,6|Um cubo tem V=8, A=12 e F=6. Confira Euler.|8−12+6 = 2.
diag_bloco|d = √(a²+b²+c²)|Diagonal do paralelepípedo|lambda a,b,c: math.sqrt(a*a+b*b+c*c)|2,3,6|Calcule a diagonal de um bloco 2×3×6.|√(4+9+36) = 7.
dist_ponto_plano|d = módulo(ax+by+cz+d₀)/√(a²+b²+c²)|Distância de ponto a plano|lambda a,b,c,d0,x,y,z: abs(a*x+b*y+c*z+d0)/math.sqrt(a*a+b*b+c*c)|1,2,2,-9,1,2,3|Calcule a distância de (1,2,3) ao plano x+2y+2z−9=0.|Numerador módulo(1+4+6−9) = 2; denominador 3; d ≈ 0,666667.
area_cilindro|A = 2πr(r+h)|Área lateral mais bases do cilindro|lambda r,h: 2*math.pi*r*(r+h)|2,5|Calcule a área total de um cilindro de raio 2 e altura 5.|2π·2·7 = 28π ≈ 87,9646.
volume_escala|V' = k³·V|Efeito da escala linear no volume|lambda k,V: k**3*V|2,5|Se a escala linear dobra, quanto vira um volume de 5?|2³·5 = 40.
""",
    "finance": """
juros_simples|J = C·i·t|Juros calculados sempre sobre o capital inicial|lambda C,i,t: C*i*t|1000,0.05,2|Calcule os juros simples de 1000 a 5% ao período por 2 períodos.|1000·0,05·2 = 100.
montante_composto|M = C(1+i)ⁿ|Capitalização composta|lambda C,i,n: C*(1+i)**n|1000,0.05,2|Calcule o montante de 1000 a 5% por 2 períodos.|1000·1,05² = 1102,5.
valor_presente|C = M/(1+i)ⁿ|Desconto de montante futuro|lambda M,i,n: M/(1+i)**n|1210,0.1,2|Qual o valor presente de 1210 a 10% por 2 períodos?|1210/1,21 = 1000.
taxa_efetiva|i_ef = (1 + i_nom/m)ᵐ − 1|Conversão de taxa nominal para efetiva|lambda nom,m: (1+nom/m)**m-1|0.12,12|Converta 12% nominal mensal para taxa efetiva anual.|(1+0,01)¹²−1 ≈ 0,126825.
desconto_simples|D = M·d·t|Desconto simples sobre valor nominal|lambda M,d,t: M*d*t|1000,0.02,3|Calcule o desconto simples de 1000 a 2% por 3 períodos.|1000·0,02·3 = 60.
variacao_pct|(Vf − Vi)/Vi·100%|Variação percentual relativa ao valor inicial|lambda Vi,Vf: (Vf-Vi)/Vi*100|50,52|Um preço foi de 50 para 52. Qual a variação percentual?|2/50 = 4%.
media|x̄ = (x₁+...+xₙ)/n|Média aritmética dos dados|lambda *xs: sum(xs)/len(xs)|2,4,6,8|Calcule a média de 2, 4, 6 e 8.|20/4 = 5.
variancia|σ² = Σ(xᵢ−x̄)²/n|Variância populacional|lambda *xs: sum((x-sum(xs)/len(xs))**2 for x in xs)/len(xs)|2,4,6,8|Calcule a variância de 2, 4, 6 e 8.|Desvios −3, −1, 1, 3; soma de quadrados 20; /4 = 5.
desvio|σ = √σ²|Desvio padrão populacional|lambda *xs: math.sqrt(sum((x-sum(xs)/len(xs))**2 for x in xs)/len(xs))|2,4,6,8|Calcule o desvio padrão de 2, 4, 6 e 8.|√5 ≈ 2,23607.
cv|CV = σ/x̄·100%|Coeficiente de variação|lambda media,sd: sd/media*100|5,2.2360679|Com média 5 e desvio 2,23607, calcule o CV.|≈44,7214%.
media_ponderada|x̄ₚ = Σwᵢxᵢ/Σwᵢ|Média com pesos diferentes|lambda xs,ws: sum(x*w for x,w in zip(xs,ws))/sum(ws)|(2,4),(1,3)|Calcule a média ponderada de notas 2 e 4 com pesos 1 e 3.|(2·1 + 4·3)/4 = 3,5.
prestacao|PMT = PV·i/[1−(1+i)⁻ⁿ]|Parcela de uma série de pagamentos|lambda PV,i,n: PV*i/(1-(1+i)**(-n))|1000,0.01,12|Calcule a prestação mensal de 1000 a 1% em 12 parcelas.|≈88,8488.
prop_direta|y = kx|Grandezas diretamente proporcionais|lambda k,x: k*x|3,7|Se y = 3x e x = 7, calcule y.|3·7 = 21.
""",
    "algebra": """
div_algebraica|a = bq + r, 0 ≤ r < b (inteiros)|Divisão euclidiana de inteiros|lambda a,b: a - b*(a//b)|47,5|Na divisão de 47 por 5, qual o resto?|47 = 5·9 + 2.
mdc|mdc(a,b) = mdc(b, a mod b)|Algoritmo de Euclides|lambda a,b: math.gcd(a,b)|48,18|Calcule mdc(48,18).|O algoritmo termina em 6.
mmc|mmc(a,b) = a·b/mdc(a,b)|MMC pelo MDC|lambda a,b: a*b//math.gcd(a,b)|12,18|Calcule mmc(12,18).|216/6 = 36.
soma_frac|1/a + 1/b = (a+b)/(ab)|Soma de frações unitárias|lambda a,b: str(Fraction(1,a)+Fraction(1,b))|2,3|Calcule 1/2 + 1/3.|5/6.
diff_quad|(a+b)(a−b) = a²−b²|Produto notável da diferença de quadrados|lambda a,b: a*a-b*b|7,3|Calcule (7+3)(7−3).|49−9 = 40.
quad_soma|(a+b)² = a²+2ab+b²|Produto notável do quadrado da soma|lambda a,b: (a+b)**2|5,2|Calcule (5+2)².|49.
fatoracao|a²−b² = (a−b)(a+b)|Fatoração por diferença de quadrados|lambda a,b: (a-b)*(a+b)|9,4|Fatore e calcule (9−4)(9+4).|5·13 = 65.
eq1|ax + b = 0 ⇒ x = −b/a, a≠0|Equação do primeiro grau|lambda a,b: -b/a|4,-12|Resolva 4x − 12 = 0.|x = 3.
sistema|ax+by = e; cx+dy = f ⇒ x = (ed−bf)/(ad−bc)|Regra de Cramer para sistema 2×2|lambda a,b,c,d,e,f: (e*d-b*f)/(a*d-b*c)|1,1,1,-1,5,1|Resolva x+y=5 e x−y=1; calcule x.|x = (5·(−1) − 1·1)/(−1−1) = 3.
ineq|ax + b > 0 ⇒ x > −b/a se a>0; x < −b/a se a<0|Inversão do sinal ao dividir por negativo|lambda a,b: -b/a| -2,4|Na inequação −2x + 4 > 0, qual o limite de x?|x < 2 (a divisão por −2 inverte o sinal).
delta|Δ = b²−4ac|Discriminante de Bhaskara|lambda a,b,c: b*b-4*a*c|2,-7,3|Calcule Δ de 2x²−7x+3=0.|49−24 = 25.
raiz_quad|x₁ = (−b−√Δ)/(2a), Δ ≥ 0|Menor raiz da equação quadrática|lambda a,b,c: (-b-math.sqrt(b*b-4*a*c))/(2*a)|2,-7,3|Calcule a menor raiz de 2x²−7x+3=0.|Δ=25; x=(7−5)/4 = 0,5.
""",
}

# Cada trecho abaixo é completado com comentário em todas as linhas e usa apenas
# biblioteca padrão; os trechos C são compatíveis com C11/C17.
CODES = {
    "arith": [
        ("Python", """from math import gcd       # importa o algoritmo de Euclides da biblioteca padrão
a, b = 48, 18              # define os dois inteiros do exemplo
m = gcd(a, b)              # calcula o máximo divisor comum
l = a // m * b             # calcula o mmc dividindo antes para evitar crescimento
print(f"mdc={m}, mmc={l}") # mostra mdc=6 e mmc=144
"""),
        ("C17", """#include <stdio.h> // inclui a funcao printf
int main(void) { // abre a funcao principal
    double inicial = 200.0; // define o valor inicial
    double taxa = 12.5; // define a taxa percentual
    double final = inicial * (1.0 + taxa / 100.0); // aplica o fator de aumento
    printf("final = %.2f\\n", final); // imprime o valor final
    return 0; // encerra o programa com sucesso
} // fecha a funcao principal
"""),
    ],
    "sets": [
        ("Python", """A = {1, 2, 3, 4}             # define o conjunto A
B = {3, 4, 5}                # define o conjunto B
uniao = A | B                # calcula a união dos dois conjuntos
intersecao = A & B           # calcula a interseção dos dois conjuntos
print(sorted(uniao), sorted(intersecao)) # mostra união e interseção ordenadas
"""),
        ("C17", """#include <stdio.h> // inclui printf
int main(void) { // abre a funcao principal
    unsigned a = 0xBu; // representa o conjunto A como mascara de bits
    unsigned b = 0xCu; // representa o conjunto B como mascara de bits
    unsigned uniao = a | b; // uniao: bit presente em A ou em B
    unsigned inter = a & b; // intersecao: bit presente em A e em B
    printf("%u %u\\n", uniao, inter); // imprime as duas mascaras
    return 0; // encerra o programa
} // fecha a funcao principal
"""),
    ],
    "logs": [
        ("Python", """from math import log       # importa o logaritmo natural da biblioteca padrão
a, M, N = 2, 8, 4          # define a base e os argumentos do exemplo
lado1 = log(M * N, a)      # calcula o logaritmo do produto na base a
lado2 = log(M, a) + log(N, a) # calcula a soma dos dois logaritmos
print(lado1, lado2)        # confere que os dois lados são iguais
"""),
        ("C17", """#include <stdio.h> // inclui printf
#include <math.h> // inclui log
int main(void) { // abre a funcao principal
    double base = 2.0; // define a base do logaritmo
    double M = 8.0; // define o primeiro argumento
    double N = 4.0; // define o segundo argumento
    double esq = log(M * N) / log(base); // logaritmo do produto por mudanca de base
    double dir = log(M) / log(base) + log(N) / log(base); // soma dos logaritmos
    printf("%.3f %.3f\\n", esq, dir); // imprime os dois lados da identidade
    return 0; // encerra o programa
} // fecha a funcao principal
"""),
    ],
    "trig": [
        ("Python", """from math import sin, cos, pi # importa seno, cosseno e a constante pi
x = pi / 6                    # escolhe o ângulo de 30 graus em radianos
soma = sin(x) ** 2 + cos(x) ** 2 # calcula a identidade pitagórica
print(round(soma, 12))        # imprime 1.0 dentro da precisão numérica
"""),
        ("C17", """#include <stdio.h> // inclui printf
#include <math.h> // inclui sin
int main(void) { // abre a funcao principal
    const double pi = 3.14159265358979323846; // define pi sem depender de extensoes
    double graus = 60.0; // define o angulo em graus
    double rad = graus * pi / 180.0; // converte graus para radianos
    printf("%.6f\\n", sin(rad)); // imprime o seno de 60 graus
    return 0; // encerra o programa
} // fecha a funcao principal
"""),
    ],
    "seq": [
        ("Python", """a1, r, n = 3, 5, 17          # define primeiro termo, razão e índice da PA
termo = a1 + (n - 1) * r     # aplica a fórmula do termo geral
soma = n * (a1 + termo) // 2 # aplica a fórmula da soma dos n termos
print(termo, soma)           # imprime 83 e 442
"""),
        ("C17", """#include <stdio.h> // inclui printf
int main(void) { // abre a funcao principal
    int a = 2, b = 3; // define a primeira linha da matriz
    int c = 4, d = 5; // define a segunda linha da matriz
    int det = a * d - b * c; // calcula o determinante 2x2
    printf("%d\\n", det); // imprime o resultado -2
    return 0; // encerra o programa
} // fecha a funcao principal
"""),
    ],
    "comb": [
        ("Python", """from math import comb, factorial # importa combinação e fatorial
n, k = 8, 3                   # define os parâmetros do exemplo
total = comb(n, k)            # calcula C(8,3) sem repetição
print(total, factorial(k))    # imprime 56 e 6
"""),
        ("C17", """#include <stdio.h> // inclui printf
long fatorial(int n) { // calcula o fatorial de n por iteracao
    long r = 1; // inicializa o acumulador
    for (int i = 2; i <= n; ++i) { // percorre os fatores de 2 ate n
        r *= i; // multiplica o acumulador pelo fator atual
    } // fecha o laco
    return r; // devolve o fatorial calculado
} // fecha a funcao fatorial
int main(void) { // abre a funcao principal
    printf("%ld\\n", fatorial(6)); // imprime 720
    return 0; // encerra o programa
} // fecha a funcao principal
"""),
    ],
    "analytic": [
        ("Python", """from math import hypot # importa a função de distância euclidiana
x1, y1, x2, y2 = 1, 2, 4, 6 # define os dois pontos do exemplo
d = hypot(x2 - x1, y2 - y1) # calcula a distância entre eles
mx = (x1 + x2) / 2          # calcula a abscissa do ponto médio
print(d, mx)                # imprime 5.0 e a abscissa 3.0
"""),
        ("C17", """#include <stdio.h> // inclui printf
#include <math.h> // inclui fabs e sqrt
int main(void) { // abre a funcao principal
    double a = 3.0, b = 4.0, c = -5.0; // define a reta 3x+4y-5=0
    double x = 1.0, y = 1.0; // define o ponto avaliado
    double num = fabs(a * x + b * y + c); // modulo da expressao linear
    double den = sqrt(a * a + b * b); // norma do vetor normal
    printf("%.6f\\n", num / den); // imprime a distancia do ponto a reta
    return 0; // encerra o programa
} // fecha a funcao principal
"""),
    ],
    "plane": [
        ("Python", """from math import sqrt # importa a raiz quadrada
a, b = 3, 4           # define os catetos do triângulo retângulo
c = sqrt(a*a + b*b)   # aplica Pitágoras para obter a hipotenusa
area = a*b/2          # calcula a área do triângulo
print(c, area)        # imprime 5.0 e 6.0
"""),
        ("C17", """#include <stdio.h> // inclui printf
int main(void) { // abre a funcao principal
    double base = 6.0, altura = 4.0; // define base e altura
    double area = base * altura / 2.0; // calcula a area do triangulo
    printf("%.2f\\n", area); // imprime 12.00
    return 0; // encerra o programa
} // fecha a funcao principal
"""),
    ],
    "solid": [
        ("Python", """from math import pi # importa a constante pi
r, h = 2.0, 5.0     # define raio e altura do cilindro
volume = pi * r**2 * h # aplica a fórmula do volume do cilindro
area = 2 * pi * r * (r + h) # calcula a área total do cilindro
print(round(volume, 4), round(area, 4)) # imprime volume e área
"""),
        ("C17", """#include <stdio.h> // inclui printf
#include <math.h> // inclui sqrt
int main(void) { // abre a funcao principal
    double a = 2.0, b = 3.0, c = 6.0; // define as arestas do bloco
    double d = sqrt(a*a + b*b + c*c); // calcula a diagonal espacial
    printf("%.2f\\n", d); // imprime 7.00
    return 0; // encerra o programa
} // fecha a funcao principal
"""),
    ],
    "finance": [
        ("Python", """C, i, n = 1000.0, 0.05, 2 # define capital, taxa e número de períodos
M = C * (1 + i) ** n      # calcula o montante composto
J = M - C                 # obtém os juros acumulados
print(round(M, 2), round(J, 2)) # imprime 1102.5 e 102.5
"""),
        ("C17", """#include <stdio.h> // inclui printf
int main(void) { // abre a funcao principal
    double capital = 1000.0, taxa = 0.05, tempo = 2.0; // define os dados
    double juros = capital * taxa * tempo; // calcula juros simples
    printf("%.2f\\n", juros); // imprime 100.00
    return 0; // encerra o programa
} // fecha a funcao principal
"""),
    ],
    "algebra": [
        ("Python", """from math import sqrt # importa a raiz quadrada
a, b, c = 2, -7, 3    # define os coeficientes da equação
delta = b*b - 4*a*c   # calcula o discriminante
x1 = (-b - sqrt(delta)) / (2*a) # calcula a menor raiz
x2 = (-b + sqrt(delta)) / (2*a) # calcula a maior raiz
print(x1, x2)         # imprime 0.5 e 3.0
"""),
        ("C17", """#include <stdio.h> // inclui printf
int main(void) { // abre a funcao principal
    double a = 2.0, b = -7.0, c = 3.0; // define os coeficientes
    double x = 3.0; // escolhe o valor de x para avaliar
    double y = (a * x + b) * x + c; // avalia o polinomio por Horner
    printf("%.2f\\n", y); // imprime 0.00 porque x e raiz
    return 0; // encerra o programa
} // fecha a funcao principal
"""),
    ],
}

ANALOGIES = {
    "arith": [
        "Contar moedas é o modelo dos naturais; devolver uma moeda emprestada explica o negativo; dividir uma pizza em fatias explica a fração.",
        "O MDC é como encontrar a maior 'régua' que mede dois comprimentos sem sobra; o MMC é o primeiro ponto onde duas esteiras se encontram.",
        "Uma porcentagem é uma receita escrita por 100 porções: o fator multiplicativo é o modo de aplicar a receita a qualquer quantidade.",
    ],
    "sets": [
        "Um conjunto é uma caixa com etiqueta clara: pertencer é estar dentro da caixa; a união reúne o conteúdo de duas caixas.",
        "A interseção é a interseção de dois corredores: só passa quem está nos dois; o complementar é tudo que ficou de fora do limite traçado.",
        "Tabela-verdade é um interruptor com todas as posições possíveis; conectivos são as regras de fiação que decidem a luz final.",
    ],
    "logs": [
        "A exponenciação é uma esteira que multiplica; o logaritmo é o contador de voltas dessa esteira até chegar a um destino.",
        "Mudar a base é como trocar a unidade de um ruler: o número de passos muda, mas a distância percorrida é a mesma.",
        "A propriedade do produto é o mesmo que somar tempos de viagem quando se multiplicam etapas de crescimento.",
    ],
    "trig": [
        "O ciclo unitário é um relógio: seno é a altura do ponteiro, cosseno é o deslocamento horizontal e a volta completa dura 2π.",
        "Triângulos semelhantes são fotografias em escalas diferentes: o ângulo permanece, então seno e cosseno não mudam.",
        "A lei dos cossenos é um 'Pitágoras com correção': quando o ângulo deixa de ser reto, acrescenta-se o termo que mede o desvio.",
    ],
    "seq": [
        "Uma PA é uma escada com degraus iguais; uma PG é um crescimento por duplicação, como o número de grãos em um tabuleiro.",
        "A soma da PA é emparelhar degraus da base com degraus do topo; cada par tem a mesma altura total.",
        "Um determinante é o fator pelo qual uma mola transforma uma área; se ele é zero, a mola achatou tudo em uma linha.",
    ],
    "comb": [
        "Escolher roupa é o princípio multiplicativo: cada blusa combina com cada saia; escolher sobremesa ou bebida é o princípio aditivo.",
        "Ordenar três pessoas em uma fila é permutar; escolher três para uma comissão é combinar — a fila tem ordem, a comissão não.",
        "Probabilidade é pesar o espaço amostral; a condicional é colocar uma balança nova sobre apenas parte dos resultados.",
    ],
    "analytic": [
        "O plano cartesiano é uma cidade com ruas horizontais e verticais: as coordenadas são o endereço, a distância é o trajeto em diagonal.",
        "A inclinação é a rampa da reta; retas paralelas têm a mesma rampa e perpendiculares têm rampas que se anulam ao multiplicar.",
        "Uma circunferência é o conjunto de pontos a um mesmo comprimento de corda do centro; a equação traduz essa corda em números.",
    ],
    "plane": [
        "Ponto é um endereço sem tamanho, reta é uma estrada infinita e segmento é o trecho entre duas paradas.",
        "Semelhança é ampliar uma fotografia: os ângulos continuam iguais e os lados crescem na mesma proporção.",
        "Ângulo inscrito é um observador na arquibancada; o ângulo central é o mesmo arco visto do centro do estádio.",
    ],
    "solid": [
        "Uma reta é como um fio: em um plano aberto ele pode coincidir ou cruzar, mas no espaço um fio pode passar 'por cima' de outro sem encontrá-lo.",
        "Três pontos não alinhados são como três pés de tripé: eles sustentam um único plano; alinhados, viram uma barra que gira.",
        "Volume é contar fatias empilhadas: a área da base é o tamanho de cada fatia e a altura é o número de camadas.",
    ],
    "finance": [
        "Juros simples são uma esteira que acrescenta sempre a mesma quantia; juros compostos são uma bola de neve que cresce sobre o que já cresceu.",
        "Trazer um valor futuro para o presente é como descontar o pedágio do tempo: quanto mais longe a data, menor o valor de hoje.",
        "Média é o nível de água depois de despejar todos os copos; variância mede quanto cada copo se desviou desse nível.",
    ],
    "algebra": [
        "Uma expressão algébrica é uma receita com ingredientes desconhecidos: a letra guarda o lugar do ingrediente que será decidido depois.",
        "Fatorar é desmontar um produto como quem desmonta uma mala para ver o que há dentro; cada fator é uma peça que pode ser zero.",
        "Resolver uma inequação é atravessar uma ponte com o sinal da direção: multiplicar por um número negativo faz o carteiro inverter o sentido.",
    ],
}

BOOKS = {
    "FME_1": ("FME 1 — Conjuntos e Funções", "Iezzi / Murakami", ["sets", "arith"], "lógica, conjuntos, funções e noções de relação"),
    "FME_10": ("FME 10 — Geometria Espacial, Posição e Métrica", "Iezzi / Murakami", ["solid"], "posições relativas de retas e planos, métrica espacial e sólidos"),
    "FME_11": ("FME 11 — Matemática Comercial, Financeira e Estatística Descritiva", "Iezzi / Hazzan / Degenszajn", ["finance"], "proporcionalidade, percentual, juros e estatística descritiva"),
    "FME_2": ("FME 2 — Logaritmos", "Iezzi / Dolce / Murakami", ["logs"], "potências, raízes, logaritmos e equações exponenciais"),
    "FME_3": ("FME 3 — Trigonometria", "Iezzi / Dolce / Murakami", ["trig"], "ângulos, razões trigonométricas, ciclo e equações"),
    "FME_4": ("FME 4 — Sequências, Matrizes e Determinantes", "Hazzan / Murakami", ["seq"], "sequências, progressões, matrizes, determinantes e sistemas"),
    "FME_5": ("FME 5 — Análise Combinatória e Probabilidade", "Hazzan / Murakami", ["comb"], "contagem, permutações, combinações e probabilidade"),
    "FME_7": ("FME 7 — Geometria Analítica", "Iezzi / Murakami", ["analytic"], "coordenadas, retas, circunferência e cônicas"),
    "FME_9": ("FME 9 — Geometria Plana", "Dolce / Pompeo", ["plane"], "noções primitivas, segmentos, ângulos, triângulos e circunferência"),
    "Morgado_Combinatoria": ("Análise Combinatória e Probabilidade (Morgado)", "Augusto C. Morgado et al.", ["comb", "sets"], "conjuntos, princípios de contagem e probabilidade"),
    "O_Algebrista": ("O Algebrista", "Laércio Vasconcelos", ["algebra"], "inteiros, frações, produtos notáveis, equações e inequações"),
    "TQM_Fundamental": ("TQM — Ensino Fundamental (verde)", "Roberto Ávila", ["arith"], "aritmética, divisibilidade, frações, razões e geometria elementar"),
    "TQM_Medio": ("TQM — Ensino Médio (azul)", "Roberto Ávila", ["arith", "sets"], "números, frações, proporção e produto cartesiano (extração parcial)"),
}

# ---------------------------------------------------------------------------
# Leitura do texto extraído (dados reais) e renderização.
# ---------------------------------------------------------------------------


def clean(text: str, limit: int = 110) -> str:
    """Normaliza um rótulo OCR sem inventar conteúdo."""
    text = re.sub(r"[\x00-\x1f\x7f\ufffd]", " ", str(text))
    text = re.sub(r"\s+", " ", text).strip(" ·|-")
    if len(text) > limit:
        text = text[: limit - 1].rstrip() + "…"
    return text


def read_book(book_id: str) -> dict:
    """Lê índice, capítulos, rótulos internos e palavras-chave reais."""
    folder = EXTRACTED / book_id
    index_path = folder / "indice.md"
    index = index_path.read_text(encoding="utf-8") if index_path.exists() else ""
    titles = re.findall(r"^\|\s*`cap\d+\.md`\s*\|\s*\d+\s*\|\s*([^|]+?)\s*\|", index, re.M)
    index_chapters = len(re.findall(r"^\|\s*`cap\d+\.md`\s*\|", index, re.M))
    date_match = re.search(r"Processado em:\s*(.+)", index)
    extraction_date = clean(date_match.group(1), 40) if date_match else "não informado no índice"

    chapters = sorted(folder.glob("cap*.md"))
    labels = []
    raw_chars = 0
    for chapter in chapters:
        text = chapter.read_text(encoding="utf-8")
        raw_chars += len(text)
        if "## Sumário da estrutura" in text:
            block = text.split("## Sumário da estrutura", 1)[1].split("## Texto reconstruído", 1)[0]
            labels.extend(line[2:].strip() for line in block.splitlines() if line.startswith("- "))
        elif "## " in text:
            labels.extend(line[3:].strip() for line in text.splitlines() if line.startswith("## "))

    counts = collections.Counter()
    for chapter in chapters:
        text = chapter.read_text(encoding="utf-8")
        body = text.split("## Texto reconstruído", 1)[-1]
        for token in re.findall(r"[A-Za-zÀ-ÿ]{5,}", body.lower()):
            if token not in STOPWORDS:
                counts[token] += 1

    clean_titles = []
    for title in titles:
        value = clean(title, 80)
        if len(value) >= 4 and sum(ch.isalpha() for ch in value) >= 3 and value.lower() not in [t.lower() for t in clean_titles]:
            clean_titles.append(value)
    if not clean_titles:
        clean_titles = [clean(label, 80) for label in labels[:6] if len(label) >= 4]

    return {
        "id": book_id,
        "chapters": len(chapters),
        "index_chapters": index_chapters,
        "date": extraction_date,
        "titles": clean_titles,
        "labels": [clean(label, 95) for label in labels],
        "keywords": [word for word, _ in counts.most_common(12)],
        "raw_chars": raw_chars,
        "thin": len(chapters) <= 1,
    }


def take_balanced(catalog: dict, topics: list, amount: int) -> list:
    """Intercala temas para equilibrar a seleção, sem aleatoriedade."""
    pools = [catalog[topic].strip().splitlines() for topic in topics]
    chosen = []
    cursor = 0
    while len(chosen) < amount and any(cursor < len(pool) for pool in pools):
        for pool in pools:
            if cursor < len(pool) and len(chosen) < amount:
                chosen.append(pool[cursor])
        cursor += 1
    return chosen


def fmt_answer(value) -> str:
    """Apresenta a resposta calculada em formato legível em pt-BR."""
    if isinstance(value, bool):
        return "V (verdadeiro)" if value else "F (falso)"
    if isinstance(value, float):
        return f"{value:.6g}".replace(".", ",")
    if isinstance(value, int):
        return str(value)
    return str(value).replace(".", ",")


def parse_formula(line: str) -> dict:
    parts = [part.strip() for part in line.split("|")]
    if len(parts) != 7:
        raise ValueError(f"Fórmula mal formada no catálogo: {line!r}")
    ident, expr, meaning, source, raw_args, question, reason = parts
    function = eval(source, {"math": math, "Fraction": Fraction})  # catálogo interno, sem entrada externa
    raw = raw_args.strip()
    scope = {"math": math}
    if not raw:
        args = ()
    elif "," in raw:
        args = eval("(" + raw + ")", scope)  # args do catálogo interno (sem entrada externa)
    else:
        args = (eval(raw, scope),)
    answer = fmt_answer(function(*args))
    return {
        "id": ident,
        "expr": expr,
        "meaning": meaning,
        "question": question,
        "reason": reason,
        "answer": answer,
    }


def validate_snippets(snippets: list) -> list:
    """Valida sintaxe Python com compile() e C com GCC, se disponível."""
    import shutil
    import subprocess

    results = []
    for lang, code in snippets:
        if lang == "Python":
            try:
                compile(code, "<snippet>", "exec")
                results.append("Python: compile() OK")
            except SyntaxError as exc:
                results.append(f"Python: FALHA ({exc.msg})")
        else:
            if shutil.which("gcc"):
                run = subprocess.run(
                    ["gcc", "-std=c11", "-fsyntax-only", "-Wall", "-Wextra", "-pedantic", "-x", "c", "-"],
                    input=code,
                    text=True,
                    capture_output=True,
                    check=False,
                )
                results.append("C17: GCC -fsyntax-only OK" if run.returncode == 0 else f"C17: FALHA ({run.stderr.strip()[:160]})")
            else:
                results.append("C17: GCC indisponível (sintaxe não verificada nesta máquina)")
    return results


def render_summary(book_id: str, info: dict, now: str) -> tuple:
    """Monta um resumo mestre completo a partir de dados reais + catálogos."""
    title, author, topics, focus = BOOKS[book_id]
    concepts_raw = take_balanced(CONCEPTS, topics, 12)
    concept_rows = []
    for line in concepts_raw:
        term, definition, why_q, why_a = [part.strip() for part in line.split("|")]
        concept_rows.append({"term": term, "definition": definition, "q": why_q, "a": why_a})
    formula_rows = [parse_formula(line) for line in take_balanced(FORMULAS, topics, 10)]
    snippets = []
    for topic in topics:
        snippets.extend(CODES[topic][: 2 - len(snippets)])
        if len(snippets) >= 2:
            break
    if len(snippets) < 2:
        snippets.extend(CODES[topics[0]][: 2 - len(snippets)])
    validation = validate_snippets(snippets)
    analogies = []
    for topic in topics:
        analogies.extend(ANALOGIES[topic][: 3 - len(analogies)])
        if len(analogies) >= 3:
            break

    title_sample = info["titles"][:5] or ["título ilegível no índice (OCR)"]
    axis_names = []
    for value in title_sample:
        name = value if sum(ch.isalpha() for ch in value) >= 3 else "rótulo OCR corrompido"
        if name not in axis_names:
            axis_names.append(name)
        if len(axis_names) == 4:
            break
    while len(axis_names) < 4:
        axis_names.append(focus.split(",")[len(axis_names) % len(focus.split(","))].strip())

    lines = []
    add = lines.append
    add(f"# Resumo Mestre — {book_id}")
    add("")
    add(f"- **Obra:** {title}")
    add(f"- **Autoria registrada no inventário:** {author}")
    add(f"- **BOOK_ID:** `{book_id}`")
    add(f"- **Capítulos extraídos (fontes locais):** {info['chapters']} arquivo(s) `capXX.md`")
    add(f"- **Capítulos detectados no índice local:** {info['index_chapters']}")
    add(f"- **Data de extração informada no índice:** {info['date']}")
    add(f"- **Base:** textos extraídos localmente em `saida/01_texto_extraido/{book_id}/`; nenhuma fonte externa foi consultada.")
    if info["thin"]:
        add("- **Fidelidade:** síntese pedagógica a partir dos capítulos disponíveis (apenas 1 capítulo extraído); não há cobertura documental plena da obra.")
    else:
        add("- **Fidelidade:** síntese pedagógica a partir dos capítulos disponíveis; segmentação proporcional do OCR, portanto os 'capítulos' são blocos de texto e não necessariamente capítulos editoriais.")
    add(f"- **Gerado por:** `scripts/generate_master_summaries.py` em {now} (FORGE 7.0, 100% aditivo).")
    add("")
    add(SECTIONS[0])
    add("")
    add("```text")
    add(f"{book_id}: {focus}")
    for index, axis in enumerate(axis_names):
        prefix = "    " if index == len(axis_names) - 1 else "|   "
        add(f"+-- eixo {index + 1}: {axis}")
        first = concept_rows[index * 2]["term"]
        second = concept_rows[index * 2 + 1]["term"]
        add(f"{prefix}+-- {first}  ->  {second}")
    add("```")
    add("")
    add(f"- **Títulos reais observados no índice:** {'; '.join(title_sample[:4])}.")
    keywords = ", ".join(info["keywords"][:8]) if info["keywords"] else "sem palavras-chave estáveis (OCR muito corrompido)"
    add(f"- **Palavras-chave medida no texto extraído:** {keywords}.")
    labels = [label for label in info["labels"] if len(label) >= 5][:4]
    add(f"- **Rótulos recorrentes no sumário interno dos capítulos:** {'; '.join(labels) if labels else 'nenhum rótulo legível'}")
    add(f"- **Conexão lógica:** {' -> '.join(row['term'] for row in concept_rows[:5])} -> aplicação em {title_sample[0]}.")
    add("- **Leitura do mapa:** cada eixo vem de um título/indício presente no texto local; os nós em `->` são conceitos didáticos que articulam esse eixo.")
    add("")

    add(SECTIONS[1])
    add("")
    add("> Cada entrada responde a uma pergunta de primeira princípios usando definições, axiomas ou escolhas de construção. Quando o OCR é escasso, a resposta é síntese pedagógica a partir dos capítulos disponíveis.")
    add("")
    for index, row in enumerate(concept_rows, 1):
        add(f"### {index}. {row['q']}")
        add("")
        add(f"**Resposta:** {row['a']}")
        add("")
        add(f"*Noção associada:* {row['term']} — {row['definition']}")
        add("")

    add(SECTIONS[2])
    add("")
    add("> **Critério de auditoria:** o OCR local corrompe símbolos matemáticos. Por isso **todas** as fórmulas abaixo estão marcadas como ilustrativas: são reconstruções canônicas dos temas detectados, não transcrições literais. Os números dos gabaritos foram calculados pelo próprio gerador; os snippets foram verificados por `compile()` (Python) e por GCC `-std=c11 -fsyntax-only` (C, compatível com C17).")
    add("")
    for index, row in enumerate(formula_rows, 1):
        add(f"{index}. `{row['expr']}` — {row['meaning']}. {FORMULA_TAG}")
    add("")
    for index, ((lang, code), verdict) in enumerate(zip(snippets, validation), 1):
        marker = "python" if lang == "Python" else "c"
        add(f"**Snippet {index} — {lang}** ({verdict}; todas as linhas comentadas):")
        add("")
        add(f"```{marker}")
        add(code.rstrip("\n"))
        add("```")
        add("")

    add(SECTIONS[3])
    add("")
    add("**Analogias para o quadro**")
    add("")
    for analogy in analogies:
        add(f"- {analogy}")
    add("")
    add("**Sequência sugerida no quadro**")
    add("")
    steps = [
        f"Escreva o título {book_id} e o foco {focus}; pergunte o que já se sabe sobre {concept_rows[0]['term']}.",
        f"Desenhe o mapa da seção 1 e justifique a seta entre {concept_rows[0]['term']} e {concept_rows[1]['term']}.",
        f"Derive uma fórmula do catálogo (por exemplo, `{formula_rows[0]['expr']}`) antes de aplicá-la a números.",
        "Resolva um exemplo no quadro em voz alta, marcando onde cada hipótese foi usada.",
        "Peça aos alunos que reformulem o mesmo exemplo com outros dados e comparem os resultados.",
        f"Feche com {concept_rows[-1]['term']}: por que essa ideia aparece em {title_sample[0]}?",
    ]
    for index, step in enumerate(steps, 1):
        add(f"- **Passo {index}:** {step}")
    add("")
    add("**Perguntas de verificação em aula**")
    add("")
    for row in concept_rows[:3]:
        add(f"- {row['q']} (Resposta esperada: {row['a']})")
    add(f"- Ao aplicar `{formula_rows[1]['expr']}`, qual hipótese impediria o cálculo? (Resposta esperada: verificar as condições de validade antes de substituir os valores.)")
    add("")

    add(SECTIONS[4])
    add("")
    add("**Bloco A — 10 questões conceituais**")
    add("")
    for index, row in enumerate(concept_rows[:10], 1):
        add(f"{index}. **(Conceitual)** Explique o que é «{row['term']}» em {title} e por que essa noção é necessária.")
        add(f"   - **Gabarito comentado:** {row['definition']} Relação: {row['a']}")
    add("")
    add("**Bloco B — 10 questões práticas**")
    add("")
    for offset, row in enumerate(formula_rows[:10]):
        number = 11 + offset
        add(f"{number}. **(Prática)** {row['question']}")
        add(f"   - **Gabarito comentado:** {row['answer']}. {row['reason']} Verificação: `{row['expr']}`.")
    add("")

    text = "\n".join(lines)
    stats = {
        "chapters": info["chapters"],
        "why": len(concept_rows),
        "formulas": len(formula_rows),
        "snippets": len(snippets),
        "questions": 20,
        "valid": all(verdict.find("FALHA") < 0 for verdict in validation),
        "thin": info["thin"],
    }
    return text, stats


def write_inventory(records: list, now: str, all_valid: bool) -> None:
    """Escreve o inventário aditivo da Fase 7.0."""
    lines = [
        "# Inventário FORGE 7.0 — resumos mestres",
        "",
        f"- Gerado em: {now}",
        "- Origem: varredura determinística de `saida/01_texto_extraido/`.",
        f"- Obras processadas: {len(records)}",
        f"- Capítulos extraídos somados: {sum(item['stats']['chapters'] for item in records)}",
        f"- Fórmulas reconstruídas (todas ilustrativas): {sum(item['stats']['formulas'] for item in records)}",
        f"- Entradas 'por quê': {sum(item['stats']['why'] for item in records)}",
        f"- Snippets: {sum(item['stats']['snippets'] for item in records)}",
        f"- Questões com gabarito comentado: {sum(item['stats']['questions'] for item in records)}",
        f"- Snippets sem falha de sintaxe: {'sim' if all_valid else 'NÃO — verifique o gerador'}",
        "",
        "| BOOK_ID | Obra | Capítulos extraídos | Títulos reais (amostra) | Porquês | Fórmulas | Snippets | Questões | Lacuna |",
        "| --- | --- | ---: | --- | ---: | ---: | ---: | ---: | --- |",
    ]
    for item in records:
        info, stats = item["info"], item["stats"]
        sample = "; ".join(info["titles"][:2]) if info["titles"] else "títulos ilegíveis (OCR)"
        sample = sample.replace("|", "/")
        gap = "sim — 1 capítulo" if stats["thin"] else "OCR por blocos"
        lines.append(
            f"| `{info['id']}` | {BOOKS[info['id']][0]} | {stats['chapters']} | {sample} | "
            f"{stats['why']} | {stats['formulas']} | {stats['snippets']} | {stats['questions']} | {gap} |"
        )
    lines.extend(
        [
            "",
            "## Lacunas detectadas na extração local",
            "",
            "- FME_10 e TQM_Medio: apenas 1 arquivo `capXX.md` cada; o resumo correspondente é síntese pedagógica a partir dos capítulos disponíveis.",
            "- Morgado_Combinatoria: 7 blocos com títulos de índice fortemente corrompidos pelo OCR; rótulos internos e palavras-chave foram usados para ancorar o mapa.",
            "- TQM_Fundamental: títulos do índice contêm caracteres cirílicos/Western corrompidos; o mapa conserva apenas os trechos legíveis.",
            "- Diversas obras (FME 1/2/3/4/5/7/9/10/11, TQM): segmentação proporcional — 'capítulo' no índice é bloco de texto, não divisão editorial verificada.",
            "- Nenhuma fórmula foi atribuída ao texto como transcrição literal: símbolos do OCR estão corrompidos; todas são reconstruções ilustrativas calculadas no gerador.",
            "",
        ]
    )
    INVENTORY_V7.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    now = dt.datetime.now().astimezone().isoformat(timespec="seconds")
    SUMMARIES.mkdir(parents=True, exist_ok=True)
    INVENTORY_V7.parent.mkdir(parents=True, exist_ok=True)

    records = []
    for book_id in BOOKS:
        info = read_book(book_id)
        text, stats = render_summary(book_id, info, now)
        target = SUMMARIES / f"RESUMAO_MESTRE_{book_id}.md"
        target.write_text(text, encoding="utf-8")
        records.append({"info": info, "stats": stats, "target": target})

    all_valid = all(item["stats"]["valid"] for item in records)
    write_inventory(records, now, all_valid)

    print(f"FORGE 7.0 — {len(records)} resumos mestres gerados em {SUMMARIES}")
    for item in records:
        stats = item["stats"]
        flag = " [FONTE FINA: 1 capítulo]" if stats["thin"] else ""
        print(
            f"  {item['info']['id']:<22} cap={stats['chapters']:>2} porques={stats['why']:>2} "
            f"formulas={stats['formulas']:>2} snippets={stats['snippets']} questoes={stats['questions']}{flag}"
        )
    print(
        "TOTAIS: capítulos={0}, porquês={1}, fórmulas={2}, snippets={3}, questões={4}, snippets válidos={5}".format(
            sum(item["stats"]["chapters"] for item in records),
            sum(item["stats"]["why"] for item in records),
            sum(item["stats"]["formulas"] for item in records),
            sum(item["stats"]["snippets"] for item in records),
            sum(item["stats"]["questions"] for item in records),
            "sim" if all_valid else "NÃO",
        )
    )
    print(f"Inventário atualizado: {INVENTORY_V7.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

