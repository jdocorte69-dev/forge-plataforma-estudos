/*
 * tensor_engine.c — mecanismo de tensores didático (C17, sem dependências externas).
 *
 * Objetivo: mostrar, com código curto e auditável, como um "forward pass" de uma
 * rede neural mínima é apenas álgebra linear + funções elementwise:
 *     x (1x3) · W1 (3x4) -> ReLU -> · W2 (4x3) -> softmax (3 classes)
 *
 * Não é um runtime de LLM: não há autograd, GPU, BLAS, batch real nem pesos
 * treinados. Veja README.md neste diretório para os limites completos.
 *
 * Compilação estrita (mesma usada pelo auditor):
 *   gcc -std=c17 -Wall -Wextra -Werror -pedantic -O2 tensor_engine.c -lm -o tensor.exe
 */
#include "tensor_engine.h"

#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* ---------- infraestrutura básica do tensor ---------- */

int tensor_criar(Tensor *t, const size_t *dims, size_t ndim)
{
    size_t elementos = 1U;
    size_t i = 0U;

    if (t == NULL || dims == NULL || ndim == 0U || ndim > TENSOR_MAX_DIM) {
        return -1;
    }
    for (i = 0U; i < ndim; ++i) {
        if (dims[i] == 0U) {
            return -1;
        }
        /* Impede estouro no produto das dimensões e na alocação. */
        if (dims[i] > ((size_t)-1) / elementos / sizeof(double)) {
            return -1;
        }
        elementos *= dims[i];
    }

    memset(t, 0, sizeof(*t));
    t->ndim = ndim;
    for (i = 0U; i < ndim; ++i) {
        t->dims[i] = dims[i];
    }
    /* Passos row-major: o último eixo tem passo 1. */
    t->strides[ndim - 1U] = 1U;
    for (i = ndim - 1U; i > 0U; --i) {
        t->strides[i - 1U] = t->strides[i] * dims[i];
    }
    t->data = (double *)calloc(elementos, sizeof(*t->data));
    if (t->data == NULL) {
        memset(t, 0, sizeof(*t));
        return -1;
    }
    return 0;
}

void tensor_liberar(Tensor *t)
{
    if (t == NULL) {
        return;
    }
    free(t->data);
    memset(t, 0, sizeof(*t));
}

static int e_matriz(const Tensor *t)
{
    return t != NULL && t->data != NULL && t->ndim == 2U &&
           t->dims[0] > 0U && t->dims[1] > 0U;
}

/* Acesso elementwise respeitando os strides (a forma pode ter passos não triviais). */
static double *elem(Tensor *t, size_t i, size_t j)
{
    return t->data + i * t->strides[0] + j * t->strides[1];
}

static const double *celem(const Tensor *t, size_t i, size_t j)
{
    return t->data + i * t->strides[0] + j * t->strides[1];
}

static int formas_compativeis(const Tensor *a, const Tensor *b, const Tensor *out)
{
    if (!e_matriz(a) || !e_matriz(b) || !e_matriz(out)) {
        return 0;
    }
    if (out == a || out == b) { /* saída em separado evita corromper as entradas */
        return 0;
    }
    return a->dims[1] == b->dims[0] &&
           out->dims[0] == a->dims[0] &&
           out->dims[1] == b->dims[1];
}

/* ---------- multiplicação de matrizes ---------- */

int tensor_matmul(const Tensor *a, const Tensor *b, Tensor *out)
{
    size_t i = 0U;
    size_t j = 0U;
    size_t k = 0U;
    const size_t m = a != NULL ? a->dims[0] : 0U;
    const size_t n = b != NULL ? b->dims[1] : 0U;
    const size_t p = a != NULL ? a->dims[1] : 0U;

    if (!formas_compativeis(a, b, out)) {
        return -1;
    }
    for (i = 0U; i < m; ++i) {
        for (j = 0U; j < n; ++j) {
            const double *linha_a = a->data + i * a->strides[0];
            const double *coluna_b = b->data + j * b->strides[1];
            double acc = 0.0;

            /* Desenrolamento manual de 4 iterações: menos saltos de loop. */
            while (k + 3U <= p) {
                acc += linha_a[k * a->strides[1]] * coluna_b[k * b->strides[0]];
                acc += linha_a[(k + 1U) * a->strides[1]] *
                       coluna_b[(k + 1U) * b->strides[0]];
                acc += linha_a[(k + 2U) * a->strides[1]] *
                       coluna_b[(k + 2U) * b->strides[0]];
                acc += linha_a[(k + 3U) * a->strides[1]] *
                       coluna_b[(k + 3U) * b->strides[0]];
                k += 4U;
            }
            /* Resto (quando p não é múltiplo de 4). */
            for (; k < p; ++k) {
                acc += linha_a[k * a->strides[1]] * coluna_b[k * b->strides[0]];
            }
            *elem(out, i, j) = acc;
            k = 0U; /* reinicia para a próxima célula (i, j) */
        }
    }
    return 0;
}

