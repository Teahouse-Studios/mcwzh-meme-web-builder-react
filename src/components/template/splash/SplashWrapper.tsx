import { lazy, Suspense } from 'react'
import { Container, Box } from '@mui/material'
const Splash = lazy(() => import('./Splash'))

export default function SplashWrapper() {
  return (
    <Container
      sx={{
        textAlign: 'center',
        mb: 1,
        color: 'secondary.main',
        fontWeight: 700,
        fontSize: '1rem',
        textShadow: (theme) =>
          theme.palette.mode === 'light'
            ? `1px 1px 2px ${theme.palette.text.primary}`
            : null,
        overflow: 'hidden',
      }}
    >
      <Suspense fallback={<></>}>
        <Box
          sx={{
            animation: 'splash 2s linear infinite',
            '@keyframes splash': {
              from: { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.2)' },
              to: { transform: 'scale(1)' },
            },
          }}
        >
          <Splash />
        </Box>
      </Suspense>
    </Container>
  )
}
