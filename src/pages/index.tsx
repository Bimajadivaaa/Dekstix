import About from "@/components/About"
import Hero from "@/components/Hero"
import DekstixWorks from "@/components/Dekstix-works"
import FAQ from "@/components/FAQ"
import { Fragment } from "react"

export default function Home() {
  return (
    <Fragment>
      <Hero />
      <About />
      <DekstixWorks />
      <FAQ />
    </Fragment>
  )
}
