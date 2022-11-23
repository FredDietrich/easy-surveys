import React from 'react'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@emotion/react'
import pages from './pages'

const router = createHashRouter(pages)

const theme = createTheme({
  palette: {mode: 'dark'}
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
)
