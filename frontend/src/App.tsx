import { useState } from "react"
import "./App.css"
import { Typography, Tab, Tabs } from "@mui/material"
import Usuarios from "./components/Usuarios"
import Fondos from "./components/Fondos"
import Transacciones from "./components/Transacciones"

function App() {
  const [value, setValue] = useState(0)

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <div className="mainContainer">
      <Typography variant="h3" align="center" marginY={4}>
        Gestión de Fondos: Inversiones BTG Pactual
      </Typography>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Usuarios" />
        <Tab label="Fondos" />
        <Tab label="Transacciones" />
      </Tabs>
      {value === 0 && <Usuarios />}
      {value === 1 && <Fondos />}
      {value === 2 && <Transacciones />}
    </div>
  )
}

export default App
