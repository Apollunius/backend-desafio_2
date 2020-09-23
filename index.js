const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const server = new Koa();

server.use(bodyParser());

const pedido = [];
const produto = [];


server.use((ctx) => {

    // Adicionar um produto no pedido previamente existente
    // (localhost:8081/orders ou products/"id")
    const addProduto = (id_produto, id_pedido, conteudo) => {
        let id_produtoReal = id_produto - 1
        let id_pedidoReal = id_pedido - 1
        let total = 0
        if (pedido[id_pedidoReal]) {
            if (pedido[id_pedidoReal].estado === "incompleto") {
                if (produto[id_produtoReal]) {

                    if (!produto[id_produtoReal].deletado) {

                        if (produto[id_produtoReal].qtd >= conteudo.qtd) {

                            produto[id_produtoReal].qtd -= conteudo.qtd
                            total = conteudo.qtd * produto[id_produtoReal].valor
                            pedido[id_pedidoReal].vTotal += total
                            pedido[id_pedidoReal].produtos.push(conteudo)
                            ctx.status = 200;
                            ctx.body = {
                                status: 'OK',
                                dados: {
                                    mensagem: pedido
                                }

                            }
                        } else {
                            ctx.status = 406;
                            ctx.body = {
                                status: 'erro',
                                dados: {
                                    mensagem: 'Não tem quantidade em estoque'
                                }
                            }
                        }
                    } else {
                        ctx.status = 404;
                        ctx.body = {
                            status: 'erro',
                            dados: {
                                mensagem: 'Não existe este produto em estoque'
                            }
                        }
                    }
                } else {
                    ctx.status = 404;
                    ctx.body = {
                        status: 'erro',
                        dados: {
                            mensagem: 'Não existe este produto em estoque'
                        }
                    }
                }
            } else {
                ctx.status = 401;
                ctx.body = {
                    status: 'erro',
                    dados: {
                        mensagem: 'Esse pedido não pode mais ser editado'
                    }
                }
            }
        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'erro',
                dados: {
                    mensagem: 'Não existe pedido com esse ID'
                }
            }
        }

    }

    // Cria um novo produto ou pedido 
    // (localhost:8081/orders ou products/)
    const novaSolicitacao = (solicitado) => {
        if (solicitado === produto) {
            const nome = ctx.request.body.nome;
            const qtd = ctx.request.body.qtd;
            const valor = ctx.request.body.valor;

            produto.push({
                ["id"]: produto.length + 1,
                ["nome"]: nome,
                ["qtd"]: qtd,
                ["valor"]: valor,
                ["deletado"]: false

            })
        }
        if (solicitado === pedido) {
            const idCliente = ctx.request.body.idCliente;

            pedido.push({
                ["id"]: pedido.length + 1,
                ["produtos"]: [],
                ["estado"]: "incompleto",
                ["idCliente"]: idCliente,
                ["vTotal"]: 0,
                ["deletado"]: false

            })
        }
    }

    // Funcionalidades para o método GET 
    // (localhost:8081/orders ou products/ ou localhost:8081/orders ou products/"id" ou localhost:8081/orders ou products/"estado")
    const obterSolicitacao = (requestId, solicitado) => {

        if (solicitado === produto) {
            if (solicitado[requestId - 1]) {
                if (!solicitado[requestId - 1].deletado) {
                    ctx.status = 200;
                    ctx.body = {
                        status: 'OK',
                        dados: {
                            mensagem: solicitado[requestId - 1]
                        }
                    }
                } else {
                    ctx.status = 404;
                    ctx.body = {
                        status: 'erro',
                        dados: {
                            mensagem: 'Não existe este produto em estoque'
                        }
                    }
                }
            } else {
                ctx.status = 404;
                ctx.body = {
                    status: 'erro',
                    dados: {
                        mensagem: 'Não existe este produto em estoque'
                    }
                }
            }
        } else if (solicitado === pedido) {
            if (solicitado) {
                if (requestId.length < 4) {
                    if (solicitado[requestId - 1]) {
                        if (!solicitado[requestId - 1].deletado) {
                            ctx.status = 200;
                            ctx.body = {
                                status: 'OK',
                                dados: {
                                    mensagem: solicitado[requestId - 1]
                                }
                            }
                        } else {
                            ctx.status = 404;
                            ctx.body = {
                                status: 'erro',
                                dados: {
                                    mensagem: 'Não existe este produto em estoque'
                                }
                            }
                        }
                    } else {
                        ctx.status = 404;
                        ctx.body = {
                            status: 'erro',
                            dados: {
                                mensagem: 'Não existe este produto em estoque'
                            }
                        }
                    }

                } else if (requestId === 'incompleto') {
                    let incompletos = []
                    for (x = 0; x < solicitado.length; x++) {
                        if (requestId === solicitado[x].estado) {
                            incompletos.push(solicitado[x])
                        }

                    }
                    if (incompletos.length > 0) {
                        ctx.status = 200;
                        ctx.body = {
                            status: 'OK',
                            dados: {
                                mensagem: incompletos
                            }

                        }
                    } else {
                        ctx.status = 404;
                        ctx.body = {
                            status: 'erro',
                            dados: {
                                mensagem: "Nenhum pedido existente com o status selecionado"
                            }

                        }

                    }
                } else if (requestId === 'processando') {
                    let processados = []
                    for (x = 0; x < solicitado.length; x++) {
                        if (requestId === solicitado[x].estado) {
                            processados.push(solicitado[x])
                        }
                    }
                    if (processados.length > 0) {
                        ctx.status = 200;
                        ctx.body = {
                            status: 'OK',
                            dados: {
                                mensagem: processados
                            }

                        }
                    } else {
                        ctx.status = 404;
                        ctx.body = {
                            status: 'erro',
                            dados: {
                                mensagem: "Nenhum pedido existente com o status selecionado"
                            }

                        }

                    }
                } else if (requestId === 'pago') {
                    let pagos = []
                    for (x = 0; x < solicitado.length; x++) {
                        if (requestId === solicitado[x].estado) {
                            pagos.push(solicitado[x])
                        }
                    }
                    if (pagos.length > 0) {
                        ctx.status = 200;
                        ctx.body = {
                            status: 'OK',
                            dados: {
                                mensagem: pagos
                            }

                        }
                    } else {
                        ctx.status = 404;
                        ctx.body = {
                            status: 'erro',
                            dados: {
                                mensagem: "Nenhum pedido existente com o status selecionado"
                            }

                        }

                    }

                } else if (requestId === 'enviado') {
                    let enviados = []
                    for (x = 0; x < solicitado.length; x++) {
                        if (requestId === solicitado[x].estado) {
                            enviados.push(solicitado[x])
                        }
                    }
                    if (enviados.length > 0) {
                        ctx.status = 200;
                        ctx.body = {
                            status: 'OK',
                            dados: {
                                mensagem: enviados
                            }

                        }
                    } else {
                        ctx.status = 404;
                        ctx.body = {
                            status: 'erro',
                            dados: {
                                mensagem: "Nenhum pedido existente com o status selecionado"
                            }

                        }
                    }

                } else if (requestId === 'entregue') {
                    let entregues = []
                    for (x = 0; x < solicitado.length; x++) {
                        if (requestId === solicitado[x].estado) {
                            entregues.push(solicitado[x])
                        }
                    }
                    if (entregues.length > 0) {
                        ctx.status = 200;
                        ctx.body = {
                            status: 'OK',
                            dados: {
                                mensagem: entregues
                            }

                        }
                    } else {
                        ctx.status = 404;
                        ctx.body = {
                            status: 'erro',
                            dados: {
                                mensagem: "Nenhum pedido existente com o status selecionado"
                            }

                        }
                    }
                } else if (requestId === 'cancelado') {
                    let cancelados = []
                    for (x = 0; x < solicitado.length; x++) {
                        if (requestId === solicitado[x].estado) {
                            cancelados.push(solicitado[x])
                        }
                    }
                    if (cancelados.length > 0) {
                        ctx.status = 200;
                        ctx.body = {
                            status: 'OK',
                            dados: {
                                mensagem: cancelados
                            }

                        }
                    } else {
                        ctx.status = 404;
                        ctx.body = {
                            status: 'erro',
                            dados: {
                                mensagem: "Nenhum pedido existente com o status selecionado"
                            }

                        }
                    }

                } else {
                    ctx.status = 200;
                    ctx.body = {
                        status: 'OK',
                        dados: {
                            mensagem: solicitado[id - 1]
                        }

                    }
                }

            } else {
                ctx.status = 404;
                ctx.body = {
                    status: 'erro',
                    dados: {
                        mensagem: 'Não existe pedido com esse ID'
                    }
                }
            }
        } else {
            ctx.status = 400;
            ctx.body = {
                status: 'erro',
                dados: {
                    mensagem: 'Requisição mal-formatada'
                }

            }
        }
    }

    // Funcionalidade para o método PUT ou DELETE 
    // (localhost:8081/orders ou products/"id")
    const attSolicitacao = (id, deletando, solicitado) => {
        if (!deletando) {

            if (solicitado === produto) {
                if (!solicitado[id - 1].deletado) {
                    solicitado[id - 1].valor = ctx.request.body.valor;

                    ctx.status = 201;
                    ctx.body = {
                        status: 'OK',
                        dados: {
                            mensagem: solicitado[id - 1]
                        }

                    }

                } else {
                    ctx.status = 404;
                    ctx.body = {
                        status: 'erro',
                        dados: {
                            mensagem: "Não tem este produto no estoque"
                        }

                    }
                }

            } else if (solicitado === pedido) {

                if (!solicitado[id - 1].deletado) {
                    solicitado[id - 1].estado = ctx.request.body.estado
                    ctx.status = 201;
                    ctx.body = {
                        status: 'OK',
                        dados: {
                            mensagem: 'Conteúdo atualizado!'
                        }

                    }
                } else {
                    ctx.status = 404;
                    ctx.body = {
                        status: 'erro',
                        dados: {
                            mensagem: 'Esse pedido não existe!'
                        }

                    }
                }


            }
        } else {
            if (solicitado[id - 1]) {
                if (!solicitado[id - 1].deletado) {
                    solicitado[id - 1].deletado = true;
                    ctx.status = 200;
                    ctx.body = {
                        status: 'OK',
                        dados: {
                            mensagem: 'O produto foi deletado!'
                        }
                    }
                } else {
                    ctx.status = 401;
                    ctx.body = {
                        status: 'erro',
                        dados: {
                            mensagem: 'O produto já foi deletado!'
                        }
                    }
                }
            } else {
                ctx.status = 404;
                ctx.body = {
                    status: 'erro',
                    dados: {
                        mensagem: 'Produto/Pedido não encontrado'
                    }
                }
            }
        }


    }

    if (ctx.url.includes("/products/")) {
        if (ctx.method === "POST") {
            novaSolicitacao(produto)

            ctx.status = 201;
            ctx.body = {
                status: 'OK',
                dados: {
                    mensagem: 'Conteúdo criado!'
                }
            }
        } else if (ctx.method === "GET") {
            if (produto.length > 0) {
                if (ctx.url.length > 10) {
                    const requestId = ctx.url.split('/')[2];
                    console.log("ID Requisitado: " + requestId)
                    obterSolicitacao(requestId, produto)
                } else {
                    let pdtAtt = []
                    for (x = 0; x < produto.length; x++) {
                        if (produto[x].deletado === false) {
                            pdtAtt.push(produto[x])
                        }

                        ctx.status = 200;
                        ctx.body = {
                            status: 'OK',
                            dados: {
                                mensagem: pdtAtt
                            }
                        }
                    }
                }
            } else {
                ctx.status = 404;
                ctx.body = {
                    status: 'erro',
                    dados: {
                        mensagem: 'Não existe nenhum produto'
                    }
                }
            }

        } else if (ctx.method === "PUT") {
            const requestId = ctx.url.split('/')[2];
            console.log("ID Requisitado: " + requestId)
            const deletando = false
            attSolicitacao(requestId, deletando, produto)


        } else if (ctx.method === "DELETE") {
            const requestId = ctx.url.split('/')[2];
            console.log("ID Requisitado: " + requestId)
            const deletando = true
            attSolicitacao(requestId, deletando, produto)
        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'erro',
                dados: {
                    mensagem: 'Página não encontrada'
                }
            }
        }
    } else if (ctx.url.includes("/orders/")) {
        if (ctx.method === "POST") {
            novaSolicitacao(pedido)

            ctx.status = 201;
            ctx.body = {
                status: 'OK',
                dados: {
                    mensagem: 'Conteúdo criado!'
                }
            }
        } else if (ctx.method === "GET") {
            if (ctx.url.length > 8) {
                const requestId = ctx.url.split('/')[2];
                console.log("ID Requisitado: " + requestId)
                obterSolicitacao(requestId, pedido)
            } else {
                let pddAtt = []
                for (x = 0; x < pedido.length; x++) {
                    if (pedido[x].deletado === false) {
                        pddAtt.push(pedido[x])
                    }

                    ctx.status = 200;
                    ctx.body = {
                        status: 'OK',
                        dados: {
                            mensagem: pddAtt
                        }
                    }
                }

            }

        } else if (ctx.method === "PUT") {
            if (ctx.url.length > 8) {

                const requestId = ctx.url.split('/')[2];
                let conteudo = ctx.request.body;

                if ((conteudo.hasOwnProperty("qtd")) && (conteudo.hasOwnProperty("estado"))) {
                    ctx.status = 406;
                    ctx.body = {
                        status: 'erro',
                        dados: {
                            mensagem: 'Só é possivel fazer uma solicitação por vez'
                        }

                    }

                } else if ((conteudo.hasOwnProperty("qtd")) && (!conteudo.hasOwnProperty("estado"))) {

                    const id_produto = conteudo.id
                    addProduto(id_produto, requestId, conteudo)
                } else {
                    attSolicitacao(requestId, false, pedido)
                    ctx.request.body = pedido
                }
            }


        } else if (ctx.method === "DELETE") {
            const requestId = ctx.url.split('/')[2];
            console.log("ID Requisitado: " + requestId)

            attSolicitacao(requestId, true, pedido)
        }

    } else {
        ctx.status = 404;
        ctx.body = {
            status: 'erro',
            dados: {
                mensagem: 'Página não encontrada'
            }
        }
    }

})

server.listen(8081, () => console.log('Running on 8081!'));

