import { GetServerSideProps } from 'next'
import { ChangeEvent, useState, FormEvent, useEffect } from 'react'
import { db } from '../../services/firebaseConnection'
import styles from './styles.module.css'
import Head from 'next/head'
import { getSession } from 'next-auth/react'
import TextArea from '@/components/textarea'
import { FiShare2 } from 'react-icons/fi'
import { FaTrash } from 'react-icons/fa'
import Link from 'next/link'
import {
  addDoc,
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  doc,
  deleteDoc
} from 'firebase/firestore'

interface HomeProps {
  user: {
    email: string;
  }
}

interface TaskProps {
  id: string;
  created: Date;
  public: boolean;
  tarefa: string;
  user: string;
}

export default function Dashboard({ user }: HomeProps) {

  const [input, setInput] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [tasks, setTasks] = useState<TaskProps[]>([])

  useEffect(() => {
    async function loadTarefas() {
      const tarefasRef = collection(db, "tarefas")
      const q = query(
        tarefasRef,
        orderBy("created", "desc"),
        where("user", "==", user?.email)
      )

      onSnapshot(q, (snapshot) => {
        let lista = [] as TaskProps[];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            tarefa: doc.data().tarefa,
            created: doc.data().created,
            user: doc.data().user,
            public: doc.data().public
          })
        })
        setTasks(lista)
      })
    }

    loadTarefas();
  }, [user?.email])

  const handleChangePublic = (event: ChangeEvent<HTMLInputElement>) => {
    setIsPublic(event.target.checked)
  }

  const handleRegisterTask = async (event: FormEvent) => {
    event.preventDefault()
    // console.log(input)
    // console.log(isPublic)

    if (input === '') return;

    try {
      await addDoc(collection(db, "tarefas"), {
        tarefa: input,
        created: new Date(),
        user: user?.email,
        public: isPublic
      })

      setInput("")
      setIsPublic(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleShare = async (id: string) => {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${id}`
    )
    alert("URL copiada com sucesso!")
  }

  const handleDeleteTask = async (id: string) => {
    const docRef = doc(db, "tarefas", id)
    await deleteDoc(docRef)
  }

  return (
    <div className={styles.containter}>
      <Head>
        <title>Dashboard | Tarefas+</title>
      </Head>
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual sua tarefa?</h1>
            <form onSubmit={handleRegisterTask}>
              <TextArea
                value={input}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                placeholder='Digite qual a sua tarefa... '
              />
              <div className={styles.checkboxArea}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={isPublic}
                  onChange={handleChangePublic}
                />
                <label>Deixar tarefa pública?</label>
              </div>
              <button className={styles.button} type="submit">
                Registrar
              </button>
            </form>
          </div>
        </section>
        <section className={styles.taskContainer}>
          <h1>Minhas tarefas</h1>
          {tasks.map((item) => (
            <article key={item.id} className={styles.task}>
              {item.public && (
                <div className={styles.tagContainer}>
                  <label className={styles.tag}>PUBLICO</label>
                  <button className={styles.shareButton} onClick={() => handleShare(item.id)}>
                    <FiShare2
                      size={22}
                      color="#3183ff"
                    />
                  </button>
                </div>
              )}
              <div className={styles.taskContent}>
                {item.public ? (<Link href={`/task/${item.id}`}>
                  <p>{item.tarefa}</p>
                </Link>) : (
                  <p>{item.tarefa}</p>
                )}
                <button className={styles.trashButton}>
                  <FaTrash
                    size={24}
                    color='#ea3140'
                    onClick={() => handleDeleteTask(item.id)}
                  />
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })

  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: {
      user: {
        email: session?.user?.email,
      },
    },
  }
}