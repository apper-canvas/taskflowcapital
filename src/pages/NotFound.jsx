import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <ApperIcon name="AlertTriangle" size={32} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold text-surface-900 dark:text-white mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <ApperIcon name="ArrowLeft" size={16} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}