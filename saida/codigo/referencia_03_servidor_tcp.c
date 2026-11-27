/*
 * referencia_03_servidor_tcp.c
 * Servidor TCP concorrente minimo. No Windows usa Winsock + threads; no POSIX usa fork().
 * Windows: gcc -std=c17 -Wall -Wextra -Werror -pedantic referencia_03_servidor_tcp.c -lws2_32 -o servidor.exe
 * Linux  : gcc -std=c17 -Wall -Wextra -Werror -pedantic referencia_03_servidor_tcp.c -o servidor
 * Encerra com Ctrl+C. Porta padrao 8080 (alteravel por argv[1]).
 */
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>

#ifdef _WIN32
#include <windows.h>
#include <winsock2.h>
#include <ws2tcpip.h>
#include <process.h>
#define PORTA_PADRAO 8080U
typedef SOCKET socket_t;
#define SOCKET_INVALIDO INVALID_SOCKET
#define FECHAR_SOCKET closesocket
#else
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/wait.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <signal.h>
#define PORTA_PADRAO 8080U
typedef int socket_t;
#define SOCKET_INVALIDO (-1)
#define FECHAR_SOCKET close
#endif

#define BACKLOG 10
#define TAM_BUFFER 1024

/* Trata um unico cliente: le a mensagem e responde com HTTP minimo. */
static void atender_cliente(socket_t client_socket, const char *ip)
{
    char buffer[TAM_BUFFER + 1];
    static const char resposta[] =
        "HTTP/1.1 200 OK\r\nContent-Length: 14\r\n\r\nHello, Client!";
    int recebidos = 0;

    memset(buffer, 0, sizeof(buffer));
    recebidos = recv(client_socket, buffer, TAM_BUFFER, 0);
    if (recebidos > 0) {
        printf("[CLIENTE %s] %.*s\n", ip, recebidos, buffer);
        (void)send(client_socket, resposta, (int)strlen(resposta), 0);
    } else {
        printf("[CLIENTE %s] sem dados ou erro na leitura.\n", ip);
    }
    FECHAR_SOCKET(client_socket);
}

#ifdef _WIN32
/* Thread por cliente no Windows. */
static unsigned __stdcall thread_cliente(void *arg)
{
    socket_t s = (socket_t)(intptr_t)arg;
    atender_cliente(s, "windows");
    _endthreadex(0U);
    return 0U;
}
#else
/* Evita processos zumbis ao usar fork(). */
static void tratador_sigchld(int sinal)
{
    (void)sinal;
    while (waitpid(-1, NULL, WNOHANG) > 0) {
        /* esvazia a fila de filhos encerrados */
    }
}
#endif

int main(int argc, char **argv)
{
    socket_t server_fd = SOCKET_INVALIDO;
    struct sockaddr_in endereco;
    unsigned short porta = (unsigned short)PORTA_PADRAO;
    int opt = 1;

    if (argc > 1) {
        int p = atoi(argv[1]);
        if (p < 1 || p > 65535) {
            fprintf(stderr, "Porta invalida: %s\n", argv[1]);
            return EXIT_FAILURE;
        }
        porta = (unsigned short)p;
    }

#ifdef _WIN32
    {
        WSADATA wsa;
        if (WSAStartup(MAKEWORD(2, 2), &wsa) != 0) {
            fprintf(stderr, "Falha no WSAStartup.\n");
            return EXIT_FAILURE;
        }
    }
#else
    {
        struct sigaction sa;
        memset(&sa, 0, sizeof(sa));
        sa.sa_handler = tratador_sigchld;
        sigemptyset(&sa.sa_mask);
        sa.sa_flags = SA_RESTART;
        if (sigaction(SIGCHLD, &sa, NULL) == -1) {
            perror("sigaction");
            return EXIT_FAILURE;
        }
    }
#endif

    server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd == SOCKET_INVALIDO) {
        perror("socket");
        return EXIT_FAILURE;
    }
    (void)setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, (const char *)&opt, sizeof(opt));

    memset(&endereco, 0, sizeof(endereco));
    endereco.sin_family = AF_INET;
    endereco.sin_addr.s_addr = htonl(INADDR_ANY);
    endereco.sin_port = htons(porta);

    if (bind(server_fd, (struct sockaddr *)&endereco, sizeof(endereco)) < 0) {
        perror("bind");
        FECHAR_SOCKET(server_fd);
        return EXIT_FAILURE;
    }
    if (listen(server_fd, BACKLOG) < 0) {
        perror("listen");
        FECHAR_SOCKET(server_fd);
        return EXIT_FAILURE;
    }
    printf("[SERVIDOR] Escutando na porta %u. Ctrl+C para encerrar.\n", (unsigned)porta);

    for (;;) {
        struct sockaddr_in cli;
        int tam = (int)sizeof(cli);
        socket_t novo = accept(server_fd, (struct sockaddr *)&cli,
#ifdef _WIN32
                               &tam
#else
                               (socklen_t *)&tam
#endif
        );
        char ip[INET_ADDRSTRLEN];
        if (novo == SOCKET_INVALIDO) {
            perror("accept");
            continue;
        }
#ifdef _WIN32
        /* MinGW nao declara inet_ntop; inet_ntoa e suficiente para IPv4. */
        (void)snprintf(ip, sizeof(ip), "%s", inet_ntoa(cli.sin_addr));
#else
        (void)inet_ntop(AF_INET, &cli.sin_addr, ip, sizeof(ip));
#endif
#ifdef _WIN32
        {
            printf("[SERVIDOR] Conexao aceita de %s\n", ip);
            uintptr_t h = _beginthreadex(NULL, 0U, thread_cliente, (void *)novo, 0U, NULL);
            if (h == 0U) {
                FECHAR_SOCKET(novo);
            } else {
                CloseHandle((HANDLE)h);
            }
        }
#else
        {
            pid_t filho = fork();
            if (filho == 0) {
                FECHAR_SOCKET(server_fd);
                atender_cliente(novo, ip);
                exit(EXIT_SUCCESS);
            }
            FECHAR_SOCKET(novo);
            if (filho < 0) {
                perror("fork");
            }
        }
#endif
    }
    FECHAR_SOCKET(server_fd); /* Alcancado apenas em caso de saida futuro. */
    return EXIT_SUCCESS;
}