int tensor_gemm(const Tensor *a, const Tensor *b, Tensor *c,
                double alpha, double beta)
{
    size_t i = 0U;
    size_t j = 0U;
    size_t k = 0U;
    const size_t m = a != NULL ? a->dims[0] : 0U;
    const size_t n = b != NULL ? b->dims[1] : 0U;
    const size_t p = a != NULL ? a->dims[1] : 0U;

    if (!formas_compativeis(a, b, c)) {
        return -1;
    }
    /* Versão didática: triple loop direto, sem bloqueio nem vetorização. */
    for (i = 0U; i < m; ++i) {
        for (j = 0U; j < n; ++j) {
            double acc = beta * *celem(c, i, j);
            for (k = 0U; k < p; ++k) {
                acc += alpha * *celem(a, i, k) * *celem(b, k, j);
            }
            *elem(c, i, j) = acc;
        }
    }
    return 0;
}

/* ---------- funções elementwise ---------- */

size_t tensor_argmax(const Tensor *t)
{
    size_t elementos = 0U;
    size_t i = 0U;
    size_t melhor = 0U;
    double maior = 0.0;

    if (t == NULL || t->data == NULL || t->ndim == 0U) {
        return 0U;
    }
    elementos = t->dims[0];
    for (i = 1U; i < t->ndim; ++i) {
        elementos *= t->dims[i];
    }
    maior = t->data[0];
    for (i = 1U; i < elementos; ++i) {
        if (t->data[i] > maior) {
            maior = t->data[i];
            melhor = i;
        }
    }
    return melhor;
}

int tensor_relu(Tensor *t)
{
    size_t elementos = 0U;
    size_t i = 0U;

    if (t == NULL || t->data == NULL || t->ndim == 0U) {
        return -1;
    }
    elementos = t->dims[0];
    for (i = 1U; i < t->ndim; ++i) {
        elementos *= t->dims[i];
    }
    for (i = 0U; i < elementos; ++i) {
        if (t->data[i] < 0.0) {
            t->data[i] = 0.0;
        }
    }
    return 0;
}

int tensor_softmax(const Tensor *t, Tensor *out)
{
    size_t linhas = 0U;
    size_t colunas = 0U;
    size_t i = 0U;
    size_t j = 0U;

    if (!e_matriz(t) || !e_matriz(out) || out == t ||
        t->dims[0] != out->dims[0] || t->dims[1] != out->dims[1]) {
        return -1;
    }
    linhas = t->dims[0];
    colunas = t->dims[1];
    for (i = 0U; i < linhas; ++i) {
        double maior = *celem(t, i, 0U);
        double soma = 0.0;

        /* Estabilidade numérica: subtrai o máximo antes de exp(). */
        for (j = 1U; j < colunas; ++j) {
            const double valor = *celem(t, i, j);
            if (valor > maior) {
                maior = valor;
            }
        }
        for (j = 0U; j < colunas; ++j) {
            const double e = exp(*celem(t, i, j) - maior);
            *elem(out, i, j) = e;
            soma += e;
        }
        if (soma <= 0.0 || !isfinite(soma)) {
            return -1;
        }
        for (j = 0U; j < colunas; ++j) {
            *elem(out, i, j) /= soma;
        }
    }
    return 0;
}

/* ---------- demonstração determinística ---------- */

static void imprimir_linha(const char *rotulo, const Tensor *t)
{
    size_t j = 0U;

    printf("%s = [", rotulo);
    for (j = 0U; j < t->dims[1]; ++j) {
        printf("%s%.6f", j == 0U ? "" : " ", t->data[j]);
    }
    printf("]\n");
}

static int preencher(Tensor *t, const double *valores, size_t qtd)
{
    size_t i = 0U;

    if (t == NULL || t->data == NULL || valores == NULL ||
        t->dims[0] * t->dims[1] != qtd) {
        return -1;
    }
    for (i = 0U; i < qtd; ++i) {
        t->data[i] = valores[i];
    }
    return 0;
}

