//  Conexión a Supabase
const supabase = window.supabase.createClient(
  "https://rfgtzmuroumbhqkfezad.supabase.co",
  "sb_publishable_857Enr2hzZgbhRkXEU5oxA_blkOwJ0E"
);


//  Enviar mensaje
async function enviar() {
    let usuario = document.getElementById("login").value;
    let texto = document.getElementById("teclado").value;

    if (!usuario || !texto) return;

    let { error } = await supabase
        .from("mensajes")
        .insert([
            { usuario: usuario, mensaje: texto }
        ]);

    if (error) {
        console.log("Error:", error);
        return;
    }

    document.getElementById("teclado").value = "";
}


//  Cargar mensajes
async function cargarMensajes() {
    let { data, error } = await supabase
        .from("mensajes")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.log("Error:", error);
        return;
    }

    let chat = document.getElementById("chat");
    chat.innerHTML = "";

    data.forEach(msg => {
        let p = document.createElement("p");
        p.textContent = msg.usuario + ": " + msg.mensaje;
        chat.appendChild(p);
    });

    // ⬇ bajar automático
    chat.scrollTop = chat.scrollHeight;
}


// Tiempo real (cuando alguien envía mensaje)
supabase
  .channel('chat')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'mensajes' },
    () => {
        cargarMensajes();
    }
  )
  .subscribe();


// Al cargar la página
window.onload = () => {
    cargarMensajes();
};
