import "styles/reset.scss"

const RootLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <html>
      <head>

      </head>
      <body>{children}</body>
    </html>
  );
}

export default RootLayout