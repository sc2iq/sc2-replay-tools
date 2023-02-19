import type { LinksFunction, MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react"
import resetStyles from "./styles/reset.css"
import rootStyles from "./styles/root.css"

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "SC2 Replay Viewer",
  viewport: "width=device-width,initial-scale=1",
})

export const links: LinksFunction = () => [
  { rel: 'manifest', href: 'manifest.json' },
  { rel: 'apple-touch-icon', href: 'logo.jpg' },
  { rel: 'stylesheet', href: resetStyles },
  { rel: 'stylesheet', href: rootStyles },
]

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <h1>StarCraft 2 Build Order Analysis</h1>
        </header>
        <main>
          <Outlet />
        </main>
        <footer>
          
        </footer>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
