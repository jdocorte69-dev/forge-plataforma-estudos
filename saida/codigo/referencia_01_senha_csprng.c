/*
 * referencia_01_senha_csprng.c
 * Gerador de senhas com entropia criptografica (CSPRNG) e sem vies de modulo.
 * Compilacao (Windows/MinGW): gcc -std=c11 -Wall -Wextra -Werror -pedantic referencia_01_senha_csprng.c -ladvapi32 -o senha.exe
 * Compilacao (Linux)        : gcc -std=c17 -Wall -Wextra -Werror -pedantic referencia_01_senha_csprng.c -o senha
 * Nota: o MinGW 6.3 desta maquina nao tem -std=c17 nem bcrypt.h; usa-se C11 e a API CryptoAPI.
 */
#define _POSIX_C_SOURCE 200809L

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <math.h>

#ifdef _WIN32
#include <windows.h>
#include <wincrypt.h>
#else
#include <sys/random.h>
#include <unistd.h>
#endif

/* Alfabeto ASCII visivel: 94 caracteres imprimiveis. */
static const char CHARSET[] =
    "abcdefghijklmnopqrstuvwxyz"
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    "0123456789"
    "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

static const size_t CHARSET_SIZE = sizeof(CHARSET) - 1U; /* 94, sem o terminador NUL. */

/* Zeracao resistente a otimizacao: ponteiro volatile impede o compilador de remover o loop. */
static void secure_zero(void *ptr, size_t length)
{
    volatile unsigned char *p = (volatile unsigned char *)ptr;
    size_t i;
    for (i = 0; i < length; ++i) {
        p[i] = 0U;
    }
}

/* Le bytes diretamente da fonte de entropia do sistema operacional. */
static int csprng_bytes(void *buffer, size_t length)
{
    if (buffer == NULL || length == 0U) {
        return -1;
    }
#ifdef _WIN32
    /* CryptoAPI: CryptGenRandom le o pool de entropia do sistema Windows. */
    HCRYPTPROV prov = 0;
    BOOL ok = FALSE;
    if (!CryptAcquireContextA(&prov, NULL, NULL, PROV_RSA_FULL,
                              CRYPT_VERIFYCONTEXT)) {
        return -1;
    }
    ok = CryptGenRandom(prov, (DWORD)length, (PBYTE)buffer);
    (void)CryptReleaseContext(prov, 0U);
    return ok ? 0 : -1;
#else
    /* getrandom(2): le o pool de entropia do kernel Linux. */
    unsigned char *p = (unsigned char *)buffer;
    size_t feitos = 0U;
    while (feitos < length) {
        ssize_t n = getrandom(p + feitos, length - feitos, 0U);
        if (n <= 0) {
            return -1;
        }
        feitos += (size_t)n;
    }
    return 0;
#endif
}

/*
 * Rejection sampling: elimina o vies de modulo.
 * Descarta valores menores que (2^B mod N) antes de aplicar o resto.
 */
static uint8_t uniform_index(uint8_t limite)
{
    const unsigned min_aceitavel = 256U % (unsigned)limite;
    uint8_t bruto = 0U;
    do {
        if (csprng_bytes(&bruto, sizeof(bruto)) != 0) {
            fprintf(stderr, "Falha fatal: fonte de entropia indisponivel.\n");
            exit(EXIT_FAILURE);
        }
    } while ((unsigned)bruto < min_aceitavel);
    return (uint8_t)((unsigned)bruto % (unsigned)limite);
}

int main(int argc, char **argv)
{
    char *senha = NULL;
    int comprimento = 0;
    int i = 0;
    double entropia = 0.0;

    if (argc != 2) {
        fprintf(stderr, "Uso: %s <comprimento entre 1 e 1024>\n", argv[0]);
        return EXIT_FAILURE;
    }
    comprimento = atoi(argv[1]);
    if (comprimento < 1 || comprimento > 1024) {
        fprintf(stderr, "Erro: comprimento deve estar entre 1 e 1024.\n");
        return EXIT_FAILURE;
    }
    if (CHARSET_SIZE > 256U) {
        fprintf(stderr, "Erro: alfabeto excede 256 simbolos.\n");
        return EXIT_FAILURE;
    }

    senha = (char *)malloc((size_t)comprimento + 1U);
    if (senha == NULL) {
        fprintf(stderr, "Erro: falha de alocacao de memoria.\n");
        return EXIT_FAILURE;
    }
    for (i = 0; i < comprimento; ++i) {
        senha[i] = CHARSET[uniform_index((uint8_t)CHARSET_SIZE)];
    }
    senha[comprimento] = '\0';

    entropia = (double)comprimento * log2((double)CHARSET_SIZE);
    printf("Senha: %s\n", senha);
    printf("Comprimento: %d | Alfabeto: %lu | Entropia: %.2f bits\n",
           comprimento, (unsigned long)CHARSET_SIZE, entropia);

    secure_zero(senha, (size_t)comprimento + 1U);
    free(senha);
    return EXIT_SUCCESS;
}
