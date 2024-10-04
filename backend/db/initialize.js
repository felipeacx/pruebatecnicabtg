const { collection, addDoc } = require("firebase/firestore")
const { db } = require("./firebase.js")

const fondosData = [
  { nombre: "FPV_BTG_PACTUAL_RECAUDADORA", montominimo: 75000, categoria: "FPV" },
  { nombre: "FPV_BTG_PACTUAL_ECOPETROL", montominimo: 125000, categoria: "FPV" },
  { nombre: "DEUDAPRIVADA", montominimo: 50000, categoria: "FIC" },
  { nombre: "FDO-ACCIONES", montominimo: 250000, categoria: "FIC" },
  { nombre: "FPV_BTG_PACTUAL_DINAMICA", montominimo: 100000, categoria: "FPV" },
]

const usuariosData = [
  { nombre: "Juan Bonilla", cargo: "Desarrollador Senior", correo: "juanfe1190@gmail.com" },
  { nombre: "María López", cargo: "Desarrolladora", correo: "maria.lopez@example.com" },
  { nombre: "Carlos García", cargo: "Diseñador", correo: "carlos.garcia@example.com" },
  { nombre: "Ana Torres", cargo: "Analista", correo: "ana.torres@example.com" },
  { nombre: "Luis Martínez", cargo: "Tester", correo: "luis.martinez@example.com" },
  { nombre: "Sofía Rodríguez", cargo: "Administrador", correo: "sofia.rodriguez@example.com" },
  { nombre: "Pedro Sánchez", cargo: "Gerente de Proyecto", correo: "pedro.sanchez@example.com" },
  { nombre: "Laura Gómez", cargo: "Ingeniera de Soporte", correo: "laura.gomez@example.com" },
  { nombre: "David Ramírez", cargo: "Consultor", correo: "david.ramirez@example.com" },
  { nombre: "Lucía Fernández", cargo: "Marketing", correo: "lucia.fernandez@example.com" },
  { nombre: "Jorge Castro", cargo: "Vendedor", correo: "jorge.castro@example.com" },
  { nombre: "Natalia Romero", cargo: "Recursos Humanos", correo: "natalia.romero@example.com" },
  { nombre: "Diego Herrera", cargo: "Product Owner", correo: "diego.herrera@example.com" },
  { nombre: "Elena Salazar", cargo: "DevOps", correo: "elena.salazar@example.com" },
  { nombre: "Ricardo Muñoz", cargo: "Arquitecto de Software", correo: "ricardo.munoz@example.com" },
  { nombre: "Patricia Silva", cargo: "Investigadora", correo: "patricia.silva@example.com" },
  { nombre: "Fernando Díaz", cargo: "Jefe de Ventas", correo: "fernando.diaz@example.com" },
  { nombre: "Claudia Morales", cargo: "Coordinadora", correo: "claudia.morales@example.com" },
  { nombre: "Gabriel Jiménez", cargo: "Asistente", correo: "gabriel.jimenez@example.com" },
  {
    nombre: "Verónica Medina",
    cargo: "Científica de Datos",
    correo: "veronica.medina@example.com",
  },
]

async function crearFondos() {
  try {
    for (const fondo of fondosData) {
      const docRef = await addDoc(collection(db, "fondos"), {
        saldo: 0,
        nombre: fondo.nombre,
        categoria: fondo.categoria,
        montominimo: fondo.montominimo,
      })
      console.log(`Fondo ${fondo.nombre} creado con ID: ${docRef.id}`)
    }
    console.log("Todos los fondos han sido creados exitosamente.")
  } catch (error) {
    console.error("Error al crear los fondos:", error)
  }
}

async function crearUsuarios() {
  try {
    for (const usuario of usuariosData) {
      const docRef = await addDoc(collection(db, "usuarios"), {
        nombre: usuario.nombre,
        saldo: 500000,
        cargo: usuario.cargo,
        fechaRegistro: new Date().toISOString(),
        correo: usuario.correo,
      })
      console.log(`Usuario ${usuario.nombre} creado con ID: ${docRef.id}`)
    }
    console.log("Todos los usuarios han sido creados exitosamente.")
  } catch (error) {
    console.error("Error al crear los usuarios:", error)
  } finally {
    process.exit(0)
  }
}

//crearFondos()
//crearUsuarios()
