const { db } = require("../../db/firebase.js")
const {
  collection,
  doc,
  updateDoc,
  addDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} = require("firebase/firestore")
const { sendEmail } = require("../mailer.js")

const subscribe = async (req, res) => {
  try {
    const { userId, fondo, monto, usuario, notificationEmail } = req.body
    const userRef = doc(db, "usuarios", userId)
    const userDoc = await getDoc(userRef)
    if (!userDoc.exists()) {
      return res.status(200).json({
        successful: false,
        message: "Usuario no encontrado",
      })
    }

    const fondoRef = collection(db, "fondos")
    const q = query(fondoRef, where("nombre", "==", fondo))
    const fondoDocSnapshot = await getDocs(q)
    if (fondoDocSnapshot.empty) {
      return res.status(200).json({
        successful: false,
        message: "Fondo no encontrado",
      })
    }

    const userData = userDoc.data()
    let fondoData = null
    let fondoDocId = null

    fondoDocSnapshot.forEach((doc) => {
      fondoData = doc.data()
      fondoDocId = doc.id
    })

    const nuevoSaldoUsuario = userData.saldo - monto
    if (nuevoSaldoUsuario < 0) {
      return res.status(200).json({
        successful: false,
        message:
          "No tiene saldo disponible para vincularse al fondo " +
          fondoData.nombre +
          ". Monto mínimo: " +
          fondoData.montominimo.toLocaleString("es-ES").replace(/,/g, "."),
      })
    }

    if (monto < fondoData.montominimo) {
      return res.status(200).json({
        successful: false,
        message:
          "El monto ingresado no es suficiente para suscribirse a este fondo. Monto mínimo: " +
          fondoData.montominimo.toLocaleString("es-ES").replace(/,/g, "."),
      })
    }

    const nuevoSaldoFondo = fondoData.saldo + monto

    await updateDoc(userRef, {
      saldo: nuevoSaldoUsuario,
      fondosSuscritos:
        userData.fondosSuscritos && !userData.fondosSuscritos.includes(fondo)
          ? [...userData.fondosSuscritos, fondo]
          : userData.fondosSuscritos || [fondo],
    })

    const fondoDocRef = doc(db, "fondos", fondoDocId)
    await updateDoc(fondoDocRef, { saldo: nuevoSaldoFondo })

    const transaccionData = {
      nombreUsuario: usuario,
      userId: userId,
      fondo,
      monto: monto,
      fecha: new Date().toISOString(),
      type: "sub",
    }

    await addDoc(collection(db, "transacciones"), transaccionData)

    // Enviar correo
    if (notificationEmail)
      sendEmail(userData.correo, fondo, monto, fondoData.categoria, userData.nombre)

    res.status(200).json({
      status: 200,
      successful: true,
      message: "Suscripción realizada con éxito",
      body: {
        transaccionData,
      },
    })
  } catch (error) {
    res.status(400).json({
      status: 400,
      successful: false,
      message: "Error: " + error.message,
      body: {},
    })
  }
}

const cancel = async (req, res) => {
  try {
    const { userId, fondo } = req.body
    const userRef = doc(db, "usuarios", userId)
    const userDoc = await getDoc(userRef)
    if (!userDoc.exists()) {
      return res.status(200).json({
        successful: false,
        message: "Usuario no encontrado",
      })
    }

    const fondoRef = collection(db, "fondos")
    const q = query(fondoRef, where("nombre", "==", fondo))
    const fondoDocSnapshot = await getDocs(q)
    if (fondoDocSnapshot.empty) {
      return res.status(200).json({
        successful: false,
        message: "Fondo no encontrado",
      })
    }

    let fondoData = null
    let fondoDocId = null

    fondoDocSnapshot.forEach((doc) => {
      fondoData = doc.data()
      fondoDocId = doc.id
    })

    const transaccionesRef = collection(db, "transacciones")
    const querySnapshot = await getDocs(
      query(
        transaccionesRef,
        where("userId", "==", userId),
        where("fondo", "==", fondo),
        where("type", "==", "sub")
      )
    )

    if (querySnapshot.empty) {
      return res.status(200).json({
        successful: false,
        message: "No se encontraron transacciones para este fondo",
      })
    }

    const transaccionDoc = querySnapshot.docs

    let nuevoSaldoUsuario = userDoc.data().saldo
    let totalTransacciones = 0
    transaccionDoc.forEach(async (transaccion) => {
      totalTransacciones += transaccion.data().monto
      await updateDoc(transaccion.ref, { type: "unsub" })
    })

    await updateDoc(userRef, {
      saldo: nuevoSaldoUsuario,
      fondosSuscritos: userDoc.data().fondosSuscritos.filter((id) => id !== fondo),
    })

    const nuevoSaldoFondo = fondoData.saldo - totalTransacciones
    await updateDoc(doc(db, "fondos", fondoDocId), { saldo: nuevoSaldoFondo })

    const salidaTransaccionData = {
      nombreUsuario: userDoc.data().nombre,
      userId: userId,
      fondo,
      monto: -totalTransacciones,
      fecha: new Date().toISOString(),
      type: "cancel",
    }

    await addDoc(collection(db, "transacciones"), salidaTransaccionData)

    res.status(200).json({
      status: 200,
      successful: true,
      message: "Cancelación del fondo realizada con éxito",
      body: salidaTransaccionData,
    })
  } catch (error) {
    res.status(400).json({
      status: 400,
      successful: false,
      message: "Error: " + error,
      body: {},
    })
  }
}

const getTransactions = async (req, res) => {
  try {
    const transaccionesRef = collection(db, "transacciones")
    const q = query(transaccionesRef, orderBy("fecha", "desc"), limit(10))
    const querySnapshot = await getDocs(q)

    const transacciones = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    res.status(200).json({
      status: 200,
      successful: true,
      message: "Transacciones consultadas con éxito",
      body: transacciones,
    })
  } catch (error) {
    res.status(400).json({
      status: 400,
      successful: false,
      message: "Error: " + error,
      body: {},
    })
  }
}

const getUsers = async (req, res) => {
  try {
    const usuariosRef = collection(db, "usuarios")
    const querySnapshot = await getDocs(usuariosRef)

    const usuarios = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    res.status(200).json({
      status: 200,
      successful: true,
      message: "Usuarios consultados con éxito",
      body: usuarios,
    })
  } catch (error) {
    res.status(400).json({
      status: 400,
      successful: false,
      message: "Error: " + error,
      body: {},
    })
  }
}

const getFunds = async (req, res) => {
  try {
    const fondosRef = collection(db, "fondos")
    const querySnapshot = await getDocs(fondosRef)

    const fondos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    res.status(200).json({
      status: 200,
      successful: true,
      message: "Fondos consultados con éxito",
      body: fondos,
    })
  } catch (error) {
    res.status(400).json({
      status: 400,
      successful: false,
      message: "Error: " + error,
      body: {},
    })
  }
}

module.exports = { subscribe, cancel, getTransactions, getUsers, getFunds }
