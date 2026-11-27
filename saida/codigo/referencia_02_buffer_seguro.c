/*
 * referencia_02_buffer_seguro.c
 * Buffer dinamico com verificacao de overflow, realocacao segura e sanitizacao da RAM.
 * Compilacao: gcc -std=c17 -Wall -Wextra -Werror -pedantic referencia_02_buffer_seguro.c -o buffer.exe
 */
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>

typedef struct {
    uint8_t *dados;
    size_t capacidade;
    size_t tamanho;
} BufferSeguro;

/* Zeracao voluntaria antes de liberar: evita leitura pos-desalocacao. */
static void secure_zero(void *ptr, size_t length)
{
    volatile unsigned char *p = (volatile unsigned char *)ptr;
    size_t i;
    for (i = 0; i < length; ++i) {
        p[i] = 0U;
    }
}

/* Cria buffer com capacidade inicial; retorna NULL em caso de falha. */
static BufferSeguro *buffer_criar(size_t capacidade_inicial)
{
    BufferSeguro *b = NULL;
    if (capacidade_inicial == 0U) {
        return NULL;
    }
    b = (BufferSeguro *)malloc(sizeof(*b));
    if (b == NULL) {
        return NULL;
    }
    b->dados = (uint8_t *)malloc(capacidade_inicial);
    if (b->dados == NULL) {
        free(b);
        return NULL;
    }
    b->capacidade = capacidade_inicial;
    b->tamanho = 0U;
    return b;
}

/* Acrescenta dados, dobrando a capacidade ate comportar a requisicao. */
static int buffer_anexar(BufferSeguro *b, const uint8_t *dados, size_t qtd)
{
    size_t nova_capacidade = 0U;
    uint8_t *novo_bloco = NULL;

    if (b == NULL || dados == NULL || qtd == 0U) {
        return -1;
    }
    /* Verificacao de overflow antes da soma: qtd > SIZE_MAX - tamanho. */
    if (qtd > (size_t)-1 - b->tamanho) {
        return -1;
    }
    if (b->tamanho + qtd > b->capacidade) {
        nova_capacidade = b->capacidade;
        while (nova_capacidade < b->tamanho + qtd) {
            if (nova_capacidade > (size_t)-1 / 2U) {
                nova_capacidade = b->tamanho + qtd;
                break;
            }
            nova_capacidade *= 2U;
        }
        novo_bloco = (uint8_t *)realloc(b->dados, nova_capacidade);
        if (novo_bloco == NULL) {
            return -1; /* Buffer original permanece intacto. */
        }
        b->dados = novo_bloco;
        b->capacidade = nova_capacidade;
    }
    memcpy(b->dados + b->tamanho, dados, qtd);
    b->tamanho += qtd;
    return 0;
}

/* Destruicao com sanitizacao completa de dados e metadados. */
static void buffer_destruir(BufferSeguro *b)
{
    if (b == NULL) {
        return;
    }
    if (b->dados != NULL) {
        secure_zero(b->dados, b->capacidade);
        free(b->dados);
    }
    secure_zero(b, sizeof(*b));
    free(b);
}

int main(void)
{
    BufferSeguro *b = buffer_criar(8U);
    const char *segredo = "SEGREDO_FORGE_2026_EXEMPLO";
    size_t i = 0U;

    if (b == NULL) {
        fprintf(stderr, "Erro ao criar BufferSeguro.\n");
        return EXIT_FAILURE;
    }
    if (buffer_anexar(b, (const uint8_t *)segredo, strlen(segredo)) != 0) {
        fprintf(stderr, "Erro ao anexar dados.\n");
        buffer_destruir(b);
        return EXIT_FAILURE;
    }
    printf("Buffer expandido: tamanho=%lu capacidade=%lu\n",
           (unsigned long)b->tamanho, (unsigned long)b->capacidade);
    printf("Conteudo (demonstrativo): ");
    for (i = 0U; i < b->tamanho; ++i) {
        putchar((int)b->dados[i]);
    }
    putchar('\n');

    buffer_destruir(b);
    printf("Buffer sanitizado e liberado com sucesso.\n");
    return EXIT_SUCCESS;
}
