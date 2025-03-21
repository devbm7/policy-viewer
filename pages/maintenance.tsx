// pages/maintenance.tsx
import Head from 'next/head'
import styles from '../styles/Maintenance.module.css'
import type { NextPage } from 'next'

const Maintenance: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Site Under Maintenance</title>
        <meta name="description" content="We'll be back soon" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          We're under maintenance
        </h1>
        <p className={styles.description}>
          Our site is currently undergoing scheduled maintenance and will be back shortly.
        </p>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>We apologize for the inconvenience</h2>
            <p>Thank you for your patience while we improve our services.</p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Dev Makwana</p>
      </footer>
    </div>
  )
}

export default Maintenance