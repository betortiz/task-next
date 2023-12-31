import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import styles from './styles.module.css'

export default function Header() {

  const { data: session, status } = useSession();

  return (
    <header className={styles.header}>
      <section className={styles.content}>
        <nav className={styles.nav}>
          <Link href="/">
            <h1 className={styles.logo}>
              Tarefas<span>+</span>
            </h1>
          </Link>
          {session?.user && (
            <Link href="/dashboard" className={styles.link}>
              Meu Painel
            </Link>
          )}
        </nav>
        {status === "loading" ? (
          <>
          </>
        ) : session ? (
          <div className={styles.perfil}>
            <img className={styles.foto} src={session?.user?.image ?? ''} alt="foto" />
            <button className={styles.loginButton} onClick={() => signOut()}>
              Olá {session?.user?.name}
            </button>
          </div>
        ) : (
          <button className={styles.loginButton} onClick={() => signIn("google")}>
            Entrar
          </button>
        )}
      </section>
    </header>
  )
}