/*
 * quantizacao.c — demonstração didática de quantização simétrica int8 (C17).
 * Nenhuma dependência externa. Compilação estrita:
 *   gcc -std=c17 -Wall -Wextra -Werror -pedantic -O2 quantizacao.c -lm -o quantizacao.exe
 *
 * Não é quantização de LLM de verdade: aqui só mostramos o mapeamento
 * x -> round(x/escala) -> q*escala e o erro de arredondamento resultante.
 */
#include <math.h>
#include <stddef.h>
#include <stdint.h>
#include <stdio.h>

#define AMOSTRA_QTD 6U

/* escala = max|x| / 127; q em [-127, 127] (reservamos -128). */
static int quantizar_int8(const double *x, size_t n, int8_t *q, double *escala)
{
    size_t i = 0U;
    double max_abs = 0.0;

    if (x == NULL || q == NULL || escala == NULL || n == 0U) {
        return -1;
    }
    for (i = 0U; i < n; ++i) {
        if (!isfinite(x[i])) {
            return -1;
        }
        if (fabs(x[i]) > max_abs) {
            max_abs = fabs(x[i]);
        }
    }
    *escala = max_abs > 0.0 ? max_abs / 127.0 : 1.0;
    for (i = 0U; i < n; ++i) {
        double arredondado = round(x[i] / *escala);
        if (arredondado > 127.0) {
            arredondado = 127.0;
        } else if (arredondado < -127.0) {
            arredondado = -127.0;
        }
        q[i] = (int8_t)arredondado;
    }
    return 0;
}

static void desquantizar(const int8_t *q, size_t n, double escala, double *saida)
{
    size_t i = 0U;

    for (i = 0U; i < n; ++i) {
        saida[i] = (double)q[i] * escala;
    }
}

int main(void)
{
    static const double entrada[AMOSTRA_QTD] = {
        0.80, -0.20, 0.50, -0.95, 0.10, 0.35
    };
    int8_t q[AMOSTRA_QTD];
    double reconstruido[AMOSTRA_QTD];
    double escala = 0.0;
    double erro_max = 0.0;
    size_t i = 0U;

    if (quantizar_int8(entrada, AMOSTRA_QTD, q, &escala) != 0) {
        fprintf(stderr, "Erro: falha na quantizacao.\n");
        return 1;
    }
    desquantizar(q, AMOSTRA_QTD, escala, reconstruido);
    printf("=== Quantizacao simetrica int8 (didatica) ===\n");
    printf("escala = %.8f\n", escala);
    for (i = 0U; i < AMOSTRA_QTD; ++i) {
        const double erro = fabs(entrada[i] - reconstruido[i]);
        if (erro > erro_max) {
            erro_max = erro;
        }
        printf("x[%lu]=%+.4f -> q=%+4d -> x'=%+.6f\n",
               (unsigned long)i, entrada[i], (int)q[i], reconstruido[i]);
    }
    printf("erro maximo = %.8f\n", erro_max);
    return 0;
}
