import { useState } from "react"
import cls from "./App.module.css"
import { Container } from "./FlowchartContainer/ui/Container/Container"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className={cls.root}>
      <Container />
    </div>
  )
}

export default App
