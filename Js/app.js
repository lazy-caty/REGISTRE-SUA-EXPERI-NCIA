// ======================================

// CONEXÃO COM SUPABASE

// ======================================

const SUPABASE_URL =

    "https://elxcbmookggmwxsntbaq.supabase.co";

const SUPABASE_KEY =

    "sb_publishable_7u7sDnFVjDMxGAYM6bYM0Q_1FoAN8VY";

const supabaseClient =

    window.supabase.createClient(

        SUPABASE_URL,

        SUPABASE_KEY

    );

// ======================================

// CADASTRO DO PARTICIPANTE

// ======================================

const formularioCadastro =

    document.getElementById("formularioCadastro");

if (formularioCadastro) {

    formularioCadastro.addEventListener(

        "submit",

        async function (event) {

            event.preventDefault();

            const nome =

                document.getElementById("nome").value.trim();

            const escola =

                document.getElementById("escola").value.trim();

            const serie =

                document.getElementById("serie").value.trim();

            const telefone =

                document.getElementById("telefone").value.trim();

            if (!nome || !escola || !serie || !telefone) {

                alert(

                    "Preencha todos os campos para continuar."

                );

                return;

            }

            try {

                const participanteId =

                    crypto.randomUUID();

                const { error } =

                    await supabaseClient

                        .from("participantes")

                        .insert([{

                            id: participanteId,

                            nome,

                            escola,

                            serie,

                            telefone

                        }]);

                if (error) {

                    console.error(

                        "Erro no cadastro:",

                        error

                    );

                    console.error(

                        "Detalhes:",

                        error.details

                    );

                    console.error(

                        "Mensagem:",

                        error.message

                    );

                    alert(

                        "Não foi possível realizar o cadastro.\n\n" +

                        error.message

                    );

                    return;

                }

                const participante = {

                    id: participanteId,

                    nome,

                    escola,

                    serie,

                    telefone

                };

                localStorage.setItem(

                    "participante",

                    JSON.stringify(participante)

                );

                window.location.href =

                    "evento.html";

            } catch (erro) {

                console.error(

                    "Erro inesperado:",

                    erro

                );

                alert(

                    "Ocorreu um erro ao realizar o cadastro."

                );

            }

        }

    );

}

// ======================================

// ELEMENTOS DA CÂMERA

// ======================================

const abrirCamera =

    document.getElementById("abrirCamera");

const cameraContainer =

    document.getElementById("cameraContainer");

const camera =

    document.getElementById("camera");

const fecharCamera =

    document.getElementById("fecharCamera");

const capturarFoto =

    document.getElementById("capturarFoto");

const trocarCamera =

    document.getElementById("trocarCamera");

// ======================================

// VARIÁVEIS DA CÂMERA

// ======================================

let streamCamera = null;

let cameraAtual = "environment";

// ======================================

// ABRIR CÂMERA

// ======================================

if (abrirCamera) {

    abrirCamera.addEventListener(

        "click",

        async function () {

            try {

                streamCamera =

                    await navigator.mediaDevices.getUserMedia({

                        video: {

                            facingMode: cameraAtual

                        },

                        audio: false

                    });

                camera.srcObject =

                    streamCamera;

                cameraContainer.classList.add(

                    "ativa"

                );

            } catch (erro) {

                console.error(

                    "Erro ao abrir câmera:",

                    erro

                );

                alert(

                    "Não foi possível acessar a câmera.\n\n" +

                    "Verifique se você permitiu o acesso à câmera."

                );

            }

        }

    );

}

// ======================================

// FECHAR CÂMERA

// ======================================

if (fecharCamera) {

    fecharCamera.addEventListener(

        "click",

        function () {

            fecharCameraFuncao();

        }

    );

}

function fecharCameraFuncao() {

    if (streamCamera) {

        streamCamera

            .getTracks()

            .forEach(function (track) {

                track.stop();

            });

        streamCamera = null;

    }

    if (camera) {

        camera.srcObject = null;

    }

    if (cameraContainer) {

        cameraContainer.classList.remove(

            "ativa"

        );

    }

}

// ======================================

// TROCAR CÂMERA

// ======================================

if (trocarCamera) {

    trocarCamera.addEventListener(

        "click",

        async function () {

            if (streamCamera) {

                streamCamera

                    .getTracks()

                    .forEach(function (track) {

                        track.stop();

                    });

                streamCamera = null;

            }

            if (cameraAtual === "environment") {

                cameraAtual = "user";

            } else {

                cameraAtual = "environment";

            }

            try {

                streamCamera =

                    await navigator.mediaDevices.getUserMedia({

                        video: {

                            facingMode: cameraAtual

                        },

                        audio: false

                    });

                camera.srcObject =

                    streamCamera;

            } catch (erro) {

                console.error(

                    "Erro ao trocar câmera:",

                    erro

                );

                alert(

                    "Não foi possível trocar de câmera."

                );

            }

        }

    );

}

// ======================================

// ELEMENTOS DA PRÉ-VISUALIZAÇÃO

