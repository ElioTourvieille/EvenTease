// Les pages auth (login, register) sont full-screen et gèrent leur propre chrome.
// La landing page (/) inclura Header + Footer directement dans son contenu.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
