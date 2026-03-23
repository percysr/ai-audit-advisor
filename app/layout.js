export const metadata = {
    title: 'AI Audit Advisor',
    description: 'AI-powered audit advisor built with Next.js and Claude API',
};

export default function RootLayout({ children }) {
    return (
          <html lang="es">
            <body style={{ margin: 0, padding: 0 }}>{children}</body>
  </html>
  );
}