// ======================================

const previsualizacao =

    document.getElementById("previsualizacao");

const fotoPreview =

    document.getElementById("fotoPreview");

const tirarNovamente =

    document.getElementById("tirarNovamente");

const usarFoto =

    document.getElementById("usarFoto");

// ======================================

// FOTO CAPTURADA

// ======================================

let fotoCapturada = null;

// ======================================

// ======================================

// ======================================

// CAPTURAR FOTO (Captura Direta / Sem Inversão)

// ======================================

if (capturarFoto) {

    capturarFoto.addEventListener(

        "click",

        function () {

            const canvas =

                document.getElementById("canvasFoto");

            if (!camera.videoWidth || !camera.videoHeight) {

                alert(

                    "A câmera ainda não está pronta."

                );

                return;

            }

            canvas.width =

                camera.videoWidth;

            canvas.height =

                camera.videoHeight;

            const contexto =

                canvas.getContext("2d");

            // Desenha a imagem diretamente do vídeo sem alterações de escala

            contexto.drawImage(

                camera,

                0,

                0,

                canvas.width,

                canvas.height

            );

            fotoCapturada =

                canvas.toDataURL(

                    "image/jpeg",

                    0.9

                );

            fotoPreview.src =

                fotoCapturada;

            fecharCameraFuncao();

            previsualizacao.classList.add(

                "ativa"

            );

        }

    );

}

// ======================================

// TIRAR NOVAMENTE

// ======================================

if (tirarNovamente) {

    tirarNovamente.addEventListener(

        "click",

        async function () {

            previsualizacao.classList.remove(

                "ativa"

            );

            try {

                streamCamera =

                    await navigator.mediaDevices.getUserMedia({

                        video: {

                            facingMode: cameraAtual

                        },

                        audio: false

                    });

                camera.srcObject =

                    streamCamera;

                cameraContainer.classList.add(

                    "ativa"

                );

            } catch (erro) {

                console.error(

                    "Erro ao reabrir câmera:",

                    erro

                );

                alert(

                    "Não foi possível acessar a câmera."

                );

            }

        }

    );

}

// ======================================

// USAR FOTO

// ======================================

if (usarFoto) {

    usarFoto.addEventListener(

        "click",

        async function () {

            if (!fotoCapturada) {

                alert(

                    "Nenhuma foto foi capturada."

                );

                return;

            }

            await enviarFotoParaSupabase(

                fotoCapturada

            );

        }

    );

}

// ======================================

// ENVIAR FOTO PARA SUPABASE

// ======================================

async function enviarFotoParaSupabase(foto) {

    try {

        const participanteSalvo =

            localStorage.getItem(

                "participante"

            );

        if (!participanteSalvo) {

            alert(

                "Não foi possível identificar seu cadastro."

            );

            return;

        }

        const participante =

            JSON.parse(

                participanteSalvo

            );

        if (!participante.id) {

            alert(

                "Seu cadastro não possui um ID válido."

            );

            return;

        }

        // ======================================

        // BUSCAR A RODADA ATIVA

        // ======================================

        const agora =

            new Date().toISOString();

        const {

            data: rodada,

            error: erroRodada

        } =

            await supabaseClient

                .from("rodadas")

                .select(

                    "id, periodo, inicio_envios, fim_envios"

                )

                .lte(

                    "inicio_envios",

                    agora

                )

                .gte(

                    "fim_envios",

                    agora

                )

                .order(

                    "inicio_envios",

                    {

                        ascending: false

                    }

                )

                .limit(1)

                .maybeSingle();

        if (erroRodada) {

            console.error(

                "Erro ao buscar rodada:",

                erroRodada

            );

            alert(

                "Não foi possível verificar a competição."

            );

            return;

        }

        if (!rodada) {

            alert(

                "A competição não está aberta para envio de fotos neste momento."

            );

            return;

        }

        // ======================================

        // TRANSFORMAR DATAURL EM ARQUIVO

        // ======================================

        const resposta =

            await fetch(foto);

        const blob =

            await resposta.blob();

        const nomeArquivo =

            `${participante.id}/${Date.now()}.jpg`;

        // ======================================

        // ENVIAR FOTO PARA O STORAGE

        // ======================================

        const {

            error: erroUpload

        } =

            await supabaseClient.storage

                .from("fotos-evento")

                .upload(

                    nomeArquivo,

                    blob,

                    {

                        contentType:

                            "image/jpeg",

                        upsert:

                            false

                    }

                );

        if (erroUpload) {

            console.error(

                "Erro no upload:",

                erroUpload

            );

            alert(

                "Não foi possível enviar a foto."

            );

            return;

        }

        // ======================================

        // OBTER URL DA FOTO

        // ======================================

        const {

            data: urlFoto

        } =

            supabaseClient.storage

                .from("fotos-evento")

                .getPublicUrl(

                    nomeArquivo

                );

        const url =

            urlFoto.publicUrl;

        // ======================================

        // REGISTRAR FOTO NA TABELA

        // ======================================

        const {

            error: erroFoto

        } =

            await supabaseClient

                .from("fotos")

                .insert([{

                    rodada_id:

                        rodada.id,

                    participante_id:

                        participante.id,

                    url:

                        url,

                    status:

                        "APROVADA"

                }]);

        if (erroFoto) {

            console.error(

                "Erro ao registrar foto:",

                erroFoto

            );

            alert(

                "A foto foi enviada, mas não foi possível registrá-la na competição."

            );

            return;

        }

        // ======================================

        // FINALIZAÇÃO

        // ======================================

        previsualizacao.classList.remove(

            "ativa"

        );

        fotoCapturada =

            null;

        alert(

            "Foto registrada com sucesso! 🎉"

        );

        carregarGaleria();

    } catch (erro) {

        console.error(

            "Erro inesperado ao enviar foto:",

            erro

        );

        alert(

            "Ocorreu um erro ao enviar a foto."

        );

    }

}

