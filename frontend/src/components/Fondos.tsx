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

interface Fondo {
  id: string
  nombre: string
  saldo: number
  montominimo: number
  categoria: string
}

const Fondos: React.FC = () => {
  const [fondos, setFondos] = useState<Fondo[]>([])
  const [loading, setloading] = useState(false)

  useEffect(() => {
    const fetchFondos = async () => {
      setloading(true)
      try {
        const response = await api.get("/getFunds")
        setFondos(response.data.body)
      } catch (error) {
        console.error("Error al obtener fondos:", error)
      }
      setloading(false)
    }

    fetchFondos()
  }, [])

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>ID</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Nombre</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Saldo actual del fondo</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Categoría</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <CircularProgress />
          ) : fondos.length > 0 ? (
            fondos.map((fondo, index) => (
              <TableRow
                key={fondo.id}
                sx={{ backgroundColor: index % 2 !== 0 ? "#f0f0f0" : "inherit" }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{fondo.nombre}</TableCell>
                <TableCell>${fondo.saldo.toLocaleString("es-ES").replace(/,/g, ".")}</TableCell>
                <TableCell>{fondo.categoria}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>No hay fondos registrados</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default Fondos
