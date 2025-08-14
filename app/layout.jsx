
export const metadata = { title: "EconoDeal", description: "Liquidations en temps réel" };
export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ background: "linear-gradient(to bottom,#ecfdf5,white)", margin: 0 }}>{children}</body>
    </html>
  );
}