// ======================================

// CARREGAR GALERIA DO SUPABASE

// ======================================

async function carregarGaleria() {

    const gradeFotos =

        document.getElementById(

            "gradeFotos"

        );

    if (!gradeFotos) {

        return;

    }

    try {

        const agora =

            new Date().toISOString();

        // ======================================

        // BUSCAR RODADA ATIVA

        // ======================================

        const {

            data: rodada,

            error: erroRodada

        } =

            await supabaseClient

                .from("rodadas")

                .select(

                    "id, periodo, inicio_envios, fim_envios"

                )

                .lte(

                    "inicio_envios",

                    agora

                )

                .gte(

                    "fim_envios",

                    agora

                )

                .order(

                    "inicio_envios",

                    {

                        ascending: false

                    }

                )

                .limit(1)

                .maybeSingle();

        if (erroRodada) {

            console.error(

                "Erro ao buscar rodada:",

                erroRodada

            );

            return;

        }

        if (!rodada) {

            gradeFotos.innerHTML = "";

            return;

        }

        // ======================================

        // BUSCAR FOTOS + PARTICIPANTE

        // ======================================

      const {

    data: fotos,

    error: erroFotos

} =

    await supabaseClient

        .rpc(

            "obter_galeria_rodada",

            {

                p_rodada_id: rodada.id

            }

        );

        if (erroFotos) {

            console.error(

                "Erro ao carregar fotos:",

                erroFotos

            );

            return;

        }

        gradeFotos.innerHTML = "";

        // ======================================

        // MONTAR GALERIA

        // ======================================

        for (const foto of fotos) {

            let caminhoFoto =

                foto.url;

            // ======================================

            // EXTRAIR CAMINHO DA FOTO

            // ======================================

            if (

                caminhoFoto.startsWith(

                    "http"

                )

            ) {

                const marcador =

                    "/storage/v1/object/public/fotos-evento/";

                if (

                    caminhoFoto.includes(

                        marcador

                    )

                ) {

                    caminhoFoto =

                        caminhoFoto.split(

                            marcador

                        )[1];

                }

            }

            // ======================================

            // GERAR URL TEMPORÁRIA

            // ======================================

            const {

                data: urlAssinada,

                error: erroUrl

            } =

                await supabaseClient.storage

                    .from("fotos-evento")

                    .createSignedUrl(

                        caminhoFoto,

                        3600

                    );

            if (erroUrl) {

                console.error(

                    "Erro ao gerar URL da foto:",

                    erroUrl

                );

                continue;

            }

            // ======================================

            // CRIAR CARD DA FOTO

            // ======================================

          const card =

    document.createElement("div");

card.className =

    "foto-card";

// ======================================

// IMAGEM

// ======================================

const imagem =

    document.createElement("img");

imagem.src =

    urlAssinada.signedUrl;

imagem.alt =

    "Foto da galeria";

imagem.loading =

    "lazy";

// ======================================

// IDENTIFICAÇÃO

// ======================================

const identificacao =

    document.createElement("div");

identificacao.className =

    "foto-identificacao";

// NOME

const nome =

    document.createElement("strong");

nome.textContent =

    foto.nome || "Participante";

// ESCOLA

const escola =

    document.createElement("span");

escola.textContent =

    foto.escola || "";

// ======================================

// MONTAR IDENTIFICAÇÃO

// ======================================

identificacao.appendChild(

    nome

);

identificacao.appendChild(

    escola

);

// ======================================

// MONTAR CARD

// ======================================

card.appendChild(

    imagem

);

card.appendChild(

    identificacao

);

// ======================================

// ADICIONAR NA GALERIA

// ======================================

gradeFotos.appendChild(

    card

);

        }

    } catch (erro) {

        console.error(

            "Erro inesperado ao carregar galeria:",

            erro

        );

    }

}

// ======================================

// CARREGAR GALERIA AO ABRIR A PÁGINA

// ======================================

if (

    document.getElementById(

        "gradeFotos"

    )

) {

    carregarGaleria();

}