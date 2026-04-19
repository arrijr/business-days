export const metadata = {
  title: "Business Days API",
  description: "Check business days & public holidays for 100+ countries.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
