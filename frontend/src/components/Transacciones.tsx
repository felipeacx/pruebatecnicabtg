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
} from "@mui/material"
import api from "../data/api"

interface Transaccion {
  id: string
  userId: string
  fondo: string
  monto: number
  fecha: string
  nombreUsuario: string
}

const Transacciones: React.FC = () => {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([])
  const [loading, setloading] = useState(false)

  useEffect(() => {
    const fetchTransacciones = async () => {
      setloading(true)
      try {
        const response = await api.get("/getTransactions")
        setTransacciones(response.data.body)
      } catch (error) {
        console.error("Error al obtener transacciones:", error)
      }
      setloading(false)
    }

    fetchTransacciones()
  }, [])

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>ID Transacción</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Usuario</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Fondo</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Monto</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Tipo de transacción</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Fecha y hora</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <CircularProgress />
          ) : transacciones.length > 0 ? (
            transacciones.map((transaccion, index) => (
              <TableRow
                key={transaccion.id}
                sx={{ backgroundColor: index % 2 !== 0 ? "#f0f0f0" : "inherit" }}
              >
                <TableCell>{transaccion.id}</TableCell>
                <TableCell>{transaccion.nombreUsuario}</TableCell>
                <TableCell>{transaccion.fondo}</TableCell>
                <TableCell>
                  ${transaccion.monto.toLocaleString("es-ES").replace(/,/g, ".")}
                </TableCell>
                <TableCell>{transaccion.monto >= 0 ? "Apertura" : "Cancelación"}</TableCell>
                <TableCell>
                  {transaccion.fecha.split("T", 1)} {transaccion.fecha.split("T")[1].slice(0, 8)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>No hay transacciones registradas</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default Transacciones
