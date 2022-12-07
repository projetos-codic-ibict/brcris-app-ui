import 'bootstrap/dist/css/bootstrap.min.css' // Import bootstrap CSS
import Link from 'next/link'
import Image from 'next/image'

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-violet">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <Link href="/">
            <a className="navbar-brand">
              <Image
                src="/logos/logo-brcris-pb.png"
                alt="Logo do BrCris"
                width={164}
                height={100}
              />
            </a>
          </Link>

          <Link href="/">
            <a className="navbar-brand mt-3">
              <Image
                src="/logos/logo-ibict-pb-st.png"
                alt="Logo do IBICT"
                width={164}
                height={80}
              />
            </a>
          </Link>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav me-auto mb-2 mb-lg-0"></div>

          <ul className="navbar-nav me-2">
            <li className="nav-item me-5">
              <Link href="/">
                <a className="nav-link">Home</a>
              </Link>
            </li>

            <li className="nav-item me-5">
              <Link href="/">
                <a className="nav-link">Painéis de Indicadores</a>
              </Link>
            </li>

            <li className="nav-item me-5">
              <Link href="/">
                <a className="nav-link">Equipe</a>
              </Link>
            </li>

            <li className="nav-item me-5">
              <Link href="/">
                <a className="nav-link">Sobre</a>
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav">
            <li className="nav-item">
              <button className="navbar-btn btn-picti">PICTI</button>
            </li>

            <li className="nav-item">
              <button className="navbar-btn btn-api mx-2">API</button>
            </li>

            <li className="nav-item">
              <button className="navbar-btn btn-lorem">LOREM</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