int tensor_forward_demo(void)
{
    /* Pesos fixos, escolhidos apenas para dar um exemplo reprodutível. */
    static const double x_vals[] = {0.80, -0.20, 0.50};
    static const double w1_vals[] = {
        0.20, -0.10, 0.30, 0.05,
        0.10,  0.40, 0.20, 0.15,
        0.30, -0.20, 0.10, 0.35
    };
    static const double w2_vals[] = {
        0.50, 0.10, -0.20,
        0.20, 0.60,  0.05,
        -0.10, 0.30, 0.70,
        0.40, 0.15,  0.25
    };
    const size_t dims_x[] = {1U, 3U};
    const size_t dims_w1[] = {3U, 4U};
    const size_t dims_h[] = {1U, 4U};
    const size_t dims_w2[] = {4U, 3U};
    const size_t dims_y[] = {1U, 3U};
    Tensor x, w1, h, w2, logits, probs;
    int resultado = -1;
    int criados = 0;

    memset(&x, 0, sizeof(x));
    memset(&w1, 0, sizeof(w1));
    memset(&h, 0, sizeof(h));
    memset(&w2, 0, sizeof(w2));
    memset(&logits, 0, sizeof(logits));
    memset(&probs, 0, sizeof(probs));

    if (tensor_criar(&x, dims_x, 2U) != 0 ||
        tensor_criar(&w1, dims_w1, 2U) != 0 ||
        tensor_criar(&h, dims_h, 2U) != 0 ||
        tensor_criar(&w2, dims_w2, 2U) != 0 ||
        tensor_criar(&logits, dims_y, 2U) != 0 ||
        tensor_criar(&probs, dims_y, 2U) != 0) {
        goto limpeza;
    }
    criados = 1;
    if (preencher(&x, x_vals, sizeof(x_vals) / sizeof(x_vals[0])) != 0 ||
        preencher(&w1, w1_vals, sizeof(w1_vals) / sizeof(w1_vals[0])) != 0 ||
        preencher(&w2, w2_vals, sizeof(w2_vals) / sizeof(w2_vals[0])) != 0) {
        goto limpeza;
    }

    if (tensor_matmul(&x, &w1, &h) != 0 || /* x · W1 */
        tensor_relu(&h) != 0 ||            /* ReLU */
        tensor_matmul(&h, &w2, &logits) != 0 ||
        tensor_softmax(&logits, &probs) != 0) {
        goto limpeza;
    }

    printf("=== FORGE Tensor Engine: forward pass (pesos fixos) ===\n");
    imprimir_linha("x      ", &x);
    imprimir_linha("h=ReLU ", &h);
    imprimir_linha("logits ", &logits);
    imprimir_linha("probs  ", &probs);
    printf("argmax = %lu | soma(probs) = %.6f\n",
           (unsigned long)tensor_argmax(&probs),
           probs.data[0] + probs.data[1] + probs.data[2]);
    resultado = 0;

limpeza:
    if (criados != 0) {
        tensor_liberar(&x);
        tensor_liberar(&w1);
        tensor_liberar(&h);
        tensor_liberar(&w2);
        tensor_liberar(&logits);
        tensor_liberar(&probs);
    }
    return resultado;
}

int main(void)
{
    /* Segundo exemplo: GEMM c = 1.0*(a·b) + 0.5*c. */
    const size_t dims_a[] = {2U, 2U};
    const size_t dims_b[] = {2U, 2U};
    const size_t dims_c[] = {2U, 2U};
    static const double a_vals[] = {1.0, 2.0, 3.0, 4.0};
    static const double b_vals[] = {0.5, 0.0, 0.0, 0.5};
    static const double c_vals[] = {1.0, 1.0, 1.0, 1.0};
    Tensor a, b, c;
    int ok = -1;

    memset(&a, 0, sizeof(a));
    memset(&b, 0, sizeof(b));
    memset(&c, 0, sizeof(c));
    if (tensor_criar(&a, dims_a, 2U) == 0 &&
        tensor_criar(&b, dims_b, 2U) == 0 &&
        tensor_criar(&c, dims_c, 2U) == 0) {
        if (preencher(&a, a_vals, 4U) == 0 &&
            preencher(&b, b_vals, 4U) == 0 &&
            preencher(&c, c_vals, 4U) == 0 &&
            tensor_gemm(&a, &b, &c, 1.0, 0.5) == 0) {
            printf("=== GEMM: c = 1.0*(a·b) + 0.5*c ===\n");
            imprimir_linha("linha 0", &c);
            printf("c[1,0]=%.6f c[1,1]=%.6f\n", c.data[2], c.data[3]);
            ok = tensor_forward_demo();
        }
    }
    tensor_liberar(&a);
    tensor_liberar(&b);
    tensor_liberar(&c);
    return ok == 0 ? EXIT_SUCCESS : EXIT_FAILURE;
}
