import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="card text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="mt-2 text-wheat-700">That page does not exist.</p>
      <Link to="/" className="btn-primary mt-4 inline-flex">Back to home</Link>
    </div>
  )
}
