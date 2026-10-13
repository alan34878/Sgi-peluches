import Button from './Button'
import { CATEGORIES, STATUS_FILTERS } from '../data'

export default function Filters({ status, onStatus, category, onCategory }) {
  return (
    <div className="filters">
      <div className="chips" role="group" aria-label="Filtrar por estado">
        {STATUS_FILTERS.map(([v, l]) => (
          <Button plain key={v} className={'chip' + (status === v ? ' on' : '')} onClick={() => onStatus(v)}>{l}</Button>
        ))}
      </div>
      <div className="chips" role="group" aria-label="Filtrar por categoría">
        {[['todas', 'Todas las categorías'], ...CATEGORIES.map((c) => [c, c])].map(([v, l]) => (
          <Button plain key={v} className={'chip' + (category === v ? ' on' : '')} onClick={() => onCategory(v)}>{l}</Button>
        ))}
      </div>
    </div>
  )
}
