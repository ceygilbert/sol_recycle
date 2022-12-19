import Head from 'next/head'
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'
import Desktop from './components/Desktop';

export default function Home() {
	const [region, setRegion] = useState(0);
	const [onboarding, setOnboarding] = useState(false);
	const [check, setCheck] = useState(false);
	const [num, setNum] = useState(0);

	// Saved preferences
	useEffect(() => {
		if (typeof window !== 'undefined') {
			//localStorage.removeItem("region");
			//localStorage.removeItem("onboarding");

			if (localStorage.getItem("region") != null) {
				setRegion(parseInt(localStorage.getItem("region")));
			}
			if (localStorage.getItem("onboarding") != null) {
				setOnboarding(localStorage.getItem("onboarding"))
			}
			if (localStorage.getItem("num") != null) {
				setNum(parseInt(localStorage.getItem("num")))
			}

			setCheck(true);
		}
	}, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>EcoSnap</title>
        <meta name="description" content="Recycle your plastic with the help of AI" />
        <link rel="icon" href="/favicon.ico" />
				<link rel="preconnect" href="https://fonts.googleapis.com"/>
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
				<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Manrope:wght@500;600;700&display=swap" rel="stylesheet"/>
				<meta name='viewport' content='initial-scale=1, viewport-fit=cover, minimal-ui'/>
      </Head>

      <main className={styles.main}>
				<Desktop region={region} setNum={setNum} num={num} onboarding={onboarding} setRegion={setRegion} check={check}/>
      </main>

      <footer className={styles.footer}>
       
      </footer>
    </div>
  )
}
