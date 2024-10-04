import React, { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControlLabel,
  Checkbox,
} from "@mui/material"
import api from "../data/api"
import "../App.css"
import { MdAddBox } from "react-icons/md"
import { IoMdRemoveCircleOutline } from "react-icons/io"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
}

interface Usuario {
  id: string
  nombre: string
  saldo: number
  fondosSuscritos: string[]
  fechaRegistro: string
}

const fondos = [
  { nombre: "FPV_BTG_PACTUAL_RECAUDADORA" },
  { nombre: "FPV_BTG_PACTUAL_ECOPETROL" },
  { nombre: "DEUDAPRIVADA" },
  { nombre: "FDO-ACCIONES" },
  { nombre: "FPV_BTG_PACTUAL_DINAMICA" },
]

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setloading] = useState(false)
  const [sub, setSub] = useState(false)
  const [unsub, setUnsub] = useState(false)
  const [monto, setMonto] = useState<number>()
  const [id, setId] = useState<string>("")
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [snackbarMessage, setSnackbarMessage] = useState<string>("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success")
  const [selectedFondo, setSelectedFondo] = useState<string>("")
  const [saldoActual, setSaldoActual] = useState<number>()
  const [fondosSuscritos, setFondosSuscritos] = useState<Array<string>>()
  const [sendEmail, setSendEmail] = useState(false)

  const fetchUsuarios = async () => {
    setloading(true)
    try {
      const response = await api.get("/getUsers")
      setUsuarios(response.data.body)
    } catch (error) {
      setSnackbarMessage("Error al obtener usuarios:" + error)
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }
    setloading(false)
  }

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const handleChangeSelect = (event: SelectChangeEvent) => {
    setSelectedFondo(event.target.value)
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  const handleSubmitSub = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      if (id && monto && selectedFondo && saldoActual) {
        if (monto > saldoActual) {
          setSnackbarMessage("No posees fondos suficientes. Inténtalo nuevamente.")
          setSnackbarSeverity("error")
          setSnackbarOpen(true)
        } else if (monto < 0) {
          setSnackbarMessage("Ingresaste un valor incorrecto. Inténtalo nuevamente.")
          setSnackbarSeverity("error")
          setSnackbarOpen(true)
        } else {
          const response = await api.post("/subscribe", {
            usuario: usuarios.find((usuario) => usuario.id === id)?.nombre,
            userId: id,
            monto,
            fondo: selectedFondo,
            notificationEmail: sendEmail,
          })
          if (response.data.successful) {
            setSnackbarMessage("¡Suscripción exitosa!")
            setSnackbarSeverity("success")
            setSnackbarOpen(true)
            setSub(false)
            fetchUsuarios()
            setMonto(undefined)
          } else {
            setSnackbarMessage(response.data.message)
            setSnackbarSeverity("error")
            setSnackbarOpen(true)
          }
        }
      } else {
        setSnackbarMessage("Ingresa todos los campos para continuar.")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      }
    } catch (error) {
      setSnackbarMessage("Error al suscribirse. Inténtalo nuevamente." + error)
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }
  }

  const handleSubmitUnsub = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const response = await api.post("/cancel", {
        userId: id,
        fondo: selectedFondo,
      })
      if (response.data.successful) {
        setSnackbarMessage("Cancelación exitosa!")
        setSnackbarSeverity("success")
        setSnackbarOpen(true)
        setUnsub(false)
        fetchUsuarios()
        setMonto(undefined)
        setFondosSuscritos(undefined)
      } else {
        setSnackbarMessage(response.data.message)
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      }
    } catch (error) {
      setSnackbarMessage("Error al suscribirse. Inténtalo nuevamente." + error)
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }
  }

  return (
    <>
      {/* Snackbar para mostrar mensajes de éxito o error */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {/* Modal para mostrar inscribir un usuario a un fondo */}
      <Modal open={sub} onClose={() => setSub(false)}>
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Suscribirse al fondo
          </Typography>
          <form onSubmit={handleSubmitSub}>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Selecciona un fondo</InputLabel>
              <Select
                value={selectedFondo}
                label="Selecciona un fondo"
                onChange={handleChangeSelect}
              >
                {fondos.map((fondo) => (
                  <MenuItem key={fondo.nombre} value={fondo.nombre}>
                    {fondo.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="Monto a aportar"
              variant="outlined"
              value={monto}
              onChange={(e) => setMonto(parseInt(e.target.value))}
              type="number"
              required
            />
            <FormControlLabel
              control={<Checkbox value={sendEmail} onClick={() => setSendEmail(!sendEmail)} />}
              label="Enviar correo eléctronico de suscripción"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Suscribir
            </Button>
          </form>
        </Box>
      </Modal>
      {/* Modal para cancelar una suscripción a un fondo */}
      <Modal open={unsub} onClose={() => setUnsub(false)}>
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Salirse de un fondo
          </Typography>
          <form onSubmit={handleSubmitUnsub}>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Selecciona el fondo</InputLabel>
              <Select
                value={selectedFondo}
                label="Selecciona un fondo"
                onChange={handleChangeSelect}
              >
                {fondosSuscritos &&
                  fondosSuscritos.length > 0 &&
                  fondosSuscritos.map((fondo: string) => (
                    <MenuItem key={fondo} value={fondo}>
                      {fondo}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Desuscribir
            </Button>
          </form>
        </Box>
      </Modal>
      {/* Tabla con los usuarios registrados */}
      <TableContainer component={Paper} className="tableContainer">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Saldo</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Fondos Suscritos</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Fecha de Registro</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Funciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <CircularProgress />
            ) : usuarios.length > 0 ? (
              usuarios.map((usuario, index) => (
                <TableRow
                  key={usuario.id}
                  sx={{ backgroundColor: index % 2 !== 0 ? "#f0f0f0" : "inherit" }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{usuario.nombre}</TableCell>
                  <TableCell>${usuario.saldo.toLocaleString("es-ES").replace(/,/g, ".")}</TableCell>
                  <TableCell>
                    {usuario.fondosSuscritos?.length > 0
                      ? usuario.fondosSuscritos.map((fondo) => fondo + " ")
                      : "No suscrito"}
                  </TableCell>
                  <TableCell>{usuario.fechaRegistro.split("T", 1)}</TableCell>
                  <TableCell>
                    <>
                      <Button
                        onClick={() => {
                          setSub(true)
                          setSelectedFondo("")
                          setSaldoActual(usuario.saldo)
                          setId(usuario.id)
                        }}
                      >
                        <MdAddBox className="icon" />
                      </Button>
                      {usuario.fondosSuscritos?.length > 0 && (
                        <Button
                          onClick={() => {
                            setUnsub(true)
                            setSelectedFondo("")
                            setSaldoActual(usuario.saldo)
                            setId(usuario.id)
                            setFondosSuscritos(usuario.fondosSuscritos)
                          }}
                        >
                          <IoMdRemoveCircleOutline className="icon" />
                        </Button>
                      )}
                    </>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>No hay usuarios registrados</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default Usuarios
