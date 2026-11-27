/*
 * tensor_engine.h — esqueleto didático de mecanismo de tensores em C17.
 * Sem dependências externas: apenas biblioteca padrão (stddef/math incluídas no .c).
 * Escopo: tensores densos contíguos, no máximo 4 dimensões, operações 2D.
 */
#ifndef FORGE_TENSOR_ENGINE_H
#define FORGE_TENSOR_ENGINE_H

#include <stddef.h>

#define TENSOR_MAX_DIM 4U

typedef struct {
    size_t ndim;                    /* número de dimensões (1..4) */
    size_t dims[TENSOR_MAX_DIM];    /* formas: dims[0] = linhas, dims[1] = colunas */
    size_t strides[TENSOR_MAX_DIM]; /* passos em elementos, ordem row-major */
    double *data;                   /* dados contíguos alocados com calloc */
} Tensor;

/* Cria tensor zero-inicializado. Retorna 0 em caso de sucesso, -1 em erro. */
int tensor_criar(Tensor *t, const size_t *dims, size_t ndim);

/* Libera os dados e zera os metadados. Seguro para tensor não inicializado. */
void tensor_liberar(Tensor *t);

/* multiplicação 2D: out = a · b, com loop k desenrolado de 4 em 4. */
int tensor_matmul(const Tensor *a, const Tensor *b, Tensor *out);

/* GEMM 2D simples: c = alpha · (a · b) + beta · c. */
int tensor_gemm(const Tensor *a, const Tensor *b, Tensor *c,
                double alpha, double beta);

/* Índice linear do maior valor (argmax); 0 se vazio/inválido. */
size_t tensor_argmax(const Tensor *t);

/* ReLU in-place: valores negativos passam a 0. */
int tensor_relu(Tensor *t);

/* Softmax estável por linha: lê t, escreve em out (formas iguais). */
int tensor_softmax(const Tensor *t, Tensor *out);

/* Demonstração determinística: matmul -> ReLU -> matmul -> softmax. */
int tensor_forward_demo(void);

#endif /* FORGE_TENSOR_ENGINE_H */
