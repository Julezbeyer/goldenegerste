"use client"

import { useEffect, useState, useRef } from "react"

export default function GoldeneGerstePage() {
  const [consentState, setConsentState] = useState<string>("–")
  const [showCookieBanner, setShowCookieBanner] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [statChecked, setStatChecked] = useState(false)
  const [mktChecked, setMktChecked] = useState(false)
  const heroVideoRef = useRef<HTMLVideoElement>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(true)

  const CONSENT_KEY = "gg-consent-v1"

  const readConsent = () => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY)
      return stored ? JSON.parse(stored) : null
    } catch (e) {
      return null
    }
  }

  const writeConsent = (consent: any) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent))
    updateConsentBadge()
  }

  const updateConsentBadge = () => {
    const c = readConsent()
    const label = !c
      ? "keine Entscheidung"
      : c.all
        ? "Alle akzeptiert"
        : c.stat || c.mkt
          ? `Benutzerdefiniert (${c.stat ? "Statistik" : ""}${c.stat && c.mkt ? ", " : ""}${c.mkt ? "Marketing" : ""})`
          : "Nur notwendig"
    setConsentState(label)
  }

  useEffect(() => {
    const consent = readConsent()
    if (!consent) {
      setShowCookieBanner(true)
    }
    updateConsentBadge()

    const handleHashChange = () => {
      const hash = window.location.hash || "#home"
      const links = document.querySelectorAll("header nav a")
      links.forEach((a) => {
        const href = a.getAttribute("href")
        a.classList.toggle("active", href === hash)
      })
    }

    handleHashChange()
    window.addEventListener("hashchange", handleHashChange)

    let lastScrollY = window.scrollY
    let ticking = false

    const updateHeader = () => {
      const header = document.querySelector("header")
      const currentScrollY = window.scrollY

      if (currentScrollY < 100) {
        header?.classList.remove("hidden")
      } else if (currentScrollY > lastScrollY) {
        header?.classList.add("hidden")
      } else {
        header?.classList.remove("hidden")
      }

      lastScrollY = currentScrollY
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader)
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleAcceptAll = () => {
    writeConsent({ all: true, stat: true, mkt: true, ts: Date.now() })
    setShowCookieBanner(false)
  }

  const handleDenyAll = () => {
    writeConsent({ all: false, stat: false, mkt: false, ts: Date.now() })
    setShowCookieBanner(false)
  }

  const handleOpenPrefs = () => {
    const c = readConsent() || { stat: false, mkt: false }
    setStatChecked(!!c.stat)
    setMktChecked(!!c.mkt)
    setShowModal(true)
  }

  const handleSavePrefs = () => {
    writeConsent({ all: false, stat: statChecked, mkt: mktChecked, ts: Date.now() })
    setShowModal(false)
    setShowCookieBanner(false)
  }

  const handleResetConsent = () => {
    localStorage.removeItem(CONSENT_KEY)
    updateConsentBadge()
    setShowCookieBanner(true)
  }

  const toggleHeroVideo = () => {
    if (heroVideoRef.current) {
      if (heroVideoRef.current.paused) {
        heroVideoRef.current.play()
        setIsVideoPlaying(true)
      } else {
        heroVideoRef.current.pause()
        setIsVideoPlaying(false)
      }
    }
  }

  const toggleVideoMute = () => {
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = !heroVideoRef.current.muted
      setIsVideoMuted(heroVideoRef.current.muted)
    }
  }

  return (
    <>
      <header>
        <div className="nav">
          <img
            src="/images/goldene-gerste-logo.png"
            alt="Goldene Gerste Logo"
            className="w-11 h-11 rounded-full border border-white/20 shadow-lg object-cover"
          />
          <div className="brand">
            <b>Goldene Gerste</b> • Stuttgart
          </div>
          <nav aria-label="Hauptnavigation">
            <a href="#home" className="active">
              Home
            </a>
            <a href="#shop">Shop</a>
            <a href="#shipping">Versand</a>
            <a href="#agb">AGB</a>
            <a href="#widerruf">Widerruf</a>
            <a href="#blog">Blog</a>
            <a href="#about">Über uns</a>
            <a href="#impressum">Impressum</a>
            <a href="#datenschutz">Datenschutz</a>
            <a href="#cookies">Cookies</a>
          </nav>
        </div>
      </header>

      <div className="hero-video-fullscreen">
        <video
          ref={heroVideoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onPlay={() => setIsVideoPlaying(true)}
          onPause={() => setIsVideoPlaying(false)}
        >
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bierglas_Werbevideo_mit_Logo-H43Hd72VM650teAe5vmFWH1gMlNGKf.mp4" type="video/mp4" />
          Ihr Browser unterstützt das Video-Element nicht.
        </video>

        <div className="hero-video-content">
          <h1>Goldene Gerste – Bier mit Charakter</h1>
          <p>
            Handwerklich gebraut in Stuttgart – klare Rezepte, ehrliche Zutaten und ein Einkaufserlebnis ohne
            Schnickschnack.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a className="btn primary" href="#shop">
              Zum Sortiment
            </a>
            <a className="btn ghost" href="#about">
              Unsere Story
            </a>
          </div>
        </div>

        <div className="hero-video-controls">
          <button
            className="video-control-btn"
            onClick={toggleHeroVideo}
            title={isVideoPlaying ? "Video pausieren" : "Video abspielen"}
          >
            {isVideoPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button
            className="video-control-btn"
            onClick={toggleVideoMute}
            title={isVideoMuted ? "Ton einschalten" : "Ton ausschalten"}
          >
            {isVideoMuted ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <main style={{ paddingTop: "0" }}>
        <section id="home" aria-labelledby="h-home" style={{ marginTop: "40px" }}>
          <h2 id="h-home">Willkommen bei Goldene Gerste</h2>
          <p className="lead">
            Transparenz bei Zutaten und Informationen, keine Dark Patterns – Humor bei den Namen, Ernst bei der
            Qualität. <span className="pill">ab 18</span>
          </p>

          <div className="grid">
            <div className="card">
              <h3>Werte & Versprechen</h3>
              <ul className="list-legal">
                <li>Regionale Rohstoffe, klare Zutatenlisten.</li>
                <li>Faire Kommunikation, transparente Pflichtangaben.</li>
                <li>Schonender Umgang mit Ressourcen.</li>
              </ul>
            </div>
            <div className="card">
              <img
                src="/images/goldene-gerste-logo.png"
                alt="Goldene Gerste Logo"
                className="w-32 h-32 mx-auto mb-4 rounded-full border-2 border-white/22 shadow-2xl object-cover"
              />
              <p className="text-center">
                Handwerklich gebraut in Stuttgart mit Leidenschaft für Qualität und Transparenz.
              </p>
            </div>
          </div>
        </section>

        <section id="shop" aria-labelledby="h-shop">
          <h2 id="h-shop">Sortiment</h2>
          <p>Vier Sorten, vier Charaktere. Jeweils in der 0,5-l-Mehrwegflasche und als 6er-Träger.</p>
          <div className="grid">
            <div className="card">
              <div className="product-image">
                <img
                  src="/images/pils-bottle.png"
                  alt="Goldene Gerste Pils mit Stil - 0,5l Flasche"
                  className="w-full h-48 object-contain mb-4"
                />
              </div>
              <h3>„Pils mit Stil" – Pils</h3>
              <p>Knackig herb, feine Bittere, klarer Ausklang.</p>
              <p>
                <span className="pill">4,9 % vol</span>
                <span className="pill">IBU 28</span>
                <span className="pill">Hallertauer</span>
              </p>
              <p>
                <b>Preis:</b> 2,20 € / 0,5 l • 11,90 € / 6er &nbsp;|&nbsp; zzgl. Pfand 0,08 € je Flasche
              </p>
              <p>
                <b>Lieferzeit:</b> 2–4 Werktage (DE)
              </p>
              <details>
                <summary>Produktsicherheit & Zutaten</summary>
                <ul className="list-legal">
                  <li>Wasser, Gerstenmalz, Hopfen, Hefe • Enthält Gluten</li>
                  <li>Abgabe nur an Volljährige • kühl & dunkel lagern</li>
                </ul>
              </details>
              <button className="btn primary" disabled>
                In Entwicklung
              </button>
            </div>

            <div className="card">
              <div className="product-image">
                <img
                  src="/images/kellerpils-bottle.png"
                  alt="Kellerkönig Kellerpils - 0,5l Flasche"
                  className="w-full h-48 object-contain mb-4"
                />
              </div>
              <h3>„Kellerkönig" – Kellerpils</h3>
              <p>Naturtrüb, samtig und hopfig-frisch.</p>
              <p>
                <span className="pill">5,0 % vol</span>
                <span className="pill">IBU 26</span>
                <span className="pill">Spalter/Saphir</span>
              </p>
              <p>
                <b>Preis:</b> 2,40 € / 0,5 l • 12,90 € / 6er &nbsp;|&nbsp; zzgl. Pfand 0,08 € je Flasche
              </p>
              <p>
                <b>Lieferzeit:</b> 3–5 Werktage (DE)
              </p>
              <details>
                <summary>Produktsicherheit & Zutaten</summary>
                <ul className="list-legal">
                  <li>Wasser, Gerstenmalz, Hopfen, Hefe • Enthält Gluten</li>
                  <li>Unfiltriert • vor dem Öffnen nicht schütteln</li>
                </ul>
              </details>
              <button className="btn primary" disabled>
                In Entwicklung
              </button>
            </div>

            <div className="card">
              <div className="product-image">
                <img
                  src="/images/hefeweizen-bottle.jpg"
                  alt="Goldene Gerste Wolkenweizen Hefeweizen - 0,5l Flasche"
                  className="w-full h-48 object-contain mb-4"
                />
              </div>
              <h3>„Wolkenweizen" – Hefeweizen</h3>
              <p>Banane & Nelke in Balance, cremige Perlage.</p>
              <p>
                <span className="pill">5,3 % vol</span>
                <span className="pill">IBU 14</span>
                <span className="pill">Weizenmalz hell</span>
              </p>
              <p>
                <b>Preis:</b> 2,30 € / 0,5 l • 12,50 € / 6er &nbsp;|&nbsp; zzgl. Pfand 0,08 € je Flasche
              </p>
              <p>
                <b>Lieferzeit:</b> 2–4 Werktage (DE)
              </p>
              <details>
                <summary>Produktsicherheit & Zutaten</summary>
                <ul className="list-legal">
                  <li>Wasser, Weizenmalz, Gerstenmalz, Hopfen, Hefe • Enthält Gluten</li>
                  <li>Hefe-Sediment natürlich • leicht aufschwenken</li>
                </ul>
              </details>
              <button className="btn primary" disabled>
                In Entwicklung
              </button>
            </div>

            <div className="card">
              <div className="product-image">
                <img
                  src="/images/helles-bottle.jpg"
                  alt="Goldene Gerste Goldlicht Helles - 0,5l Flasche"
                  className="w-full h-48 object-contain mb-4"
                />
              </div>
              <h3>„Goldlicht" – Helles</h3>
              <p>Feinmalzig, mild und süffig – Münchner Stil.</p>
              <p>
                <span className="pill">4,8 % vol</span>
                <span className="pill">IBU 18</span>
                <span className="pill">Tradition/Hersbrucker</span>
              </p>
              <p>
                <b>Preis:</b> 2,20 € / 0,5 l • 11,90 € / 6er &nbsp;|&nbsp; zzgl. Pfand 0,08 € je Flasche
              </p>
              <p>
                <b>Lieferzeit:</b> 2–3 Werktage (DE)
              </p>
              <details>
                <summary>Produktsicherheit & Zutaten</summary>
                <ul className="list-legal">
                  <li>Wasser, Gerstenmalz, Hopfen, Hefe • Enthält Gluten</li>
                  <li>Vor Licht schützen • 6–9 °C genießen</li>
                </ul>
              </details>
              <button className="btn primary" disabled>
                In Entwicklung
              </button>
            </div>
          </div>
        </section>

        <section id="shipping" aria-labelledby="h-ship">
          <h2 id="h-ship">Versand & Lieferbedingungen</h2>
          <div className="grid">
            <div className="card">
              <h3>Versandarten & Kosten</h3>
              <table>
                <tbody>
                  <tr>
                    <th>Art</th>
                    <th>Lieferzeit</th>
                    <th>Preis</th>
                  </tr>
                  <tr>
                    <td>DHL Paket (DE)</td>
                    <td>2–4 Werktage</td>
                    <td>5,90 €</td>
                  </tr>
                  <tr>
                    <td>DHL Express (DE)</td>
                    <td>1–2 Werktage</td>
                    <td>12,90 €</td>
                  </tr>
                  <tr>
                    <td>Ab 49 € Warenwert</td>
                    <td>Standard</td>
                    <td>Versandkostenfrei</td>
                  </tr>
                </tbody>
              </table>
              <p className="muted">Lieferung nur innerhalb Deutschlands. Jugendschutz: Altersprüfung bei Zustellung.</p>
            </div>
            <div className="card">
              <h3>Pfand & Rückgabe</h3>
              <p>
                Mehrweg-Pfand: 0,08 € je 0,5-l-Flasche (0,48 € pro 6er). Rückgabe deutschlandweit in teilnehmenden
                Märkten.
              </p>
            </div>
          </div>
        </section>

        <section id="blog" aria-labelledby="h-blog">
          <h2 id="h-blog">Blog – Brautipps & Wissen</h2>
          <div className="grid">
            <div className="card">
              <h3>Hopfengabe in 3 Akten</h3>
              <p>Vorderwürze → Whirlpool → Kalthopfung. Kleine Mengen, große Wirkung.</p>
            </div>
            <div className="card">
              <h3>Wasserprofil kompakt</h3>
              <p>Weiches Wasser liebt Helles & Weizen; fürs Pils darf's härter sein.</p>
            </div>
            <div className="card">
              <h3>Hygiene ≠ optional</h3>
              <p>Sauberkeit schlägt Rezept – Grundlage für konstante Qualität.</p>
            </div>
          </div>
        </section>

        <section id="about" aria-labelledby="h-about">
          <h2 id="h-about">Über uns</h2>
          <div className="grid">
            <div className="card">
              <h3>Die Gründung</h3>
              <p>
                <b>Jan Ramstetter</b> & <b>Anton von Forstner</b>: Freunde, die Bier mögen – und Transparenz noch mehr.
                Aus der ersten Garagensudelei wurde „Goldene Gerste".
              </p>
            </div>
            <div className="card">
              <h3>Warenproben & Tastings</h3>
              <p>
                Für Gastronomie & Handel bieten wir Musterkisten und kleine Tastings an. <a href="#kontakt">Kontakt</a>.
              </p>
            </div>
          </div>
        </section>

        <section id="agb" aria-labelledby="h-agb">
          <h2 id="h-agb">AGB – Kurzfassung</h2>
          <ol>
            <li>
              <b>Geltungsbereich:</b> Bestellungen auf goldenegerste.de.
            </li>
            <li>
              <b>Vertragspartner:</b> Goldene Gerste GmbH, Reinsburgstraße 123, 70197 Stuttgart.
            </li>
            <li>
              <b>Vertragsschluss:</b> Darstellung = kein Angebot; Annahme durch Bestätigung.
            </li>
            <li>
              <b>Preise:</b> EUR inkl. USt, zzgl. Versand, zzgl. Mehrweg-Pfand.
            </li>
            <li>
              <b>Zahlung:</b> Vorkasse/Karte/Pay-Dienst.
            </li>
            <li>
              <b>Lieferung:</b> Nur DE; Zeiten siehe Produktseite.
            </li>
            <li>
              <b>Jugendschutz:</b> Abgabe nur an Volljährige.
            </li>
            <li>
              <b>Gewährleistung:</b> Gesetzliche Mängelrechte.
            </li>
            <li>
              <b>Haftung:</b> Für Vorsatz/grobe Fahrlässigkeit unbegrenzt; im Übrigen nach Gesetz.
            </li>
            <li>
              <b>Streitbeilegung:</b> Keine Teilnahme an Verbraucherschlichtung.
            </li>
          </ol>
        </section>

        <section id="widerruf" aria-labelledby="h-wid">
          <h2 id="h-wid">Widerrufsbelehrung</h2>
          <p>
            Verbraucher können binnen 14 Tagen ohne Angabe von Gründen widerrufen. Fristbeginn mit Erhalt der Ware.
            Rücksendekosten trägt der Verbraucher. Ausgenommen sind versiegelte Waren, wenn die Versiegelung entfernt
            wurde.
          </p>
          <details>
            <summary>Muster-Widerrufsformular</summary>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {`An: Goldene Gerste GmbH, Reinsburgstraße 123, 70197 Stuttgart, hallo@goldenegerste.de
Hiermit widerrufe(n) ich/wir den Vertrag über den Kauf der folgenden Waren:
Bestellt am: … / erhalten am: …
Name des/der Verbraucher(s): …
Anschrift des/der Verbraucher(s): …
Datum, Unterschrift (nur bei Papier)`}
            </pre>
          </details>
        </section>

        <section id="impressum" aria-labelledby="h-imp">
          <h2 id="h-imp">Impressum (§ 5 DDG)</h2>
          <div className="grid">
            <div className="card">
              <p>
                <b>Goldene Gerste GmbH</b>
                <br />
                Reinsburgstraße 123, 70197 Stuttgart
                <br />
                Tel.: +49 (0)711 123456-0 • E-Mail: hallo@goldenegerste.de
                <br />
                Geschäftsführer: Jan Ramstetter, Anton von Forstner
                <br />
                Registergericht: Amtsgericht Stuttgart, HRB 999999 • USt-IdNr.: DE999999999
                <br />
                Verantwortlich i.S.d. § 18 Abs. 2 MStV: Jan Ramstetter (Anschrift wie oben)
              </p>
            </div>
            <div className="card">
              <h3>Erreichbarkeit & Kennzeichnung</h3>
              <ul className="list-legal">
                <li>Impressum jederzeit leicht erkennbar & unmittelbar erreichbar verlinkt.</li>
                <li>Herkunftslandprinzip: maßgeblich ist der Niederlassungsort (Deutschland).</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="datenschutz" aria-labelledby="h-ds">
          <h2 id="h-ds">Datenschutzerklärung – Kurzfassung</h2>
          <div className="grid">
            <div className="card">
              <h3>Verantwortlicher & Zwecke</h3>
              <ul>
                <li>
                  <b>Verantwortlicher:</b> Goldene Gerste GmbH (Adresse s. Impressum)
                </li>
                <li>
                  <b>Zwecke:</b> Betrieb der Website, Beantwortung von Anfragen; optionale Statistik/Marketing nur mit
                  Einwilligung.
                </li>
                <li>
                  <b>Rechtsgrundlagen:</b> Art. 6 Abs. 1 lit. b, f und a DSGVO.
                </li>
              </ul>
            </div>
            <div className="card">
              <h3>Betroffenenrechte</h3>
              <ul>
                <li>Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit (Art. 15–20 DSGVO).</li>
                <li>Widerspruch (Art. 21) & Widerruf von Einwilligungen.</li>
                <li>Beschwerde bei einer Aufsichtsbehörde.</li>
              </ul>
            </div>
            <div className="card">
              <h3>Auftragsverarbeitung</h3>
              <p>Einsatz von Dienstleistern nur mit AVV; Drittlandübermittlungen nur mit geeigneten Garantien.</p>
            </div>
          </div>
          <p className="muted">
            Diese Seite speichert Ihre Cookie-Entscheidung lokal (<code>localStorage</code>).
          </p>
        </section>

        <section id="cookies" aria-labelledby="h-cookie">
          <h2 id="h-cookie">Cookies & Endgeräte-Speicherung (§ 25 TDDDG)</h2>
          <p>
            Optionale Kategorien (Statistik/Marketing) werden erst nach Einwilligung geladen. „Alle akzeptieren" und
            „Alle ablehnen" sind gleichwertig. Sie können Ihre Auswahl hier jederzeit ändern.
          </p>
          <div className="card">
            <h3>Ihre Auswahl</h3>
            <p>
              Status: <span className="pill">{consentState}</span>
            </p>
            <button className="btn primary" onClick={handleOpenPrefs}>
              Cookie-Einstellungen öffnen
            </button>
            <button className="btn ghost" onClick={handleResetConsent}>
              Auswahl zurücksetzen
            </button>
          </div>
        </section>

        <section id="kontakt" aria-labelledby="h-kontakt">
          <h2 id="h-kontakt">Kontakt</h2>
          <div className="card">
            <p>
              <b>E-Mail:</b> hallo@goldenegerste.de • <b>Telefon:</b> +49 (0)711 123456-0
            </p>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2025 Goldene Gerste GmbH. Alle Rechte vorbehalten.</p>
        <p className="muted">
          UWG-Hinweis: Keine unerbetene Telefonwerbung. Werbliche E-Mails nur nach vorheriger Einwilligung.
        </p>
      </footer>

      <div
        className={`cookie ${showCookieBanner ? "show" : ""}`}
        role="dialog"
        aria-live="polite"
        aria-label="Cookie-Hinweis"
      >
        <div>
          <p>
            <b>Cookies & optionale Dienste</b> – Wir verwenden technisch notwendige Cookies und, nach Ihrer Wahl,
            optionale Dienste (Statistik/Marketing). Details: <a href="#cookies">Cookie-Infos</a>.
          </p>
          <p className="muted">
            Rechtsgrundlage für nicht notwendige Cookies: Einwilligung (§ 25 TDDDG, Art. 6 Abs. 1 lit. a DSGVO).
          </p>
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={handleDenyAll}>
            Alle ablehnen
          </button>
          <button className="btn ghost" onClick={handleOpenPrefs}>
            Einstellungen
          </button>
          <button className="btn primary" onClick={handleAcceptAll}>
            Alle akzeptieren
          </button>
        </div>
      </div>

      <div className={`modal ${showModal ? "show" : ""}`}>
        <div className="box">
          <h3>Cookie-Einstellungen</h3>
          <p className="muted">Einzelne Kategorien aktivieren. „Speichern" setzt Ihre Auswahl (jederzeit änderbar).</p>
          <table>
            <tbody>
              <tr>
                <th>Kategorie</th>
                <th>Beschreibung</th>
                <th>Status</th>
              </tr>
              <tr>
                <td>Notwendig</td>
                <td>Grundfunktionen (z. B. Einwilligungs-Speicher). Keine Abwahl möglich.</td>
                <td>
                  <span className="pill">immer aktiv</span>
                </td>
              </tr>
              <tr>
                <td>Statistik</td>
                <td>Anonyme Reichweitenmessung (wird erst nach Einwilligung aktiviert).</td>
                <td>
                  <input type="checkbox" checked={statChecked} onChange={(e) => setStatChecked(e.target.checked)} />
                </td>
              </tr>
              <tr>
                <td>Marketing</td>
                <td>Werbliche Funktionen (werden erst nach Einwilligung aktiviert).</td>
                <td>
                  <input type="checkbox" checked={mktChecked} onChange={(e) => setMktChecked(e.target.checked)} />
                </td>
              </tr>
            </tbody>
          </table>
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "12px" }}>
            <button className="btn ghost" onClick={() => setShowModal(false)}>
              Abbrechen
            </button>
            <button className="btn primary" onClick={handleSavePrefs}>
              Speichern
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
